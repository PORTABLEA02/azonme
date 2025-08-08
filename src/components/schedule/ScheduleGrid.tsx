import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Clock, User, MapPin, BookOpen } from 'lucide-react';

interface ScheduleGridProps {
  viewType: 'class' | 'teacher' | 'room';
  entityId: string;
  entityName: string;
  timeSlots: any[];
  assignments: any[];
  workingDays: string[];
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  viewType,
  entityId,
  entityName,
  timeSlots,
  assignments,
  workingDays,
}) => {
  const dayLabels = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
  };

  // Créer une grille des créneaux horaires uniques
  const generateHourlySlots = () => {
    const slots = [];
    for (let hour = 7; hour < 19; hour++) {
      slots.push({
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      });
    }
    return slots;
  };

  const uniqueTimeSlots = generateHourlySlots();

  // Trier les créneaux par heure de début
  uniqueTimeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getAssignmentForSlot = (day: string, startTime: string) => {
    return assignments.find(assignment => 
      assignment.day === day && assignment.startTime === startTime
    );
  };

  const getSlotInfo = (startTime: string, endTime: string) => {
    return timeSlots.find(slot => 
      slot.startTime === startTime && slot.endTime === endTime
    );
  };

  const renderAssignmentCell = (assignment: any, slotInfo: any) => {
    if (!assignment) {
      return (
        <div className="h-20 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors">
        </div>
      );
    }

    // Calculer la hauteur en fonction de la durée
    const duration = assignment.duration || 60;
    const heightClass = duration > 60 ? 'h-40' : 'h-20';

    return (
      <div className={`${heightClass} bg-blue-50 border border-blue-200 rounded p-2 hover:bg-blue-100 cursor-pointer transition-colors`}>
        <div className="text-xs font-medium text-blue-900 truncate">
          {assignment.subjectName}
        </div>
        <div className="text-xs text-blue-600 font-medium">
          {assignment.startTime} - {assignment.endTime}
        </div>
        <div className="text-xs text-blue-700 mt-1 space-y-0.5">
          {viewType !== 'teacher' && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span className="truncate">{assignment.teacherName}</span>
            </div>
          )}
          {viewType !== 'class' && (
            <div className="flex items-center">
              <BookOpen className="w-3 h-3 mr-1" />
              <span className="truncate">{assignment.className}</span>
            </div>
          )}
          {viewType !== 'room' && assignment.roomName && assignment.roomName !== 'Aucune salle' && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{assignment.roomName}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Emploi du temps - {entityName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-24 p-2 text-left text-sm font-medium text-gray-600 border-b">
                  Horaires
                </th>
                {workingDays.map(day => (
                  <th key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b min-w-32">
                    {dayLabels[day as keyof typeof dayLabels]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uniqueTimeSlots.map((slot, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-2 text-sm text-gray-700 font-medium bg-gray-50">
                    <div className="text-center">
                      <div>{slot.startTime}</div>
                      <div className="text-xs text-gray-500">à</div>
                      <div>{slot.endTime}</div>
                    </div>
                  </td>
                  {workingDays.map(day => {
                    const assignment = getAssignmentForSlot(day, slot.startTime);
                    
                    return (
                      <td key={day} className="p-2">
                        {renderAssignmentCell(assignment, null)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
            <span className="text-gray-600">Cours programmé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
            <span className="text-gray-600">Créneau libre</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};