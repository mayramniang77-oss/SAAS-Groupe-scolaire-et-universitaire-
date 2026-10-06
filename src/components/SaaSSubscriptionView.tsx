import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  CreditCard,
  Building,
  ShieldCheck,
  Zap,
  ArrowRight,
  Calculator,
  Download,
  Clock,
  Printer,
  X,
  CheckCircle2,
} from 'lucide-react';
import { SaaSPlan, SchoolSubscription, SchoolConfig } from '../types';
import { SAAS_PLANS } from '../data/mockData';

interface SaaSSubscriptionViewProps {
  currentSubscription: SchoolSubscription;
  config: SchoolConfig;
  studentCount: number;
  onUpdateSubscription: (sub: SchoolSubscription) => void;
}

export const SaaSSubscriptionView: React.FC<SaaSSubscriptionViewProps> = ({
  currentSubscription,
  config,
  studentCount,
  onUpdateSubscription,
}) => {
  const [billingCycle, setBillingCycle] = useState<'mensuel' | 'annuel'>('annuel');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SaaSPlan | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<'carte' | 'wave' | 'orange' | 'virement'>(
    'wave'
  );

  // ROI Calculator
  const [calcStudents, setCalcStudents] = useState<number>(650);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' ' + config.currency;
  };

  const handleSelectPlan = (plan: SaaSPlan) => {
    setSelectedPlanForCheckout(plan);
    setCheckoutSuccess(false);
  };

  const handleConfirmSubscription = () => {
    if (!selectedPlanForCheckout) return;

    let quota = 1500;
    if (selectedPlanForCheckout.id === 'starter') quota = 350;
    if (selectedPlanForCheckout.id === 'enterprise') quota = 10000;

    const nextEnd = new Date();
    if (billingCycle === 'annuel') {
      nextEnd.setFullYear(nextEnd.getFullYear() + 1);
    } else {
      nextEnd.setMonth(nextEnd.getMonth() + 1);
    }

    const updated: SchoolSubscription = {
      planId: selectedPlanForCheckout.id,
      billingCycle,
      status: 'active',
      currentPeriodEnd: nextEnd.toISOString().split('T')[0],
      maxStudentsQuota: quota,
      autoRenew: true,
    };

    onUpdateSubscription(updated);
    setCheckoutSuccess(true);
  };

  // ROI calculation
  const selectedCost =
    billingCycle === 'annuel'
      ? (SAAS_PLANS.find((p) => p.id === 'pro')?.annualPrice || 650000) / 12
      : SAAS_PLANS.find((p) => p.id === 'pro')?.monthlyPrice || 65000;
  const costPerStudentMonthly = calcStudents > 0 ? (selectedCost / calcStudents).toFixed(0) : '0';

  return (
    <div className="space-y-8">
      {/* Monetization SaaS Presentation Header */}
      <div className="rounded-2xl bg-linear-to-r from-indigo-900 via-slate-900 to-purple-950 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Modèle Commercial & Monétisation Multi-Établissements
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Offres d'Abonnement SaaS pour Établissements Scolaires & Universitaires
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            EduSphere est conçu pour être commercialisé sous forme de logiciel à la demande (SaaS)
            auprès d'autres écoles primaires, collèges, lycées et facultés universitaires. Les
            structures souscrivent à un abonnement mensuel ou annuel adapté à leur taille et volume
            d'apprenants.
          </p>
        </div>

        {/* Current Plan Badge */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Votre abonnement actuel :</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              PLAN {currentSubscription.planId.toUpperCase()} ({currentSubscription.billingCycle})
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span>Échéance de la licence : <strong>{currentSubscription.currentPeriodEnd}</strong></span>
            <span>• Quota : <strong>{studentCount} / {currentSubscription.maxStudentsQuota} élèves</strong></span>
          </div>
        </div>
      </div>

      {/* Billing Cycle Switcher */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setBillingCycle('mensuel')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition ${
              billingCycle === 'mensuel'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Facturation Mensuelle
          </button>
          <button
            onClick={() => setBillingCycle('annuel')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              billingCycle === 'annuel'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Facturation Annuelle</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              -20% Réduction
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-500">
          L'abonnement annuel offre 2 mois gratuits et le déploiement prioritaire sur mesure.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SAAS_PLANS.map((plan) => {
          const isCurrent = currentSubscription.planId === plan.id;
          const price = billingCycle === 'annuel' ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-white border-2 border-indigo-600 shadow-xl shadow-indigo-600/10'
                  : 'bg-white border border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                  Le Plus Populaire
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">{plan.tagline}</p>

                {/* Price */}
                <div className="mt-5 pb-5 border-b border-slate-100 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {formatCurrency(price)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / {billingCycle === 'annuel' ? 'an' : 'mois'}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-indigo-700 font-semibold">
                  Recommandé pour : {plan.recommendedFor}
                </div>

                {/* Feature List */}
                <div className="mt-5 space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Fonctionnalités incluses :
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold cursor-default flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Forfait Actuellement Actif
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Souscrire à ce Forfait</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ROI & Cost Per Student Simulation Tool */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Simulateur de Rentabilité & Coût par Apprenant
            </h3>
            <p className="text-xs text-slate-500">
              Démontrez la rentabilité exceptionnelle de votre solution auprès des directions
              d'écoles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Effectif total estimé de l'établissement :
              </span>
              <span className="text-base font-bold text-indigo-700">{calcStudents} élèves</span>
            </div>
            <input
              type="range"
              min={50}
              max={3000}
              step={25}
              value={calcStudents}
              onChange={(e) => setCalcStudents(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>50 élèves (Primaire)</span>
              <span>1 500 élèves (Collège/Lycée)</span>
              <span>3 000+ élèves (Campus Univ)</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-100 text-center">
            <span className="text-xs font-semibold text-slate-600 block">
              Coût SaaS moyen par élève :
            </span>
            <span className="text-3xl font-black text-indigo-900 mt-1 block">
              {costPerStudentMonthly} {config.currency}
            </span>
            <span className="text-[11px] text-indigo-600 font-medium">/ mois / élève</span>
            <p className="text-[10px] text-slate-500 mt-2">
              Amorti dès le 1er versement de frais d'inscription !
            </p>
          </div>
        </div>
      </div>

      {/* SaaS Payment / Subscription Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-xs">
            {!checkoutSuccess ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Souscription SaaS : {selectedPlanForCheckout.name}
                  </h3>
                  <button onClick={() => setSelectedPlanForCheckout(null)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Périodicité :</span>
                      <strong className="capitalize text-slate-800">{billingCycle}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Montant de la licence :</span>
                      <strong className="text-base font-black text-indigo-700">
                        {formatCurrency(
                          billingCycle === 'annuel'
                            ? selectedPlanForCheckout.annualPrice
                            : selectedPlanForCheckout.monthlyPrice
                        )}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      Passerelle de Paiement pour l'Établissement :
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentProvider('wave')}
                        className={`p-3 rounded-xl border text-left font-semibold transition ${
                          paymentProvider === 'wave'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        Wave Mobile Money
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentProvider('orange')}
                        className={`p-3 rounded-xl border text-left font-semibold transition ${
                          paymentProvider === 'orange'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        Orange Money
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentProvider('carte')}
                        className={`p-3 rounded-xl border text-left font-semibold transition ${
                          paymentProvider === 'carte'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        Carte Bancaire / Stripe
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentProvider('virement')}
                        className={`p-3 rounded-xl border text-left font-semibold transition ${
                          paymentProvider === 'virement'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        Virement Bancaire Pro
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Facturation avec quittance fiscale déductible et reconduction sécurisée.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedPlanForCheckout(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSubscription}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
                    >
                      Activer la Licence SaaS Immédiatement
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Licence SaaS Activée avec Succès !
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Votre structure bénéficie désormais de toutes les fonctionnalités du{' '}
                    <strong>{selectedPlanForCheckout.name}</strong>.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
                  Clé de Licence : EDUSPHERE-SAAS-{Date.now().toString().slice(-8)}-PRO
                </div>
                <button
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-xs"
                >
                  Retourner au Tableau de Bord
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
