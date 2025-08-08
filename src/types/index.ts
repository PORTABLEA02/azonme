export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar?: string;
  phone?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  classId: string;
  parentId?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  address?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone?: string;
  subjects: string[];
  classes: string[];
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  cycle: string;
  schoolYear: string;
  specialty?: string;
  capacity: number;
  currentStudentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassTeacher {
  id: string;
  classId: string;
  teacherId: string;
  subjectId: string;
  assignedAt: string;
}

export interface StudentClassHistory {
  id: string;
  studentId: string;
  classId: string;
  schoolYear: string;
  assignedAt: string;
  removedAt?: string;
  reason?: string;
  assignedBy: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  value: number;
  maxValue: number;
  date: string;
  type: 'exam' | 'homework' | 'participation';
  comment?: string;
}

export interface Payment {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'general' | 'grade' | 'behavior' | 'payment';
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  paymentRate: number;
  recentGrades: Grade[];
  upcomingPayments: Payment[];
  recentMessages: Message[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'classroom' | 'laboratory' | 'computer_room' | 'multipurpose' | 'conference' | 'library';
  building?: string;
  floor?: string;
  equipment: string[];
  status: 'available' | 'maintenance' | 'reserved';
  maintenanceInfo?: {
    reason: string;
    startDate: string;
    endDate: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RoomReservation {
  id: string;
  roomId: string;
  classId?: string;
  teacherId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'class' | 'meeting' | 'exam' | 'conference' | 'maintenance';
  status: 'confirmed' | 'pending' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomUsageHistory {
  id: string;
  roomId: string;
  reservationId: string;
  actualStartTime: string;
  actualEndTime: string;
  attendeesCount?: number;
  notes?: string;
  createdAt: string;
}