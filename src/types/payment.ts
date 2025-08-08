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
  installments: PaymentInstallment[];
  status: 'active' | 'completed' | 'cancelled';
  schoolYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInstallment {
  id: string;
  scheduleId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  studentId: string;
  paymentTypeId: string;
  installmentId?: string;
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