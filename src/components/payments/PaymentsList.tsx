import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { PaymentForm } from './PaymentForm';
import { PaymentDetails } from './PaymentDetails';
import { 
  Search, 
  Filter, 
  Plus, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export const PaymentsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Données simulées des paiements
  const payments = [
    {
      id: 'PAY-2024-001',
      receiptNumber: 'REC-001234',
      student: {
        id: 'STU-001',
        name: 'Emma Martin',
        class: '6ème A',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      paymentType: {
        id: 'PT-001',
        name: 'Frais de scolarité',
        category: 'tuition',
      },
      amount: 150000,
      paymentMethod: {
        id: 'PM-001',
        name: 'Mobile Money',
        code: 'mobile_money',
      },
      reference: 'MM-789456123',
      status: 'completed',
      paidDate: '2024-11-20T10:30:00Z',
      processedBy: 'Marie Dubois',
      installment: {
        id: 'INST-001',
        description: 'Tranche 1/3 - Trimestre 1',
        dueDate: '2024-11-15',
      },
      createdAt: '2024-11-20T10:30:00Z',
    },
    {
      id: 'PAY-2024-002',
      receiptNumber: 'REC-001235',
      student: {
        id: 'STU-002',
        name: 'Lucas Dubois',
        class: '5ème B',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      paymentType: {
        id: 'PT-002',
        name: 'Uniformes scolaires',
        category: 'uniform',
      },
      amount: 45000,
      paymentMethod: {
        id: 'PM-002',
        name: 'Espèces',
        code: 'cash',
      },
      status: 'completed',
      paidDate: '2024-11-19T14:15:00Z',
      processedBy: 'Jean Martin',
      createdAt: '2024-11-19T14:15:00Z',
    },
    {
      id: 'PAY-2024-003',
      receiptNumber: 'REC-001236',
      student: {
        id: 'STU-003',
        name: 'Chloé Leroy',
        class: '4ème C',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      paymentType: {
        id: 'PT-001',
        name: 'Frais de scolarité',
        category: 'tuition',
      },
      amount: 150000,
      paymentMethod: {
        id: 'PM-003',
        name: 'Chèque',
        code: 'check',
      },
      reference: 'CHQ-456789',
      status: 'pending',
      paidDate: '2024-11-18T09:00:00Z',
      processedBy: 'Marie Dubois',
      installment: {
        id: 'INST-002',
        description: 'Tranche 2/3 - Trimestre 2',
        dueDate: '2024-11-20',
      },
      createdAt: '2024-11-18T09:00:00Z',
    },
  ];

  // Données simulées des types de paiement
  const paymentTypes = [
    { id: 'all', name: 'Tous les types' },
    { id: 'tuition', name: 'Frais de scolarité' },
    { id: 'registration', name: 'Frais d\'inscription' },
    { id: 'uniform', name: 'Uniformes' },
    { id: 'supplies', name: 'Fournitures' },
    { id: 'activities', name: 'Activités parascolaires' },
  ];

  const paymentMethods = [
    { id: 'all', name: 'Tous les modes' },
    { id: 'cash', name: 'Espèces' },
    { id: 'check', name: 'Chèque' },
    { id: 'mobile_money', name: 'Mobile Money' },
    { id: 'bank_transfer', name: 'Virement bancaire' },
  ];

  const statusOptions = [
    { id: 'all', name: 'Tous les statuts' },
    { id: 'completed', name: 'Payé' },
    { id: 'pending', name: 'En attente' },
    { id: 'cancelled', name: 'Annulé' },
    { id: 'refunded', name: 'Remboursé' },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesType = selectedType === 'all' || payment.paymentType.category === selectedType;
    const matchesMethod = selectedMethod === 'all' || payment.paymentMethod.code === selectedMethod;
    return matchesSearch && matchesStatus && matchesType && matchesMethod;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      completed: 'Payé',
      pending: 'En attente',
      cancelled: 'Annulé',
      refunded: 'Remboursé',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSavePayment = (paymentData: any) => {
    console.log('Saving payment:', paymentData);
    // Logique de sauvegarde avec génération automatique du numéro de reçu
  };

  // Statistiques
  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const completedCount = filteredPayments.filter(p => p.status === 'completed').length;
  const pendingCount = filteredPayments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des paiements</h1>
          <p className="text-gray-600 mt-1">Suivi des paiements et encaissements</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total encaissé</p>
                <p className="text-lg md:text-xl font-bold text-emerald-600">
                  {formatAmount(totalAmount)}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">En attente</p>
                <p className="text-lg md:text-xl font-bold text-amber-600">
                  {formatAmount(pendingAmount)}
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
                <p className="text-xs md:text-sm font-medium text-gray-600">Paiements validés</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">En attente validation</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom d'élève ou numéro de reçu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Paiements récents ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Reçu</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Élève</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Type</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Montant</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden sm:table-cell">Mode</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Statut</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden md:table-cell">Date</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 md:p-4">
                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-600 text-sm">
                          {payment.receiptNumber}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar src={payment.student.avatar} name={payment.student.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{payment.student.name}</p>
                          <p className="text-xs text-gray-600">{payment.student.class}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{payment.paymentType.name}</p>
                        {payment.installment && (
                          <p className="text-xs text-gray-600">{payment.installment.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <span className="font-bold text-gray-900">
                        {formatAmount(payment.amount)}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{payment.paymentMethod.name}</span>
                      {payment.reference && (
                        <p className="text-xs text-gray-500">Réf: {payment.reference}</p>
                      )}
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusLabel(payment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {new Date(payment.paidDate).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => {
                            setSelectedPayment(payment);
                            setIsDetailsOpen(true);
                          }}
                          className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-emerald-50 hover:text-emerald-600 rounded transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <CreditCard className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun paiement trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou enregistrez un nouveau paiement.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Form Modal */}
      <PaymentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePayment}
      />

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetails
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}
    </div>
  );
};