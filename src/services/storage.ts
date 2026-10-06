import {
  SchoolConfig,
  Student,
  Teacher,
  ClassRoom,
  Course,
  Grade,
  EnrollmentApplication,
  TimetableSlot,
  FeePayment,
  SchoolSubscription,
  Announcement,
} from '../types';
import {
  INITIAL_SCHOOL_CONFIG,
  INITIAL_CLASSES,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_ENROLLMENTS,
  INITIAL_TIMETABLE,
  INITIAL_PAYMENTS,
  INITIAL_SUBSCRIPTION,
  INITIAL_ANNOUNCEMENTS,
} from '../data/mockData';

const KEYS = {
  SCHOOL_CONFIG: 'edusphere_school_config',
  CLASSES: 'edusphere_classes',
  TEACHERS: 'edusphere_teachers',
  COURSES: 'edusphere_courses',
  STUDENTS: 'edusphere_students',
  GRADES: 'edusphere_grades',
  ENROLLMENTS: 'edusphere_enrollments',
  TIMETABLE: 'edusphere_timetable',
  PAYMENTS: 'edusphere_payments',
  SUBSCRIPTION: 'edusphere_subscription',
  ANNOUNCEMENTS: 'edusphere_announcements',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to localStorage`, e);
  }
}

export const StorageService = {
  getSchoolConfig: (): SchoolConfig => getStoredItem(KEYS.SCHOOL_CONFIG, INITIAL_SCHOOL_CONFIG),
  saveSchoolConfig: (config: SchoolConfig) => setStoredItem(KEYS.SCHOOL_CONFIG, config),

  getClasses: (): ClassRoom[] => getStoredItem(KEYS.CLASSES, INITIAL_CLASSES),
  saveClasses: (classes: ClassRoom[]) => setStoredItem(KEYS.CLASSES, classes),

  getTeachers: (): Teacher[] => getStoredItem(KEYS.TEACHERS, INITIAL_TEACHERS),
  saveTeachers: (teachers: Teacher[]) => setStoredItem(KEYS.TEACHERS, teachers),

  getCourses: (): Course[] => getStoredItem(KEYS.COURSES, INITIAL_COURSES),
  saveCourses: (courses: Course[]) => setStoredItem(KEYS.COURSES, courses),

  getStudents: (): Student[] => getStoredItem(KEYS.STUDENTS, INITIAL_STUDENTS),
  saveStudents: (students: Student[]) => setStoredItem(KEYS.STUDENTS, students),

  getGrades: (): Grade[] => getStoredItem(KEYS.GRADES, INITIAL_GRADES),
  saveGrades: (grades: Grade[]) => setStoredItem(KEYS.GRADES, grades),

  getEnrollments: (): EnrollmentApplication[] =>
    getStoredItem(KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS),
  saveEnrollments: (enrollments: EnrollmentApplication[]) =>
    setStoredItem(KEYS.ENROLLMENTS, enrollments),

  getTimetable: (): TimetableSlot[] => getStoredItem(KEYS.TIMETABLE, INITIAL_TIMETABLE),
  saveTimetable: (slots: TimetableSlot[]) => setStoredItem(KEYS.TIMETABLE, slots),

  getPayments: (): FeePayment[] => getStoredItem(KEYS.PAYMENTS, INITIAL_PAYMENTS),
  savePayments: (payments: FeePayment[]) => setStoredItem(KEYS.PAYMENTS, payments),

  getSubscription: (): SchoolSubscription =>
    getStoredItem(KEYS.SUBSCRIPTION, INITIAL_SUBSCRIPTION),
  saveSubscription: (sub: SchoolSubscription) => setStoredItem(KEYS.SUBSCRIPTION, sub),

  getAnnouncements: (): Announcement[] =>
    getStoredItem(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  saveAnnouncements: (announcements: Announcement[]) =>
    setStoredItem(KEYS.ANNOUNCEMENTS, announcements),

  resetToDefault: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
