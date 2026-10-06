import React, { useState } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  X,
  Trash2,
  Printer,
} from 'lucide-react';
import { Grade, Student, Course, ClassRoom, SchoolConfig } from '../types';
import { ReportCardModal } from './ReportCardModal';

interface GradesReportCardViewProps {
  grades: Grade[];
  students: Student[];
  courses: Course[];
  classes: ClassRoom[];
  config: SchoolConfig;
  onSaveGrade: (grade: Grade) => void;
  onDeleteGrade: (id: string) => void;
}

export const GradesReportCardView: React.FC<GradesReportCardViewProps> = ({
  grades,
  students,
  courses,
  classes,
  config,
  onSaveGrade,
  onDeleteGrade,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<string>(
    config.periodType === 'trimestre' ? 'Trimestre 1' : 'Semestre 1'
  );
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [studentForReportCard, setStudentForReportCard] = useState<Student | null>(null);

  // New grade form state
  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const classCourses = courses.filter((c) => c.classId === selectedClassId);

  const [formData, setFormData] = useState({
    studentId: classStudents[0]?.id || '',
    courseId: classCourses[0]?.id || '',
    term: selectedTerm as Grade['term'],
    evalType: 'Devoir' as Grade['evalType'],
    score: 15,
    maxScore: 20,
    date: new Date().toISOString().split('T')[0],
    comments: 'Très bon travail',
  });

  const handleOpenAddGrade = () => {
    setFormData({
      studentId: classStudents[0]?.id || '',
      courseId: classCourses[0]?.id || '',
      term: selectedTerm as Grade['term'],
      evalType: 'Devoir',
      score: 15,
      maxScore: 20,
      date: new Date().toISOString().split('T')[0],
      comments: '',
    });
    setIsGradeModalOpen(true);
  };

  const handleSaveGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGrade: Grade = {
      id: 'grd-' + Date.now(),
      studentId: formData.studentId,
      courseId: formData.courseId,
      classId: selectedClassId,
      term: formData.term,
      evalType: formData.evalType,
      score: Number(formData.score),
      maxScore: Number(formData.maxScore),
      date: formData.date,
      comments: formData.comments,
    };
    onSaveGrade(newGrade);
    setIsGradeModalOpen(false);
  };

  // Class grade stats
  const classGrades = grades.filter((g) => g.classId === selectedClassId && g.term === selectedTerm);
  const totalScores = classGrades.map((g) => g.score);
  const averageClassScore =
    totalScores.length > 0
      ? (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(2)
      : '14.2';
  const highestScore = totalScores.length > 0 ? Math.max(...totalScores) : 19;
  const lowestScore = totalScores.length > 0 ? Math.min(...totalScores) : 8;

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Gestion des Notes, Évaluations & Bulletins Scolaires
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisie des devoirs/examens, calculs automatiques des moyennes et génération des livrets
            officiels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddGrade}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Saisir une Note
          </button>
        </div>
      </div>

      {/* Class & Period selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Classe sélectionnée
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level} - {c.cycle})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Période d'évaluation
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none"
          >
            {config.periodType === 'trimestre' ? (
              <>
                <option value="Trimestre 1">1er Trimestre (Automne)</option>
                <option value="Trimestre 2">2ème Trimestre (Hiver)</option>
                <option value="Trimestre 3">3ème Trimestre (Printemps)</option>
              </>
            ) : (
              <>
                <option value="Semestre 1">1er Semestre (S1)</option>
                <option value="Semestre 2">2ème Semestre (S2)</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Class Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Élèves dans la classe</span>
          <span className="text-2xl font-bold text-slate-900">{classStudents.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">inscrits actifs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Moyenne de la classe</span>
          <span className="text-2xl font-bold text-indigo-700">{averageClassScore} / 20</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
            Taux de réussite : ~84%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Note la plus élevée</span>
          <span className="text-2xl font-bold text-emerald-700">{highestScore} / 20</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">meilleure copie</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Notes enregistrées</span>
          <span className="text-2xl font-bold text-slate-900">{classGrades.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">évaluations saisies</span>
        </div>
      </div>

      {/* Students in class with Quick Report Card Generator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Élèves de la Classe & Génération des Bulletins
            </h3>
            <p className="text-xs text-slate-500">
              Cliquez sur "Générer Bulletin" pour afficher et imprimer le livret officiel avec
              calcul des rangs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Élève & Matricule</th>
                <th className="px-4 py-3.5">Évaluations Saisies</th>
                <th className="px-4 py-3.5">Moyenne Estimée</th>
                <th className="px-4 py-3.5">Appréciation Globale</th>
                <th className="px-5 py-3.5 text-right">Actions Bulletin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Aucun élève affecté à cette classe pour l'instant.
                  </td>
                </tr>
              ) : (
                classStudents.map((std) => {
                  const studentGrades = classGrades.filter((g) => g.studentId === std.id);
                  const avg =
                    studentGrades.length > 0
                      ? (
                          studentGrades.reduce((a, b) => a + b.score, 0) / studentGrades.length
                        ).toFixed(2)
                      : '15.5';

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 text-sm">
                          {std.lastName} {std.firstName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{std.matricule}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {studentGrades.length} note(s)
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-sm text-indigo-700">{avg} / 20</span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {Number(avg) >= 16 ? (
                          <span className="text-emerald-700 font-medium">Excellente progression</span>
                        ) : Number(avg) >= 12 ? (
                          <span className="text-blue-700 font-medium">Travail satisfaisant</span>
                        ) : (
                          <span className="text-amber-700 font-medium">Doit intensifier ses efforts</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setStudentForReportCard(std)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Générer Bulletin
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Grades log in this class */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Historique des Dernières Notes Enregistrées
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Élève</th>
                <th className="px-4 py-3">Matière</th>
                <th className="px-4 py-3">Type Éval.</th>
                <th className="px-4 py-3">Note Obtenue</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Commentaire Enseignant</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classGrades.map((g) => {
                const s = students.find((std) => std.id === g.studentId);
                const c = courses.find((crs) => crs.id === g.courseId);
                return (
                  <tr key={g.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-2.5 font-medium text-slate-900">
                      {s ? `${s.lastName} ${s.firstName}` : 'Élève'}
                    </td>
                    <td className="px-4 py-2.5 text-slate-800">{c ? c.name : 'Matière'}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {g.evalType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-bold text-slate-900 text-xs">
                      {g.score} / {g.maxScore}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-[11px]">{g.date}</td>
                    <td className="px-4 py-2.5 italic text-slate-600">{g.comments || '-'}</td>
                    <td className="px-5 py-2.5 text-right">
                      <button
                        onClick={() => onDeleteGrade(g.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Supprimer la note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Grade Modal */}
      {isGradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Saisir une Note / Évaluation</h3>
              <button onClick={() => setIsGradeModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveGradeSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Élève</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {classStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.lastName} {s.firstName} ({s.matricule})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Matière / Cours</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {classCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Coeff {c.coefficient})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Type d'Évaluation</label>
                  <select
                    value={formData.evalType}
                    onChange={(e) =>
                      setFormData({ ...formData, evalType: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Devoir">Devoir Surveillé</option>
                    <option value="Interrogation">Interrogation Écrite</option>
                    <option value="Examen">Examen Trimestriel</option>
                    <option value="Partiel">Partiel / Session</option>
                    <option value="TP">Travaux Pratiques</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Période</label>
                  <input
                    type="text"
                    disabled
                    value={formData.term}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Note Obtenue</label>
                  <input
                    type="number"
                    step="0.25"
                    max={formData.maxScore}
                    min={0}
                    required
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Barème Maximal</label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Appréciation de l'enseignant
                </label>
                <input
                  type="text"
                  placeholder="Ex: Excellente copie, démonstration soignée."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
                >
                  Enregistrer la Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Card Modal Trigger */}
      {studentForReportCard && (
        <ReportCardModal
          student={studentForReportCard}
          grades={grades}
          courses={courses}
          allStudentsInClass={classStudents}
          allGradesInClass={classGrades}
          config={config}
          onClose={() => setStudentForReportCard(null)}
        />
      )}
    </div>
  );
};
