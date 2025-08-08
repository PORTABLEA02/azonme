import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  BarChart3, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Filter,
  Eye,
} from 'lucide-react';

export const FinancialReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedReportType, setSelectedReportType] = useState('collection_summary');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Données simulées des rapports
  const reportData = {
    collection_summary: {
      totalCollected: 4250000,
      totalPending: 890000,
      totalOverdue: 320000,
      collectionRate: 87.5,
      byCategory: {
        tuition: { collected: 3200000, pending: 650000, overdue: 200000 },
        registration: { collected: 450000, pending: 80000, overdue: 50000 },
        uniform: { collected: 380000, pending: 90000, overdue: 40000 },
        supplies: { collected: 220000, pending: 70000, overdue: 30000 },
      },
      byClass: [
        { className: '6ème A', collected: 420000, pending: 89000, overdue: 32000, students: 28 },
        { className: '5ème B', collected: 390000, pending: 78000, overdue: 28000, students: 26 },
        { className: '4ème C', collected: 375000, pending: 85000, overdue: 35000, students: 25 },
        { className: 'Terminale C', collected: 480000, pending: 95000, overdue: 45000, students: 32 },
      ],
    },
    outstanding_fees: {
      totalOutstanding: 1210000,
      studentsAffected: 156,
      byAging: {
        current: { amount: 890000, count: 89 },
        overdue_30: { amount: 200000, count: 35 },
        overdue_60: { amount: 80000, count: 20 },
        overdue_90: { amount: 40000, count: 12 },
      },
      topDebtors: [
        { studentName: 'Hugo Moreau', className: '3ème A', amount: 150000, daysOverdue: 45 },
        { studentName: 'Sarah Petit', className: '2nde B', amount: 125000, daysOverdue: 32 },
        { studentName: 'Lucas Martin', className: '1ère C', amount: 100000, daysOverdue: 28 },
      ],
    },
  };

  const reportTypes = [
    { value: 'collection_summary', label: 'Résumé des encaissements' },
    { value: 'outstanding_fees', label: 'Impayés et retards' },
    { value: 'class_analysis', label: 'Analyse par classe' },
    { value: 'period_comparison', label: 'Comparaison périodique' },
  ];

  const periods = [
    { value: 'current_month', label: 'Mois en cours' },
    { value: 'current_quarter', label: 'Trimestre en cours' },
    { value: 'current_year', label: 'Année en cours' },
    { value: 'custom', label: 'Période personnalisée' },
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const generateReport = () => {
    console.log('Generating report:', {
      type: selectedReportType,
      period: selectedPeriod,
      startDate,
      endDate,
    });
    // Logique de génération de rapport
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    console.log('Exporting report as:', format);
    // Logique d'export
  };

  const renderCollectionSummary = () => {
    const data = reportData.collection_summary;
    
    return (
      <div className="space-y-6">
        {/* Résumé général */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total encaissé</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatAmount(data.totalCollected)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-xl font-bold text-amber-600">
                    {formatAmount(data.totalPending)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Impayés</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatAmount(data.totalOverdue)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de recouvrement</p>
                  <p className="text-xl font-bold text-blue-600">{data.collectionRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Répartition par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie de frais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-600">Catégorie</th>
                    <th className="text-left p-3 font-medium text-gray-600">Encaissé</th>
                    <th className="text-left p-3 font-medium text-gray-600">En attente</th>
                    <th className="text-left p-3 font-medium text-gray-600">Impayés</th>
                    <th className="text-left p-3 font-medium text-gray-600">Taux</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.byCategory).map(([category, amounts]) => {
                    const total = amounts.collected + amounts.pending + amounts.overdue;
                    const rate = total > 0 ? (amounts.collected / total) * 100 : 0;
                    const categoryLabels = {
                      tuition: 'Frais de scolarité',
                      registration: 'Frais d\'inscription',
                      uniform: 'Uniformes',
                      supplies: 'Fournitures',
                    };
                    
                    return (
                      <tr key={category} className="border-b border-gray-100">
                        <td className="p-3 font-medium">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </td>
                        <td className="p-3 text-emerald-600 font-medium">
                          {formatAmount(amounts.collected)}
                        </td>
                        <td className="p-3 text-amber-600 font-medium">
                          {formatAmount(amounts.pending)}
                        </td>
                        <td className="p-3 text-red-600 font-medium">
                          {formatAmount(amounts.overdue)}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            rate >= 90 ? 'bg-emerald-100 text-emerald-800' :
                            rate >= 75 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {rate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Analyse par classe */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par classe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-600">Classe</th>
                    <th className="text-left p-3 font-medium text-gray-600">Élèves</th>
                    <th className="text-left p-3 font-medium text-gray-600">Encaissé</th>
                    <th className="text-left p-3 font-medium text-gray-600">En attente</th>
                    <th className="text-left p-3 font-medium text-gray-600">Impayés</th>
                    <th className="text-left p-3 font-medium text-gray-600">Moyenne/élève</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byClass.map((classData) => {
                    const averagePerStudent = classData.collected / classData.students;
                    
                    return (
                      <tr key={classData.className} className="border-b border-gray-100">
                        <td className="p-3 font-medium">{classData.className}</td>
                        <td className="p-3">{classData.students}</td>
                        <td className="p-3 text-emerald-600 font-medium">
                          {formatAmount(classData.collected)}
                        </td>
                        <td className="p-3 text-amber-600 font-medium">
                          {formatAmount(classData.pending)}
                        </td>
                        <td className="p-3 text-red-600 font-medium">
                          {formatAmount(classData.overdue)}
                        </td>
                        <td className="p-3 font-medium">
                          {formatAmount(averagePerStudent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOutstandingFees = () => {
    const data = reportData.outstanding_fees;
    
    return (
      <div className="space-y-6">
        {/* Résumé des impayés */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total des impayés</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatAmount(data.totalOutstanding)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Élèves concernés</p>
                  <p className="text-2xl font-bold text-amber-600">{data.studentsAffected}</p>
                </div>
                <Users className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analyse par ancienneté */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par ancienneté des impayés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(data.byAging).map(([period, aging]) => {
                const periodLabels = {
                  current: 'Courant',
                  overdue_30: '30+ jours',
                  overdue_60: '60+ jours',
                  overdue_90: '90+ jours',
                };
                
                return (
                  <Card key={period}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {periodLabels[period as keyof typeof periodLabels]}
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          {formatAmount(aging.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {aging.count} élèves
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top débiteurs */}
        <Card>
          <CardHeader>
            <CardTitle>Principaux débiteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topDebtors.map((debtor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{debtor.studentName}</p>
                    <p className="text-sm text-gray-600">{debtor.className}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatAmount(debtor.amount)}</p>
                    <p className="text-sm text-red-500">{debtor.daysOverdue} jours de retard</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports financiers</h1>
          <p className="text-gray-600 mt-1">Analyse et suivi des performances financières</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de rapport
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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

            {selectedPeriod === 'custom' && (
              <>
                <Input
                  label="Date de début"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="Date de fin"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={generateReport}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Générer le rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenu du rapport */}
      {selectedReportType === 'collection_summary' && renderCollectionSummary()}
      {selectedReportType === 'outstanding_fees' && renderOutstandingFees()}

      {/* Règles de gestion */}
      <Card>
        <CardHeader>
          <CardTitle>Règles de génération des rapports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Accès aux rapports</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Seuls les administrateurs et comptables peuvent générer des rapports</li>
                <li>• Les rapports sont générés en temps réel</li>
                <li>• L'historique des rapports générés est conservé</li>
                <li>• Export possible en PDF et Excel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Données incluses</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Tous les paiements validés et en attente</li>
                <li>• Analyse par classe, niveau et catégorie de frais</li>
                <li>• Calculs automatiques des taux de recouvrement</li>
                <li>• Identification des élèves en situation d'impayé</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};