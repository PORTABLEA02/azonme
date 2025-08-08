import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { 
  CreditCard, 
  Calculator, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Receipt,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

interface PaymentInstallmentManagerProps {
  studentId: string;
  onPaymentProcessed: (paymentData: any) => void;
}

export const PaymentInstallmentManager: React.FC<PaymentInstallmentManagerProps> = ({
  studentId,
  onPaymentProcessed,
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  // Données simulées des échéanciers de paiement
  const paymentSchedules = [
    {
      id: 'PS-001',
      studentId: 'STU-001',
      paymentTypeId: 'PT-001',
      paymentTypeName: 'Frais de scolarité',
      totalAmount: 450000,
      paidAmount: 150000,
      remainingAmount: 300000,
      status: 'en_cours',
      schoolYear: '2024-2025',
      installments: [
        {
          id: 'INST-001',
          scheduleId: 'PS-001',
          description: 'Tranche 1/3 - Trimestre 1',
          amount: 150000,
          paidAmount: 150000,
          remainingAmount: 0,
          dueDate: '2024-10-15',
          status: 'termine',
          payments: [
            {
              id: 'PT-001',
              installmentId: 'INST-001',
              amount: 150000,
              paymentDate: '2024-10-10',
              paymentMethodId: 'PM-001',
              receiptNumber: 'REC-001234',
              processedBy: 'Marie Dubois',
              createdAt: '2024-10-10T10:30:00Z',
            },
          ],
        },
        {
          id: 'INST-002',
          scheduleId: 'PS-001',
          description: 'Tranche 2/3 - Trimestre 2',
          amount: 150000,
          paidAmount: 0,
          remainingAmount: 150000,
          dueDate: '2024-01-15',
          status: 'en_attente',
          payments: [],
        },
        {
          id: 'INST-003',
          scheduleId: 'PS-001',
          description: 'Tranche 3/3 - Trimestre 3',
          amount: 150000,
          paidAmount: 0,
          remainingAmount: 150000,
          dueDate: '2024-04-15',
          status: 'en_attente',
          payments: [],
        },
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-10-10',
    },
    {
      id: 'PS-002',
      studentId: 'STU-001',
      paymentTypeId: 'PT-002',
      paymentTypeName: 'Uniformes scolaires',
      totalAmount: 45000,
      paidAmount: 20000,
      remainingAmount: 25000,
      status: 'en_cours',
      schoolYear: '2024-2025',
      installments: [
        {
          id: 'INST-004',
          scheduleId: 'PS-002',
          description: 'Paiement unique',
          amount: 45000,
          paidAmount: 20000,
          remainingAmount: 25000,
          dueDate: '2024-09-30',
          status: 'partiel',
          payments: [
            {
              id: 'PT-002',
              installmentId: 'INST-004',
              amount: 20000,
              paymentDate: '2024-09-25',
              paymentMethodId: 'PM-002',
              receiptNumber: 'REC-001235',
              processedBy: 'Jean Martin',
              createdAt: '2024-09-25T14:15:00Z',
            },
          ],
        },
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-25',
    },
  ];

  const paymentMethods = [
    { id: 'PM-001', name: 'Espèces', requiresReference: false },
    { id: 'PM-002', name: 'Mobile Money', requiresReference: true },
    { id: 'PM-003', name: 'Chèque', requiresReference: true },
    { id: 'PM-004', name: 'Virement bancaire', requiresReference: true },
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'termine':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'partiel':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'en_attente':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'en_retard':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'termine':
        return 'bg-emerald-100 text-emerald-800';
      case 'partiel':
        return 'bg-blue-100 text-blue-800';
      case 'en_attente':
        return 'bg-amber-100 text-amber-800';
      case 'en_retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      termine: 'Terminé',
      partiel: 'Partiel',
      en_attente: 'En attente',
      en_retard: 'En retard',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const calculateNewBalances = (installment: any, newPaymentAmount: number) => {
    const newPaidAmount = installment.paidAmount + newPaymentAmount;
    const newRemainingAmount = installment.amount - newPaidAmount;
    const newStatus = newRemainingAmount <= 0 ? 'termine' : 'partiel';

    return {
      newPaidAmount,
      newRemainingAmount: Math.max(0, newRemainingAmount),
      newStatus,
    };
  };

  const calculateScheduleBalances = (schedule: any, installmentId: string, newPaymentAmount: number) => {
    const updatedInstallments = schedule.installments.map((inst: any) => {
      if (inst.id === installmentId) {
        const balances = calculateNewBalances(inst, newPaymentAmount);
        return {
          ...inst,
          paidAmount: balances.newPaidAmount,
          remainingAmount: balances.newRemainingAmount,
          status: balances.newStatus,
        };
      }
      return inst;
    });

    const totalPaid = updatedInstallments.reduce((sum: number, inst: any) => sum + inst.paidAmount, 0);
    const totalRemaining = schedule.totalAmount - totalPaid;
    const scheduleStatus = totalRemaining <= 0 ? 'termine' : 'en_cours';

    return {
      updatedInstallments,
      totalPaid,
      totalRemaining: Math.max(0, totalRemaining),
      scheduleStatus,
    };
  };

  const handlePayment = (installment: any) => {
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    if (amount > installment.remainingAmount) {
      alert(`Le montant ne peut pas dépasser le solde restant de ${formatAmount(installment.remainingAmount)}`);
      return;
    }

    if (!paymentMethod) {
      alert('Veuillez sélectionner un mode de paiement');
      return;
    }

    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    if (selectedMethod?.requiresReference && !reference.trim()) {
      alert('Une référence est requise pour ce mode de paiement');
      return;
    }

    // Calculer les nouveaux soldes
    const schedule = paymentSchedules.find(s => s.installments.some(i => i.id === installment.id));
    if (!schedule) return;

    const scheduleBalances = calculateScheduleBalances(schedule, installment.id, amount);

    // Générer le numéro de reçu
    const receiptNumber = `REC-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const paymentData = {
      id: `PT-${Date.now()}`,
      installmentId: installment.id,
      scheduleId: schedule.id,
      studentId: studentId,
      amount: amount,
      paymentMethodId: paymentMethod,
      reference: reference || null,
      receiptNumber: receiptNumber,
      paymentDate: new Date().toISOString(),
      processedBy: 'current-user', // Dans un vrai système, ce serait l'utilisateur connecté
      notes: notes || null,
      createdAt: new Date().toISOString(),
      
      // Informations sur les soldes mis à jour
      installmentBalances: calculateNewBalances(installment, amount),
      scheduleBalances: scheduleBalances,
    };

    console.log('🔄 Règle de gestion appliquée - Échelonnement des paiements:');
    console.log('📊 Ancien solde échéance:', formatAmount(installment.remainingAmount));
    console.log('💰 Montant versé:', formatAmount(amount));
    console.log('📊 Nouveau solde échéance:', formatAmount(paymentData.installmentBalances.newRemainingAmount));
    console.log('📊 Solde total restant:', formatAmount(scheduleBalances.totalRemaining));
    console.log('📋 Statut échéance:', paymentData.installmentBalances.newStatus);
    console.log('📋 Statut paiement global:', scheduleBalances.scheduleStatus);

    onPaymentProcessed(paymentData);

    // Réinitialiser le formulaire
    setPaymentAmount('');
    setReference('');
    setNotes('');
    setSelectedSchedule(null);

    alert(`Paiement enregistré avec succès!\nReçu: ${receiptNumber}\nNouveau solde: ${formatAmount(paymentData.installmentBalances.newRemainingAmount)}`);
  };

  const totalDue = paymentSchedules.reduce((sum, schedule) => sum + schedule.totalAmount, 0);
  const totalPaid = paymentSchedules.reduce((sum, schedule) => sum + schedule.paidAmount, 0);
  const totalRemaining = totalDue - totalPaid;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Gestion des paiements échelonnés</h2>
      </div>

      {/* Résumé global */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total dû</p>
                <p className="text-xl font-bold text-gray-900">{formatAmount(totalDue)}</p>
              </div>
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total payé</p>
                <p className="text-xl font-bold text-emerald-600">{formatAmount(totalPaid)}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solde restant</p>
                <p className="text-xl font-bold text-red-600">{formatAmount(totalRemaining)}</p>
              </div>
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progression</p>
                <p className="text-xl font-bold text-purple-600">
                  {Math.round((totalPaid / totalDue) * 100)}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des échéanciers */}
      <div className="space-y-4">
        {paymentSchedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{schedule.paymentTypeName}</span>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  schedule.status === 'termine' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {schedule.status === 'termine' ? 'Terminé' : 'En cours'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Résumé de l'échéancier */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="text-lg font-bold text-gray-900">{formatAmount(schedule.totalAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Déjà payé</p>
                  <p className="text-lg font-bold text-emerald-600">{formatAmount(schedule.paidAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Solde restant</p>
                  <p className="text-lg font-bold text-red-600">{formatAmount(schedule.remainingAmount)}</p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression du paiement</span>
                  <span className="font-medium">
                    {Math.round((schedule.paidAmount / schedule.totalAmount) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all" 
                    style={{ width: `${(schedule.paidAmount / schedule.totalAmount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Échéances */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Détail des échéances</h4>
                {schedule.installments.map((installment) => (
                  <div key={installment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(installment.status)}
                        <div>
                          <p className="font-medium text-gray-900">{installment.description}</p>
                          <p className="text-sm text-gray-600">
                            Échéance: {new Date(installment.dueDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(installment.status)}`}>
                        {getStatusLabel(installment.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Montant dû</p>
                        <p className="font-medium">{formatAmount(installment.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Déjà payé</p>
                        <p className="font-medium text-emerald-600">{formatAmount(installment.paidAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Reste à payer</p>
                        <p className="font-medium text-red-600">{formatAmount(installment.remainingAmount)}</p>
                      </div>
                    </div>

                    {/* Historique des paiements */}
                    {installment.payments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Historique des paiements:</p>
                        <div className="space-y-2">
                          {installment.payments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between text-sm bg-emerald-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <Receipt className="w-4 h-4 text-emerald-600" />
                                <span>{formatAmount(payment.amount)}</span>
                                <span className="text-gray-600">
                                  le {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <span className="text-emerald-600 font-medium">
                                {payment.receiptNumber}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formulaire de paiement */}
                    {installment.remainingAmount > 0 && (
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Input
                            label="Montant à payer"
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="0"
                            max={installment.remainingAmount}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Mode de paiement
                            </label>
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Sélectionner</option>
                              {paymentMethods.map(method => (
                                <option key={method.id} value={method.id}>{method.name}</option>
                              ))}
                            </select>
                          </div>
                          <Input
                            label="Référence"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Optionnel"
                          />
                          <div className="flex items-end">
                            <Button 
                              onClick={() => handlePayment(installment)}
                              className="w-full"
                              disabled={!paymentAmount || !paymentMethod}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Encaisser
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Input
                            label="Notes (optionnel)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Informations complémentaires..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Règles de gestion */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 Règles de gestion des paiements échelonnés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Fonctionnement automatique :</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• <strong>Création d'enregistrement :</strong> Chaque élève a un ou plusieurs paiements à effectuer</li>
              <li>• <strong>Suivi en temps réel :</strong> Montant total dû, montant payé, solde restant</li>
              <li>• <strong>Mise à jour automatique :</strong> À chaque encaissement, les soldes sont recalculés</li>
              <li>• <strong>Statut dynamique :</strong> "En cours" tant qu'il reste un solde, "Terminé" quand tout est payé</li>
              <li>• <strong>Formule appliquée :</strong> Solde restant = Montant total - Montant payé</li>
              <li>• <strong>Paiements partiels :</strong> Autorisés sur chaque échéance</li>
              <li>• <strong>Traçabilité complète :</strong> Historique de tous les versements avec reçus</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};