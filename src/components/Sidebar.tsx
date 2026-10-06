import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  BookOpen,
  Award,
  Wallet,
  MessageSquare,
  Sparkles,
  Settings,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { SchoolSubscription } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  subscription: SchoolSubscription;
  studentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  subscription,
  studentCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: null,
    },
    {
      id: 'students',
      label: 'Gestion des Élèves',
      icon: <Users className="w-5 h-5" />,
      badge: studentCount.toString(),
    },
    {
      id: 'enrollments',
      label: 'Inscriptions & Admissions',
      icon: <UserPlus className="w-5 h-5" />,
      badge: 'Nouveau',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'teachers',
      label: 'Gestion des Professeurs',
      icon: <Briefcase className="w-5 h-5" />,
      badge: null,
    },
    {
      id: 'classes',
      label: 'Classes, Cours & Horaires',
      icon: <BookOpen className="w-5 h-5" />,
      badge: null,
    },
    {
      id: 'grades',
      label: 'Notes & Bulletins',
      icon: <Award className="w-5 h-5" />,
      badge: null,
    },
    {
      id: 'finance',
      label: 'Comptabilité & Scolarités',
      icon: <Wallet className="w-5 h-5" />,
      badge: null,
    },
    {
      id: 'communication',
      label: 'Communication & Alertes',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: null,
    },
    {
      id: 'subscription',
      label: 'Abonnement & Monétisation',
      icon: <Sparkles className="w-5 h-5" />,
      badge: 'SaaS Pro',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'settings',
      label: 'Configuration Établissement',
      icon: <Settings className="w-5 h-5" />,
      badge: null,
    },
  ];

  const quotaPercent = Math.min(
    100,
    Math.round((studentCount / (subscription.maxStudentsQuota || 1500)) * 100)
  );

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Brand Label */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white tracking-wide text-sm flex items-center gap-1.5">
              EduSphere <span className="text-xs px-1.5 py-0.2 rounded bg-indigo-600 text-white font-normal">SaaS</span>
            </div>
            <p className="text-[10px] text-slate-400">Solution Multi-Établissements</p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Module Académique
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.badgeColor || (isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quota & SaaS Subscription Mini-Widget */}
      <div className="p-3 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Quota Élèves
          </span>
          <span className="text-white font-semibold">
            {studentCount} / {subscription.maxStudentsQuota}
          </span>
        </div>
        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${quotaPercent}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Abonnement : {subscription.billingCycle}</span>
          <button
            onClick={() => onSelectTab('subscription')}
            className="text-indigo-400 hover:text-indigo-300 font-medium underline"
          >
            Changer d'offre
          </button>
        </div>
      </div>
    </aside>
  );
};
