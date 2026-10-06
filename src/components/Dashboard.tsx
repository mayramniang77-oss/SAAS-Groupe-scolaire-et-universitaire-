import React from 'react';
import {
  Users,
  Briefcase,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  Award,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  SchoolConfig,
  Student,
  Teacher,
  ClassRoom,
  EnrollmentApplication,
  FeePayment,
  SchoolSubscription,
  Announcement,
} from '../types';

interface DashboardProps {
  config: SchoolConfig;
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  enrollments: EnrollmentApplication[];
  payments: FeePayment[];
  subscription: SchoolSubscription;
  announcements: Announcement[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  config,
  students,
  teachers,
  classes,
  enrollments,
  payments,
  subscription,
  announcements,
  onNavigate,
}) => {
  // Calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  const totalTuitionExpected = students.reduce((acc, s) => acc + s.totalTuition, 0);
  const totalTuitionPaid = students.reduce((acc, s) => acc + s.paidTuition, 0);
  const recoveryRate =
    totalTuitionExpected > 0 ? Math.round((totalTuitionPaid / totalTuitionExpected) * 100) : 0;

  const pendingEnrollments = enrollments.filter((e) => e.status === 'en_attente').length;
  const lateTuitionCount = students.filter((s) => s.tuitionStatus === 'en_retard').length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' ' + config.currency;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Plateforme Active • {config.academicYear}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mode Multi-Structure SaaS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenue sur {config.name}
            </h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Supervisez en temps réel la vie scolaire, les inscriptions, le corps enseignant, les
              cours, les évaluations trimestrielles et la trésorerie de votre établissement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('enrollments')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs shadow-md hover:bg-slate-100 transition"
            >
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Nouvelle Inscription
            </button>
            <button
              onClick={() => onNavigate('grades')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs border border-indigo-400/30 transition shadow-sm"
            >
              <Award className="w-4 h-4" />
              Saisie des Notes
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Élèves / Inscrits
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500">
              sur quota de {subscription.maxStudentsQuota}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% enregistrés
            </span>
            <button
              onClick={() => onNavigate('students')}
              className="text-indigo-600 font-medium hover:underline flex items-center"
            >
              Détails <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Corps Professoral
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalTeachers}</span>
            <span className="text-xs text-slate-500">enseignants actifs</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span>Permanents & Vacataires</span>
            <button
              onClick={() => onNavigate('teachers')}
              className="text-indigo-600 font-medium hover:underline flex items-center"
            >
              Gérer <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Classes & Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Classes & Sections
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalClasses}</span>
            <span className="text-xs text-slate-500">niveaux ouverts</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="capitalize">{config.cycle}</span>
            <button
              onClick={() => onNavigate('classes')}
              className="text-indigo-600 font-medium hover:underline flex items-center"
            >
              Emplois du temps <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Recouvrement des Frais */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Recouvrement Écolage
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{recoveryRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">encaissé</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span>{formatCurrency(totalTuitionPaid)}</span>
            <button
              onClick={() => onNavigate('finance')}
              className="text-indigo-600 font-medium hover:underline flex items-center"
            >
              Trésorerie <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Financial Health & Quick Actions & Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Financial & Academic status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tuition Collection Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Progression Financière des Scolarités ({config.academicYear})
                </h3>
                <p className="text-xs text-slate-500">
                  Total attendu : {formatCurrency(totalTuitionExpected)}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {recoveryRate}% Récolté
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
              <div
                className="bg-linear-to-r from-indigo-600 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${recoveryRate}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Montant Encaissé</span>
                <span className="text-sm font-bold text-slate-900 block">
                  {formatCurrency(totalTuitionPaid)}
                </span>
                <span className="text-[10px] text-emerald-600 mt-1 inline-block">
                  En banque & caisse
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Reste à Recouvrer</span>
                <span className="text-sm font-bold text-amber-700 block">
                  {formatCurrency(totalTuitionExpected - totalTuitionPaid)}
                </span>
                <span className="text-[10px] text-amber-600 mt-1 inline-block">
                  Échéances en cours
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Dossiers d'Admission</span>
                <span className="text-sm font-bold text-blue-700 block">
                  {pendingEnrollments} en attente
                </span>
                <span className="text-[10px] text-blue-600 mt-1 inline-block">
                  À valider par la direction
                </span>
              </div>
            </div>
          </div>

          {/* Classes Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Effectifs par Classe & Taux de Remplissage
              </h3>
              <button
                onClick={() => onNavigate('classes')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Gérer les classes →
              </button>
            </div>
            <div className="space-y-4">
              {classes.map((cls) => {
                const fillRatio = Math.round((cls.currentStudentCount / cls.capacity) * 100);
                return (
                  <div key={cls.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{cls.name}</strong>
                        <span className="text-slate-500 ml-2">({cls.roomNumber})</span>
                      </div>
                      <div className="text-slate-600 font-medium">
                        {cls.currentStudentCount} / {cls.capacity} places ({fillRatio}%)
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          fillRatio > 90
                            ? 'bg-amber-500'
                            : fillRatio > 70
                            ? 'bg-indigo-600'
                            : 'bg-blue-400'
                        }`}
                        style={{ width: `${Math.min(100, fillRatio)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Actions, Alerts & School Circulars */}
        <div className="space-y-6">
          {/* Attention Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Alertes & Points d'Attention
            </h3>
            <div className="space-y-2.5 text-xs">
              {lateTuitionCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <div>
                    <strong className="font-semibold block">
                      {lateTuitionCount} élève(s) avec scolarité en retard
                    </strong>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Relance automatique prête dans l'onglet Comptabilité.
                    </p>
                    <button
                      onClick={() => onNavigate('finance')}
                      className="mt-1.5 text-[11px] font-bold text-amber-900 underline"
                    >
                      Voir les impayés
                    </button>
                  </div>
                </div>
              )}

              {pendingEnrollments > 0 && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <div>
                    <strong className="font-semibold block">
                      {pendingEnrollments} nouvelle(s) demande(s) d'inscription
                    </strong>
                    <p className="text-blue-800 text-[11px] mt-0.5">
                      Dossiers en attente de vérification des pièces.
                    </p>
                    <button
                      onClick={() => onNavigate('enrollments')}
                      className="mt-1.5 text-[11px] font-bold text-blue-900 underline"
                    >
                      Traiter les dossiers
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="font-semibold block">Abonnement SaaS Valide</strong>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Plan {subscription.planId.toUpperCase()} actif jusqu'au{' '}
                    {subscription.currentPeriodEnd}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Circulars / Announcements */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Derniers Communiqués
              </h3>
              <button
                onClick={() => onNavigate('communication')}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                + Nouveau
              </button>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-600">{item.targetAudience}</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
