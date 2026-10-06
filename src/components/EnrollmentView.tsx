import React, { useState } from 'react';
import {
  UserPlus,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Search,
  Filter,
  CreditCard,
  Building,
  Check,
  X,
  FileText,
} from 'lucide-react';
import {
  EnrollmentApplication,
  ClassRoom,
  SchoolConfig,
  Student,
  FeePayment,
} from '../types';

interface EnrollmentViewProps {
  enrollments: EnrollmentApplication[];
  classes: ClassRoom[];
  config: SchoolConfig;
  onSaveEnrollment: (enr: EnrollmentApplication) => void;
  onApproveAndCreateStudent: (enr: EnrollmentApplication) => void;
  onRecordPayment: (payment: FeePayment) => void;
}

export const EnrollmentView: React.FC<EnrollmentViewProps> = ({
  enrollments,
  classes,
  config,
  onSaveEnrollment,
  onApproveAndCreateStudent,
  onRecordPayment,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForReceipt, setSelectedForReceipt] = useState<EnrollmentApplication | null>(null);

  // New application form state
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    dateOfBirth: '2010-01-01',
    gender: 'M' as 'M' | 'F',
    targetClassId: classes[0]?.id || '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    registrationFee: 75000,
    feePaid: false,
    docsActe: true,
    docsReleve: true,
    docsPhoto: true,
  });

  const filtered = enrollments.filter((e) => {
    const matchesSearch =
      e.studentFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.studentLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.parentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      studentFirstName: '',
      studentLastName: '',
      dateOfBirth: '2010-01-01',
      gender: 'M',
      targetClassId: classes[0]?.id || '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      registrationFee: 75000,
      feePaid: true,
      docsActe: true,
      docsReleve: true,
      docsPhoto: true,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === formData.targetClassId);
    const docs = [];
    if (formData.docsActe) docs.push('Acte de Naissance');
    if (formData.docsReleve) docs.push('Dernier Relevé de notes');
    if (formData.docsPhoto) docs.push("Photos d'identité");

    const newEnr: EnrollmentApplication = {
      id: 'enr-' + Date.now(),
      referenceCode: `INS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentFirstName: formData.studentFirstName,
      studentLastName: formData.studentLastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      targetClassId: formData.targetClassId,
      targetClassName: targetClass ? targetClass.name : 'Classe',
      cycle: targetClass ? targetClass.cycle : config.cycle,
      parentName: formData.parentName,
      parentEmail: formData.parentEmail,
      parentPhone: formData.parentPhone,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'en_attente',
      registrationFee: formData.registrationFee,
      feePaid: formData.feePaid,
      documentsSubmitted: docs,
    };

    onSaveEnrollment(newEnr);

    if (formData.feePaid) {
      const payment: FeePayment = {
        id: 'pay-' + Date.now(),
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        studentId: newEnr.id,
        studentName: `${newEnr.studentFirstName} ${newEnr.studentLastName}`,
        className: newEnr.targetClassName,
        amount: newEnr.registrationFee,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Orange Money',
        paymentType: 'Inscription',
        status: 'valide',
      };
      onRecordPayment(payment);
    }

    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' ' + config.currency;
  };

  const handleApprove = (enr: EnrollmentApplication) => {
    onApproveAndCreateStudent(enr);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Guichet des Inscriptions & Admissions Scolaires
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Traitement des dossiers de candidature, vérification des pièces et encaissement des frais
            d'inscription
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Enregistrer une Candidature
        </button>
      </div>

      {/* Filter and stats banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500">Total Demandes</span>
            <p className="text-xl font-bold text-slate-900">{enrollments.length}</p>
          </div>
          <FileText className="w-6 h-6 text-slate-400" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-600 font-medium">En Attente</span>
            <p className="text-xl font-bold text-amber-700">
              {enrollments.filter((e) => e.status === 'en_attente').length}
            </p>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-600 font-medium">Validés / Inscrits</span>
            <p className="text-xl font-bold text-emerald-700">
              {enrollments.filter((e) => e.status === 'inscrit' || e.status === 'approuve').length}
            </p>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500">Frais d'Inscription Encaissés</span>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(
                enrollments
                  .filter((e) => e.feePaid)
                  .reduce((acc, curr) => acc + curr.registrationFee, 0)
              )}
            </p>
          </div>
          <CreditCard className="w-6 h-6 text-indigo-500" />
        </div>
      </div>

      {/* Filter and search row */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par référence, élève ou parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
          >
            <option value="all">Tous les statuts de dossier</option>
            <option value="en_attente">En attente de validation</option>
            <option value="approuve">Approuvé</option>
            <option value="inscrit">Inscrit & Intégré aux classes</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Réf & Candidat</th>
                <th className="px-4 py-3.5">Classe Demandée</th>
                <th className="px-4 py-3.5">Parent / Contact</th>
                <th className="px-4 py-3.5">Pièces Fournies</th>
                <th className="px-4 py-3.5">Frais d'Admis.</th>
                <th className="px-4 py-3.5">Statut Dossier</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((enr) => (
                <tr key={enr.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900 text-sm">
                      {enr.studentLastName} {enr.studentFirstName}
                    </div>
                    <div className="text-[11px] text-indigo-600 font-mono font-medium">
                      {enr.referenceCode} • Né(e) le {enr.dateOfBirth}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-800">{enr.targetClassName}</span>
                    <span className="block text-[10px] text-slate-400 capitalize">{enr.cycle}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-slate-800 font-medium">{enr.parentName}</div>
                    <div className="text-[11px] text-slate-500">{enr.parentPhone}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {enr.documentsSubmitted.map((d, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                        >
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">
                      {formatCurrency(enr.registrationFee)}
                    </div>
                    {enr.feePaid ? (
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Réglé
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-medium">Non réglé</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {enr.status === 'inscrit' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Inscrit Officiellement
                      </span>
                    )}
                    {enr.status === 'approuve' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                        Dossier Approuvé
                      </span>
                    )}
                    {enr.status === 'en_attente' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                        En Attente Revue
                      </span>
                    )}
                    {enr.status === 'rejete' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                        Rejeté
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Print attestation */}
                      <button
                        onClick={() => setSelectedForReceipt(enr)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        title="Attestation d'inscription"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Approve / convert to student */}
                      {enr.status === 'en_attente' && (
                        <button
                          onClick={() => handleApprove(enr)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Valider
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Formulaire d'Inscription / Admission
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prénom de l'élève</label>
                  <input
                    type="text"
                    required
                    value={formData.studentFirstName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentFirstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Ex: Cheikh"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom de l'élève</label>
                  <input
                    type="text"
                    required
                    value={formData.studentLastName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentLastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Ex: Ndiaye"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Genre</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Classe souhaitée</label>
                <select
                  value={formData.targetClassId}
                  onChange={(e) => setFormData({ ...formData, targetClassId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs">
                  Parent / Tuteur Légal
                </span>
                <div>
                  <label className="block text-slate-600 mb-0.5">Nom complet du tuteur</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Téléphone WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Email</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1.5">
                  Pièces Jointes Déposées
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.docsActe}
                      onChange={(e) => setFormData({ ...formData, docsActe: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    Acte de Naissance
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.docsReleve}
                      onChange={(e) => setFormData({ ...formData, docsReleve: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    Relevé Précédent
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.docsPhoto}
                      onChange={(e) => setFormData({ ...formData, docsPhoto: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    Photos
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Frais d'Inscription ({config.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.registrationFee}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.feePaid}
                      onChange={(e) => setFormData({ ...formData, feePaid: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    Frais réglés immédiatement
                  </label>
                </div>
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
                  Créer le Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attestation / Receipt Modal */}
      {selectedForReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Attestation Provisoire & Reçu d'Inscription
              </h3>
              <button
                onClick={() => setSelectedForReceipt(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-6 border-2 border-slate-200 rounded-xl bg-slate-50/50 space-y-4 text-xs font-serif">
              <div className="text-center border-b border-slate-300 pb-3 font-sans">
                <h4 className="font-extrabold text-slate-900 text-base">{config.name}</h4>
                <p className="text-[11px] text-slate-500">{config.address} • Tél: {config.phone}</p>
                <span className="inline-block mt-1 font-bold text-xs uppercase tracking-widest text-indigo-700">
                  ATTESTATION D'INSCRIPTION & REÇU
                </span>
              </div>

              <div className="space-y-2 text-slate-800 leading-relaxed font-sans">
                <p>
                  Nous soussignés, la Direction de <strong>{config.name}</strong>, certifions que :
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <p>
                    L'apprenant(e) :{' '}
                    <strong className="text-slate-900">
                      {selectedForReceipt.studentLastName} {selectedForReceipt.studentFirstName}
                    </strong>
                  </p>
                  <p>
                    Né(e) le : <strong>{selectedForReceipt.dateOfBirth}</strong>
                  </p>
                  <p>
                    Inscrit(e) pour l'année académique : <strong>{config.academicYear}</strong>
                  </p>
                  <p>
                    En classe de : <strong>{selectedForReceipt.targetClassName}</strong>
                  </p>
                  <p>
                    Référence dossier :{' '}
                    <strong className="font-mono text-indigo-700">
                      {selectedForReceipt.referenceCode}
                    </strong>
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex justify-between items-center">
                  <div>
                    <span className="text-emerald-800 font-semibold block">
                      Frais de dossier et d'inscription :
                    </span>
                    <span className="text-[10px] text-emerald-600">
                      Règlement enregistré par les services financiers
                    </span>
                  </div>
                  <strong className="text-base font-bold text-emerald-900">
                    {formatCurrency(selectedForReceipt.registrationFee)}
                  </strong>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-end font-sans text-[11px] text-slate-500">
                <div>
                  <p>Fait à {config.address.split(',')[0] || 'la Direction'}, le {selectedForReceipt.applicationDate}</p>
                  <p className="italic mt-1">Mention : Enregistré et Validé</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-800">Le Secrétariat Académique</p>
                  <div className="w-24 h-10 border-b border-dashed border-slate-300 mt-2 mx-auto" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelectedForReceipt(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs rounded-xl hover:bg-slate-50 font-medium"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl font-semibold shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimer l'Attestation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
