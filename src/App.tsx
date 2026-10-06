/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  SchoolCycle,
} from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { EnrollmentView } from './components/EnrollmentView';
import { TeachersView } from './components/TeachersView';
import { ClassesCoursesView } from './components/ClassesCoursesView';
import { GradesReportCardView } from './components/GradesReportCardView';
import { FinanceView } from './components/FinanceView';
import { CommunicationView } from './components/CommunicationView';
import { SaaSSubscriptionView } from './components/SaaSSubscriptionView';
import { SettingsView } from './components/SettingsView';
import { ReportCardModal } from './components/ReportCardModal';

export default function App() {
  // App state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(
    StorageService.getSchoolConfig()
  );
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(StorageService.getTeachers());
  const [classes, setClasses] = useState<ClassRoom[]>(StorageService.getClasses());
  const [courses, setCourses] = useState<Course[]>(StorageService.getCourses());
  const [grades, setGrades] = useState<Grade[]>(StorageService.getGrades());
  const [enrollments, setEnrollments] = useState<EnrollmentApplication[]>(
    StorageService.getEnrollments()
  );
  const [timetable, setTimetable] = useState<TimetableSlot[]>(StorageService.getTimetable());
  const [payments, setPayments] = useState<FeePayment[]>(StorageService.getPayments());
  const [subscription, setSubscription] = useState<SchoolSubscription>(
    StorageService.getSubscription()
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    StorageService.getAnnouncements()
  );

  // Student selected for direct report card modal
  const [directReportCardStudent, setDirectReportCardStudent] = useState<Student | null>(null);

  // Cycle switch handler
  const handleCycleChange = (newCycle: SchoolCycle) => {
    const updatedConfig = { ...schoolConfig, cycle: newCycle };
    setSchoolConfig(updatedConfig);
    StorageService.saveSchoolConfig(updatedConfig);
  };

  // Student handlers
  const handleSaveStudent = (savedStudent: Student) => {
    const exists = students.some((s) => s.id === savedStudent.id);
    let updated: Student[];
    if (exists) {
      updated = students.map((s) => (s.id === savedStudent.id ? savedStudent : s));
    } else {
      updated = [savedStudent, ...students];
      // update class count
      const updatedClasses = classes.map((c) =>
        c.id === savedStudent.classId
          ? { ...c, currentStudentCount: c.currentStudentCount + 1 }
          : c
      );
      setClasses(updatedClasses);
      StorageService.saveClasses(updatedClasses);
    }
    setStudents(updated);
    StorageService.saveStudents(updated);
  };

  const handleDeleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    StorageService.saveStudents(updated);

    if (target) {
      const updatedClasses = classes.map((c) =>
        c.id === target.classId
          ? { ...c, currentStudentCount: Math.max(0, c.currentStudentCount - 1) }
          : c
      );
      setClasses(updatedClasses);
      StorageService.saveClasses(updatedClasses);
    }
  };

  // Enrollment handlers
  const handleSaveEnrollment = (enr: EnrollmentApplication) => {
    const updated = [enr, ...enrollments];
    setEnrollments(updated);
    StorageService.saveEnrollments(updated);
  };

  const handleApproveEnrollment = (enr: EnrollmentApplication) => {
    // 1. Mark enrollment as enrolled
    const updatedEnr = enrollments.map((e) =>
      e.id === enr.id ? { ...e, status: 'inscrit' as const } : e
    );
    setEnrollments(updatedEnr);
    StorageService.saveEnrollments(updatedEnr);

    // 2. Convert to registered student
    const targetClass = classes.find((c) => c.id === enr.targetClassId);
    const newStudent: Student = {
      id: 'std-' + Date.now(),
      matricule: `ETU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      firstName: enr.studentFirstName,
      lastName: enr.studentLastName,
      dateOfBirth: enr.dateOfBirth,
      gender: enr.gender,
      classId: enr.targetClassId,
      className: enr.targetClassName,
      cycle: enr.cycle,
      parentName: enr.parentName,
      parentPhone: enr.parentPhone,
      parentEmail: enr.parentEmail,
      address: 'Dakar / Résidence',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'actif',
      tuitionStatus: 'partiel',
      totalTuition: targetClass ? targetClass.annualFee : 550000,
      paidTuition: enr.registrationFee,
    };

    handleSaveStudent(newStudent);
  };

  // Teachers handlers
  const handleSaveTeacher = (t: Teacher) => {
    const exists = teachers.some((item) => item.id === t.id);
    const updated = exists ? teachers.map((item) => (item.id === t.id ? t : item)) : [t, ...teachers];
    setTeachers(updated);
    StorageService.saveTeachers(updated);
  };

  const handleDeleteTeacher = (id: string) => {
    const updated = teachers.filter((t) => t.id !== id);
    setTeachers(updated);
    StorageService.saveTeachers(updated);
  };

  // Classes & Courses & Timetable handlers
  const handleSaveClass = (c: ClassRoom) => {
    const updated = [...classes, c];
    setClasses(updated);
    StorageService.saveClasses(updated);
  };

  const handleDeleteClass = (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    StorageService.saveClasses(updated);
  };

  const handleSaveCourse = (c: Course) => {
    const updated = [...courses, c];
    setCourses(updated);
    StorageService.saveCourses(updated);
  };

  const handleDeleteCourse = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    StorageService.saveCourses(updated);
  };

  const handleSaveTimetableSlot = (slot: TimetableSlot) => {
    const updated = [...timetable, slot];
    setTimetable(updated);
    StorageService.saveTimetable(updated);
  };

  const handleDeleteTimetableSlot = (id: string) => {
    const updated = timetable.filter((s) => s.id !== id);
    setTimetable(updated);
    StorageService.saveTimetable(updated);
  };

  // Grades handlers
  const handleSaveGrade = (g: Grade) => {
    const updated = [g, ...grades];
    setGrades(updated);
    StorageService.saveGrades(updated);
  };

  const handleDeleteGrade = (id: string) => {
    const updated = grades.filter((g) => g.id !== id);
    setGrades(updated);
    StorageService.saveGrades(updated);
  };

  // Payments handlers
  const handleRecordPayment = (pay: FeePayment) => {
    const updated = [pay, ...payments];
    setPayments(updated);
    StorageService.savePayments(updated);
  };

  const handleUpdateStudentPayment = (studentId: string, additionalAmount: number) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        const newPaid = s.paidTuition + additionalAmount;
        let tuitionStatus: Student['tuitionStatus'] = 'partiel';
        if (newPaid >= s.totalTuition) tuitionStatus = 'solde';
        else if (newPaid <= 0) tuitionStatus = 'en_retard';
        return { ...s, paidTuition: newPaid, tuitionStatus };
      }
      return s;
    });
    setStudents(updated);
    StorageService.saveStudents(updated);
  };

  // SaaS Subscription handler
  const handleUpdateSubscription = (newSub: SchoolSubscription) => {
    setSubscription(newSub);
    StorageService.saveSubscription(newSub);
  };

  // Announcements handlers
  const handleSaveAnnouncement = (anc: Announcement) => {
    const updated = [anc, ...announcements];
    setAnnouncements(updated);
    StorageService.saveAnnouncements(updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    StorageService.saveAnnouncements(updated);
  };

  // Settings
  const handleSaveConfig = (cfg: SchoolConfig) => {
    setSchoolConfig(cfg);
    StorageService.saveSchoolConfig(cfg);
  };

  const handleResetData = () => {
    StorageService.resetToDefault();
    setSchoolConfig(StorageService.getSchoolConfig());
    setStudents(StorageService.getStudents());
    setTeachers(StorageService.getTeachers());
    setClasses(StorageService.getClasses());
    setCourses(StorageService.getCourses());
    setGrades(StorageService.getGrades());
    setEnrollments(StorageService.getEnrollments());
    setTimetable(StorageService.getTimetable());
    setPayments(StorageService.getPayments());
    setSubscription(StorageService.getSubscription());
    setAnnouncements(StorageService.getAnnouncements());
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        config={schoolConfig}
        subscription={subscription}
        onCycleChange={handleCycleChange}
        onNavigateToTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          subscription={subscription}
          studentCount={students.length}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                config={schoolConfig}
                students={students}
                teachers={teachers}
                classes={classes}
                enrollments={enrollments}
                payments={payments}
                subscription={subscription}
                announcements={announcements}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'students' && (
              <StudentsView
                students={students}
                classes={classes}
                config={schoolConfig}
                onSaveStudent={handleSaveStudent}
                onDeleteStudent={handleDeleteStudent}
                onViewReportCard={(std) => setDirectReportCardStudent(std)}
              />
            )}

            {activeTab === 'enrollments' && (
              <EnrollmentView
                enrollments={enrollments}
                classes={classes}
                config={schoolConfig}
                onSaveEnrollment={handleSaveEnrollment}
                onApproveAndCreateStudent={handleApproveEnrollment}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {activeTab === 'teachers' && (
              <TeachersView
                teachers={teachers}
                classes={classes}
                courses={courses}
                config={schoolConfig}
                onSaveTeacher={handleSaveTeacher}
                onDeleteTeacher={handleDeleteTeacher}
              />
            )}

            {activeTab === 'classes' && (
              <ClassesCoursesView
                classes={classes}
                courses={courses}
                timetable={timetable}
                teachers={teachers}
                config={schoolConfig}
                onSaveClass={handleSaveClass}
                onDeleteClass={handleDeleteClass}
                onSaveCourse={handleSaveCourse}
                onDeleteCourse={handleDeleteCourse}
                onSaveTimetableSlot={handleSaveTimetableSlot}
                onDeleteTimetableSlot={handleDeleteTimetableSlot}
              />
            )}

            {activeTab === 'grades' && (
              <GradesReportCardView
                grades={grades}
                students={students}
                courses={courses}
                classes={classes}
                config={schoolConfig}
                onSaveGrade={handleSaveGrade}
                onDeleteGrade={handleDeleteGrade}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceView
                payments={payments}
                students={students}
                config={schoolConfig}
                onRecordPayment={handleRecordPayment}
                onUpdateStudentPayment={handleUpdateStudentPayment}
              />
            )}

            {activeTab === 'communication' && (
              <CommunicationView
                announcements={announcements}
                config={schoolConfig}
                onSaveAnnouncement={handleSaveAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {activeTab === 'subscription' && (
              <SaaSSubscriptionView
                currentSubscription={subscription}
                config={schoolConfig}
                studentCount={students.length}
                onUpdateSubscription={handleUpdateSubscription}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                config={schoolConfig}
                onSaveConfig={handleSaveConfig}
                onResetData={handleResetData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Report Card Modal when triggered directly from student list */}
      {directReportCardStudent && (
        <ReportCardModal
          student={directReportCardStudent}
          grades={grades}
          courses={courses}
          allStudentsInClass={students.filter(
            (s) => s.classId === directReportCardStudent.classId
          )}
          allGradesInClass={grades.filter(
            (g) => g.classId === directReportCardStudent.classId
          )}
          config={schoolConfig}
          onClose={() => setDirectReportCardStudent(null)}
        />
      )}
    </div>
  );
}
