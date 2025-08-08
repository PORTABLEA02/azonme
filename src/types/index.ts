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
  teacherId: string;
  studentCount: number;
  subjects: string[];
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
  studentId: string;
  amount: number;
  type: 'tuition' | 'supplies' | 'transport' | 'meals';
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  method?: 'cash' | 'transfer' | 'check';
}

export interface Message {
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