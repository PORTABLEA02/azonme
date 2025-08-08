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
  GraduationCap,
  BookOpen,
  Eye,
  Copy,
} from 'lucide-react';

export const FeeStructureManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<any>(null);

  // Données simulées des barèmes
  const feeStructures = [
    {
      id: 'FS-2024-001',
      name: 'Barème Collège 2024-2025',
      type: 'level',
      targetLevel: 'Collège',
      schoolYear: '2024-2025',
      isActive: true,
      fees: [
        {
          id: 'FEE-001',
          name: 'Frais de scolarité',
          category: 'tuition',
          baseAmount: 450000,
          isRecurring: true,
          installments: 3,
          dueMonths: [10, 1, 4], // Octobre, Janvier, Avril
        },
        {
          id: 'FEE-002',
          name: 'Frais d\'inscription',
          category: 'registration',
          baseAmount: 75000,
          isRecurring: false,
          dueMonths: [9], // Septembre
        },
        {
          id: 'FEE-003',
          name: 'Uniformes scolaires',
          category: 'uniform',
          baseAmount: 45000,
          isRecurring: false,
          dueMonths: [9],
        },
      ],
      discounts: [
        {
          id: 'DISC-001',
          name: 'Bourse mérite',
          type: 'percentage',
          value: 50,
          appliesTo: ['tuition'],
          conditions: 'Moyenne >= 16/20',
        },
        {
          id: 'DISC-002',
          name: 'Réduction famille nombreuse',
          type: 'percentage',
          value: 15,
          appliesTo: ['tuition'],
          conditions: '3+ enfants dans l\'établissement',
        },
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-11-20',
    },
    {
      id: 'FS-2024-002',
      name: 'Barème Lycée Sciences 2024-2025',
      type: 'class',
      targetClass: 'Terminale C',
      schoolYear: '2024-2025',
      isActive: true,
      fees: [
        {
          id: 'FEE-004',
          name: 'Frais de scolarité',
          category: 'tuition',
          baseAmount: 550000,
          isRecurring: true,
          installments: 3,
          dueMonths: [10, 1, 4],
        },
        {
          id: 'FEE-005',
          name: 'Frais de laboratoire',
          category: 'laboratory',
          baseAmount: 85000,
          isRecurring: true,
          installments: 2,
          dueMonths: [10, 2],
        },
      ],
      discounts: [
        {
          id: 'DISC-003',
          name: 'Bourse excellence',
          type: 'fixed',
          value: 200000,
          appliesTo: ['tuition'],
          conditions: 'Major de promotion',
        },
      ],
      createdAt: '2024-09-01',
      updatedAt: '2024-11-15',
    },
    {
      id: 'FS-2024-003',
      name: 'Barème Élève Spécial - Emma Martin',
      type: 'student',
      targetStudent: 'STU-001',
      studentName: 'Emma Martin',
      schoolYear: '2024-2025',
      isActive: true,
      fees: [
        {
          id: 'FEE-006',
          name: 'Frais de scolarité (réduits)',
          category: 'tuition',
          baseAmount: 300000,
          isRecurring: true,
          installments: 3,
          dueMonths: [10, 1, 4],
        },
      ],
      discounts: [
        {
          id: 'DISC-004',
          name: 'Bourse sociale',
          type: 'percentage',
          value: 30,
          appliesTo: ['tuition'],
          conditions: 'Situation familiale difficile',
        },
      ],
      createdAt: '2024-09-15',
      updatedAt: '2024-11-10',
    },
  ];

  const typeOptions = [
    { id: 'all', name: 'Tous les types' },
    { id: 'level', name: 'Par niveau' },
    { id: 'class', name: 'Par classe' },
    { id: 'student', name: 'Par élève' },
  ];

  const filteredStructures = feeStructures.filter(structure => {
    const matchesSearch = structure.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || structure.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'level': return <BookOpen className="w-4 h-4" />;
      case 'class': return <GraduationCap className="w-4 h-4" />;
      case 'student': return <Users className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'level': return 'Niveau';
      case 'class': return 'Classe';
      case 'student': return 'Élève';
      default: return type;
    }
  };

  const getTotalAmount = (fees: any[]) => {
    return fees.reduce((sum, fee) => sum + fee.baseAmount, 0);
  };

  const handleSaveStructure = (structureData: any) => {
    console.log('Saving fee structure:', structureData);
    // Logique de sauvegarde
  };

  const handleDuplicateStructure = (structure: any) => {
    const duplicatedStructure = {
      ...structure,
      id: undefined,
      name: `${structure.name} (Copie)`,
      isActive: false,
    };
    setSelectedStructure(duplicatedStructure);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Barèmes des frais</h1>
          <p className="text-gray-600 mt-1">Gérer les structures tarifaires par niveau, classe ou élève</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau barème
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total barèmes</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{feeStructures.length}</p>
              </div>
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Barèmes actifs</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">
                  {feeStructures.filter(s => s.isActive).length}
                </p>
              </div>
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Par niveau</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">
                  {feeStructures.filter(s => s.type === 'level').length}
                </p>
              </div>
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Personnalisés</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">
                  {feeStructures.filter(s => s.type === 'student').length}
                </p>
              </div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
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
                placeholder="Rechercher un barème..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {typeOptions.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structures List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStructures.map((structure) => (
          <Card key={structure.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getTypeIcon(structure.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{structure.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {getTypeLabel(structure.type)}
                      </span>
                      {structure.isActive ? (
                        <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                          Actif
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          Inactif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedStructure(structure);
                      setIsFormOpen(true);
                    }}
                    className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDuplicateStructure(structure)}
                    className="p-1 hover:bg-emerald-50 hover:text-emerald-600 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Target Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Cible :</p>
                <p className="text-sm text-gray-600">
                  {structure.type === 'level' && structure.targetLevel}
                  {structure.type === 'class' && structure.targetClass}
                  {structure.type === 'student' && structure.studentName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Année scolaire : {structure.schoolYear}
                </p>
              </div>

              {/* Fees Summary */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Frais ({structure.fees.length})
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    Total : {formatAmount(getTotalAmount(structure.fees))}
                  </span>
                </div>
                <div className="space-y-1">
                  {structure.fees.slice(0, 3).map((fee) => (
                    <div key={fee.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{fee.name}</span>
                      <span className="font-medium">{formatAmount(fee.baseAmount)}</span>
                    </div>
                  ))}
                  {structure.fees.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{structure.fees.length - 3} autres frais
                    </p>
                  )}
                </div>
              </div>

              {/* Discounts */}
              {structure.discounts && structure.discounts.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Réductions/Bourses ({structure.discounts.length})
                  </p>
                  <div className="space-y-1">
                    {structure.discounts.slice(0, 2).map((discount) => (
                      <div key={discount.id} className="text-xs text-emerald-600">
                        • {discount.name} : {discount.type === 'percentage' ? `${discount.value}%` : formatAmount(discount.value)}
                      </div>
                    ))}
                    {structure.discounts.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{structure.discounts.length - 2} autres réductions
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                Modifié le {new Date(structure.updatedAt).toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fee Structure Form Modal */}
      <FeeStructureForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedStructure(null);
        }}
        structure={selectedStructure}
        onSave={handleSaveStructure}
      />
    </div>
  );
};