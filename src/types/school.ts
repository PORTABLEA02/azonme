export interface SchoolYear {
  id: string;
  name: string; // Ex: "2024-2025"
  startDate: string; // Format ISO Date (YYYY-MM-DD)
  endDate: string;   // Format ISO Date (YYYY-MM-DD)
  isActive: boolean; // Une seule année peut être active à la fois
  status: 'planning' | 'active' | 'closed'; // Statut de l'année
  termStructure: 'semesters' | 'trimesters'; // Structure choisie par l'école
  numberOfTerms: number; // 2 pour semestres, 3 pour trimestres
  promotionThreshold: number; // Seuil de moyenne pour promotion (ex: 10)
  createdAt: string;
  updatedAt: string;
  closedAt?: string; // Date de clôture de l'année
  closedBy?: string; // ID de l'utilisateur qui a clôturé l'année
}

export interface Term {
  id: string;
  schoolYearId: string; // Lien vers l'année scolaire
  name: string; // Ex: "Semestre 1", "Trimestre 2"
  startDate: string;
  endDate: string;
  type: 'semester' | 'trimester';
  order: number; // 1, 2, 3...
  interrogationsCount: number; // Toujours 2 selon vos règles
  homeworksCount: number; // Toujours 2 selon vos règles
  finalEvaluationOptional: boolean; // Évaluation de fin de période optionnelle
  isFinalized: boolean; // Indique si les notes de cette période sont figées
  createdAt: string;
  updatedAt: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  classId: string;
  schoolYearId: string;
  enrollmentDate: string;
  status: 'enrolled' | 'promoted' | 'repeated' | 'transferred' | 'graduated';
  finalAverage?: number; // Moyenne calculée à la clôture d'année
  promotionDecision?: 'promoted' | 'repeated' | 'special_case';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYearTransition {
  id: string;
  fromSchoolYearId: string;
  toSchoolYearId: string;
  studentId: string;
  fromClassId: string;
  toClassId: string;
  finalAverage: number;
  promotionDecision: 'promoted' | 'repeated';
  processedAt: string;
  processedBy: string;
}

export interface SubjectCoefficient {
  id: string;
  schoolYearId: string;
  subjectId: string;
  subjectName: string;
  coefficient: number; // Poids de la matière dans le calcul de la moyenne
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}