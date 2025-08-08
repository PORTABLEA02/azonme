export interface EvaluationPlan {
  id: string;
  schoolYearId: string;
  termId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  interrogationsPlanned: number; // Toujours 2
  interrogationsCompleted: number;
  homeworksPlanned: number; // Toujours 2
  homeworksCompleted: number;
  finalEvaluationPlanned: boolean;
  finalEvaluationCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AverageCalculation {
  id: string;
  studentId: string;
  schoolYearId: string;
  termId?: string; // Si c'est une moyenne de période
  subjectAverages: SubjectAverage[];
  generalAverage: number;
  calculatedAt: string;
  calculatedBy: string;
  isFinalized: boolean;
}

export interface SubjectAverage {
  subjectId: string;
  subjectName: string;
  coefficient: number;
  average: number;
  gradeCount: number;
}

export interface PromotionResult {
  id: string;
  studentId: string;
  fromSchoolYearId: string;
  fromClassId: string;
  finalAverage: number;
  promotionThreshold: number;
  decision: 'promoted' | 'repeated' | 'special_case';
  toClassId?: string; // Classe de destination si promu
  notes?: string;
  processedAt: string;
  processedBy: string;
}