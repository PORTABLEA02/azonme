import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Clock, AlertTriangle } from 'lucide-react';

interface CourseAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: any) => void;
  timeSlots: any[];
  workingDays: string[];
  assignment?: any;
}

export const CourseAssignmentForm: React.FC<CourseAssignmentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  timeSlots,
  workingDays,
  assignment,
}) => {
  const [formData, setFormData] = useState({
    subjectId: assignment?.subjectId || '',
    subjectName: assignment?.subjectName || '',
    teacherId: assignment?.teacherId || '',
    teacherName: assignment?.teacherName || '',
    classId: assignment?.classId || '',
    className: assignment?.className || '',
    roomId: assignment?.roomId || 'none',
    roomName: assignment?.roomName || 'Aucune salle',
    day: assignment?.day || 'monday',
    startTime: assignment?.startTime || '',
    endTime: assignment?.endTime || '',
    duration: assignment?.duration || 120,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Données simulées
  const subjects = [
    { id: 'MATH', name: 'Mathématiques' },
    { id: 'FR', name: 'Français' },
    { id: 'HIST', name: 'Histoire' },
    { id: 'GEOG', name: 'Géographie' },
    { id: 'SCI', name: 'Sciences' },
    { id: 'ENG', name: 'Anglais' },
  ];

  const teachers = [
    { id: 'TCH-2024-001', name: 'Jean Martin', subjects: ['MATH', 'SCI'] },
    { id: 'TCH-2024-002', name: 'Marie Dubois', subjects: ['FR'] },
    { id: 'TCH-2024-003', name: 'Pierre Leroy', subjects: ['HIST', 'GEOG'] },
    { id: 'TCH-2024-004', name: 'Sophie Moreau', subjects: ['ENG'] },
  ];

  const classes = [
    { id: 'CL-2024-001', name: '6ème A' },
    { id: 'CL-2024-002', name: '5ème B' },
    { id: 'CL-2024-003', name: '4ème C' },
    { id: 'CL-2024-004', name: 'Terminale C' },
  ];

  const rooms = [
    { id: 'RM-2024-001', name: 'Salle A1', type: 'classroom' },
    { id: 'RM-2024-002', name: 'Laboratoire Sciences', type: 'laboratory' },
    { id: 'RM-2024-003', name: 'Salle Informatique', type: 'computer_room' },
    { id: 'RM-2024-004', name: 'Salle Polyvalente', type: 'multipurpose' },
  ];

  const dayLabels = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
  };

  const generateAssignmentId = () => {
    const timestamp = Date.now();
    return `CA-${timestamp}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // RG-EDT-2.1 : Vérification de tous les champs obligatoires
    if (!formData.subjectId) newErrors.subjectId = 'La matière est obligatoire';
    if (!formData.teacherId) newErrors.teacherId = 'L\'enseignant est obligatoire';
    if (!formData.classId) newErrors.classId = 'La classe est obligatoire';
    if (!formData.day) newErrors.day = 'Le jour est obligatoire';
    if (!formData.startTime) newErrors.startTime = 'L\'heure de début est obligatoire';
    if (!formData.endTime) newErrors.endTime = 'L\'heure de fin est obligatoire';

    // Vérification de la cohérence horaire
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'L\'heure de fin doit être postérieure à l\'heure de début';
    }

    // Vérification de la durée maximale (2 heures)
    if (formData.duration > 120) {
      newErrors.endTime = 'La durée d\'un cours ne peut pas dépasser 2 heures';
    }

    // Vérification que l'enseignant peut enseigner cette matière
    const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
    if (selectedTeacher && formData.subjectId && !selectedTeacher.subjects.includes(formData.subjectId)) {
      newErrors.teacherId = 'Cet enseignant ne peut pas enseigner cette matière';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const assignmentData = {
      ...formData,
      id: assignment?.id || generateAssignmentId(),
      schoolYear: '2024-2025',
      createdAt: assignment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(assignmentData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Calculer la durée automatiquement quand les heures changent
    if (field === 'startTime' || field === 'endTime') {
      const startTime = field === 'startTime' ? value as string : formData.startTime;
      const endTime = field === 'endTime' ? value as string : formData.endTime;
      
      if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        
        if (durationMinutes > 0) {
          setFormData(prev => ({ ...prev, duration: durationMinutes }));
        }
      }
    }
    
    // Auto-fill related fields
    if (field === 'subjectId') {
      const subject = subjects.find(s => s.id === value);
      if (subject) {
        setFormData(prev => ({ ...prev, subjectName: subject.name }));
      }
    }
    
    if (field === 'teacherId') {
      const teacher = teachers.find(t => t.id === value);
      if (teacher) {
        setFormData(prev => ({ ...prev, teacherName: teacher.name }));
      }
    }
    
    if (field === 'classId') {
      const cls = classes.find(c => c.id === value);
      if (cls) {
        setFormData(prev => ({ ...prev, className: cls.name }));
      }
    }
    
    if (field === 'roomId') {
      const room = rooms.find(r => r.id === value);
      if (room) {
        setFormData(prev => ({ ...prev, roomName: room.name }));
      } else if (value === 'none') {
        setFormData(prev => ({ ...prev, roomName: 'Aucune salle' }));
      }
    }

    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Filtrer les créneaux disponibles pour le jour sélectionné
  const availableTimeSlots = timeSlots.filter(slot => slot.day === formData.day);

  // Générer toutes les heures possibles de 07:00 à 19:00
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 7; hour <= 19; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Filtrer les enseignants qui peuvent enseigner la matière sélectionnée
  const availableTeachers = formData.subjectId 
    ? teachers.filter(teacher => teacher.subjects.includes(formData.subjectId))
    : teachers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {assignment ? 'Modifier le cours' : 'Nouveau cours'}
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
              {/* Matière et Enseignant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Classe et Salle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classe *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => handleInputChange('classId', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.classId ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  {errors.classId && <p className="text-sm text-red-600 mt-1">{errors.classId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salle (optionnel)
                  </label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => handleInputChange('roomId', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.roomId ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="none">Aucune salle assignée</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                  </select>
                  {errors.roomId && <p className="text-sm text-red-600 mt-1">{errors.roomId}</p>}
                </div>
              </div>

              {/* Jour et Horaires */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jour *
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => handleInputChange('day', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.day ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    {workingDays.map(day => (
                      <option key={day} value={day}>
                        {dayLabels[day as keyof typeof dayLabels]}
                      </option>
                    ))}
                  </select>
                  {errors.day && <p className="text-sm text-red-600 mt-1">{errors.day}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début *
                  </label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.startTime ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionner l'heure</option>
                    {timeOptions.slice(0, -1).map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin *
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.endTime ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Sélectionner l'heure</option>
                    {timeOptions.slice(1).map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.endTime && <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>}
                </div>
              </div>

              {/* Durée calculée */}
              {formData.startTime && formData.endTime && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Durée du cours : {formData.duration} minutes ({(formData.duration / 60).toFixed(1)}h)
                    </span>
                  </div>
                  {formData.duration > 120 && (
                    <div className="mt-2 text-sm text-red-600">
                      ⚠️ La durée maximale recommandée est de 2 heures (120 minutes)
                    </div>
                  )}
                </div>
              )}

              {/* Règles de gestion */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Vérifications automatiques :</p>
                    <ul className="space-y-1">
                      <li>• RG-EDT-2.1 : Tous les champs obligatoires sont vérifiés</li>
                      <li>• RG-EDT-2.2 : Disponibilité de l'enseignant et de la classe</li>
                      <li>• RG-EDT-3.x : Prévention des conflits d'horaires</li>
                      <li>• Durée maximale : 2 heures par cours</li>
                      <li>• Horaires : 07:00 à 19:00</li>
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
                  {assignment ? 'Mettre à jour' : 'Créer le cours'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};