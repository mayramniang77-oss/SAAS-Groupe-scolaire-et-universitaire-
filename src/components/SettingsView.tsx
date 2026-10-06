import React, { useState } from 'react';
import {
  Settings,
  Building,
  Save,
  RotateCcw,
  CheckCircle,
  GraduationCap,
  Calendar,
  DollarSign,
  Award,
} from 'lucide-react';
import { SchoolConfig, SchoolCycle } from '../types';

interface SettingsViewProps {
  config: SchoolConfig;
  onSaveConfig: (config: SchoolConfig) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onSaveConfig,
  onResetData,
}) => {
  const [formData, setFormData] = useState<SchoolConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Configuration Générale de l'Établissement
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paramétrez l'identité légale, le cycle pédagogique, la devise et le système d'évaluation
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Paramètres de l'établissement enregistrés avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
        {/* Section 1: Identité */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" /> Identité & Coordonnées Officielles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Raison Sociale / Nom de l'Établissement
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Devise / Slogan Éducatif
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Initiales / Sigle du Logo
              </label>
              <input
                type="text"
                maxLength={4}
                value={formData.logoText}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Adresse Physique</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Téléphone Standard</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Institutionnel</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cycle & Pédagogie */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" /> Cycle Pédagogique & Notation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cycle Principal</label>
              <select
                value={formData.cycle}
                onChange={(e) =>
                  setFormData({ ...formData, cycle: e.target.value as SchoolCycle })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="primaire">Enseignement Primaire</option>
                <option value="secondaire">Enseignement Secondaire (Collège/Lycée)</option>
                <option value="universitaire">Enseignement Supérieur (Universitaire/LMD)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Barème d'Évaluation
              </label>
              <select
                value={formData.gradingSystem}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gradingSystem: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="scale20">Système standard sur 20</option>
                <option value="scale10">Système primaire sur 10</option>
                <option value="ects">Système Européen ECTS / LMD</option>
                <option value="gpa4">Système International GPA (4.0)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Découpage Pédagogique
              </label>
              <select
                value={formData.periodType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    periodType: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="trimestre">Trimestres (3 périodes / an)</option>
                <option value="semestre">Semestres (2 périodes / an)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Année & Trésorerie */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-600" /> Année Académique & Monnaie
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Année Scolaire en Cours</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                placeholder="2026-2027"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Devise de Facturation</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="FCFA">Franc CFA (FCFA)</option>
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar Américain ($)</option>
                <option value="MAD">Dirham Marocain (MAD)</option>
                <option value="TND">Dinar Tunisien (TND)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous rétablir les données d exemple par défaut ?')) {
                onResetData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser les Données Démo
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            Sauvegarder les Paramètres
          </button>
        </div>
      </form>
    </div>
  );
};
