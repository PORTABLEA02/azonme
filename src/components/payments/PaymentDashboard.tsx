import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  CreditCard,
  Calendar,
  BarChart3,
  Filter,
  Download,
} from 'lucide-react';

export const PaymentDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedClass, setSelectedClass] = useState('all');

  // Données simulées du tableau de bord
  const dashboardStats = {
    totalCollected: 4250000,
    totalPending: 890000,
    totalOverdue: 320000,
    totalRefunds: 45000,
    collectionRate: 87.5,
    overdueCount: 12,
    restrictedStudents: 3,
    paymentsByType: {
      tuition: 3200000,
      registration: 450000,
      uniform: 380000,
      supplies: 220000,
      activities: 150000,
    },
    paymentsByMethod: {
      mobile_money: 2100000,
      cash: 1200000,
      bank_transfer: 650000,
      check: 300000,
    },
  };

  const recentPayments = [
    {
      id: 'PAY-001',
      student: { name: 'Emma Martin', class: '6ème A', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
      amount: 150000,
      type: 'Frais de scolarité',
      status: 'completed',
      date: '2024-11-20',
    },
    {
      id: 'PAY-002',
      student: { name: 'Lucas Dubois', class: '5ème B', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' },
      amount: 45000,
      type: 'Uniformes',
      status: 'pending',
      date: '2024-11-19',
    },
    {
      id: 'PAY-003',
      student: { name: 'Chloé Leroy', class: '4ème C', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
      amount: 30000,
      type: 'Fournitures',
      status: 'completed',
      date: '2024-11-18',
    },
  ];

  const overduePayments = [
    {
      id: 'OVD-001',
      student: { name: 'Hugo Moreau', class: '3ème A', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
      amount: 150000,
      type: 'Frais de scolarité',
      dueDate: '2024-11-10',
      daysOverdue: 10,
    },
    {
      id: 'OVD-002',
      student: { name: 'Sarah Petit', class: '2nde B', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
      amount: 75000,
      type: 'Activités parascolaires',
      dueDate: '2024-11-05',
      daysOverdue: 15,
    },
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const periods = [
    { id: 'week', name: 'Cette semaine' },
    { id: 'month', name: 'Ce mois' },
    { id: 'quarter', name: 'Ce trimestre' },
    { id: 'year', name: 'Cette année' },
  ];

  const classes = [
    { id: 'all', name: 'Toutes les classes' },
    { id: '6A', name: '6ème A' },
    { id: '5B', name: '5ème B' },
    { id: '4C', name: '4ème C' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord - Paiements</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des encaissements et paiements</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>{period.name}</option>
            ))}
          </select>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total encaissé</p>
                <p className="text-lg md:text-xl font-bold text-emerald-600">
                  {formatAmount(dashboardStats.totalCollected)}
                </p>
                <p className="text-xs text-emerald-600 mt-1">+12% ce mois</p>
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
                  {formatAmount(dashboardStats.totalPending)}
                </p>
                <p className="text-xs text-amber-600 mt-1">Validation requise</p>
              </div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Impayés</p>
                <p className="text-lg md:text-xl font-bold text-red-600">
                  {formatAmount(dashboardStats.totalOverdue)}
                </p>
                <p className="text-xs text-red-600 mt-1">{dashboardStats.overdueCount} élèves</p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Taux de recouvrement</p>
                <p className="text-lg md:text-xl font-bold text-blue-600">
                  {dashboardStats.collectionRate}%
                </p>
                <p className="text-xs text-blue-600 mt-1">Objectif: 90%</p>
              </div>
              <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par type de paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dashboardStats.paymentsByType).map(([type, amount]) => {
                const percentage = (amount / dashboardStats.totalCollected) * 100;
                const typeLabels = {
                  tuition: 'Frais de scolarité',
                  registration: 'Frais d\'inscription',
                  uniform: 'Uniformes',
                  supplies: 'Fournitures',
                  activities: 'Activités parascolaires',
                };
                
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {typeLabels[type as keyof typeof typeLabels]}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatAmount(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Répartition par mode de paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dashboardStats.paymentsByMethod).map(([method, amount]) => {
                const percentage = (amount / dashboardStats.totalCollected) * 100;
                const methodLabels = {
                  mobile_money: 'Mobile Money',
                  cash: 'Espèces',
                  bank_transfer: 'Virement bancaire',
                  check: 'Chèque',
                };
                
                return (
                  <div key={method}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {methodLabels[method as keyof typeof methodLabels]}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatAmount(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paiements récents */}
        <Card>
          <CardHeader>
            <CardTitle>Paiements récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar src={payment.student.avatar} name={payment.student.name} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{payment.student.name}</p>
                      <p className="text-xs text-gray-600">{payment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatAmount(payment.amount)}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status === 'completed' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impayés critiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Impayés critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overduePayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar src={payment.student.avatar} name={payment.student.name} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{payment.student.name}</p>
                      <p className="text-xs text-red-600">
                        {payment.type} - {payment.daysOverdue} jours de retard
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-sm">{formatAmount(payment.amount)}</p>
                    <p className="text-xs text-gray-600">
                      Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {dashboardStats.restrictedStudents > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>{dashboardStats.restrictedStudents} élèves</strong> ont des restrictions 
                  appliquées en raison d'impayés.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Règles de gestion */}
      <Card>
        <CardHeader>
          <CardTitle>Règles de gestion des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Alertes automatiques</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Rappel 7 jours avant échéance</li>
                <li>• Alerte immédiate en cas de retard</li>
                <li>• Notification aux parents par SMS/email</li>
                <li>• Escalade vers l'administration après 15 jours</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Restrictions automatiques</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Blocage d'accès au bulletin après 30 jours</li>
                <li>• Refus d'inscription aux examens</li>
                <li>• Suspension des activités parascolaires</li>
                <li>• Restriction d'accès à la bibliothèque</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};