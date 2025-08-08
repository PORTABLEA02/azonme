export interface PaymentType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  defaultAmount?: number;
  isRecurring: boolean;
  category: 'tuition' | 'registration' | 'supplies' | 'uniform' | 'activities' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: 'cash' | 'check' | 'mobile_money' | 'bank_transfer';
  isActive: boolean;
  requiresReference: boolean;
  processingFee?: number;
}

export interface PaymentSchedule {
  id: string;
  studentId: string;
  paymentTypeId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  installments: PaymentInstallment[];
  schoolYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInstallment {
  id: string;
  scheduleId: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  receiptNumber: string;
  studentId: string;
  paymentTypeId: string;
  installmentId?: string;
  scheduleId?: string;
  amount: number;
  paymentMethodId: string;
  reference?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'partial';
  paidDate: string;
  processedBy: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}