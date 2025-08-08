import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: any;
  onSave: (teacherData: any) => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ 
  isOpen, 
  onClose, 
  teacher, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    firstName: teacher?.firstName || '',
    lastName: teacher?.lastName || '',
    dateOfBirth: teacher?.dateOfBirth || '',
    email: teacher?.email || '',
    phone: teacher?.phone || '',
    subjects: teacher?.subjects || [''],
    classes: teacher?.classes || [''],
    avatar: teacher?.avatar || '',
    status: teacher?.status || 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const generateTeacherId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TCH-${year}-${randomNum}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La date de naissance est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    const validSubjects = formData.subjects.filter(s => s.trim());
    if (validSubjects.length === 0) {
      newErrors.subjects = 'Au moins une matière est obligatoire';
    }

    // Vérification de l'unicité de l'email
    // Dans un vrai système, cette vérification se ferait côté serveur
    const existingEmails = [
      'jean.martin@school.fr',
      'marie.dubois@school.fr',
      'pierre.leroy@school.fr',
      'sophie.moreau@school.fr',
    ];

    const isDuplicateEmail = existingEmails.some(
      email => email.toLowerCase() === formData.email.toLowerCase() &&
               (!teacher || email !== teacher.email)
    );

    if (isDuplicateEmail) {
      newErrors.email = 'Un enseignant avec cet email existe déjà';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const teacherData = {
      ...formData,
      id: teacher?.id || generateTeacherId(),
      subjects: formData.subjects.filter(s => s.trim()),
      classes: formData.classes.filter(c => c.trim()),
      createdAt: teacher?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(teacherData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: 'subjects' | 'classes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'subjects' | 'classes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'subjects' | 'classes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {teacher ? 'Modifier l\'enseignant' : 'Nouvel enseignant'}
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
              {/* Photo de profil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de profil *
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    {formData.avatar ? (
                      <img 
                        src={formData.avatar} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="URL de la photo"
                      value={formData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Entrez l'URL d'une photo ou téléchargez une image
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Nom"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  required
                />
              </div>

              <Input
                label="Date de naissance"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                />
                <Input
                  label="Téléphone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="06 12 34 56 78"
                />
              </div>

              {/* Matières enseignées */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matières enseignées *
                </label>
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="Nom de la matière"
                      value={subject}
                      onChange={(e) => handleArrayChange('subjects', index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('subjects', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('subjects')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une matière
                </Button>
                {errors.subjects && (
                  <p className="text-sm text-red-600 mt-1">{errors.subjects}</p>
                )}
              </div>

              {/* Classes assignées */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classes assignées
                </label>
                {formData.classes.map((className, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="Nom de la classe (ex: 6A, 5B)"
                      value={className}
                      onChange={(e) => handleArrayChange('classes', index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.classes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('classes', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('classes')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une classe
                </Button>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Actif (en service)</option>
                  <option value="inactive">Inactif (archivé)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Les enseignants inactifs ne peuvent pas accéder au système
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Règles de gestion appliquées :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Identifiant unique généré automatiquement (TCH-YYYY-XXX)</li>
                  <li>• Tous les champs obligatoires sont vérifiés</li>
                  <li>• Vérification de l'unicité de l'adresse email</li>
                  <li>• Au moins une matière doit être enseignée</li>
                  <li>• Statut par défaut : Actif (peut se connecter au système)</li>
                  <li>• Horodatage automatique de création et modification</li>
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
                  {teacher ? 'Mettre à jour' : 'Créer l\'enseignant'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};