import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { 
  X, 
  Receipt, 
  User,
  CreditCard,
  Calendar,
  FileText,
  Download,
  Edit,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface PaymentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ 
  isOpen, 
  onClose, 
  payment 
}) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'partial':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'cancelled':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      completed: 'Payé et validé',
      partial: 'Paiement partiel',
      pending: 'En attente de validation',
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Données simulées de l'historique
  const paymentHistory = [
    {
      id: '1',
      action: 'Paiement créé',
      date: payment.createdAt,
      user: payment.processedBy,
      details: 'Paiement enregistré dans le système',
    },
    {
      id: '2',
      action: 'En attente de validation',
      date: payment.createdAt,
      user: 'Système',
      details: 'Paiement en attente de validation par un administrateur',
    },
  ];

  if (payment.status === 'completed') {
    paymentHistory.push({
      id: '3',
      action: 'Paiement validé',
      date: payment.paidDate,
      user: payment.processedBy,
      details: 'Paiement validé et reçu généré',
    });
  }

  const tabs = [
    { id: 'details', label: 'Détails', icon: Receipt },
    { id: 'history', label: 'Historique', icon: Clock },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="text-xl flex items-center">
                <Receipt className="w-6 h-6 mr-2" />
                Reçu {payment.receiptNumber}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Paiement de {formatAmount(payment.amount)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <CardContent className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium text-gray-900">{getStatusLabel(payment.status)}</p>
                      <p className="text-sm text-gray-600">
                        {payment.status === 'pending' ? 'Validation requise' : 'Traitement terminé'}
                      </p>
                    </div>
                  </div>
                  {payment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Valider
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations de l'élève */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations de l'élève</h3>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Avatar 
                        src={payment.student.avatar} 
                        name={payment.student.name} 
                        size="lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{payment.student.name}</p>
                        <p className="text-sm text-gray-600">{payment.student.class}</p>
                        <p className="text-xs text-gray-500">ID: {payment.student.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Détails du paiement */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Détails du paiement</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Type de paiement</p>
                          <p className="font-medium">{payment.paymentType.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Mode de paiement</p>
                          <p className="font-medium">{payment.paymentMethod.name}</p>
                          {payment.reference && (
                            <p className="text-xs text-gray-500">Réf: {payment.reference}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Date de paiement</p>
                          <p className="font-medium">
                            {formatDateTime(payment.paidDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Traité par</p>
                          <p className="font-medium">{payment.processedBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Échéancier (si applicable) */}
                {payment.installment && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Échéancier</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-900">{payment.installment.description}</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Échéance : {new Date(payment.installment.dueDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Montant */}
                <div className={`p-6 rounded-lg ${
                  payment.status === 'completed' ? 'bg-emerald-50' : 
                  payment.status === 'partial' ? 'bg-blue-50' : 'bg-amber-50'
                }`}>
                  <div className="text-center">
                    <p className={`text-sm mb-2 ${
                      payment.status === 'completed' ? 'text-emerald-700' : 
                      payment.status === 'partial' ? 'text-blue-700' : 'text-amber-700'
                    }`}>
                      {payment.status === 'partial' ? 'Paiement partiel' : 'Montant payé'}
                    </p>
                    <p className={`text-3xl font-bold ${
                      payment.status === 'completed' ? 'text-emerald-900' : 
                      payment.status === 'partial' ? 'text-blue-900' : 'text-amber-900'
                    }`}>
                      {formatAmount(payment.amount)}
                    </p>
                    {payment.feeBalance && (
                      <p className="text-sm mt-2 text-gray-600">
                        Reste à payer : {formatAmount(payment.feeBalance.newRemaining)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {payment.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{payment.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    {payment.status === 'completed' && (
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Demander remboursement
                      </Button>
                    )}
                  </div>
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le reçu
                  </Button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Historique du paiement</h3>
                
                <div className="space-y-4">
                  {paymentHistory.map((entry, index) => (
                    <div key={entry.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          index === paymentHistory.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{entry.action}</p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(entry.date)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                        <p className="text-xs text-gray-500 mt-1">Par {entry.user}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Règles de gestion */}
                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">Règles de traçabilité :</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Chaque action est horodatée et tracée</li>
                    <li>• L'historique est conservé de manière permanente</li>
                    <li>• Seuls les administrateurs peuvent modifier les paiements validés</li>
                    <li>• Les remboursements nécessitent une validation spéciale</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};