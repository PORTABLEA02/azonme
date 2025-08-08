import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, AlertTriangle, Clock, User, Users, MapPin } from 'lucide-react';

interface ScheduleConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: any[];
}

export const ScheduleConflictModal: React.FC<ScheduleConflictModalProps> = ({
  isOpen,
  onClose,
  conflicts,
}) => {
  if (!isOpen || conflicts.length === 0) return null;

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'teacher_conflict':
        return <User className="w-5 h-5 text-red-600" />;
      case 'class_conflict':
        return <Users className="w-5 h-5 text-red-600" />;
      case 'room_conflict':
        return <MapPin className="w-5 h-5 text-red-600" />;
      case 'reserved_slot':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getConflictTitle = (type: string) => {
    switch (type) {
      case 'teacher_conflict':
        return 'Conflit d\'enseignant';
      case 'class_conflict':
        return 'Conflit de classe';
      case 'room_conflict':
        return 'Conflit de salle';
      case 'reserved_slot':
        return 'Créneau réservé';
      default:
        return 'Conflit détecté';
    }
  };

  const getConflictColor = (type: string) => {
    switch (type) {
      case 'reserved_slot':
        return 'border-amber-200 bg-amber-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Conflits détectés ({conflicts.length})
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600">
                Les conflits suivants empêchent la création de ce cours. 
                Veuillez modifier les paramètres pour résoudre ces problèmes.
              </p>

              {conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getConflictColor(conflict.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getConflictIcon(conflict.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {getConflictTitle(conflict.type)}
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        {conflict.message}
                      </p>

                      {/* Détails du créneau */}
                      <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>
                            {conflict.timeSlot.day} à {conflict.timeSlot.startTime}
                          </span>
                        </div>
                      </div>

                      {/* Cours en conflit */}
                      {conflict.conflictingAssignments && conflict.conflictingAssignments.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Cours en conflit :
                          </p>
                          {conflict.conflictingAssignments.map((assignment: any, idx: number) => (
                            <div key={idx} className="bg-white bg-opacity-50 rounded p-3 text-sm">
                              <div className="font-medium text-gray-900">
                                {assignment.subjectName}
                              </div>
                              <div className="text-gray-600 mt-1 space-y-1">
                                <div>Enseignant : {assignment.teacherName}</div>
                                <div>Classe : {assignment.className}</div>
                                <div>Salle : {assignment.roomName}</div>
                                <div>Horaire : {assignment.startTime} - {assignment.endTime}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Solutions suggérées */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Solutions suggérées :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Choisir un autre créneau horaire disponible</li>
                <li>• Sélectionner un autre enseignant pour cette matière</li>
                <li>• Utiliser une salle différente</li>
                <li>• Modifier l'emploi du temps existant si nécessaire</li>
              </ul>
            </div>

            {/* Règles de gestion */}
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Règles de gestion appliquées :</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• RG-EDT-3.1 : Un enseignant ne peut enseigner qu'à une seule classe à la fois</li>
                <li>• RG-EDT-3.2 : Une classe ne peut recevoir qu'un seul cours à la fois</li>
                <li>• RG-EDT-3.3 : Une salle ne peut accueillir qu'une seule classe à la fois</li>
                <li>• RG-EDT-3.4 : Aucun cours dans les créneaux réservés</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                onClick={onClose}
                variant="outline"
              >
                Modifier les paramètres
              </Button>
              <Button
                onClick={onClose}
              >
                Compris
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};