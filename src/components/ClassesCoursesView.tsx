import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Layers,
  Plus,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  X,
  GraduationCap,
  Building,
  CheckCircle,
} from 'lucide-react';
import { ClassRoom, Course, TimetableSlot, Teacher, SchoolConfig } from '../types';

interface ClassesCoursesViewProps {
  classes: ClassRoom[];
  courses: Course[];
  timetable: TimetableSlot[];
  teachers: Teacher[];
  config: SchoolConfig;
  onSaveClass: (c: ClassRoom) => void;
  onDeleteClass: (id: string) => void;
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onSaveTimetableSlot: (slot: TimetableSlot) => void;
  onDeleteTimetableSlot: (id: string) => void;
}

export const ClassesCoursesView: React.FC<ClassesCoursesViewProps> = ({
  classes,
  courses,
  timetable,
  teachers,
  config,
  onSaveClass,
  onDeleteClass,
  onSaveCourse,
  onDeleteCourse,
  onSaveTimetableSlot,
  onDeleteTimetableSlot,
}) => {
  const [subTab, setSubTab] = useState<'classes' | 'courses' | 'timetable'>('classes');
  const [selectedClassForTimetable, setSelectedClassForTimetable] = useState<string>(
    classes[0]?.id || ''
  );

  // Modal states
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  // Class Form
  const [classForm, setClassForm] = useState({
    name: '',
    level: '6ème',
    cycle: config.cycle,
    mainTeacherId: teachers[0]?.id || '',
    roomNumber: 'Salle 101',
    capacity: 35,
    annualFee: 550000,
  });

  // Course Form
  const [courseForm, setCourseForm] = useState({
    code: 'MATH-01',
    name: '',
    coefficient: 4,
    teacherId: teachers[0]?.id || '',
    classId: classes[0]?.id || '',
    hoursPerWeek: 4,
    cycle: config.cycle,
  });

  // Timetable Slot Form
  const [slotForm, setSlotForm] = useState({
    day: 'Lundi' as TimetableSlot['day'],
    startTime: '08:00',
    endTime: '10:00',
    classId: classes[0]?.id || '',
    courseName: courses[0]?.name || 'Mathématiques',
    teacherName: teachers[0]?.firstName + ' ' + teachers[0]?.lastName,
    room: 'Salle B-01',
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const tch = teachers.find((t) => t.id === classForm.mainTeacherId);
    const newClass: ClassRoom = {
      id: 'cls-' + Date.now(),
      name: classForm.name,
      level: classForm.level,
      cycle: classForm.cycle,
      mainTeacherId: classForm.mainTeacherId,
      mainTeacherName: tch ? `${tch.firstName} ${tch.lastName}` : 'Non assigné',
      roomNumber: classForm.roomNumber,
      capacity: classForm.capacity,
      currentStudentCount: 0,
      annualFee: classForm.annualFee,
    };
    onSaveClass(newClass);
    setIsClassModalOpen(false);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const tch = teachers.find((t) => t.id === courseForm.teacherId);
    const newCourse: Course = {
      id: 'crs-' + Date.now(),
      code: courseForm.code,
      name: courseForm.name,
      coefficient: courseForm.coefficient,
      teacherId: courseForm.teacherId,
      teacherName: tch ? `${tch.firstName} ${tch.lastName}` : 'Non assigné',
      classId: courseForm.classId,
      hoursPerWeek: courseForm.hoursPerWeek,
      cycle: courseForm.cycle,
    };
    onSaveCourse(newCourse);
    setIsCourseModalOpen(false);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimetableSlot = {
      id: 'tt-' + Date.now(),
      day: slotForm.day,
      startTime: slotForm.startTime,
      endTime: slotForm.endTime,
      classId: slotForm.classId,
      courseName: slotForm.courseName,
      teacherName: slotForm.teacherName,
      room: slotForm.room,
    };
    onSaveTimetableSlot(newSlot);
    setIsSlotModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' ' + config.currency;
  };

  const days: TimetableSlot['day'][] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Gestion Académique : Classes, Matières & Emplois du Temps
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organisez les niveaux d'enseignement, coefficients pondérés et planning des salles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'classes' && (
            <button
              onClick={() => setIsClassModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
            >
              <Plus className="w-4 h-4" /> Créer une Classe
            </button>
          )}
          {subTab === 'courses' && (
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter une Matière
            </button>
          )}
          {subTab === 'timetable' && (
            <button
              onClick={() => setIsSlotModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter un Créneau
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setSubTab('classes')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            subTab === 'classes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Classes & Salles ({classes.length})
        </button>
        <button
          onClick={() => setSubTab('courses')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            subTab === 'courses'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Matières & Coefficients ({courses.length})
        </button>
        <button
          onClick={() => setSubTab('timetable')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            subTab === 'timetable'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Planning & Emploi du Temps
        </button>
      </div>

      {/* SUBTAB 1: CLASSES */}
      {subTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const classCourses = courses.filter((c) => c.classId === cls.id);
            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {cls.cycle} • {cls.level}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5">{cls.name}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {cls.roomNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-700 block">
                        {formatCurrency(cls.annualFee)}
                      </span>
                      <span className="text-[10px] text-slate-400">/ an par élève</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Professeur Principal :</span>
                      <strong className="text-slate-800">{cls.mainTeacherName}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Effectif actuel :</span>
                      <span className="font-semibold text-slate-800">
                        {cls.currentStudentCount} / {cls.capacity} élèves
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Matières rattachées :</span>
                      <span className="font-semibold text-indigo-600">{classCourses.length} cours</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedClassForTimetable(cls.id);
                      setSubTab('timetable');
                    }}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Voir l'emploi du temps →
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer la classe ${cls.name} ?`)) {
                        onDeleteClass(cls.id);
                      }
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Supprimer la classe"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: COURSES & COEFFICIENTS */}
      {subTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Code & Matière / Module</th>
                  <th className="px-4 py-3.5">Classe Rattachée</th>
                  <th className="px-4 py-3.5">Enseignant Responsable</th>
                  <th className="px-4 py-3.5">Coeff. / Crédits ECTS</th>
                  <th className="px-4 py-3.5">Heures / Semaine</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((crs) => {
                  const targetCls = classes.find((c) => c.id === crs.classId);
                  return (
                    <tr key={crs.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 text-sm">{crs.name}</div>
                        <div className="text-[11px] text-indigo-600 font-mono font-medium">
                          {crs.code}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800">
                          {targetCls ? targetCls.name : 'Toutes'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-slate-800 font-medium">{crs.teacherName}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {crs.coefficient} {crs.cycle === 'universitaire' ? 'ECTS' : 'Coeff'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {crs.hoursPerWeek} heures
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer la matière ${crs.name} ?`)) {
                              onDeleteCourse(crs.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: TIMETABLE (GRID VIEW) */}
      {subTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Classe visualisée :</span>
              <select
                value={selectedClassForTimetable}
                onChange={(e) => setSelectedClassForTimetable(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.level})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500">
              {timetable.filter((t) => t.classId === selectedClassForTimetable).length} cours
              programmés
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {days.map((day) => {
              const daySlots = timetable
                .filter(
                  (t) =>
                    t.day === day &&
                    (!selectedClassForTimetable || t.classId === selectedClassForTimetable)
                )
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
                  <div className="border-b border-slate-100 pb-2 mb-3 text-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      {day}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {daySlots.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-6 italic">
                        Aucun cours
                      </p>
                    ) : (
                      daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-2.5 rounded-xl bg-linear-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100 text-xs relative group"
                        >
                          <div className="flex items-center justify-between text-[10px] text-indigo-700 font-semibold mb-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <button
                              onClick={() => onDeleteTimetableSlot(slot.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                              title="Retirer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <h5 className="font-bold text-slate-900 text-[11px] leading-tight">
                            {slot.courseName}
                          </h5>
                          <p className="text-slate-600 text-[10px] mt-0.5">{slot.teacherName}</p>
                          <p className="text-[9px] text-slate-400 mt-1 font-mono">{slot.room}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Create Class */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Créer une Nouvelle Classe</h3>
              <button onClick={() => setIsClassModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateClass} className="mt-4 space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nom de la Classe</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 1ère Scientifique S1"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Niveau / Grade</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1ère S, CM1, Licence 1"
                    value={classForm.level}
                    onChange={(e) => setClassForm({ ...classForm, level: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cycle</label>
                  <select
                    value={classForm.cycle}
                    onChange={(e) =>
                      setClassForm({ ...classForm, cycle: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="primaire">Primaire</option>
                    <option value="secondaire">Secondaire</option>
                    <option value="universitaire">Universitaire</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Capacité Élèves</label>
                  <input
                    type="number"
                    value={classForm.capacity}
                    onChange={(e) =>
                      setClassForm({ ...classForm, capacity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salle Principale</label>
                  <input
                    type="text"
                    value={classForm.roomNumber}
                    onChange={(e) =>
                      setClassForm({ ...classForm, roomNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Professeur Principal</label>
                <select
                  value={classForm.mainTeacherId}
                  onChange={(e) =>
                    setClassForm({ ...classForm, mainTeacherId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Écolage Annuel Prévu ({config.currency})
                </label>
                <input
                  type="number"
                  value={classForm.annualFee}
                  onChange={(e) =>
                    setClassForm({ ...classForm, annualFee: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Course */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Ajouter une Matière / Unité</h3>
              <button onClick={() => setIsCourseModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-slate-700 font-semibold mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    placeholder="BIO-01"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Intitulé Matière</label>
                  <input
                    type="text"
                    required
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Sciences de la Vie et de la Terre"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Coefficient / ECTS
                  </label>
                  <input
                    type="number"
                    value={courseForm.coefficient}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, coefficient: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Heures / Semaine</label>
                  <input
                    type="number"
                    value={courseForm.hoursPerWeek}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, hoursPerWeek: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Classe</label>
                <select
                  value={courseForm.classId}
                  onChange={(e) => setCourseForm({ ...courseForm, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Enseignant</label>
                <select
                  value={courseForm.teacherId}
                  onChange={(e) => setCourseForm({ ...courseForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
                >
                  Créer la Matière
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Timetable Slot */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Ajouter un Créneau Horaire</h3>
              <button onClick={() => setIsSlotModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateSlot} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jour</label>
                  <select
                    value={slotForm.day}
                    onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salle</label>
                  <input
                    type="text"
                    value={slotForm.room}
                    onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Heure de début</label>
                  <input
                    type="time"
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Heure de fin</label>
                  <input
                    type="time"
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Classe</label>
                <select
                  value={slotForm.classId}
                  onChange={(e) => setSlotForm({ ...slotForm, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Cours / Matière</label>
                <select
                  value={slotForm.courseName}
                  onChange={(e) => setSlotForm({ ...slotForm, courseName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {courses.map((crs) => (
                    <option key={crs.id} value={crs.name}>
                      {crs.name} ({crs.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Enseignant</label>
                <select
                  value={slotForm.teacherName}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={`${t.firstName} ${t.lastName}`}>
                      {t.firstName} {t.lastName} ({t.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
                >
                  Enregistrer au Planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
