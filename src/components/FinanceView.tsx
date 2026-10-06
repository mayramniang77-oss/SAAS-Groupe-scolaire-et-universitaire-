import React, { useState } from 'react';
import {
  Wallet,
  DollarSign,
  CreditCard,
  Plus,
  Search,
  Filter,
  Printer,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  X,
} from 'lucide-react';
import { FeePayment, Student, SchoolConfig } from '../types';

interface FinanceViewProps {
  payments: FeePayment[];
  students: Student[];
  config: SchoolConfig;
  onRecordPayment: (payment: FeePayment) => void;
  onUpdateStudentPayment: (studentId: string, additionalAmount: number) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  payments,
  students,
  config,
  onRecordPayment,
  onUpdateStudentPayment,
}) => {
  const [subTab, setSubTab] = useState<'payments' | 'defaulters'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // Payment form state
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    amount: 150000,
    paymentMethod: 'Orange Money' as FeePayment['paymentMethod'],
    paymentType: 'Scolarité Tranche 2' as FeePayment['paymentType'],
  });

  const totalBilled = students.reduce((acc, s) => acc + s.totalTuition, 0);
  const totalCollected = students.reduce((acc, s) => acc + s.paidTuition, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const defaulters = students.filter((s) => s.tuitionStatus === 'en_retard');

  const filteredPayments = payments.filter(
    (p) =>
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' ' + config.currency;
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === formData.studentId);
    if (!st) return;

    const newPayment: FeePayment = {
      id: 'pay-' + Date.now(),
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      className: st.className,
      amount: Number(formData.amount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod,
      paymentType: formData.paymentType,
      status: 'valide',
    };

    onRecordPayment(newPayment);
    onUpdateStudentPayment(st.id, Number(formData.amount));
    setIsModalOpen(false);
    setSelectedReceipt(newPayment);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Gestion Financière & Recouvrement des Scolarités
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des encaissements d'écolage, délivrance des reçus fiscaux et gestion des impayés
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Encaisser un Paiement
        </button>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Scolarités Facturé
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">{formatCurrency(totalBilled)}</p>
          <p className="text-xs text-slate-500 mt-1">Prévision budgétaire {config.academicYear}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Encaissé
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-3">
            {formatCurrency(totalCollected)}
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}% du budget
            scolaire perçu
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reste à Recouvrer (Créances)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-3">
            {formatCurrency(totalOutstanding)}
          </p>
          <p className="text-xs text-amber-600 font-medium mt-1">
            {defaulters.length} dossier(s) d'élèves en retard
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setSubTab('payments')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            subTab === 'payments'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Journal des Paiements ({payments.length})
        </button>
        <button
          onClick={() => setSubTab('defaulters')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            subTab === 'defaulters'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Échéanciers en Retard ({defaulters.length})
        </button>
      </div>

      {/* SUBTAB 1: PAYMENTS JOURNAL */}
      {subTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Rechercher par numéro de reçu ou élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">N° Reçu</th>
                  <th className="px-4 py-3.5">Élève & Classe</th>
                  <th className="px-4 py-3.5">Motif / Tranche</th>
                  <th className="px-4 py-3.5">Mode Règlement</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Montant Réglé</th>
                  <th className="px-5 py-3.5 text-right">Quittance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">
                      {p.receiptNumber}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{p.studentName}</div>
                      <div className="text-[11px] text-slate-400">{p.className}</div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-800 font-medium">{p.paymentType}</td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {p.paymentMethod}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500">{p.date}</td>

                    <td className="px-4 py-3.5 font-bold text-slate-900 text-sm">
                      {formatCurrency(p.amount)}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> Reçu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DEFAULTERS */}
      {subTab === 'defaulters' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Liste des Élèves avec Retard de Règlement
            </h3>
            <p className="text-xs text-slate-500">
              Familles à relancer pour l'échéance de scolarité
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Élève & Classe</th>
                  <th className="px-4 py-3.5">Parent / Contact</th>
                  <th className="px-4 py-3.5">Total Scolarité</th>
                  <th className="px-4 py-3.5">Montant Versé</th>
                  <th className="px-4 py-3.5">Solde Restant Dû</th>
                  <th className="px-5 py-3.5 text-right">Relance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaulters.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">
                        {std.lastName} {std.firstName}
                      </div>
                      <div className="text-[11px] text-slate-400">{std.className}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-slate-800 font-medium">{std.parentName}</div>
                      <div className="text-[11px] text-indigo-600">{std.parentPhone}</div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-700">
                      {formatCurrency(std.totalTuition)}
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {formatCurrency(std.paidTuition)}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-sm text-red-600">
                        {formatCurrency(std.totalTuition - std.paidTuition)}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() =>
                          alert(
                            `Rappel SMS / WhatsApp généré pour ${std.parentName} (${std.parentPhone}) : "Chers parents, merci de régulariser le reliquat de scolarité de ${formatCurrency(std.totalTuition - std.paidTuition)} auprès de la comptabilité."`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Envoyer Relance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Encaisser un Versement de Scolarité</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Élève Bénéficiaire</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.lastName} {s.firstName} ({s.className}) — Reste:{' '}
                      {formatCurrency(s.totalTuition - s.paidTuition)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Montant Réglé ({config.currency})
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Motif / Tranche</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentType: e.target.value as FeePayment['paymentType'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Inscription">Frais d'Inscription</option>
                    <option value="Scolarité Tranche 1">Scolarité Tranche 1</option>
                    <option value="Scolarité Tranche 2">Scolarité Tranche 2</option>
                    <option value="Scolarité Tranche 3">Scolarité Tranche 3</option>
                    <option value="Frais Examen">Frais d'Examen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mode de Paiement</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as FeePayment['paymentMethod'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Wave">Wave Mobile Money</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Carte Bancaire">Carte Bancaire (CB)</option>
                    <option value="Espèces">Espèces / Guichet</option>
                    <option value="Virement">Virement Bancaire</option>
                  </select>
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
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
                >
                  Valider l'Encaissement & Émettre Reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Quittance de Règlement Officielle
              </h3>
              <button onClick={() => setSelectedReceipt(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="mt-4 p-5 border-2 border-slate-300 rounded-xl bg-slate-50 space-y-3 font-sans">
              <div className="text-center border-b border-slate-200 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">{config.name}</h4>
                <p className="text-[11px] text-slate-500">Service Comptabilité & Trésorerie</p>
                <span className="inline-block mt-1 font-bold text-xs uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  REÇU DE CAISSE N° {selectedReceipt.receiptNumber}
                </span>
              </div>

              <div className="space-y-1.5 text-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date du règlement :</span>
                  <strong>{selectedReceipt.date}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reçu de l'apprenant :</span>
                  <strong className="text-slate-900">{selectedReceipt.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Classe :</span>
                  <span>{selectedReceipt.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Motif :</span>
                  <span>{selectedReceipt.paymentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Moyen de transaction :</span>
                  <span>{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Somme encaissée :</span>
                  <span className="text-base font-black text-emerald-700">
                    {formatCurrency(selectedReceipt.amount)}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between text-[10px] text-slate-500">
                <div>
                  <p>Document officiel certifié conforme</p>
                  <p className="italic">Conserver ce reçu pour justification</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-800">Le Caissier Comptable</p>
                  <div className="w-20 h-8 border-b border-dashed border-slate-300 mt-1 mx-auto" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimer le Reçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
