export interface FeeType {
  id: string;
  name: string;
  description?: string;
  category: 'tuition' | 'registration' | 'supplies' | 'uniform' | 'activities' | 'transport' | 'meals' | 'other';
  isActive: boolean;
  isRecurring: boolean;
  recurringPeriod?: 'monthly' | 'quarterly' | 'semester' | 'annual';
  createdAt: string;
  updatedAt: string;
}

export interface FeeStructure {
  id: string;
  feeTypeId: string;
  feeTypeName: string;
  applicableLevel: 'all' | 'primary' | 'secondary' | 'specific_class';
  specificClasses?: string[]; // IDs des classes spécifiques
  cycle?: 'premier' | 'second' | 'all';
  amount: number;
  currency: string;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSchedule {
  id: string;
  studentId: string;
  feeStructureId: string;
  schoolYear: string;
  totalAmount: number;
  installments: PaymentInstallment[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paidDate?: string;
  paidAmount?: number;
  paymentId?: string;
}

export interface FinancialReport {
  id: string;
  title: string;
  type: 'collection_summary' | 'outstanding_fees' | 'class_analysis' | 'period_comparison';
  parameters: {
    startDate: string;
    endDate: string;
    classes?: string[];
    feeTypes?: string[];
  };
  data: any;
  generatedBy: string;
  generatedAt: string;
}