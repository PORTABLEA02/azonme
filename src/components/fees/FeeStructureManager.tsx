import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FeeStructureForm } from './FeeStructureForm';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  Users,
  Calendar,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export const FeeStructureManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<any>(null);

  // Données simulées des structures de frais
  const feeStructures = [
    {
      id: 'FS-001',
      feeTypeId: 'FT-001',
      feeTypeName: 'Frais de scolarité',
      category: 'tuition',
      applicableLevel: 'all',
      cycle: 'all',
      amount: 150000,
      currency: 'XOF',
      validFrom: '2024-09-01',
      validTo: '2025-08-31',
      isActive: true,
      createdBy: 'Admin',
      createdAt: '2024-08-15',
      updatedAt: '2024-08-15',
      studentsAffected: 1247,
    },
    {
      id: 'FS-002',
      feeTypeId: 'FT-002',
      feeTypeName: 'Frais d\'inscription',
      category: 'registration',
      applicableLevel: 'all',
      cycle: 'all',
      amount: 25000,
      currency: 'XOF',
      validFrom: '2024-09-01',
      validTo: '2025-08-31',
      isActive: true,
      createdBy: 'Admin',
      createdAt: '2024-08-15',
      updatedAt: '2024-08-15',
      studentsAffected: 1247,
    },
    {
      id: 'FS-003',
      feeTypeId: 'FT-003',
      feeTypeName: 'Uniformes scolaires',
      category: 'uniform',
      applicableLevel: 'primary',
      cycle: 'premier',
      amount: 45000,
      currency: 'XOF',
      validFrom: '2024-09-01',
      validTo: '2025-08-31',
      isActive: true,
      createdBy: 'Admin',
      createdAt: '2024-08-15',
      updatedAt: '2024-08-15',
      studentsAffected: 680,
    },
    {
      id: 'FS-004',
      feeTypeId: 'FT-004',
      feeTypeName: 'Activités parascolaires',
      category: 'activities',
      applicableLevel: 'specific_class',
      specificClasses: ['CL-2024-001', 'CL-2024-002'],
      amount: 20000,
      currency: 'XOF',
      validFrom: '2024-09-01',
      validTo: '2025-08-31',
      isActive: true,
      createdBy: 'Admin',
      createdAt: '2024-08-15',
      updatedAt: '2024-08-15',
      studentsAffected: 54,
    },
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'tuition', name: 'Frais de scolarité' },
    { id: 'registration', name: 'Frais d\'inscription' },
    { id: 'uniform', name: 'Uniformes' },
    { id: 'supplies', name: 'Fournitures' },
    { id: 'activities', name: 'Activités parascolaires' },
    { id: 'transport', name: 'Transport' },
    { id: 'meals', name: 'Restauration' },
    { id: 'other', name: 'Autres' },
  ];

  const levels = [
    { id: 'all', name: 'Tous les niveaux' },
    { id: 'primary', name: 'Primaire' },
    { id: 'secondary', name: 'Secondaire' },
    { id: 'specific_class', name: 'Classes spécifiques' },
  ];

  const filteredFeeStructures = feeStructures.filter(fee => {
    const matchesSearch = fee.feeTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || fee.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || fee.applicableLevel === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const formatAmount = (amount: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      tuition: 'Scolarité',
      registration: 'Inscription',
      uniform: 'Uniformes',
      supplies: 'Fournitures',
      activities: 'Activités',
      transport: 'Transport',
      meals: 'Restauration',
      other: 'Autres',
    };
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const getLevelLabel = (level: string, specificClasses?: string[]) => {
    if (level === 'specific_class' && specificClasses) {
      return `Classes: ${specificClasses.length} sélectionnées`;
    }
    const levelLabels = {
      all: 'Tous niveaux',
      primary: 'Primaire',
      secondary: 'Secondaire',
    };
    return levelLabels[level as keyof typeof levelLabels] || level;
  };

  const handleSaveFeeStructure = (feeData: any) => {
    console.log('Saving fee structure:', feeData);
    // Logique de sauvegarde
    setIsFormOpen(false);
    setSelectedFeeStructure(null);
  };

  const handleEditFeeStructure = (fee: any) => {
    setSelectedFeeStructure(fee);
    setIsFormOpen(true);
  };

  const handleDeleteFeeStructure = (feeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette structure de frais ?')) {
      console.log('Deleting fee structure:', feeId);
      // Logique de suppression
    }
  };

  // Statistiques
  const totalStructures = filteredFeeStructures.length;
  const activeStructures = filteredFeeStructures.filter(f => f.isActive).length;
  const totalStudentsAffected = filteredFeeStructures.reduce((sum, f) => sum + f.studentsAffected, 0);
  const totalRevenuePotential = filteredFeeStructures.reduce((sum, f) => sum + (f.amount * f.studentsAffected), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des frais scolaires</h1>
          <p className="text-gray-600 mt-1">Définir et gérer les structures tarifaires</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle structure de frais
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Structures actives</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{activeStructures}</p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Élèves concernés</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">{totalStudentsAffected}</p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Revenus potentiels</p>
                <p className="text-lg md:text-xl font-bold text-purple-600">
                  {formatAmount(totalRevenuePotential)}
                </p>
              </div>
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total structures</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">{totalStructures}</p>
              </div>
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
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
                placeholder="Rechercher une structure de frais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
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

      {/* Fee Structures List */}
      <Card>
        <CardHeader>
          <CardTitle>Structures de frais ({filteredFeeStructures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Type de frais</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Montant</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Applicable à</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden sm:table-cell">Élèves concernés</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm hidden md:table-cell">Période</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Statut</th>
                  <th className="text-left p-2 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeeStructures.map((fee) => (
                  <tr key={fee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 md:p-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{fee.feeTypeName}</p>
                        <p className="text-xs text-gray-600">{getCategoryLabel(fee.category)}</p>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <span className="font-bold text-gray-900">
                        {formatAmount(fee.amount, fee.currency)}
                      </span>
                    </td>
                    <td className="p-2 md:p-4">
                      <span className="text-sm text-gray-600">
                        {getLevelLabel(fee.applicableLevel, fee.specificClasses)}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 hidden sm:table-cell">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {fee.studentsAffected}
                      </div>
                    </td>
                    <td className="p-2 md:p-4 hidden md:table-cell">
                      <div className="text-sm text-gray-600">
                        <div>{new Date(fee.validFrom).toLocaleDateString('fr-FR')}</div>
                        <div className="text-xs">→ {fee.validTo ? new Date(fee.validTo).toLocaleDateString('fr-FR') : 'Indéfini'}</div>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        fee.isActive 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fee.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleEditFeeStructure(fee)}
                          className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteFeeStructure(fee.id)}
                          className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {filteredFeeStructures.length === 0 && (
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune structure de frais trouvée
            </h3>
            <p className="text-gray-600">
              Créez une nouvelle structure de frais pour commencer.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rules Information */}
      <Card>
        <CardHeader>
          <CardTitle>Règles de gestion des frais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Définition des frais</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Seuls les administrateurs peuvent définir les structures de frais</li>
                <li>• Chaque structure doit avoir un montant et une période de validité</li>
                <li>• Les frais peuvent être appliqués par niveau, cycle ou classe spécifique</li>
                <li>• Les modifications affectent uniquement les nouveaux paiements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Application automatique</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Les frais sont automatiquement appliqués aux élèves concernés</li>
                <li>• Les échéanciers sont générés selon la périodicité définie</li>
                <li>• Les parents sont notifiés des nouveaux frais applicables</li>
                <li>• L'historique des modifications est conservé</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structure Form Modal */}
      <FeeStructureForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedFeeStructure(null);
        }}
        feeStructure={selectedFeeStructure}
        onSave={handleSaveFeeStructure}
      />
    </div>
  );
};