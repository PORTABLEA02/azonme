import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { 
  Receipt, 
  Download, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  User,
  School,
} from 'lucide-react';

export const ParentPaymentView: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState('STU-001');
  const [selectedPeriod, setSelectedPeriod] = useState('current_year');

  // Données simulées des enfants du parent
  const children = [
    {
      id: 'STU-001',
      firstName: 'Emma',
      lastName: 'Martin',
      class: '6ème A',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 'STU-002',
      firstName: 'Lucas',
      lastName: 'Martin',
      class: '4ème C',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  // Données simulées des paiements
  const payments = [
    {
      id: 'PAY-2024-001',
      receiptNumber: 'REC-001234',
      studentId: 'STU-001',
      feeType: 'Frais de scolarité',
      amount: 150000,
      dueDate: '2024-11-15',
      paidDate: '2024-11-10',
      status: 'paid',
      paymentMethod: 'Mobile Money',
      reference: 'MM-789456123',
      installment: 'Tranche 1/3 - Trimestre 1',
    },
    {
      id: 'PAY-2024-002',
      receiptNumber: 'REC-001235',
      studentId: 'STU-001',
      feeType: 'Uniformes scolaires',
      amount: 45000,
      dueDate: '2024-09-30',
      paidDate: '2024-09-25',
      status: 'paid',
      paymentMethod: 'Espèces',
      installment: null,
    },
    {
      id: 'PAY-2024-003',
      receiptNumber: null,
      studentId: 'STU-001',
      feeType: 'Frais de scolarité',
      amount: 150000,
      dueDate: '2024-12-15',
      status: 'pending',
      installment: 'Tranche 2/3 - Trimestre 2',
    },
    {
      id: 'PAY-2024-004',
      receiptNumber: 'REC-001236',
      studentId: 'STU-002',
      feeType: 'Frais de scolarité',
      amount: 150000,
      dueDate: '2024-11-15',
      paidDate: '2024-11-12',
      status: 'paid',
      paymentMethod: 'Chèque',
      reference: 'CHQ-456789',
      installment: 'Tranche 1/3 - Trimestre 1',
    },
    {
      id: 'PAY-2024-005',
      receiptNumber: null,
      studentId: 'STU-002',
      feeType: 'Activités parascolaires',
      amount: 20000,
      dueDate: '2024-11-20',
      status: 'overdue',
      installment: null,
    },
  ];

  const periods = [
    { value: 'current_year', label: 'Année scolaire 2024-2025' },
    { value: 'current_quarter', label: 'Trimestre en cours' },
    { value: 'last_quarter', label: 'Trimestre précédent' },
  ];

  const selectedChildData = children.find(child => child.id === selectedChild);
  const childPayments = payments.filter(payment => payment.studentId === selectedChild);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      paid: 'Payé',
      pending: 'En attente',
      overdue: 'En retard',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const downloadReceipt = (payment: any) => {
    console.log('Downloading receipt for payment:', payment.id);
    // Logique de téléchargement du reçu
  };

  // Statistiques pour l'enfant sélectionné
  const totalPaid = childPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = childPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = childPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const paidCount = childPayments.filter(p => p.status === 'paid').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suivi des paiements</h1>
          <p className="text-gray-600 mt-1">Consultez les frais scolaires et paiements de vos enfants</p>
        </div>
      </div>

      {/* Sélection de l'enfant */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un enfant
              </label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName} - {child.class}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de l'enfant sélectionné */}
      {selectedChildData && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar 
                src={selectedChildData.avatar} 
                name={`${selectedChildData.firstName} ${selectedChildData.lastName}`} 
                size="lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedChildData.firstName} {selectedChildData.lastName}
                </h3>
                <p className="text-gray-600">{selectedChildData.class}</p>
                <p className="text-sm text-gray-500">ID: {selectedChildData.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résumé financier */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total payé</p>
                <p className="text-lg md:text-xl font-bold text-emerald-600">
                  {formatAmount(totalPaid)}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">En attente</p>
                <p className="text-lg md:text-xl font-bold text-amber-600">
                  {formatAmount(totalPending)}
                </p>
              </div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">En retard</p>
                <p className="text-lg md:text-xl font-bold text-red-600">
                  {formatAmount(totalOverdue)}
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Paiements</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{paidCount}</p>
              </div>
              <Receipt className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements ({childPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {childPayments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(payment.status)}
                      <h4 className="font-medium text-gray-900">{payment.feeType}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="font-medium">{formatAmount(payment.amount)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      {payment.paidDate && (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>
                            Payé le: {new Date(payment.paidDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>

                    {payment.installment && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          <FileText className="w-3 h-3 mr-1" />
                          {payment.installment}
                        </span>
                      </div>
                    )}

                    {payment.paymentMethod && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <CreditCard className="w-4 h-4 mr-1" />
                        <span>{payment.paymentMethod}</span>
                        {payment.reference && (
                          <span className="ml-2 text-gray-500">
                            (Réf: {payment.reference})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {payment.receiptNumber && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReceipt(payment)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Reçu
                      </Button>
                    )}
                    
                    {payment.status === 'pending' && (
                      <Button size="sm">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {childPayments.length === 0 && (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Receipt className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun paiement trouvé
            </h3>
            <p className="text-gray-600">
              Aucun paiement n'a été enregistré pour cette période.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Informations importantes */}
      <Card>
        <CardHeader>
          <CardTitle>Informations importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Modes de paiement acceptés</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Espèces (à l'administration)</li>
                <li>• Mobile Money (Orange Money, MTN Money)</li>
                <li>• Chèque bancaire</li>
                <li>• Virement bancaire</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Règles de paiement</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Les frais sont payables par trimestre</li>
                <li>• Un reçu est délivré pour chaque paiement</li>
                <li>• Les retards de paiement peuvent entraîner des restrictions</li>
                <li>• Contactez l'administration pour tout problème</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};