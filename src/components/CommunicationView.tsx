import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Send,
  Plus,
  Filter,
  Users,
  AlertTriangle,
  Mail,
  Smartphone,
  CheckCircle,
  X,
  Trash2,
} from 'lucide-react';
import { Announcement, SchoolConfig } from '../types';

interface CommunicationViewProps {
  announcements: Announcement[];
  config: SchoolConfig;
  onSaveAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({
  announcements,
  config,
  onSaveAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [filterAudience, setFilterAudience] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sentToast, setSentToast] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'Tous' as Announcement['targetAudience'],
    priority: 'normal' as Announcement['priority'],
    sendEmailCopy: true,
    sendSmsCopy: true,
  });

  const filtered = announcements.filter(
    (a) => filterAudience === 'all' || a.targetAudience === filterAudience
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnc: Announcement = {
      id: 'anc-' + Date.now(),
      title: formData.title,
      content: formData.content,
      targetAudience: formData.targetAudience,
      date: new Date().toISOString().split('T')[0],
      priority: formData.priority,
      author: 'Direction des Études',
    };

    onSaveAnnouncement(newAnc);
    setIsModalOpen(false);

    setSentToast(
      `Communiqué diffusé avec succès ! Canaux notifiés : Tableau d'affichage, ${
        formData.sendEmailCopy ? 'Email, ' : ''
      }${formData.sendSmsCopy ? 'SMS / WhatsApp' : ''}`
    );
    setTimeout(() => setSentToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Centre de Communication & Diffusions Scolaires
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publiez des notes d'information, convocations et alertes à destination des parents,
            élèves et enseignants
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Rédiger un Communiqué
        </button>
      </div>

      {sentToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sentToast}</span>
          </div>
          <button onClick={() => setSentToast(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Filter className="w-4 h-4 text-slate-400" />
          Filtrer par destinataire :
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'Tous', 'Parents', 'Professeurs', 'Étudiants'].map((aud) => (
            <button
              key={aud}
              onClick={() => setFilterAudience(aud)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterAudience === aud
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {aud === 'all' ? 'Toutes les cibles' : aud}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] uppercase tracking-wider ${
                    item.priority === 'urgent'
                      ? 'bg-red-100 text-red-800'
                      : item.priority === 'important'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.priority}
                </span>
                <span className="font-semibold text-indigo-700">
                  Cible : {item.targetAudience}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Publié le {item.date}</span>
                <span>• Par {item.author}</span>
                <button
                  onClick={() => onDeleteAnnouncement(item.id)}
                  className="text-red-400 hover:text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
            <p className="mt-2 text-slate-600 text-xs leading-relaxed whitespace-pre-line">
              {item.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Notification Email
                </span>
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Relais Mobile
                </span>
              </div>
              <span className="text-emerald-600 font-medium">Diffusé sur le portail web</span>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Rédiger un Communiqué Administratif
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Titre du Communiqué
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Réunion Parents-Professeurs de mi-semestre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Public Cible</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAudience: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Tous">Tous (Élèves, Parents, Profs)</option>
                    <option value="Parents">Parents d'Élèves uniquement</option>
                    <option value="Professeurs">Enseignants & Faculté</option>
                    <option value="Étudiants">Étudiants / Élèves</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Niveau d'Urgence
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="normal">Information Normale</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent / Alerte</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Contenu du Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Rédigez le texte officiel qui sera affiché et notifié..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <span className="font-semibold text-slate-800 block text-[11px]">
                  Canaux de Diffusion Immédiate
                </span>
                <div className="flex items-center gap-4 text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sendEmailCopy}
                      onChange={(e) =>
                        setFormData({ ...formData, sendEmailCopy: e.target.checked })
                      }
                      className="rounded text-indigo-600"
                    />
                    Avis par Email
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sendSmsCopy}
                      onChange={(e) =>
                        setFormData({ ...formData, sendSmsCopy: e.target.checked })
                      }
                      className="rounded text-indigo-600"
                    />
                    SMS / Message Mobile
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Publier & Notifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
