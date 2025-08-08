import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: any;
  onSave: (classData: any) => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({ 
  isOpen, 
  onClose, 
  classData, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    level: classData?.level || 'Collège',
    cycle: classData?.cycle || 'Premier cycle',
    schoolYear: classData?.schoolYear || '2024-2025',
    specialty: classData?.specialty || '',
    capacity: classData?.capacity || 30,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const generateClassId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CL-${year}-${randomNum}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la classe est obligatoire';
    }

    if (!formData.level) {
      newErrors.level = 'Le niveau d\'étude est obligatoire';
    }

    if (!formData.cycle) {
      newErrors.cycle = 'Le cycle est obligatoire';
    }

    if (!formData.schoolYear) {
      newErrors.schoolYear = 'L\'année scolaire est obligatoire';
    }

    if (formData.capacity < 1 || formData.capacity > 50) {
      newErrors.capacity = 'La capacité doit être entre 1 et 50 élèves';
    }

    // RG-CL-1.3 : Vérification de l'unicité du nom pour l'année scolaire
    // Dans un vrai système, cette vérification se ferait côté serveur
    const existingClasses = [
      { name: '6ème A', schoolYear: '2024-2025' },
      { name: '5ème B', schoolYear: '2024-2025' },
    ];

    const isDuplicate = existingClasses.some(
      cls => cls.name === formData.name && 
             cls.schoolYear === formData.schoolYear &&
             (!classData || cls.name !== classData.name)
    );

    if (isDuplicate) {
      newErrors.name = 'Une classe avec ce nom existe déjà pour cette année scolaire (RG-CL-1.3)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const classDataToSave = {
      ...formData,
      id: classData?.id || generateClassId(),
      currentStudentCount: classData?.currentStudentCount || 0,
      createdAt: classData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(classDataToSave);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const levels = [
    'Primaire',
    'Collège',
    'Lycée',
  ];

  const cycles = [
    'Premier cycle',
    'Second cycle',
  ];

  const currentYear = new Date().getFullYear();
  const schoolYears = [
    `${currentYear-1}-${currentYear}`,
    `${currentYear}-${currentYear+1}`,
    `${currentYear+1}-${currentYear+2}`,
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {classData ? 'Modifier la classe' : 'Nouvelle classe'}
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
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom de la classe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ex: 6ème A, Terminale C"
                  error={errors.name}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau d'étude *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.level ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.level && <p className="text-sm text-red-600 mt-1">{errors.level}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cycle *
                  </label>
                  <select
                    value={formData.cycle}
                    onChange={(e) => handleInputChange('cycle', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cycle ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    {cycles.map(cycle => (
                      <option key={cycle} value={cycle}>{cycle}</option>
                    ))}
                  </select>
                  {errors.cycle && <p className="text-sm text-red-600 mt-1">{errors.cycle}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année scolaire *
                  </label>
                  <select
                    value={formData.schoolYear}
                    onChange={(e) => handleInputChange('schoolYear', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.schoolYear ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    {schoolYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.schoolYear && <p className="text-sm text-red-600 mt-1">{errors.schoolYear}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Spécialité (optionnel)"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="ex: Sciences, Littéraire, G1, G2"
                />
                <Input
                  label="Capacité maximale"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  min="1"
                  max="50"
                  error={errors.capacity}
                  required
                />
              </div>

              {/* Règles de gestion */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Règles de gestion appliquées :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• RG-CL-1.1 : Identifiant unique généré automatiquement</li>
                  <li>• RG-CL-1.2 : Tous les champs obligatoires sont définis</li>
                  <li>• RG-CL-1.3 : Vérification de l'unicité du nom par année scolaire</li>
                </ul>
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
                  {classData ? 'Mettre à jour' : 'Créer la classe'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};