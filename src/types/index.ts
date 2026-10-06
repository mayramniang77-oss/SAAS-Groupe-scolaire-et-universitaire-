export type SchoolCycle = 'primaire' | 'secondaire' | 'universitaire';

export interface SchoolConfig {
  id: string;
  name: string;
  cycle: SchoolCycle;
  tagline: string;
  academicYear: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  gradingSystem: 'scale20' | 'scale10' | 'gpa4' | 'ects';
  periodType: 'trimestre' | 'semestre';
  logoText: string;
}

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  classId: string;
  className: string;
  cycle: SchoolCycle;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  enrollmentDate: string;
  status: 'actif' | 'en_attente' | 'diplome' | 'radie';
  tuitionStatus: 'solde' | 'partiel' | 'en_retard';
  totalTuition: number;
  paidTuition: number;
  avatarUrl?: string;
}

export interface Teacher {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  status: 'permanent' | 'vacataire';
  assignedClassIds: string[];
  assignedSubjects: string[];
  weeklyHours: number;
  hireDate: string;
  cycle: SchoolCycle;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  coefficient: number; // or ECTS credits for university
  teacherId: string;
  teacherName: string;
  classId: string;
  hoursPerWeek: number;
  cycle: SchoolCycle;
}

export interface ClassRoom {
  id: string;
  name: string;
  level: string; // e.g. "CM2", "3ème", "Terminale S", "Licence 3 Informatique"
  cycle: SchoolCycle;
  mainTeacherId: string;
  mainTeacherName: string;
  roomNumber: string;
  capacity: number;
  currentStudentCount: number;
  annualFee: number;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  classId: string;
  term: 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3' | 'Semestre 1' | 'Semestre 2';
  evalType: 'Interrogation' | 'Devoir' | 'Examen' | 'Partiel' | 'TP';
  score: number;
  maxScore: number;
  date: string;
  comments?: string;
}

export interface EnrollmentApplication {
  id: string;
  referenceCode: string;
  studentFirstName: string;
  studentLastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  targetClassId: string;
  targetClassName: string;
  cycle: SchoolCycle;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  applicationDate: string;
  status: 'en_attente' | 'approuve' | 'rejete' | 'inscrit';
  registrationFee: number;
  feePaid: boolean;
  documentsSubmitted: string[];
}

export interface TimetableSlot {
  id: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  startTime: string;
  endTime: string;
  classId: string;
  courseName: string;
  teacherName: string;
  room: string;
}

export interface FeePayment {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  date: string;
  paymentMethod: 'Wave' | 'Orange Money' | 'Carte Bancaire' | 'Espèces' | 'Virement';
  paymentType: 'Inscription' | 'Scolarité Tranche 1' | 'Scolarité Tranche 2' | 'Scolarité Tranche 3' | 'Frais Examen';
  status: 'valide' | 'en_attente';
}

export interface SaaSPlan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  maxStudents: number | 'Illimité';
  maxTeachers: number | 'Illimité';
  features: string[];
  recommendedFor: string;
  popular?: boolean;
}

export interface SchoolSubscription {
  planId: 'starter' | 'pro' | 'enterprise';
  billingCycle: 'mensuel' | 'annuel';
  status: 'active' | 'trial' | 'expired';
  currentPeriodEnd: string;
  maxStudentsQuota: number;
  autoRenew: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'Tous' | 'Parents' | 'Professeurs' | 'Étudiants';
  date: string;
  priority: 'normal' | 'important' | 'urgent';
  author: string;
}
