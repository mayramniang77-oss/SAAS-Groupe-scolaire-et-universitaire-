import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle,
  Bell,
  Search,
  ExternalLink,
} from 'lucide-react';
import { SchoolConfig, SchoolCycle, SchoolSubscription } from '../types';

interface HeaderProps {
  config: SchoolConfig;
  subscription: SchoolSubscription;
  onCycleChange: (cycle: SchoolCycle) => void;
  onNavigateToTab: (tab: string) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  subscription,
  onCycleChange,
  onNavigateToTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getCycleBadge = () => {
    switch (config.cycle) {
      case 'primaire':
        return {
          label: 'Cycle Primaire',
          icon: <School className="w-3.5 h-3.5" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'secondaire':
        return {
          label: 'Cycle Secondaire (Collège/Lycée)',
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'universitaire':
        return {
          label: 'Enseignement Supérieur (LMD)',
          icon: <Building2 className="w-3.5 h-3.5" />,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        };
    }
  };

  const badge = getCycleBadge();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: School Identity & Cycle Switcher */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {config.logoText || 'ES'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {config.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Année Académique : <strong className="text-slate-700 font-semibold">{config.academicYear}</strong>
                </span>
                <span>•</span>
                <span className="text-slate-500">Devise : {config.currency}</span>
              </div>
            </div>
          </div>

          {/* Quick cycle quick switch for demo / multi-cycle capability */}
          <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="px-2 py-1 text-slate-500 font-medium">Vue Démo :</span>
            <button
              onClick={() => onCycleChange('primaire')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                config.cycle === 'primaire'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Primaire
            </button>
            <button
              onClick={() => onCycleChange('secondaire')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                config.cycle === 'secondaire'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Secondaire
            </button>
            <button
              onClick={() => onCycleChange('universitaire')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                config.cycle === 'universitaire'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Universitaire
            </button>
          </div>

          {/* Right: SaaS Plan Badge & Actions */}
          <div className="flex items-center gap-3">
            {/* SaaS Subscription indicator */}
            <button
              onClick={() => onNavigateToTab('subscription')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900 hover:border-amber-300 transition text-xs font-semibold shadow-xs"
              title="Gérer ou souscrire à l'abonnement SaaS"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                Licence SaaS :{' '}
                <span className="text-amber-800 capitalize font-bold">
                  {subscription.planId.toUpperCase()} ({subscription.billingCycle})
                </span>
              </span>
              <span className="bg-emerald-500 text-white rounded-full p-0.5">
                <CheckCircle className="w-2.5 h-2.5" />
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                      Alertes administratives
                    </span>
                    <span className="text-xs text-indigo-600 cursor-pointer hover:underline" onClick={() => { setShowNotifications(false); onNavigateToTab('communication'); }}>
                      Voir tout
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                    <div className="px-4 py-2.5 hover:bg-slate-50">
                      <p className="font-medium text-slate-800">Échéance 2ème tranche de scolarité</p>
                      <p className="text-slate-500 mt-0.5">Rappel automatique envoyé aux 14 familles en retard.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Aujourd'hui à 09:30</span>
                    </div>
                    <div className="px-4 py-2.5 hover:bg-slate-50">
                      <p className="font-medium text-slate-800">Conseil de classe T1 programmé</p>
                      <p className="text-slate-500 mt-0.5">Saisie des notes ouverte jusqu'au 10 décembre.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Hier</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Administrator Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-medium text-xs">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Admin Principal</p>
                <p className="text-[10px] text-slate-500">Direction Générale</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
