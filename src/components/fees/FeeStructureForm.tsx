import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface FeeStructureFormProps {
  isOpen: boolean;
  onClose: () => void;
  feeStructure?: any;
  onSave: (feeData: any) => void;
}

export const FeeStructureForm: React.FC<FeeStructureFormProps> = ({ 
  isOpen, 
  onClose, 
  feeStructure, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    feeTypeName: feeStructure?.feeTypeName || '',
    category: feeStructure?.category || 'tuition',
    amount: feeStructure?.amount || '',
    currency: feeStructure?.currency || 'XOF',
    applicableLevel: feeStructure?.applicableLevel || 'all',
    cycle: feeStructure?.cycle || 'all',
    specificClasses: feeStructure?.specificClasses || [],
    validFrom: feeStructure?.validFrom || new Date().toISOString().split('T')[0],
    validTo: feeStructure?.validTo || '',
    isRecurring: feeStructure?.isRecurring || false,
    recurringPeriod: feeStructure?.recurringPeriod || 'quarterly',
    description: feeStructure?.description || '',
    isActive: feeStructure?.isActive !== undefined ? feeStructure.isActive : true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableClasses] = useState([
    { id: 'CL-2024-001', name: '6ème A' },
    { id: 'CL-2024-002', name: '5ème B' },
    { id: 'CL-2024-003', name: '4ème C' },
    { id: 'CL-2024-004', name: 'Terminale C' },
  ]);

  if (!isOpen) return null;

  const generateFeeStructureId = () => {
    const timestamp = Date.now();
    return `FS-${timestamp.toString().slice(-6)}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.feeTypeName.trim()) {
      newErrors.feeTypeName = 'Le nom du type de frais est obligatoire';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.validFrom) {
      newErrors.validFrom = 'La date de début de validité est obligatoire';
    }

    if (formData.validTo && formData.validFrom && formData.validTo <= formData.validFrom) {
      newErrors.validTo = 'La date de fin doit être postérieure à la date de début';
    }

    if (formData.applicableLevel === 'specific_class' && formData.specificClasses.length === 0) {
      newErrors.specificClasses = 'Au moins une classe doit être sélectionnée';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const feeData = {
      ...formData,
      id: feeStructure?.id || generateFeeStructureId(),
      amount: parseFloat(formData.amount),
      createdBy: 'current-user-id', // Dans un vrai système
      createdAt: feeStructure?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(feeData);
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClassSelection = (classId: string, isSelected: boolean) => {
    setFormData(prev => ({
      ...prev,
      specificClasses: isSelected 
        ? [...prev.specificClasses, classId]
        : prev.specificClasses.filter(id => id !== classId)
    }));
  };

  const categories = [
    { value: 'tuition', label: 'Frais de scolarité' },
    { value: 'registration', label: 'Frais d\'inscription' },
    { value: 'uniform', label: 'Uniformes scolaires' },
    { value: 'supplies', label: 'Fournitures scolaires' },
    { value: 'activities', label: 'Activités parascolaires' },
    { value: 'transport', label: 'Transport scolaire' },
    { value: 'meals', label: 'Restauration' },
    { value: 'other', label: 'Autres frais' },
  ];

  const applicableLevels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'primary', label: 'Primaire uniquement' },
    { value: 'secondary', label: 'Secondaire uniquement' },
    { value: 'specific_class', label: 'Classes spécifiques' },
  ];

  const cycles = [
    { value: 'all', label: 'Tous les cycles' },
    { value: 'premier', label: 'Premier cycle' },
    { value: 'second', label: 'Second cycle' },
  ];

  const recurringPeriods = [
    { value: 'monthly', label: 'Mensuel' },
    { value: 'quarterly', label: 'Trimestriel' },
    { value: 'semester', label: 'Semestriel' },
    { value: 'annual', label: 'Annuel' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {feeStructure ? 'Modifier la structure de frais' : 'Nouvelle structure de frais'}
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type de frais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom du type de frais"
                  value={formData.feeTypeName}
                  onChange={(e) => handleInputChange('feeTypeName', e.target.value)}
                  placeholder="ex: Frais de scolarité, Uniformes"
                  error={errors.feeTypeName}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Montant */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Montant"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    min="0"
                    step="1"
                    error={errors.amount}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Devise
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="XOF">FCFA (XOF)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">Dollar US (USD)</option>
                  </select>
                </div>
              </div>

              {/* Applicabilité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicable à *
                  </label>
                  <select
                    value={formData.applicableLevel}
                    onChange={(e) => handleInputChange('applicableLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {applicableLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
                {formData.applicableLevel !== 'specific_class' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cycle
                    </label>
                    <select
                      value={formData.cycle}
                      onChange={(e) => handleInputChange('cycle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {cycles.map(cycle => (
                        <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Classes spécifiques */}
              {formData.applicableLevel === 'specific_class' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classes concernées *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {availableClasses.map(cls => (
                      <label key={cls.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.specificClasses.includes(cls.id)}
                          onChange={(e) => handleClassSelection(cls.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{cls.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specificClasses && (
                    <p className="text-sm text-red-600 mt-1">{errors.specificClasses}</p>
                  )}
                </div>
              )}

              {/* Période de validité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date de début de validité"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  error={errors.validFrom}
                  required
                />
                <Input
                  label="Date de fin de validité (optionnel)"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => handleInputChange('validTo', e.target.value)}
                  error={errors.validTo}
                />
              </div>

              {/* Récurrence */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                    Frais récurrent (paiement échelonné)
                  </label>
                </div>
                
                {formData.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Périodicité
                    </label>
                    <select
                      value={formData.recurringPeriod}
                      onChange={(e) => handleInputChange('recurringPeriod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {recurringPeriods.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée des frais..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Statut */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Structure active (applicable immédiatement)
                </label>
              </div>

              {/* Règles de gestion */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Règles appliquées :</p>
                    <ul className="space-y-1">
                      <li>• Les frais sont automatiquement appliqués aux élèves concernés</li>
                      <li>• Les échéanciers sont générés selon la périodicité définie</li>
                      <li>• Les modifications n'affectent que les nouveaux paiements</li>
                      <li>• Les parents sont notifiés des nouveaux frais applicables</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {feeStructure ? 'Mettre à jour' : 'Créer la structure'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};