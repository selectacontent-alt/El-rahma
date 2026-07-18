/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Send, Landmark, HelpCircle, PhoneCall, Sparkles } from 'lucide-react';
import { Plan, PlanType, Language } from '../types.ts';
import { PUBLIC_API } from '../lib/siteApi';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  planType: PlanType;
  defaultBudget?: number;
  currentLang?: Language;
}

export default function RequestModal({
  isOpen,
  onClose,
  selectedPlan,
  planType,
  defaultBudget = 30000,
  currentLang = 'ar'
}: RequestModalProps) {
  const isAr = currentLang === 'ar';
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState(defaultBudget);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!clientName.trim()) {
      tempErrors.clientName = isAr ? 'الرجاء إدخال اسمك الكريم' : 'Please enter your name';
    }
    if (!businessName.trim()) {
      tempErrors.businessName = isAr ? 'الرجاء إدخال اسم النشاط التجاري أو المشروع' : 'Please enter your brand or business name';
    }
    if (!phone.trim()) {
      tempErrors.phone = isAr ? 'الرجاء إدخال رقم الهاتف / الواتس اب' : 'Please enter your phone number';
    } else if (phone.length < 8) {
      tempErrors.phone = isAr ? 'الرجاء إدخال رقم هاتف صحيح متبوعاً بكود الدولة' : 'Please enter a valid phone number with country code';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newRequest = {
      id: 'req_' + Date.now(),
      clientName,
      businessName,
      phone,
      selectedPlanId: selectedPlan?.id || 'custom',
      selectedPlanTitle: selectedPlan?.title || (isAr ? 'خطة تفصيلية مخصصة' : 'Custom Tailored Strategy'),
      selectedPlanType: planType,
      budget: budget || defaultBudget,
      notes,
      createdAt: new Date().toISOString()
    };

    await fetch(`${PUBLIC_API}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'plan',
        name: clientName,
        phone,
        company: businessName,
        businessActivity: businessName,
        planSection: planType === 'advertising' ? 'social-advertising' : 'social',
        planId: newRequest.selectedPlanId,
        planTitle: newRequest.selectedPlanTitle,
        planPrice: selectedPlan?.price ?? null,
        planCurrency: selectedPlan?.currency || 'EGP',
        requestDetails: selectedPlan ? { description: selectedPlan.description, features: selectedPlan.features, postsCountText: selectedPlan.postsCountText } : { budget: budget || defaultBudget },
        message: notes || newRequest.selectedPlanTitle,
        source: 'website-plan-request-legacy',
      }),
    });

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setClientName('');
    setBusinessName('');
    setPhone('');
    setNotes('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] ${
              isAr ? 'text-right' : 'text-left'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <div className={`flex items-center gap-2 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-magenta animate-ping" />
                <h3 className="text-lg font-bold text-navy-deep flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-magenta" />
                  {isAr ? "اطلب خطتك الذكية الآن" : "Request Your Marketing Strategy"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                aria-label="Close"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Selected Plan Details Card */}
                  {selectedPlan ? (
                    <div className={`bg-magenta/5 border border-magenta/15 rounded-xl p-4 flex justify-between items-center mb-5 ${
                      isAr ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                      <div className={isAr ? 'text-right' : 'text-left'}>
                        <p className="text-xs text-magenta font-semibold mb-0.5">
                          {isAr ? "الخطة المختارة حالياً:" : "Currently selected plan:"}
                        </p>
                        <h4 className="font-bold text-navy-deep text-base">{selectedPlan.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{selectedPlan.postsCountText}</p>
                      </div>
                      <div className={isAr ? 'text-left' : 'text-right'}>
                        <span className="text-xl font-extrabold text-magenta block">
                          {selectedPlan.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-navy-deep block font-medium">
                          {isAr ? "ج.م / شهرياً" : "EGP / mo"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`bg-magenta/5 border border-magenta/15 rounded-xl p-4 flex justify-between items-center mb-5 ${
                      isAr ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                      <div className={isAr ? 'text-right' : 'text-left'}>
                        <p className="text-xs text-magenta font-semibold mb-0.5">
                          {isAr ? "طلب مخصص:" : "Custom request:"}
                        </p>
                        <h4 className="font-bold text-navy-deep text-base">
                          {isAr ? "خطة تفصيلية مخصصة حسب الطلب" : "Tailored custom strategy"}
                        </h4>
                      </div>
                      <div className={isAr ? 'text-left' : 'text-right'}>
                        <span className="text-sm font-semibold text-magenta block">
                          {isAr ? "يحدد لاحقاً" : "TBD"}
                        </span>
                        <span className="text-xs text-navy-deep font-medium">
                          {isAr ? "حسب الميزانية" : "Based on budget"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Form inputs */}
                  <div>
                    <label className={`block text-sm font-bold text-navy-deep mb-1 ${
                      isAr ? 'text-right' : 'text-left'
                    }`}>
                      {isAr ? "الاسم بالكامل أو اسم المتحدث الرسمي" : "Full Name / Representative"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-gray-50/50 transition-all ${
                        isAr ? 'text-right' : 'text-left'
                      } ${
                        errors.clientName
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-200 focus:ring-magenta/15 focus:border-magenta'
                      }`}
                      placeholder={isAr ? "أحمد علي..." : "John Doe..."}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      id="input-client-name"
                    />
                    {errors.clientName && (
                      <p className={`text-xs text-red-500 font-semibold mt-1 ${isAr ? 'text-right' : 'text-left'}`}>
                        {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold text-navy-deep mb-1 ${
                      isAr ? 'text-right' : 'text-left'
                    }`}>
                      {isAr ? "اسم المتجر الإلكتروني أو علامتك التجارية" : "E-commerce Store / Brand Name"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 bg-gray-50/50 transition-all ${
                        isAr ? 'text-right' : 'text-left'
                      } ${
                        errors.businessName
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-200 focus:ring-magenta/15 focus:border-magenta'
                      }`}
                      placeholder={isAr ? "براند كلوذينج / صالون الورد..." : "Clothing Brand / Business Name..."}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      id="input-business-name"
                    />
                    {errors.businessName && (
                      <p className={`text-xs text-red-500 font-semibold mt-1 ${isAr ? 'text-right' : 'text-left'}`}>
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-bold text-navy-deep mb-1 ${
                      isAr ? 'text-right' : 'text-left'
                    }`}>
                      {isAr ? "رقم الهاتف لتأكيد الخطة والمتابعة الفورية" : "Phone / WhatsApp Number (for validation)"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        dir="ltr"
                        className={`w-full pl-4 pr-10 py-2.5 rounded-lg border text-left focus:outline-none focus:ring-2 bg-gray-50/50 transition-all ${
                          errors.phone
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:ring-magenta/15 focus:border-magenta'
                        }`}
                        placeholder="+20 100 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        id="input-phone"
                      />
                      <span className="absolute right-3.5 top-3 flex items-center justify-center text-gray-400">
                        <PhoneCall className="w-5 h-5 text-gray-400" />
                      </span>
                    </div>
                    {errors.phone && (
                      <p className={`text-xs text-red-500 font-semibold mt-1 ${isAr ? 'text-right' : 'text-left'}`}>
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className={`flex justify-between items-center mb-1 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span className="text-xs text-magenta font-semibold bg-magenta/5 px-2 py-0.5 rounded-full font-mono">
                        {budget.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                      <label className={`block text-sm font-bold text-navy-deep ${isAr ? 'text-right' : 'text-left'}`}>
                        {isAr ? "الميزانية الإعلانية المقدرة شهرياً" : "Estimated Monthly Advertising Spend"}
                      </label>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="150000"
                      step="5000"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full accent-magenta cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                      id="input-budget-range"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 px-1 mt-1 font-mono">
                      <span>{isAr ? "150,000 ج.م" : "150,000 EGP"}</span>
                      <span>{isAr ? "10,000 ج.م" : "10,000 EGP"}</span>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold text-navy-deep mb-1 ${
                      isAr ? 'text-right' : 'text-left'
                    }`}>
                      {isAr ? "ملاحظات خاصة، أهدافك، أو رابط صفحتك الحالية (اختياري)" : "Special notes, goals, or current page link (Optional)"}
                    </label>
                    <textarea
                      className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta/15 focus:border-magenta bg-gray-50/50 text-sm transition-all ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      rows={3}
                      placeholder={isAr 
                        ? "اكتب هنا ما يهمك (مثلاً: أرغب في التركيز على مبيعات السفر والرحلات، صفحتي الحالية هي...)"
                        : "Write details here (e.g. current Facebook page, target industry, goals...)"}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      id="input-notes"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-magenta hover:bg-magenta/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-magenta/20 flex items-center justify-center gap-2 text-base cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                      id="submit-request-form-btn"
                    >
                      <Send className="w-5 h-5" />
                      {isAr ? "إرسال الطلب وحجز الجلسة المجانية" : "Submit Request & Book Free Consultation"}
                    </button>
                    <p className="text-[11px] text-gray-400 text-center mt-2.5 leading-relaxed">
                      {isAr 
                        ? "بمجرد إرسال الطلب، سيقوم أحد مستشاري النمو بالاتصال بك هاتفياً وعلى واتساب خلال أقل من 12 ساعة لتأكيد التفاصيل ومراجعة صفحاتك الحالية مجاناً."
                        : "Once submitted, one of our growth consultants will call or WhatsApp you within 12 hours to review your current pages for free."}
                    </p>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 px-4 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-success/10 flex items-center justify-center mx-auto mb-5 text-emerald-success animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h4 className="text-2xl font-bold text-navy-deep mb-2">
                    {isAr ? "تم استلام طلبك بنجاح! 🎉" : "Request Submitted Successfully! 🎉"}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {isAr ? (
                      <>
                        شكراً لك <span className="font-bold text-magenta">{clientName}</span>. لقد سجلنا اهتمامك بـ{' '}
                        <span className="font-bold text-navy-deep">{selectedPlan?.title || 'خطة تسويق تفصيلية'}</span>، ومبـلغ ميزانيتـك المقدر بـ{' '}
                        <span className="font-bold text-magenta">{budget.toLocaleString()} ج.م</span> لشـركتك{' '}
                        <span className="font-bold text-navy-deep">({businessName})</span>.
                      </>
                    ) : (
                      <>
                        Thank you <span className="font-bold text-magenta">{clientName}</span>. We registered your interest in{' '}
                        <span className="font-bold text-navy-deep">{selectedPlan?.title || 'detailed marketing plan'}</span>, with a budget of{' '}
                        <span className="font-bold text-magenta">{budget.toLocaleString()} EGP</span> for your company{' '}
                        <span className="font-bold text-navy-deep">({businessName})</span>.
                      </>
                    )}
                  </p>

                  <div className={`bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 mb-6 ${
                    isAr ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`flex justify-between text-xs ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span className="font-semibold text-navy-deep">{phone}</span>
                      <span className="text-gray-400">{isAr ? "رقم الهاتف المسجل:" : "Registered Phone Number:"}</span>
                    </div>
                    <div className={`flex justify-between text-xs ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span className="font-semibold text-emerald-success">
                        {isAr ? "بانتظار مراجعة خبير السوشيال" : "Pending review by social expert"}
                      </span>
                      <span className="text-gray-400">{isAr ? "حالة الطلب الحالية:" : "Current Request Status:"}</span>
                    </div>
                    <div className={`flex justify-between text-xs ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span className="font-semibold text-magenta">
                        {isAr ? "مجانية تماماً (بدون رسوم إدارية)" : "100% Free (No management fees)"}
                      </span>
                      <span className="text-gray-400">{isAr ? "جلسة التشخيص الأولي:" : "Initial Diagnostic Session:"}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full bg-navy-deep hover:bg-navy-deep/90 text-white font-semibold py-2.5 rounded-lg transition-all text-sm cursor-pointer"
                    id="success-close-modal-btn"
                  >
                    {isAr ? "رائع، العودة لتصفح المزيد" : "Great, back to browsing"}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
