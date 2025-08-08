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
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paidDate: string;
  processedBy: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRestriction {
  id: string;
  studentId: string;
  type: 'bulletin_access' | 'exam_registration' | 'library_access' | 'activities_access';
  reason: string;
  appliedDate: string;
  isActive: boolean;
  createdBy: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  processedDate?: string;
  notes?: string;
}

export interface Credit {
  id: string;
  studentId: string;
  amount: number;
  source: 'refund' | 'overpayment' | 'scholarship' | 'adjustment';
  description: string;
  isUsed: boolean;
  usedAmount: number;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAlert {
  id: string;
  studentId: string;
  type: 'due_soon' | 'overdue' | 'payment_received' | 'restriction_applied';
  message: string;
  severity: 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface PaymentDashboardStats {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  totalRefunds: number;
  paymentsByType: Record<string, number>;
  paymentsByMethod: Record<string, number>;
  collectionRate: number;
  overdueCount: number;
  restrictedStudents: number;
}