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
  payment, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    studentId: payment?.studentId || '',
    paymentTypeId: payment?.paymentTypeId || '',
    installmentId: payment?.installmentId || '',
    amount: payment?.amount || '',
    paymentMethodId: payment?.paymentMethodId || '',
    reference: payment?.reference || '',
    paidDate: payment?.paidDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    notes: payment?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Données simulées
  const students = [
    { id: 'STU-001', name: 'Emma Martin', class: '6ème A' },
    { id: 'STU-002', name: 'Lucas Dubois', class: '5ème B' },
    { id: 'STU-003', name: 'Chloé Leroy', class: '4ème C' },
  ];

  const paymentTypes = [
    { id: 'PT-001', name: 'Frais de scolarité', category: 'tuition', defaultAmount: 150000 },
    { id: 'PT-002', name: 'Frais d\'inscription', category: 'registration', defaultAmount: 25000 },
    { id: 'PT-003', name: 'Uniformes scolaires', category: 'uniform', defaultAmount: 45000 },
    { id: 'PT-004', name: 'Fournitures scolaires', category: 'supplies', defaultAmount: 30000 },
    { id: 'PT-005', name: 'Activités parascolaires', category: 'activities', defaultAmount: 20000 },
  ];

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

    if (!formData.studentId) {
      newErrors.studentId = 'L\'élève est obligatoire';
    }

    if (!formData.paymentTypeId) {
      newErrors.paymentTypeId = 'Le type de paiement est obligatoire';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
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

    const paymentData = {
      ...formData,
      id: payment?.id || `PAY-${Date.now()}`,
      receiptNumber: payment?.receiptNumber || generateReceiptNumber(),
      amount: parseFloat(formData.amount),
      status: 'pending', // Les paiements nécessitent une validation
      processedBy: 'current-user-id', // Dans un vrai système, ce serait l'utilisateur connecté
      createdAt: payment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(paymentData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill amount when payment type changes
    if (field === 'paymentTypeId') {
      const selectedType = paymentTypes.find(t => t.id === value);
      if (selectedType && !formData.amount) {
        setFormData(prev => ({ ...prev, amount: selectedType.defaultAmount.toString() }));
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
              {payment ? 'Modifier le paiement' : 'Nouveau paiement'}
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
              {/* Élève */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Élève *
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.studentId ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Sélectionner un élève</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </option>
                  ))}
                </select>
                {errors.studentId && <p className="text-sm text-red-600 mt-1">{errors.studentId}</p>}
              </div>

              {/* Type de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de paiement *
                </label>
                <select
                  value={formData.paymentTypeId}
                  onChange={(e) => handleInputChange('paymentTypeId', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentTypeId ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {paymentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {formatAmount(type.defaultAmount)}
                    </option>
                  ))}
                </select>
                {errors.paymentTypeId && <p className="text-sm text-red-600 mt-1">{errors.paymentTypeId}</p>}
              </div>

              {/* Montant et Mode de paiement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Montant (FCFA)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  min="0"
                  step="1"
                  error={errors.amount}
                  required
                />
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
                      <li>• Paiement en attente de validation par défaut</li>
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
                  {payment ? 'Mettre à jour' : 'Enregistrer le paiement'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};