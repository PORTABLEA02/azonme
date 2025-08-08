import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ScheduleGrid } from './ScheduleGrid';
import { CourseAssignmentForm } from './CourseAssignmentForm';
import { ScheduleConflictModal } from './ScheduleConflictModal';
import { 
  Calendar,
  Plus,
  Users,
  BookOpen,
  Building,
  Clock,
  AlertTriangle,
  Settings,
} from 'lucide-react';

export const ScheduleManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'class' | 'teacher' | 'room'>('class');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  // Données simulées des paramètres de l'établissement
  const schoolSettings = {
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    timeSlots: [
      { id: 'slot-1', startTime: '07:00', endTime: '08:00', day: 'monday' },
      { id: 'slot-2', startTime: '08:00', endTime: '09:00', day: 'monday' },
      { id: 'slot-3', startTime: '09:00', endTime: '10:00', day: 'monday' },
      { id: 'slot-4', startTime: '10:00', endTime: '11:00', day: 'monday' },
      { id: 'slot-5', startTime: '11:00', endTime: '12:00', day: 'monday' },
      { id: 'slot-6', startTime: '12:00', endTime: '13:00', day: 'monday' },
      { id: 'slot-7', startTime: '13:00', endTime: '14:00', day: 'monday' },
      { id: 'slot-8', startTime: '14:00', endTime: '15:00', day: 'monday' },
      { id: 'slot-9', startTime: '15:00', endTime: '16:00', day: 'monday' },
      { id: 'slot-10', startTime: '16:00', endTime: '17:00', day: 'monday' },
      { id: 'slot-11', startTime: '17:00', endTime: '18:00', day: 'monday' },
      { id: 'slot-12', startTime: '18:00', endTime: '19:00', day: 'monday' },
    ],
    schoolYear: '2024-2025',
  };

  // Données simulées des entités
  const entities = {
    class: [
      { id: 'CL-2024-001', name: '6ème A' },
      { id: 'CL-2024-002', name: '5ème B' },
      { id: 'CL-2024-003', name: '4ème C' },
    ],
    teacher: [
      { id: 'TCH-2024-001', name: 'Jean Martin' },
      { id: 'TCH-2024-002', name: 'Marie Dubois' },
      { id: 'TCH-2024-003', name: 'Pierre Leroy' },
    ],
    room: [
      { id: 'RM-2024-001', name: 'Salle A1' },
      { id: 'RM-2024-002', name: 'Laboratoire Sciences' },
      { id: 'RM-2024-003', name: 'Salle Informatique' },
    ],
  };

  // Données simulées des assignations de cours
  const courseAssignments = [
    {
      id: 'CA-001',
      subjectId: 'MATH',
      subjectName: 'Mathématiques',
      teacherId: 'TCH-2024-001',
      teacherName: 'Jean Martin',
      classId: 'CL-2024-001',
      className: '6ème A',
      roomId: 'RM-2024-001',
      roomName: 'Salle A1',
      timeSlotId: 'slot-2',
      day: 'monday',
      startTime: '08:00',
      endTime: '09:00',
      duration: 60,
      schoolYear: '2024-2025',
      createdAt: '2024-11-20',
      updatedAt: '2024-11-20',
    },
    {
      id: 'CA-002',
      subjectId: 'FR',
      subjectName: 'Français',
      teacherId: 'TCH-2024-002',
      teacherName: 'Marie Dubois',
      classId: 'CL-2024-001',
      className: '6ème A',
      roomId: 'RM-2024-001',
      roomName: 'Salle A1',
      timeSlotId: 'slot-5',
      day: 'monday',
      startTime: '10:15',
      endTime: '11:15',
      duration: 60,
      schoolYear: '2024-2025',
      createdAt: '2024-11-20',
      updatedAt: '2024-11-20',
    },
  ];

  const handleSaveCourseAssignment = (assignmentData: any) => {
    // Vérification des conflits avant sauvegarde
    const detectedConflicts = checkForConflicts(assignmentData);
    
    if (detectedConflicts.length > 0) {
      setConflicts(detectedConflicts);
      setIsConflictModalOpen(true);
      return;
    }

    console.log('Saving course assignment:', assignmentData);
    // Logique de sauvegarde
    setIsAssignmentFormOpen(false);
  };

  const checkForConflicts = (newAssignment: any) => {
    const conflicts = [];

    // Calculer les créneaux occupés par le nouveau cours
    const newStart = new Date(`2000-01-01T${newAssignment.startTime}:00`);
    const newEnd = new Date(`2000-01-01T${newAssignment.endTime}:00`);

    // RG-EDT-3.1 : Un enseignant ne peut enseigner qu'à une seule classe à la fois
    const teacherConflict = courseAssignments.find(assignment => {
      if (assignment.teacherId !== newAssignment.teacherId || 
          assignment.day !== newAssignment.day || 
          assignment.id === newAssignment.id) {
        return false;
      }
      
      const existingStart = new Date(`2000-01-01T${assignment.startTime}:00`);
      const existingEnd = new Date(`2000-01-01T${assignment.endTime}:00`);
      
      // Vérifier le chevauchement
      return (newStart < existingEnd && newEnd > existingStart);
    });

    const classConflict = courseAssignments.find(assignment => {
      if (assignment.classId !== newAssignment.classId || 
          assignment.day !== newAssignment.day || 
          assignment.id === newAssignment.id) {
        return false;
      }
      
      const existingStart = new Date(`2000-01-01T${assignment.startTime}:00`);
      const existingEnd = new Date(`2000-01-01T${assignment.endTime}:00`);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    const roomConflict = courseAssignments.find(assignment => {
      if (assignment.roomId !== newAssignment.roomId || 
          assignment.roomId === 'none' ||
          newAssignment.roomId === 'none' ||
          assignment.day !== newAssignment.day || 
          assignment.id === newAssignment.id) {
        return false;
      }
      
      const existingStart = new Date(`2000-01-01T${assignment.startTime}:00`);
      const existingEnd = new Date(`2000-01-01T${assignment.endTime}:00`);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    /* Ancienne logique remplacée par la nouvelle
    const teacherConflict = courseAssignments.find(assignment => 
      assignment.teacherId === newAssignment.teacherId &&
      assignment.day === newAssignment.day &&
      assignment.startTime === newAssignment.startTime &&
      assignment.id !== newAssignment.id
    );
    */

    if (teacherConflict) {
      conflicts.push({
        type: 'teacher_conflict',
        message: `L'enseignant ${newAssignment.teacherName} a déjà un cours qui chevauche avec ce créneau`,
        conflictingAssignments: [teacherConflict],
        timeSlot: { day: newAssignment.day, startTime: newAssignment.startTime, endTime: newAssignment.endTime }
      });
    }

    if (classConflict) {
      conflicts.push({
        type: 'class_conflict',
        message: `La classe ${newAssignment.className} a déjà un cours qui chevauche avec ce créneau`,
        conflictingAssignments: [classConflict],
        timeSlot: { day: newAssignment.day, startTime: newAssignment.startTime, endTime: newAssignment.endTime }
      });
    }

    if (roomConflict) {
      conflicts.push({
        type: 'room_conflict',
        message: `La salle ${newAssignment.roomName} est déjà occupée sur un créneau qui chevauche`,
        conflictingAssignments: [roomConflict],
        timeSlot: { day: newAssignment.day, startTime: newAssignment.startTime, endTime: newAssignment.endTime }
      });
    }

    return conflicts;
  };

  const getViewIcon = (view: string) => {
    switch (view) {
      case 'class': return Users;
      case 'teacher': return BookOpen;
      case 'room': return Building;
      default: return Calendar;
    }
  };

  const getViewLabel = (view: string) => {
    switch (view) {
      case 'class': return 'Par classe';
      case 'teacher': return 'Par enseignant';
      case 'room': return 'Par salle';
      default: return view;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emplois du temps</h1>
          <p className="text-gray-600 mt-1">Gestion des plannings et attribution des cours</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
          <Button onClick={() => setIsAssignmentFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau cours
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Cours programmés</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{courseAssignments.length}</p>
              </div>
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Créneaux disponibles</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">
                  {schoolSettings.timeSlots.length}
                </p>
              </div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Conflits détectés</p>
                <p className="text-xl md:text-2xl font-bold text-red-600">0</p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Taux d'occupation</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">75%</p>
              </div>
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Selection */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex space-x-2">
              {(['class', 'teacher', 'room'] as const).map((view) => {
                const Icon = getViewIcon(view);
                return (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === view
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {getViewLabel(view)}
                  </button>
                );
              })}
            </div>
            
            <div className="flex-1">
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner {getViewLabel(activeView).toLowerCase()}</option>
                {entities[activeView].map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      {selectedEntity && (
        <ScheduleGrid
          viewType={activeView}
          entityId={selectedEntity}
          entityName={entities[activeView].find(e => e.id === selectedEntity)?.name || ''}
          timeSlots={schoolSettings.timeSlots}
          assignments={courseAssignments.filter(assignment => {
            switch (activeView) {
              case 'class': return assignment.classId === selectedEntity;
              case 'teacher': return assignment.teacherId === selectedEntity;
              case 'room': return assignment.roomId === selectedEntity;
              default: return false;
            }
          })}
          workingDays={schoolSettings.workingDays}
        />
      )}

      {/* Rules Information */}
      <Card>
        <CardHeader>
          <CardTitle>Règles de gestion des emplois du temps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Règles d'attribution</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• RG-EDT-2.1 : Chaque matière doit être associée à un enseignant, une classe, une salle, un jour et un horaire</li>
                <li>• RG-EDT-2.2 : Le système vérifie automatiquement la disponibilité avant attribution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Prévention des conflits</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• RG-EDT-3.1 : Un enseignant ne peut enseigner qu'à une seule classe à la fois</li>
                <li>• RG-EDT-3.2 : Une classe ne peut recevoir qu'un seul cours à la fois</li>
                <li>• RG-EDT-3.3 : Une salle ne peut accueillir qu'une seule classe à la fois</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Assignment Form */}
      <CourseAssignmentForm
        isOpen={isAssignmentFormOpen}
        onClose={() => setIsAssignmentFormOpen(false)}
        onSave={handleSaveCourseAssignment}
        timeSlots={schoolSettings.timeSlots}
        workingDays={schoolSettings.workingDays}
      />

      {/* Conflict Modal */}
      <ScheduleConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflicts={conflicts}
      />
    </div>
  );
};