import React, { useState } from 'react';
import {
  Briefcase,
  UserPlus,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';
import { Teacher, ClassRoom, Course, SchoolConfig } from '../types';

interface TeachersViewProps {
  teachers: Teacher[];
  classes: ClassRoom[];
  courses: Course[];
  config: SchoolConfig;
  onSaveTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  teachers,
  classes,
  courses,
  config,
  onSaveTeacher,
  onDeleteTeacher,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    status: 'permanent' as 'permanent' | 'vacataire',
    weeklyHours: 18,
    assignedSubjects: 'Mathématiques',
    assignedClassIds: [] as string[],
    hireDate: '2024-09-01',
    cycle: config.cycle,
  });

  const filtered = teachers.filter((t) => {
    const matchesSearch =
      t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.matricule.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: '',
      status: 'permanent',
      weeklyHours: 18,
      assignedSubjects: 'Mathématiques',
      assignedClassIds: [classes[0]?.id || ''],
      hireDate: new Date().toISOString().split('T')[0],
      cycle: config.cycle,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      phone: t.phone,
      specialty: t.specialty,
      status: t.status,
      weeklyHours: t.weeklyHours,
      assignedSubjects: t.assignedSubjects.join(', '),
      assignedClassIds: t.assignedClassIds,
      hireDate: t.hireDate,
      cycle: t.cycle,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArray = formData.assignedSubjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingTeacher) {
      const updated: Teacher = {
        ...editingTeacher,
        ...formData,
        assignedSubjects: subjectsArray,
      };
      onSaveTeacher(updated);
    } else {
      const newTeacher: Teacher = {
        id: 'tch-' + Date.now(),
        matricule: `ENS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        assignedSubjects: subjectsArray,
      };
      onSaveTeacher(newTeacher);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Corps Professoral & Enseignants
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion du personnel académique, charges horaires et affectations par classe
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter un Enseignant
        </button>
      </div>

      {/* Filter and metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Total Professeurs</span>
          <span className="text-2xl font-bold text-slate-900">{teachers.length}</span>
          <span className="text-[11px] text-indigo-600 block mt-0.5">
            {teachers.filter((t) => t.status === 'permanent').length} Permanents •{' '}
            {teachers.filter((t) => t.status === 'vacataire').length} Vacataires
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Volume Horaire Total</span>
          <span className="text-2xl font-bold text-slate-900">
            {teachers.reduce((acc, t) => acc + t.weeklyHours, 0)} h
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">dispensées par semaine</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Matières Enseignées</span>
          <span className="text-2xl font-bold text-slate-900">{courses.length}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">modules & unités d'enseignement</span>
        </div>
      </div>

      {/* Search and filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher un professeur par nom ou spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
          >
            <option value="all">Tous les statuts de contrat</option>
            <option value="permanent">Enseignant Permanent</option>
            <option value="vacataire">Enseignant Vacataire</option>
          </select>
        </div>
      </div>

      {/* Teachers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const teacherCourses = courses.filter((c) => c.teacherId === t.id);
          return (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center border border-purple-200 text-sm">
                      {t.firstName[0]}
                      {t.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {t.firstName} {t.lastName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">{t.matricule}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      t.status === 'permanent'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="text-slate-700 font-medium flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{t.specialty}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Charge : <strong>{t.weeklyHours} h</strong> / semaine</span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t.phone}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Matières & Modules pris en charge :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {t.assignedSubjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-50 text-indigo-700 font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  Depuis le {t.hireDate}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer l'enseignant ${t.firstName} ${t.lastName} ?`)) {
                        onDeleteTeacher(t.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTeacher ? "Modifier l'Enseignant" : 'Ajouter un Enseignant'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Spécialité Principale
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="Ex: Mathématiques & Analyse Numérique"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Statut Contrat</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'permanent' | 'vacataire',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="permanent">Permanent / Titulaire</option>
                    <option value="vacataire">Vacataire / Prestataire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Charge Hebdomadaire (Heures)
                  </label>
                  <input
                    type="number"
                    value={formData.weeklyHours}
                    onChange={(e) =>
                      setFormData({ ...formData, weeklyHours: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Professionnel</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Numéro Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Matières assignées (séparées par une virgule)
                </label>
                <input
                  type="text"
                  value={formData.assignedSubjects}
                  onChange={(e) => setFormData({ ...formData, assignedSubjects: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="Mathématiques, Statistiques"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-sm"
                >
                  {editingTeacher ? 'Sauvegarder Modifications' : 'Ajouter au Registre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
