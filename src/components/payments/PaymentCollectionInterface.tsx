import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { PaymentForm } from './PaymentForm';
import { InstallmentPlanModal } from './InstallmentPlanModal';
import { 
  Search, 
  User,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
  Plus,
  Eye,
  FileText,
} from 'lucide-react';

export const PaymentCollectionInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  // Données simulées des élèves avec leurs frais
  const studentsWithFees = [
    {
      id: 'STU-001',
      firstName: 'Emma',
      lastName: 'Martin',
      class: '6ème A',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalDue: 525000,
      totalPaid: 300000,
      totalOverdue: 150000,
      fees: [
        {
          id: 'FEE-001',
          name: 'Frais de scolarité',
          category: 'tuition',
          totalAmount: 450000,
          paidAmount: 300000,
          remainingAmount: 150000,
          status: 'partial',
          dueDate: '2024-11-15',
          isOverdue: true,
          installments: [
            {
              id: 'INST-001',
              description: 'Tranche 1/3 - Trimestre 1',
              amount: 150000,
              dueDate: '2024-10-15',
              status: 'paid',
              paidDate: '2024-10-10',
              paidAmount: 150000,
            },
            {
              id: 'INST-002',
              description: 'Tranche 2/3 - Trimestre 2',
              amount: 150000,
              dueDate: '2024-01-15',
              status: 'paid',
              paidDate: '2024-01-12',
              paidAmount: 150000,
            },
            {
              id: 'INST-003',
              description: 'Tranche 3/3 - Trimestre 3',
              amount: 150000,
              dueDate: '2024-04-15',
              status: 'pending',
              paidAmount: 0,
            },
          ],
        },
        {
          id: 'FEE-002',
          name: 'Uniformes scolaires',
          category: 'uniform',
          totalAmount: 45000,
          paidAmount: 0,
          remainingAmount: 45000,
          status: 'pending',
          dueDate: '2024-09-30',
          isOverdue: true,
          installments: [
            {
              id: 'INST-004',
              description: 'Paiement unique',
              amount: 45000,
              dueDate: '2024-09-30',
              status: 'pending',
              paidAmount: 0,
            },
          ],
        },
        {
          id: 'FEE-003',
          name: 'Fournitures scolaires',
          category: 'supplies',
          totalAmount: 30000,
          paidAmount: 0,
          remainingAmount: 30000,
          status: 'pending',
          dueDate: '2024-12-01',
          isOverdue: false,
          installments: [
            {
              id: 'INST-005',
              description: 'Paiement unique',
              amount: 30000,
              dueDate: '2024-12-01',
              status: 'pending',
              paidAmount: 0,
            },
          ],
        },
      ],
      discounts: [
        {
          id: 'DISC-001',
          name: 'Bourse mérite',
          type: 'percentage',
          value: 10,
          appliedAmount: 45000,
          appliesTo: ['tuition'],
        },
      ],
    },
    {
      id: 'STU-002',
      firstName: 'Lucas',
      lastName: 'Dubois',
      class: '5ème B',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalDue: 450000,
      totalPaid: 450000,
      totalOverdue: 0,
      fees: [
        {
          id: 'FEE-004',
          name: 'Frais de scolarité',
          category: 'tuition',
          totalAmount: 450000,
          paidAmount: 450000,
          remainingAmount: 0,
          status: 'paid',
          dueDate: '2024-10-15',
          isOverdue: false,
          installments: [
            {
              id: 'INST-006',
              description: 'Paiement complet',
              amount: 450000,
              dueDate: '2024-10-15',
              status: 'paid',
              paidDate: '2024-10-10',
              paidAmount: 450000,
            },
          ],
        },
      ],
      discounts: [],
    },
  ];

  const filteredStudents = studentsWithFees.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      case 'partial':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'partial':
        return 'bg-amber-100 text-amber-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      paid: 'Payé',
      partial: 'Partiel',
      pending: 'En attente',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const handlePaymentSave = (paymentData: any) => {
    console.log('Payment saved:', paymentData);
    // Logique de sauvegarde du paiement
  };

  const handleInstallmentPlan = (fee: any, student: any) => {
    setSelectedFee({ ...fee, student });
    setIsInstallmentModalOpen(true);
  };

  const handleQuickPayment = (fee: any, student: any) => {
    setSelectedStudent(student);
    setSelectedFee(fee);
    setIsPaymentFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interface d'encaissement</h1>
          <p className="text-gray-600 mt-1">Sélectionner un élève pour voir ses frais et enregistrer les paiements</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un élève par nom ou classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Student Header */}
              <div className="flex items-center space-x-4 mb-6">
                <Avatar 
                  src={student.avatar} 
                  name={`${student.firstName} ${student.lastName}`} 
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-gray-600">{student.class}</p>
                  <p className="text-xs text-gray-500">ID: {student.id}</p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Total dû</p>
                  <p className="font-bold text-gray-900">{formatAmount(student.totalDue)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Payé</p>
                  <p className="font-bold text-emerald-600">{formatAmount(student.totalPaid)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Restant</p>
                  <p className={`font-bold ${student.totalOverdue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatAmount(student.totalDue - student.totalPaid)}
                  </p>
                </div>
              </div>

              {/* Discounts Applied */}
              {student.discounts.length > 0 && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-medium text-emerald-900 mb-1">Réductions appliquées :</p>
                  {student.discounts.map((discount) => (
                    <div key={discount.id} className="text-xs text-emerald-700">
                      • {discount.name} : {discount.type === 'percentage' ? `${discount.value}%` : formatAmount(discount.value)}
                      {discount.appliedAmount > 0 && ` (${formatAmount(discount.appliedAmount)} économisés)`}
                    </div>
                  ))}
                </div>
              )}

              {/* Fees List */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Frais à payer ({student.fees.length})</h4>
                {student.fees.map((fee) => (
                  <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{fee.name}</span>
                        {getStatusIcon(fee.status)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(fee.status)}`}>
                          {getStatusLabel(fee.status)}
                        </span>
                        {fee.isOverdue && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            En retard
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Montant total :</span>
                        <span className="ml-2 font-medium">{formatAmount(fee.totalAmount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payé :</span>
                        <span className="ml-2 font-medium text-emerald-600">{formatAmount(fee.paidAmount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Restant :</span>
                        <span className="ml-2 font-medium text-red-600">{formatAmount(fee.remainingAmount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Échéance :</span>
                        <span className="ml-2 font-medium">
                          {new Date(fee.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {/* Installments */}
                    {fee.installments.length > 1 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Échéancier ({fee.installments.length} tranches) :
                        </p>
                        <div className="space-y-1">
                          {fee.installments.map((installment) => (
                            <div key={installment.id} className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">{installment.description}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{formatAmount(installment.amount)}</span>
                                {installment.status === 'paid' ? (
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Clock className="w-3 h-3 text-amber-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {fee.remainingAmount > 0 && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleQuickPayment(fee, student)}
                            className="flex-1 min-w-0"
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Paiement
                          </Button>
                          {fee.installments.length > 1 && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleInstallmentPlan(fee, student)}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Échéancier
                            </Button>
                          )}
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                      {fee.status === 'paid' && (
                        <Button size="sm" variant="outline">
                          <Receipt className="w-4 h-4 mr-1" />
                          Reçu
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                <span className="text-sm text-gray-600">
                  {student.totalOverdue > 0 ? 'Paiements en retard' : 'Situation à jour'}
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Relevé
                  </Button>
                  {student.totalDue - student.totalPaid > 0 && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student);
                        setSelectedFee(null);
                        setIsPaymentFormOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Paiement global
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <User className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun élève trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier votre recherche ou vérifiez l'orthographe.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Form Modal */}
      <PaymentForm
        isOpen={isPaymentFormOpen}
        onClose={() => {
          setIsPaymentFormOpen(false);
          setSelectedStudent(null);
          setSelectedFee(null);
        }}
        student={selectedStudent}
        fee={selectedFee}
        onSave={handlePaymentSave}
      />

      {/* Installment Plan Modal */}
      <InstallmentPlanModal
        isOpen={isInstallmentModalOpen}
        onClose={() => {
          setIsInstallmentModalOpen(false);
          setSelectedFee(null);
        }}
        fee={selectedFee}
      />
    </div>
  );
};