import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Plus, Trash2, DollarSign, Percent, AlertTriangle } from 'lucide-react';

interface FeeStructureFormProps {
  isOpen: boolean;
  onClose: () => void;
  structure?: any;
  onSave: (structureData: any) => void;
}

export const FeeStructureForm: React.FC<FeeStructureFormProps> = ({ 
  isOpen, 
  onClose, 
  structure, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: structure?.name || '',
    type: structure?.type || 'level',
    targetLevel: structure?.targetLevel || '',
    targetClass: structure?.targetClass || '',
    targetStudent: structure?.targetStudent || '',
    studentName: structure?.studentName || '',
    schoolYear: structure?.schoolYear || '2024-2025',
    isActive: structure?.isActive ?? true,
    fees: structure?.fees || [
      {
        id: '',
        name: '',
        category: 'tuition',
        baseAmount: 0,
        isRecurring: true,
        installments: 1,
        dueMonths: [9],
      }
    ],
    discounts: structure?.discounts || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const generateId = (prefix: string) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp.toString().slice(-6)}${randomNum}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du barème est obligatoire';
    }

    if (formData.type === 'level' && !formData.targetLevel) {
      newErrors.targetLevel = 'Le niveau cible est obligatoire';
    }

    if (formData.type === 'class' && !formData.targetClass) {
      newErrors.targetClass = 'La classe cible est obligatoire';
    }

    if (formData.type === 'student' && !formData.targetStudent) {
      newErrors.targetStudent = 'L\'élève cible est obligatoire';
    }

    // Validation des frais
    formData.fees.forEach((fee, index) => {
      if (!fee.name.trim()) {
        newErrors[`fee_name_${index}`] = 'Le nom du frais est obligatoire';
      }
      if (fee.baseAmount <= 0) {
        newErrors[`fee_amount_${index}`] = 'Le montant doit être supérieur à 0';
      }
      if (fee.installments < 1 || fee.installments > 12) {
        newErrors[`fee_installments_${index}`] = 'Le nombre d\'échéances doit être entre 1 et 12';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const structureData = {
      ...formData,
      id: structure?.id || generateId('FS'),
      fees: formData.fees.map(fee => ({
        ...fee,
        id: fee.id || generateId('FEE'),
      })),
      discounts: formData.discounts.map(discount => ({
        ...discount,
        id: discount.id || generateId('DISC'),
      })),
      createdAt: structure?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(structureData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeeChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      fees: prev.fees.map((fee, i) => 
        i === index ? { ...fee, [field]: value } : fee
      )
    }));
  };

  const addFee = () => {
    setFormData(prev => ({
      ...prev,
      fees: [...prev.fees, {
        id: '',
        name: '',
        category: 'tuition',
        baseAmount: 0,
        isRecurring: true,
        installments: 1,
        dueMonths: [9],
      }]
    }));
  };

  const removeFee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fees: prev.fees.filter((_, i) => i !== index)
    }));
  };

  const handleDiscountChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      discounts: prev.discounts.map((discount, i) => 
        i === index ? { ...discount, [field]: value } : discount
      )
    }));
  };

  const addDiscount = () => {
    setFormData(prev => ({
      ...prev,
      discounts: [...prev.discounts, {
        id: '',
        name: '',
        type: 'percentage',
        value: 0,
        appliesTo: [],
        conditions: '',
      }]
    }));
  };

  const removeDiscount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index)
    }));
  };

  const typeOptions = [
    { value: 'level', label: 'Par niveau d\'étude' },
    { value: 'class', label: 'Par classe spécifique' },
    { value: 'student', label: 'Par élève individuel' },
  ];

  const categoryOptions = [
    { value: 'tuition', label: 'Frais de scolarité' },
    { value: 'registration', label: 'Frais d\'inscription' },
    { value: 'uniform', label: 'Uniformes scolaires' },
    { value: 'supplies', label: 'Fournitures scolaires' },
    { value: 'activities', label: 'Activités parascolaires' },
    { value: 'laboratory', label: 'Frais de laboratoire' },
    { value: 'transport', label: 'Transport scolaire' },
    { value: 'meals', label: 'Restauration' },
    { value: 'other', label: 'Autres frais' },
  ];

  const monthOptions = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {structure ? 'Modifier le barème' : 'Nouveau barème de frais'}
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
              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom du barème"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ex: Barème Collège 2024-2025"
                  error={errors.name}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de barème *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cible du barème */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.type === 'level' && (
                  <Input
                    label="Niveau cible"
                    value={formData.targetLevel}
                    onChange={(e) => handleInputChange('targetLevel', e.target.value)}
                    placeholder="ex: Collège, Lycée, Primaire"
                    error={errors.targetLevel}
                    required
                  />
                )}
                {formData.type === 'class' && (
                  <Input
                    label="Classe cible"
                    value={formData.targetClass}
                    onChange={(e) => handleInputChange('targetClass', e.target.value)}
                    placeholder="ex: 6ème A, Terminale C"
                    error={errors.targetClass}
                    required
                  />
                )}
                {formData.type === 'student' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="ID Élève"
                      value={formData.targetStudent}
                      onChange={(e) => handleInputChange('targetStudent', e.target.value)}
                      placeholder="STU-001"
                      error={errors.targetStudent}
                      required
                    />
                    <Input
                      label="Nom de l'élève"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      placeholder="Nom complet"
                    />
                  </div>
                )}
                <Input
                  label="Année scolaire"
                  value={formData.schoolYear}
                  onChange={(e) => handleInputChange('schoolYear', e.target.value)}
                  placeholder="2024-2025"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Barème actif (applicable immédiatement)
                </label>
              </div>

              {/* Frais */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Frais inclus dans ce barème</h3>
                  <Button type="button" onClick={addFee} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un frais
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.fees.map((fee, index) => (
                    <Card key={fee.id || `fee-${index}`} className="p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Frais #{index + 1}</h4>
                        {formData.fees.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFee(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Nom du frais"
                          value={fee.name}
                          onChange={(e) => handleFeeChange(index, 'name', e.target.value)}
                          placeholder="ex: Frais de scolarité"
                          error={errors[`fee_name_${index}`]}
                          required
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Catégorie
                          </label>
                          <select
                            value={fee.category}
                            onChange={(e) => handleFeeChange(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categoryOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Input
                          label="Montant de base (FCFA)"
                          type="number"
                          value={fee.baseAmount}
                          onChange={(e) => handleFeeChange(index, 'baseAmount', parseInt(e.target.value) || 0)}
                          min="0"
                          error={errors[`fee_amount_${index}`]}
                          required
                        />
                        <Input
                          label="Nombre d'échéances"
                          type="number"
                          value={fee.installments}
                          onChange={(e) => handleFeeChange(index, 'installments', parseInt(e.target.value) || 1)}
                          min="1"
                          max="12"
                          error={errors[`fee_installments_${index}`]}
                          required
                        />
                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            id={`recurring_${index}`}
                            checked={fee.isRecurring}
                            onChange={(e) => handleFeeChange(index, 'isRecurring', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`recurring_${index}`} className="text-sm text-gray-700">
                            Frais récurrent
                          </label>
                        </div>
                      </div>

                      {/* Mois d'échéance */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mois d'échéance
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {monthOptions.map(month => (
                            <label key={month.value} className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={fee.dueMonths.includes(month.value)}
                                onChange={(e) => {
                                  const newDueMonths = e.target.checked
                                    ? [...fee.dueMonths, month.value]
                                    : fee.dueMonths.filter(m => m !== month.value);
                                  handleFeeChange(index, 'dueMonths', newDueMonths);
                                }}
                                className="mr-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              {month.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Aperçu du montant par échéance */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Montant par échéance :</strong> {formatAmount(fee.baseAmount / fee.installments)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Réductions et bourses */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Réductions et bourses</h3>
                  <Button type="button" onClick={addDiscount} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une réduction
                  </Button>
                </div>

                {formData.discounts.length > 0 && (
                  <div className="space-y-4">
                    {formData.discounts.map((discount, index) => (
                      <Card key={discount.id || `discount-${index}`} className="p-4 bg-emerald-50">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Réduction #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeDiscount(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Nom de la réduction"
                            value={discount.name}
                            onChange={(e) => handleDiscountChange(index, 'name', e.target.value)}
                            placeholder="ex: Bourse mérite, Réduction famille nombreuse"
                            required
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type de réduction
                            </label>
                            <select
                              value={discount.type}
                              onChange={(e) => handleDiscountChange(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="percentage">Pourcentage</option>
                              <option value="fixed">Montant fixe</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="relative">
                            <Input
                              label={discount.type === 'percentage' ? 'Pourcentage de réduction' : 'Montant de réduction (FCFA)'}
                              type="number"
                              value={discount.value}
                              onChange={(e) => handleDiscountChange(index, 'value', parseInt(e.target.value) || 0)}
                              min="0"
                              max={discount.type === 'percentage' ? 100 : undefined}
                              required
                            />
                            {discount.type === 'percentage' && (
                              <Percent className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
                            )}
                            {discount.type === 'fixed' && (
                              <DollarSign className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Conditions d'application
                            </label>
                            <textarea
                              value={discount.conditions}
                              onChange={(e) => handleDiscountChange(index, 'conditions', e.target.value)}
                              placeholder="ex: Moyenne >= 16/20, 3+ enfants dans l'établissement"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Règles de gestion */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Règles de gestion appliquées :</p>
                    <ul className="space-y-1">
                      <li>• Les barèmes par élève ont priorité sur les barèmes par classe</li>
                      <li>• Les barèmes par classe ont priorité sur les barèmes par niveau</li>
                      <li>• Les réductions sont appliquées automatiquement selon les conditions</li>
                      <li>• Un seul barème actif par cible (niveau/classe/élève)</li>
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
                  {structure ? 'Mettre à jour' : 'Créer le barème'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};