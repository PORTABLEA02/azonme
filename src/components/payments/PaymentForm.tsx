import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Receipt, AlertTriangle } from 'lucide-react';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: any;
  onSave: (paymentData: any) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  isOpen, 
  onClose, 
  student,
  fee,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    studentId: student?.id || '',
    feeId: fee?.id || '',
    installmentId: '',
    amount: '',
    maxAmount: fee?.remainingAmount || 0,
    paymentMethodId: '',
    reference: '',
    paidDate: new Date().toISOString().split('T')[0],
    notes: '',
    isPartialPayment: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableInstallments, setAvailableInstallments] = useState<any[]>([]);

  if (!isOpen) return null;

  // Simuler les échéances disponibles pour ce frais
  React.useEffect(() => {
    if (fee) {
      const installments = fee.installments?.filter((inst: any) => inst.remainingAmount > 0) || [];
      setAvailableInstallments(installments);
      
      // Si c'est un paiement global, définir le montant maximum
      if (!formData.installmentId) {
        setFormData(prev => ({ 
          ...prev, 
          maxAmount: fee.remainingAmount,
          amount: fee.remainingAmount.toString()
        }));
      }
    }
  }, [fee]);

  const paymentMethods = [
    { id: 'PM-001', name: 'Espèces', code: 'cash', requiresReference: false },
    { id: 'PM-002', name: 'Chèque', code: 'check', requiresReference: true },
    { id: 'PM-003', name: 'Mobile Money', code: 'mobile_money', requiresReference: true },
    { id: 'PM-004', name: 'Virement bancaire', code: 'bank_transfer', requiresReference: true },
  ];

  const generateReceiptNumber = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${timestamp.toString().slice(-6)}${randomNum}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    const paymentAmount = parseFloat(formData.amount);
    const maxAmount = formData.installmentId 
      ? availableInstallments.find(inst => inst.id === formData.installmentId)?.remainingAmount || 0
      : formData.maxAmount;

    if (paymentAmount > maxAmount) {
      newErrors.amount = `Le montant ne peut pas dépasser ${formatAmount(maxAmount)}`;
    }

    if (!formData.paymentMethodId) {
      newErrors.paymentMethodId = 'Le mode de paiement est obligatoire';
    }

    // Vérifier si une référence est requise
    const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethodId);
    if (selectedMethod?.requiresReference && !formData.reference.trim()) {
      newErrors.reference = 'La référence est obligatoire pour ce mode de paiement';
    }

    if (!formData.paidDate) {
      newErrors.paidDate = 'La date de paiement est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const paymentAmount = parseFloat(formData.amount);
    const selectedInstallment = formData.installmentId 
      ? availableInstallments.find(inst => inst.id === formData.installmentId)
      : null;

    // Déterminer le statut du paiement
    let paymentStatus = 'completed';
    if (selectedInstallment) {
      paymentStatus = paymentAmount < selectedInstallment.remainingAmount ? 'partial' : 'completed';
    } else {
      paymentStatus = paymentAmount < fee.remainingAmount ? 'partial' : 'completed';
    }

    const paymentData = {
      ...formData,
      id: `PAY-${Date.now()}`,
      receiptNumber: generateReceiptNumber(),
      amount: parseFloat(formData.amount),
      status: paymentStatus,
      processedBy: 'current-user-id', // Dans un vrai système, ce serait l'utilisateur connecté
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      feeBalance: {
        previousRemaining: fee.remainingAmount,
        newRemaining: fee.remainingAmount - paymentAmount,
        isFullyPaid: (fee.remainingAmount - paymentAmount) <= 0,
      }
    };

    onSave(paymentData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mettre à jour le montant maximum quand l'échéance change
    if (field === 'installmentId') {
      const selectedInstallment = availableInstallments.find(inst => inst.id === value);
      if (selectedInstallment) {
        setFormData(prev => ({ 
          ...prev, 
          maxAmount: selectedInstallment.remainingAmount,
          amount: selectedInstallment.remainingAmount.toString()
        }));
      } else {
        // Paiement global
        setFormData(prev => ({ 
          ...prev, 
          maxAmount: fee.remainingAmount,
          amount: fee.remainingAmount.toString()
        }));
      }
    }

    // Clear reference when payment method doesn't require it
    if (field === 'paymentMethodId') {
      const selectedMethod = paymentMethods.find(m => m.id === value);
      if (!selectedMethod?.requiresReference) {
        setFormData(prev => ({ ...prev, reference: '' }));
      }
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethodId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Nouveau paiement
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de l'élève et du frais */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Détails du paiement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Élève :</span>
                    <span className="ml-2 font-medium">{student?.firstName} {student?.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Classe :</span>
                    <span className="ml-2 font-medium">{student?.class}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type de frais :</span>
                    <span className="ml-2 font-medium">{fee?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Montant total :</span>
                    <span className="ml-2 font-medium">{formatAmount(fee?.totalAmount || 0)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Déjà payé :</span>
                    <span className="ml-2 font-medium text-emerald-600">{formatAmount(fee?.paidAmount || 0)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reste à payer :</span>
                    <span className="ml-2 font-medium text-red-600">{formatAmount(fee?.remainingAmount || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Choix de l'échéance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode de paiement
                </label>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={!formData.installmentId}
                      onChange={() => handleInputChange('installmentId', '')}
                      className="mr-2"
                    />
                    <span className="text-sm">Paiement global (montant libre)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={!!formData.installmentId}
                      onChange={() => {
                        if (availableInstallments.length > 0) {
                          handleInputChange('installmentId', availableInstallments[0].id);
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">Paiement par échéance</span>
                  </label>
                </div>

                {formData.installmentId && (
                <select
                    value={formData.installmentId}
                    onChange={(e) => handleInputChange('installmentId', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.installmentId ? 'border-red-500' : ''
                  }`}
                >
                    <option value="">Sélectionner une échéance</option>
                    {availableInstallments.map(installment => (
                      <option key={installment.id} value={installment.id}>
                        {installment.description} - Reste: {formatAmount(installment.remainingAmount)}
                    </option>
                  ))}
                </select>
                )}
              </div>

              {/* Montant et Mode de paiement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant à payer (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    min="1"
                    max={formData.maxAmount}
                    step="1"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.amount ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {formatAmount(formData.maxAmount)}
                  </p>
                  {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mode de paiement *
                  </label>
                  <select
                    value={formData.paymentMethodId}
                    onChange={(e) => handleInputChange('paymentMethodId', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.paymentMethodId ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionner un mode</option>
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>{method.name}</option>
                    ))}
                  </select>
                  {errors.paymentMethodId && <p className="text-sm text-red-600 mt-1">{errors.paymentMethodId}</p>}
                </div>
              </div>

              {/* Référence (si requise) */}
              {selectedMethod?.requiresReference && (
                <Input
                  label={`Référence ${selectedMethod.name} *`}
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  placeholder={
                    selectedMethod.code === 'check' ? 'Numéro de chèque' :
                    selectedMethod.code === 'mobile_money' ? 'ID de transaction' :
                    selectedMethod.code === 'bank_transfer' ? 'Référence virement' : 'Référence'
                  }
                  error={errors.reference}
                  required
                />
              )}

              {/* Date de paiement */}
              <Input
                label="Date de paiement"
                type="date"
                value={formData.paidDate}
                onChange={(e) => handleInputChange('paidDate', e.target.value)}
                error={errors.paidDate}
                required
              />

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Informations complémentaires..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Règles de gestion */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Règles appliquées :</p>
                    <ul className="space-y-1">
                      <li>• Numéro de reçu généré automatiquement</li>
                      <li>• Paiements partiels autorisés</li>
                      <li>• Statut "Terminé" uniquement si montant total payé</li>
                      <li>• Référence obligatoire selon le mode de paiement</li>
                      <li>• Historique conservé pour suivi et audit</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer le paiement
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};