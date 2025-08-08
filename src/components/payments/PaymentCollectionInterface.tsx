import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { PaymentInstallmentManager } from './PaymentInstallmentManager';
import { 
  Search, 
  Filter, 
  CreditCard,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Receipt,
  TrendingUp,
  Calculator,
} from 'lucide-react';

export const PaymentCollectionInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  // Données simulées des élèves avec leurs paiements
  const studentsWithPayments = [
    {
      id: 'STU-001',
      firstName: 'Emma',
      lastName: 'Martin',
      class: '6ème A',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalDue: 450000,
      totalPaid: 150000,
      remainingBalance: 300000,
      status: 'partial',
      lastPayment: '2024-10-15',
      paymentSchedules: [
        {
          id: 'PS-001',
          type: 'Frais de scolarité',
          totalAmount: 450000,
          paidAmount: 150000,
          remainingAmount: 300000,
          status: 'en_cours',
          nextDueDate: '2024-12-15',
        }
      ]
    },
    {
      id: 'STU-002',
      firstName: 'Lucas',
      lastName: 'Dubois',
      class: '5ème B',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalDue: 380000,
      totalPaid: 380000,
      remainingBalance: 0,
      status: 'completed',
      lastPayment: '2024-11-10',
      paymentSchedules: [
        {
          id: 'PS-002',
          type: 'Frais de scolarité',
          totalAmount: 380000,
          paidAmount: 380000,
          remainingAmount: 0,
          status: 'termine',
          nextDueDate: null,
        }
      ]
    },
    {
      id: 'STU-003',
      firstName: 'Chloé',
      lastName: 'Leroy',
      class: '4ème C',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalDue: 420000,
      totalPaid: 0,
      remainingBalance: 420000,
      status: 'unpaid',
      lastPayment: null,
      paymentSchedules: [
        {
          id: 'PS-003',
          type: 'Frais de scolarité',
          totalAmount: 420000,
          paidAmount: 0,
          remainingAmount: 420000,
          status: 'en_cours',
          nextDueDate: '2024-11-30',
        }
      ]
    },
  ];

  const classes = [
    { id: 'all', name: 'Toutes les classes' },
    { id: '6A', name: '6ème A' },
    { id: '5B', name: '5ème B' },
    { id: '4C', name: '4ème C' },
  ];

  const statusOptions = [
    { id: 'all', name: 'Tous les statuts' },
    { id: 'completed', name: 'Payé intégralement' },
    { id: 'partial', name: 'Paiement partiel' },
    { id: 'unpaid', name: 'Impayé' },
    { id: 'overdue', name: 'En retard' },
  ];

  const filteredStudents = studentsWithPayments.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class.includes(selectedClass);
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'unpaid':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'unpaid':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      completed: 'Payé intégralement',
      partial: 'Paiement partiel',
      unpaid: 'Impayé',
      overdue: 'En retard',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const handlePaymentProcessed = (paymentData: any) => {
    console.log('Payment processed:', paymentData);
    // Ici, vous ajouteriez la logique pour traiter le paiement
    // et mettre à jour les données de l'élève
  };

  // Statistiques
  const totalStudents = filteredStudents.length;
  const totalDue = filteredStudents.reduce((sum, student) => sum + student.totalDue, 0);
  const totalPaid = filteredStudents.reduce((sum, student) => sum + student.totalPaid, 0);
  const totalRemaining = filteredStudents.reduce((sum, student) => sum + student.remainingBalance, 0);
  const completedPayments = filteredStudents.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interface d'encaissement</h1>
          <p className="text-gray-600 mt-1">Gérer les paiements et encaissements des élèves</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Élèves</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total dû</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">{formatAmount(totalDue)}</p>
              </div>
              <Calculator className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Encaissé</p>
                <p className="text-lg md:text-xl font-bold text-emerald-600">{formatAmount(totalPaid)}</p>
              </div>
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Reste à encaisser</p>
                <p className="text-lg md:text-xl font-bold text-red-600">{formatAmount(totalRemaining)}</p>
              </div>
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Paiements terminés</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">{completedPayments}</p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
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
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
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

      {/* Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={student.avatar} 
                    name={`${student.firstName} ${student.lastName}`} 
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{student.class}</p>
                    <p className="text-xs text-gray-500">ID: {student.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(student.status)}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(student.status)}`}>
                    {getStatusLabel(student.status)}
                  </span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-xs text-gray-600">Total dû</p>
                  <p className="font-bold text-gray-900">{formatAmount(student.totalDue)}</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-600">Payé</p>
                  <p className="font-bold text-emerald-600">{formatAmount(student.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-xs text-red-600">Reste</p>
                  <p className="font-bold text-red-600">{formatAmount(student.remainingBalance)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progression</span>
                  <span>{Math.round((student.totalPaid / student.totalDue) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(student.totalPaid / student.totalDue) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Payment Schedules */}
              <div className="space-y-2 mb-4">
                {student.paymentSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{schedule.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{formatAmount(schedule.remainingAmount)}</span>
                      {schedule.nextDueDate && (
                        <span className="text-xs text-gray-500">
                          Échéance: {new Date(schedule.nextDueDate).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Last Payment */}
              {student.lastPayment && (
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Receipt className="w-3 h-3 mr-1" />
                  Dernier paiement: {new Date(student.lastPayment).toLocaleDateString('fr-FR')}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedStudent(student.id)}
                  disabled={student.remainingBalance === 0}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {student.remainingBalance === 0 ? 'Payé' : 'Encaisser'}
                </Button>
                <Button size="sm" variant="outline">
                  <Receipt className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun élève trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Management Interface */}
      {selectedStudent && (
        <PaymentInstallmentManager
          studentId={selectedStudent}
          onPaymentProcessed={handlePaymentProcessed}
        />
      )}

      {/* Rules Information */}
      <Card>
        <CardHeader>
          <CardTitle>Interface d'encaissement - Règles de gestion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Fonctionnalités de l'interface :</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• <strong>Vue d'ensemble :</strong> Affichage de tous les élèves avec leur statut de paiement</li>
              <li>• <strong>Recherche et filtres :</strong> Recherche par nom, classe, statut de paiement</li>
              <li>• <strong>Encaissement direct :</strong> Interface simplifiée pour traiter les paiements</li>
              <li>• <strong>Suivi en temps réel :</strong> Mise à jour automatique des soldes et statuts</li>
              <li>• <strong>Génération de reçus :</strong> Reçu automatique pour chaque encaissement</li>
              <li>• <strong>Gestion des échéanciers :</strong> Support des paiements échelonnés</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};