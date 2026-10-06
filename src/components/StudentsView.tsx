import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Filter,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  QrCode,
  Printer,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Student, ClassRoom, SchoolConfig, SchoolCycle } from '../types';

interface StudentsViewProps {
  students: Student[];
  classes: ClassRoom[];
  config: SchoolConfig;
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewReportCard: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  config,
  onSaveStudent,
  onDeleteStudent,
  onViewReportCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterTuition, setFilterTuition] = useState<string>('all');
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '2008-01-01',
    gender: 'M' as 'M' | 'F',
    classId: classes[0]?.id || '',
    cycle: config.cycle,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    totalTuition: 550000,
    paidTuition: 0,
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = filterClass === 'all' || s.classId === filterClass;
    const matchesTuition = filterTuition === 'all' || s.tuitionStatus === filterTuition;

    return matchesSearch && matchesClass && matchesTuition;
  });

  const handleOpenAdd = () => {
    const defaultClass = classes[0];
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '2008-01-01',
      gender: 'M',
      classId: defaultClass ? defaultClass.id : '',
      cycle: config.cycle,
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      totalTuition: defaultClass ? defaultClass.annualFee : 500000,
      paidTuition: 0,
    });
    setEditingStudent(null);
    setIsAddingNew(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      classId: student.classId,
      cycle: student.cycle,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      address: student.address,
      totalTuition: student.totalTuition,
      paidTuition: student.paidTuition,
    });
    setIsAddingNew(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === formData.classId);
    const className = targetClass ? targetClass.name : 'Classe Générale';
    const cycle = targetClass ? targetClass.cycle : config.cycle;

    let tuitionStatus: 'solde' | 'partiel' | 'en_retard' = 'en_retard';
    if (formData.paidTuition >= formData.totalTuition) {
      tuitionStatus = 'solde';
    } else if (formData.paidTuition > 0) {
      tuitionStatus = 'partiel';
    }

    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        ...formData,
        className,
        cycle,
        tuitionStatus,
      };
      onSaveStudent(updated);
    } else {
      const newStudent: Student = {
        id: 'std-' + Date.now(),
        matricule: `ETU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        className,
        cycle,
        status: 'actif',
        enrollmentDate: new Date().toISOString().split('T')[0],
        tuitionStatus,
      };
      onSaveStudent(newStudent);
    }

    setIsAddingNew(false);
    setEditingStudent(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' ' + config.currency;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Gestion & Registre des Élèves / Étudiants
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {students.length} apprenant(s) répertorié(s) pour l'année académique{' '}
            {config.academicYear}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter un Élève
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Toutes les classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.level})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterTuition}
            onChange={(e) => setFilterTuition(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tous statuts de scolarité</option>
            <option value="solde">Scolarité Soldée (100%)</option>
            <option value="partiel">Paiement Partiel</option>
            <option value="en_retard">En retard / Impayé</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Matricule & Élève</th>
                <th className="px-4 py-3.5">Classe & Cycle</th>
                <th className="px-4 py-3.5">Parents / Tuteurs</th>
                <th className="px-4 py-3.5">État Scolarité</th>
                <th className="px-4 py-3.5">Date Inscription</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Aucun élève ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-indigo-700 font-bold flex items-center justify-center border border-slate-200 text-xs shrink-0">
                          {std.firstName[0]}
                          {std.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {std.lastName} {std.firstName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {std.matricule} • {std.gender === 'M' ? 'Masculin' : 'Féminin'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{std.className}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 capitalize">
                        {std.cycle}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-slate-800 font-medium">{std.parentName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {std.parentPhone}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div>
                        {std.tuitionStatus === 'solde' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Soldé
                          </span>
                        )}
                        {std.tuitionStatus === 'partiel' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                            Partiel ({Math.round((std.paidTuition / std.totalTuition) * 100)}%)
                          </span>
                        )}
                        {std.tuitionStatus === 'en_retard' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                            En retard
                          </span>
                        )}
                        <div className="text-[11px] text-slate-500 mt-1">
                          {formatCurrency(std.paidTuition)} / {formatCurrency(std.totalTuition)}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                      {std.enrollmentDate}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Report Card */}
                        <button
                          onClick={() => onViewReportCard(std)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Générer le Bulletin Scolaire"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Student ID Card */}
                        <button
                          onClick={() => setSelectedStudentForCard(std)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Imprimer Carte Scolaire"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(std)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Confirmez-vous la suppression de l'élève ${std.firstName} ${std.lastName} ?`
                              )
                            ) {
                              onDeleteStudent(std.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? "Modifier l'Élève" : 'Inscrire un Nouvel Élève'}
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Amadou"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom de famille</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Diallo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Date de Naissance
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Genre</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Classe d'affectation</label>
                <select
                  value={formData.classId}
                  onChange={(e) => {
                    const cl = classes.find((c) => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      classId: e.target.value,
                      totalTuition: cl ? cl.annualFee : formData.totalTuition,
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.level}) — Tarif : {formatCurrency(cls.annualFee)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs">
                  Informations Tuteurs / Parents
                </span>
                <div>
                  <label className="block text-slate-600 mb-0.5">Nom du Parent / Responsable</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    placeholder="Ex: M. Ousmane Diallo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Téléphone d'urgence</label>
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      placeholder="+221 77 000 00 00"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Email du parent</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      placeholder="parent@gmail.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Adresse de résidence</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    placeholder="Quartier, Ville"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Frais de Scolarité Annuel ({config.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.totalTuition}
                    onChange={(e) =>
                      setFormData({ ...formData, totalTuition: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Montant Déjà Réglé ({config.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.paidTuition}
                    onChange={(e) =>
                      setFormData({ ...formData, paidTuition: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-sm"
                >
                  {editingStudent ? 'Mettre à Jour' : 'Valider Inscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student ID Card Modal Preview */}
      {selectedStudentForCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Carte Scolaire Officielle (Badging)
              </h3>
              <button
                onClick={() => setSelectedStudentForCard(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable ID Card Design */}
            <div
              id="student-id-badge"
              className="mt-4 p-5 rounded-2xl bg-linear-to-br from-indigo-900 via-slate-900 to-blue-950 text-white shadow-xl relative overflow-hidden border border-indigo-400/30"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                    {config.logoText || 'ES'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-none">{config.name}</h4>
                    <span className="text-[9px] text-indigo-200">Année {config.academicYear}</span>
                  </div>
                </div>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-white/10 font-mono tracking-wider">
                  {selectedStudentForCard.cycle}
                </span>
              </div>

              <div className="mt-4 flex gap-4 items-center">
                <div className="w-18 h-22 rounded-xl bg-slate-800 border-2 border-indigo-400/50 flex flex-col items-center justify-center text-indigo-200 shrink-0 font-bold text-lg">
                  {selectedStudentForCard.firstName[0]}
                  {selectedStudentForCard.lastName[0]}
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-[10px] text-indigo-300 uppercase tracking-wider">ÉLÈVE / ÉTUDIANT</p>
                  <p className="font-extrabold text-sm text-white">
                    {selectedStudentForCard.lastName} {selectedStudentForCard.firstName}
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Classe : <strong className="text-white">{selectedStudentForCard.className}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    N° Matricule : {selectedStudentForCard.matricule}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
                <div>
                  <p className="text-slate-400">Contact Urgence :</p>
                  <p className="text-white font-mono">{selectedStudentForCard.parentPhone}</p>
                </div>
                <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center text-slate-900">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedStudentForCard(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs rounded-xl hover:bg-slate-50 font-medium"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl font-semibold shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimer la Carte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
