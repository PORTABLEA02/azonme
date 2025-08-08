import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, BookOpen, AlertTriangle } from 'lucide-react';

interface GradeFormProps {
  isOpen: boolean;
  onClose: () => void;
  grade?: any;
  onSave: (gradeData: any) => void;
}

export const GradeForm: React.FC<GradeFormProps> = ({ 
  isOpen, 
  onClose, 
  grade, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    studentId: grade?.studentId || '',
    subjectId: grade?.subjectId || '',
    teacherId: grade?.teacherId || '',
    value: grade?.value || '',
    maxValue: grade?.maxValue || 20,
    date: grade?.date || new Date().toISOString().split('T')[0],
    type: grade?.type || 'exam',
    comment: grade?.comment || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Données simulées
  const students = [
    { id: 'STU-001', name: 'Emma Martin', class: '6ème A' },
    { id: 'STU-002', name: 'Lucas Dubois', class: '6ème A' },
    { id: 'STU-003', name: 'Chloé Leroy', class: '5ème B' },
    { id: 'STU-004', name: 'Hugo Moreau', class: '4ème C' },
  ];

  const subjects = [
    { id: 'MATH', name: 'Mathématiques' },
    { id: 'FR', name: 'Français' },
    { id: 'HIST', name: 'Histoire' },
    { id: 'GEOG', name: 'Géographie' },
    { id: 'SCI', name: 'Sciences' },
    { id: 'ENG', name: 'Anglais' },
  ];

  const teachers = [
    { id: 'TCH-001', name: 'Jean Martin', subjects: ['MATH', 'SCI'] },
    { id: 'TCH-002', name: 'Marie Dubois', subjects: ['FR'] },
    { id: 'TCH-003', name: 'Pierre Leroy', subjects: ['HIST', 'GEOG'] },
    { id: 'TCH-004', name: 'Sophie Moreau', subjects: ['ENG'] },
  ];

  const gradeTypes = [
    { value: 'exam', label: 'Examen' },
    { value: 'homework', label: 'Devoir' },
    { value: 'participation', label: 'Participation' },
    { value: 'project', label: 'Projet' },
    { value: 'quiz', label: 'Interrogation' },
  ];

  const generateGradeId = () => {
    const timestamp = Date.now();
    return `GRD-${timestamp}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = 'L\'élève est obligatoire';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'La matière est obligatoire';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'L\'enseignant est obligatoire';
    }

    if (!formData.value || parseFloat(formData.value) < 0) {
      newErrors.value = 'La note doit être un nombre positif';
    }

    if (parseFloat(formData.value) > formData.maxValue) {
      newErrors.value = `La note ne peut pas dépasser ${formData.maxValue}`;
    }

    if (!formData.maxValue || formData.maxValue <= 0) {
      newErrors.maxValue = 'La note maximale doit être supérieure à 0';
    }

    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }

    if (!formData.type) {
      newErrors.type = 'Le type d\'évaluation est obligatoire';
    }

    // Vérifier que l'enseignant peut enseigner cette matière
    const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
    if (selectedTeacher && formData.subjectId && !selectedTeacher.subjects.includes(formData.subjectId)) {
      newErrors.teacherId = 'Cet enseignant ne peut pas noter cette matière';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedStudent = students.find(s => s.id === formData.studentId);
    const selectedSubject = subjects.find(s => s.id === formData.subjectId);
    const selectedTeacher = teachers.find(t => t.id === formData.teacherId);

    const gradeData = {
      ...formData,
      id: grade?.id || generateGradeId(),
      value: parseFloat(formData.value),
      studentName: selectedStudent?.name,
      studentClass: selectedStudent?.class,
      subjectName: selectedSubject?.name,
      teacherName: selectedTeacher?.name,
      createdAt: grade?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(gradeData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Filtrer les enseignants qui peuvent enseigner la matière sélectionnée
  const availableTeachers = formData.subjectId 
    ? teachers.filter(teacher => teacher.subjects.includes(formData.subjectId))
    : teachers;

  const calculatePercentage = () => {
    if (formData.value && formData.maxValue) {
      return ((parseFloat(formData.value) / formData.maxValue) * 100).toFixed(1);
    }
    return '0';
  };

  const getGradeColor = () => {
    const percentage = parseFloat(calculatePercentage());
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {grade ? 'Modifier la note' : 'Nouvelle note'}
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
              {/* Élève et Matière */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Élève *
                  </label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.studentId ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionner un élève</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.class})
                      </option>
                    ))}
                  </select>
                  {errors.studentId && <p className="text-sm text-red-600 mt-1">{errors.studentId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => handleInputChange('subjectId', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.subjectId ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                  {errors.subjectId && <p className="text-sm text-red-600 mt-1">{errors.subjectId}</p>}
                </div>
              </div>

              {/* Enseignant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enseignant *
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => handleInputChange('teacherId', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.teacherId ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Sélectionner un enseignant</option>
                  {availableTeachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
                {errors.teacherId && <p className="text-sm text-red-600 mt-1">{errors.teacherId}</p>}
              </div>

              {/* Note et Note maximale */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note obtenue *
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max={formData.maxValue}
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.value ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.value && <p className="text-sm text-red-600 mt-1">{errors.value}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note maximale *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxValue}
                    onChange={(e) => handleInputChange('maxValue', parseInt(e.target.value) || 20)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.maxValue ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.maxValue && <p className="text-sm text-red-600 mt-1">{errors.maxValue}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pourcentage
                  </label>
                  <div className={`w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-medium ${getGradeColor()}`}>
                    {calculatePercentage()}%
                  </div>
                </div>
              </div>

              {/* Type et Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'évaluation *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    {gradeTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de l'évaluation *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
                </div>
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  placeholder="Commentaire sur la performance de l'élève..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Aperçu de la note */}
              {formData.value && formData.maxValue && (
                <div className={`p-4 rounded-lg ${
                  parseFloat(calculatePercentage()) >= 80 ? 'bg-emerald-50' :
                  parseFloat(calculatePercentage()) >= 60 ? 'bg-amber-50' : 'bg-red-50'
                }`}>
                  <div className="text-center">
                    <p className={`text-sm mb-2 ${
                      parseFloat(calculatePercentage()) >= 80 ? 'text-emerald-700' :
                      parseFloat(calculatePercentage()) >= 60 ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      Aperçu de la note
                    </p>
                    <p className={`text-2xl font-bold ${
                      parseFloat(calculatePercentage()) >= 80 ? 'text-emerald-900' :
                      parseFloat(calculatePercentage()) >= 60 ? 'text-amber-900' : 'text-red-900'
                    }`}>
                      {formData.value}/{formData.maxValue}
                    </p>
                    <p className="text-sm mt-1 text-gray-600">
                      {calculatePercentage()}% - {
                        parseFloat(calculatePercentage()) >= 80 ? 'Excellent' :
                        parseFloat(calculatePercentage()) >= 60 ? 'Satisfaisant' : 'À améliorer'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Règles de gestion */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Règles de gestion appliquées :</p>
                    <ul className="space-y-1">
                      <li>• Identifiant unique généré automatiquement</li>
                      <li>• Vérification que l'enseignant peut noter cette matière</li>
                      <li>• La note ne peut pas dépasser la note maximale</li>
                      <li>• Horodatage automatique de création et modification</li>
                      <li>• Calcul automatique du pourcentage</li>
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
                  {grade ? 'Mettre à jour' : 'Enregistrer la note'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};