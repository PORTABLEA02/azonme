import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { 
  X, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Receipt,
  Edit,
} from 'lucide-react';

interface InstallmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: any;
}

export const InstallmentPlanModal: React.FC<InstallmentPlanModalProps> = ({ 
  isOpen, 
  onClose, 
  fee 
}) => {
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);

  if (!isOpen || !fee) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInstallmentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getInstallmentStatusColor = (status: string) => {
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

  const getInstallmentStatusLabel = (status: string) => {
    const statusLabels = {
      paid: 'Payé',
      pending: 'En attente',
      overdue: 'En retard',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'paid') return false;
    return new Date(dueDate) < new Date();
  };

  const handlePayInstallment = (installment: any) => {
    setSelectedInstallment(installment);
    // Ouvrir le formulaire de paiement pour cette échéance
    console.log('Pay installment:', installment);
  };

  const totalPaid = fee.installments.reduce((sum: number, inst: any) => sum + inst.paidAmount, 0);
  const totalRemaining = fee.totalAmount - totalPaid;
  const completedInstallments = fee.installments.filter((inst: any) => inst.status === 'paid').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Échéancier de paiement
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {fee.name} - {fee.student?.firstName} {fee.student?.lastName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="p-6">
            {/* Student Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <Avatar 
                src={fee.student?.avatar} 
                name={`${fee.student?.firstName} ${fee.student?.lastName}`} 
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {fee.student?.firstName} {fee.student?.lastName}
                </h3>
                <p className="text-gray-600">{fee.student?.class}</p>
                <p className="text-xs text-gray-500">ID: {fee.student?.id}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Montant total</p>
                <p className="text-xl font-bold text-blue-900">{formatAmount(fee.totalAmount)}</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-600">Payé</p>
                <p className="text-xl font-bold text-emerald-900">{formatAmount(totalPaid)}</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-600">Restant</p>
                <p className="text-xl font-bold text-amber-900">{formatAmount(totalRemaining)}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Progression</p>
                <p className="text-xl font-bold text-purple-900">
                  {completedInstallments}/{fee.installments.length}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression du paiement</span>
                <span className="font-medium">
                  {Math.round((totalPaid / fee.totalAmount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all" 
                  style={{ width: `${(totalPaid / fee.totalAmount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Installments List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Détail des échéances</h3>
              {fee.installments.map((installment: any, index: number) => {
                const isInstallmentOverdue = isOverdue(installment.dueDate, installment.status);
                const actualStatus = isInstallmentOverdue ? 'overdue' : installment.status;
                
                return (
                  <Card key={installment.id} className={`p-4 ${
                    actualStatus === 'paid' ? 'bg-emerald-50 border-emerald-200' :
                    actualStatus === 'partial' ? 'bg-blue-50 border-blue-200' :
                    actualStatus === 'overdue' ? 'bg-red-50 border-red-200' :
                    'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{installment.description}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Échéance : {new Date(installment.dueDate).toLocaleDateString('fr-FR')}</span>
                            <span>Montant : {formatAmount(installment.amount)}</span>
                            {installment.paidAmount > 0 && (
                              <span className="text-emerald-600">
                                Payé : {formatAmount(installment.paidAmount)}
                              </span>
                            )}
                            {installment.remainingAmount > 0 && installment.paidAmount > 0 && (
                              <span className="text-blue-600">
                                Reste : {formatAmount(installment.remainingAmount)}
                              </span>
                            )}
                          </div>
                          {installment.paidDate && (
                            <p className="text-xs text-emerald-600 mt-1">
                              Payé le {new Date(installment.paidDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                          {installment.status === 'partial' && (
                            <p className="text-xs text-blue-600 mt-1">
                              Paiement partiel effectué
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getInstallmentStatusIcon(actualStatus)}
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getInstallmentStatusColor(actualStatus)}`}>
                            {getInstallmentStatusLabel(actualStatus)}
                          </span>
                        </div>
                        
                        <div className="flex space-x-1">
                          {installment.remainingAmount > 0 && (
                            <Button 
                              size="sm"
                              onClick={() => handlePayInstallment(installment)}
                              className={actualStatus === 'overdue' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              <CreditCard className="w-4 h-4 mr-1" />
                              {installment.status === 'partial' ? 'Compléter' : 'Payer'}
                            </Button>
                          )}
                          {installment.paidAmount > 0 && (
                            <Button size="sm" variant="outline">
                              <Receipt className="w-4 h-4 mr-1" />
                              Reçu
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Rules Information */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Règles de gestion des échéanciers :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Les paiements partiels sont autorisés sur chaque échéance</li>
                <li>• Le statut passe à "Terminé" uniquement quand le montant total est payé</li>
                <li>• Les échéances en retard génèrent automatiquement des alertes</li>
                <li>• Un reçu est généré pour chaque paiement d'échéance</li>
                <li>• Les modifications d'échéancier nécessitent une validation administrative</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {totalRemaining > 0 ? (
                  <span className="text-amber-600">
                    Reste {formatAmount(totalRemaining)} à payer
                  </span>
                ) : (
                  <span className="text-emerald-600">
                    ✓ Paiement complet effectué
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Fermer
                </Button>
                {totalRemaining > 0 && (
                  <Button>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Paiement global
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};