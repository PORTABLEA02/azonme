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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const PaymentCollectionInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
    
    // Mettre à jour le solde du frais
    const updatedFee = {
      ...selectedFee,
      paidAmount: selectedFee.paidAmount + paymentData.amount,
      remainingAmount: selectedFee.remainingAmount - paymentData.amount,
      status: paymentData.feeBalance.isFullyPaid ? 'completed' : 'partial'
    };
    
    // Mettre à jour l'échéance si applicable
    if (paymentData.installmentId) {
      const installment = updatedFee.installments.find((inst: any) => inst.id === paymentData.installmentId);
      if (installment) {
        installment.paidAmount += paymentData.amount;
        installment.remainingAmount -= paymentData.amount;
        installment.status = installment.remainingAmount <= 0 ? 'completed' : 'partial';
        installment.payments = installment.payments || [];
        installment.payments.push(paymentData);
      }
    }
    
    console.log('Updated fee balance:', updatedFee);
    
    // Fermer le modal et actualiser les données
    setIsPaymentFormOpen(false);
    setSelectedStudent(null);
    setSelectedFee(null);
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

  const handleGlobalPayment = (student: any) => {
    setSelectedStudent(student);
    setSelectedFee(null);
    setIsPaymentFormOpen(true);
  };

  const getTotalOverdue = (student: any) => {
    return student.fees.reduce((sum: number, fee: any) => {
      return sum + (fee.isOverdue ? fee.remainingAmount : 0);
    }, 0);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interface d'encaissement</h1>
          <p className="text-gray-600 mt-1">Liste des élèves avec leurs frais et options de paiement</p>
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

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des élèves ({filteredStudents.length})
            {searchTerm && ` - Résultats pour "${searchTerm}"`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-600">Élève</th>
                  <th className="text-left p-4 font-medium text-gray-600">Classe</th>
                  <th className="text-left p-4 font-medium text-gray-600">Total dû</th>
                  <th className="text-left p-4 font-medium text-gray-600">Payé</th>
                  <th className="text-left p-4 font-medium text-gray-600">Restant</th>
                  <th className="text-left p-4 font-medium text-gray-600">En retard</th>
                  <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => {
                  const totalOverdue = getTotalOverdue(student);
                  const remainingAmount = student.totalDue - student.totalPaid;
                  const hasOverdue = totalOverdue > 0;
                  
                  return (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            src={student.avatar} 
                            name={`${student.firstName} ${student.lastName}`} 
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-gray-500">ID: {student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">{student.class}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-900">
                          {formatAmount(student.totalDue)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-600">
                          {formatAmount(student.totalPaid)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatAmount(remainingAmount)}
                        </span>
                      </td>
                      <td className="p-4">
                        {hasOverdue ? (
                          <span className="font-bold text-red-600">
                            {formatAmount(totalOverdue)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {hasOverdue && (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            hasOverdue ? 'bg-red-100 text-red-800' :
                            remainingAmount > 0 ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {hasOverdue ? 'En retard' :
                             remainingAmount > 0 ? 'Partiel' : 'À jour'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {remainingAmount > 0 && (
                            <Button 
                              size="sm"
                              onClick={() => handleGlobalPayment(student)}
                              className={hasOverdue ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              <CreditCard className="w-4 h-4 mr-1" />
                              Payer
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Open detailed view - could be a modal or navigate to detail page
                              console.log('View details for student:', student.id);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            Relevé
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredStudents.length)} sur {filteredStudents.length} élèves
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {currentStudents.length === 0 && (
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