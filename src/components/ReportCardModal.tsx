import React from 'react';
import { X, Printer, Award, CheckCircle, FileText } from 'lucide-react';
import { Student, Grade, Course, SchoolConfig } from '../types';

interface ReportCardModalProps {
  student: Student;
  grades: Grade[];
  courses: Course[];
  allStudentsInClass: Student[];
  allGradesInClass: Grade[];
  config: SchoolConfig;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  grades,
  courses,
  allStudentsInClass,
  allGradesInClass,
  config,
  onClose,
}) => {
  // Filter courses for this student's class
  const classCourses = courses.filter((c) => c.classId === student.classId);

  // Calculate marks per course for this student
  const courseRows = classCourses.map((c) => {
    const studentCourseGrades = grades.filter(
      (g) => g.studentId === student.id && g.courseId === c.id
    );

    let avgScore = 0;
    if (studentCourseGrades.length > 0) {
      const sum = studentCourseGrades.reduce((acc, g) => acc + g.score, 0);
      avgScore = Number((sum / studentCourseGrades.length).toFixed(2));
    }

    const points = Number((avgScore * c.coefficient).toFixed(2));

    // Class min/max/avg for this course
    const allScoresForCourse = allGradesInClass
      .filter((g) => g.courseId === c.id)
      .map((g) => g.score);

    const classCourseAvg =
      allScoresForCourse.length > 0
        ? Number(
            (
              allScoresForCourse.reduce((acc, val) => acc + val, 0) /
              allScoresForCourse.length
            ).toFixed(2)
          )
        : 12.5;

    const classMax = allScoresForCourse.length > 0 ? Math.max(...allScoresForCourse) : 18;
    const classMin = allScoresForCourse.length > 0 ? Math.min(...allScoresForCourse) : 8;

    let appreciation = 'Travail convenable.';
    if (avgScore >= 16) appreciation = 'Excellente maîtrise des compétences.';
    else if (avgScore >= 14) appreciation = 'Très bon trimestre, poursuivez ainsi.';
    else if (avgScore >= 12) appreciation = 'Assez bon travail d ensemble.';
    else if (avgScore >= 10) appreciation = 'Juste la moyenne, efforts à redoubler.';
    else if (avgScore > 0) appreciation = 'Insuffisant, un suivi régulier est requis.';
    else appreciation = 'Non évalué';

    return {
      course: c,
      avgScore,
      points,
      classCourseAvg,
      classMin,
      classMax,
      appreciation,
    };
  });

  const totalCoeff = courseRows.reduce((acc, r) => acc + r.course.coefficient, 0);
  const totalPoints = courseRows.reduce((acc, r) => acc + r.points, 0);
  const generalAverage = totalCoeff > 0 ? Number((totalPoints / totalCoeff).toFixed(2)) : 0;

  // Compute student rank in class
  // Calculate average for all other students in class
  const classAverages = allStudentsInClass.map((otherStd) => {
    let pts = 0;
    let cf = 0;
    classCourses.forEach((c) => {
      const sGrades = allGradesInClass.filter(
        (g) => g.studentId === otherStd.id && g.courseId === c.id
      );
      if (sGrades.length > 0) {
        const avg = sGrades.reduce((a, b) => a + b.score, 0) / sGrades.length;
        pts += avg * c.coefficient;
        cf += c.coefficient;
      }
    });
    const avg = cf > 0 ? pts / cf : 0;
    return { studentId: otherStd.id, avg };
  });

  classAverages.sort((a, b) => b.avg - a.avg);
  const rankIndex = classAverages.findIndex((item) => item.studentId === student.id);
  const rank = rankIndex !== -1 ? rankIndex + 1 : 1;
  const suffix = rank === 1 ? 'er' : 'ème';

  // Mention
  let mention = 'Passable';
  let distinction = 'Tableau d honneur';
  if (generalAverage >= 16) {
    mention = 'Très Bien';
    distinction = 'Félicitations du Conseil de Classe';
  } else if (generalAverage >= 14) {
    mention = 'Bien';
    distinction = 'Encouragements et Félicitations';
  } else if (generalAverage >= 12) {
    mention = 'Assez Bien';
    distinction = 'Encouragements';
  } else if (generalAverage < 10) {
    mention = 'Insuffisant';
    distinction = 'Avertissement de travail';
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto">
        {/* Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Aperçu Officiel du Bulletin Scolaire
              </h3>
              <p className="text-xs text-slate-500">
                Document certifié prêt pour signature et impression
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Imprimer le Bulletin
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE BULLETIN SHEET */}
        <div className="border-2 border-slate-800 p-6 sm:p-8 rounded-lg bg-white text-slate-900 font-sans print:border-none print:p-0">
          {/* Official Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center">
                {config.logoText || 'ES'}
              </div>
              <div>
                <h1 className="text-lg font-black uppercase tracking-tight text-slate-900">
                  {config.name}
                </h1>
                <p className="text-xs text-slate-600 font-medium">{config.tagline}</p>
                <p className="text-[11px] text-slate-500">
                  {config.address} • Tél: {config.phone}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="border border-slate-900 px-3 py-1 font-bold text-xs uppercase tracking-wider bg-slate-100">
                BULLETIN DU 1ER {config.periodType === 'trimestre' ? 'TRIMESTRE' : 'SEMESTRE'}
              </div>
              <p className="text-xs text-slate-700 mt-1 font-semibold">
                Année Scolaire : {config.academicYear}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">Cycle : {student.cycle}</p>
            </div>
          </div>

          {/* Student Profile Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Nom & Prénom
              </span>
              <strong className="text-slate-900 font-bold text-sm">
                {student.lastName} {student.firstName}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Classe & Section
              </span>
              <strong className="text-slate-800 font-semibold">{student.className}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Matricule
              </span>
              <span className="font-mono text-slate-800 font-semibold">{student.matricule}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Né(e) le / Sexe
              </span>
              <span className="text-slate-800">
                {student.dateOfBirth} ({student.gender === 'M' ? 'M' : 'F'})
              </span>
            </div>
          </div>

          {/* Grades Table */}
          <div className="border border-slate-800 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-800 text-white text-[11px] font-bold">
                <tr>
                  <th className="p-2 border-r border-slate-700">Matière / Discipline</th>
                  <th className="p-2 border-r border-slate-700">Professeur</th>
                  <th className="p-2 text-center border-r border-slate-700">
                    Moyenne / {config.gradingSystem === 'scale10' ? '10' : '20'}
                  </th>
                  <th className="p-2 text-center border-r border-slate-700">Coeff / ECTS</th>
                  <th className="p-2 text-center border-r border-slate-700">Points</th>
                  <th className="p-2 text-center border-r border-slate-700">Moy. Classe</th>
                  <th className="p-2 text-center border-r border-slate-700">Min - Max</th>
                  <th className="p-2">Appréciations des Enseignants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {courseRows.map((r, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-300">
                      {r.course.name}
                    </td>
                    <td className="p-2 text-slate-600 border-r border-slate-300">
                      {r.course.teacherName}
                    </td>
                    <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-300">
                      {r.avgScore > 0 ? r.avgScore : '-'}
                    </td>
                    <td className="p-2 text-center font-semibold text-slate-700 border-r border-slate-300">
                      {r.course.coefficient}
                    </td>
                    <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-300">
                      {r.points > 0 ? r.points : '-'}
                    </td>
                    <td className="p-2 text-center text-slate-600 border-r border-slate-300">
                      {r.classCourseAvg}
                    </td>
                    <td className="p-2 text-center text-slate-500 font-mono text-[10px] border-r border-slate-300">
                      {r.classMin} - {r.classMax}
                    </td>
                    <td className="p-2 italic text-slate-700 text-[11px]">{r.appreciation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Summary & Rank Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 p-4 bg-slate-50 border border-slate-300 rounded text-xs">
            <div className="space-y-1">
              <p className="text-slate-600">
                Total des Coefficients : <strong>{totalCoeff}</strong>
              </p>
              <p className="text-slate-600">
                Total des Points : <strong>{totalPoints}</strong>
              </p>
              <p className="text-slate-600">
                Moyenne Générale :{' '}
                <strong className="text-base font-black text-indigo-900">
                  {generalAverage} / 20
                </strong>
              </p>
            </div>

            <div className="space-y-1 text-center sm:border-x border-slate-300 px-3">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Rang dans la classe
              </span>
              <p className="text-2xl font-black text-slate-900">
                {rank}
                <sup className="text-xs font-normal text-slate-600">{suffix}</sup>
                <span className="text-xs font-normal text-slate-500">
                  {' '}
                  / {allStudentsInClass.length} élèves
                </span>
              </p>
              <p className="font-semibold text-slate-800 text-[11px]">Mention : {mention}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Décision du Conseil de Classe
              </span>
              <p className="font-bold text-indigo-800 text-xs">{distinction}</p>
              <p className="text-[11px] text-slate-600 italic">
                {generalAverage >= 10
                  ? 'Poursuivez les efforts avec la même rigueur.'
                  : 'Travail insuffisant. Redoublez de vigilance pour le second trimestre.'}
              </p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-300 text-center text-xs">
            <div>
              <p className="font-bold text-slate-800">Les Parents / Responsables</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Vu et pris connaissance</p>
              <div className="h-16 border-b border-dashed border-slate-300 mt-2" />
            </div>

            <div>
              <p className="font-bold text-slate-800">Le Professeur Principal</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Visa et Observations</p>
              <div className="h-16 border-b border-dashed border-slate-300 mt-2" />
            </div>

            <div>
              <p className="font-bold text-slate-800">Le Chef d'Établissement</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Cachet & Signature officielle</p>
              <div className="h-16 border-b border-dashed border-slate-300 mt-2 flex items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-indigo-700/60 border border-indigo-200 px-2 py-1 rounded">
                  SCEAU OFFICIEL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
