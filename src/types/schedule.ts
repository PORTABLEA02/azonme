export interface TimeSlot {
  id: string;
  startTime: string; // Format HH:MM
  endTime: string;   // Format HH:MM
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  isReserved?: boolean; // Pour les pauses, entretiens, etc.
  reservationType?: 'break' | 'maintenance' | 'meeting' | 'other';
}

export interface CourseAssignment {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  roomId: string;
  roomName: string;
  timeSlotId: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number; // en minutes
  schoolYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  type: 'class' | 'teacher' | 'room';
  entityId: string; // ID de la classe, enseignant ou salle
  entityName: string;
  schoolYear: string;
  assignments: CourseAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleConflict {
  type: 'teacher_conflict' | 'class_conflict' | 'room_conflict' | 'reserved_slot';
  message: string;
  conflictingAssignments: CourseAssignment[];
  timeSlot: TimeSlot;
}

export interface SchoolSettings {
  workingDays: string[];
  timeSlots: TimeSlot[];
  schoolYear: string;
  breakTimes: {
    morning?: TimeSlot;
    lunch?: TimeSlot;
    afternoon?: TimeSlot;
  };
}