"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Send, Bell } from 'lucide-react';
import { Language } from '../types';

interface LiveDashboardMockupProps {
  lang: Language;
}

type Client = {
  id: number;
  name: string;
  role: string;
  unread: number;
};

type ChatMessage = {
  sender: 'client' | 'agency';
  text: string;
};

type ChatKey = 0 | 1 | 2 | 3;

const clientsAr: Client[] = [
  { id: 1, name: 'أحمد - عقارات', role: 'الخطة التسويقية', unread: 0 },
  { id: 2, name: 'محمود - متجر', role: 'نظام الـ CRM', unread: 2 },
  { id: 3, name: 'ياسر - مقاولات', role: 'برمجة موقع', unread: 1 },
  { id: 4, name: 'د كريم - عيادة', role: 'أسعار الخطط', unread: 0 },
];

const clientsEn: Client[] = [
  { id: 1, name: 'Ahmed - Real Estate', role: 'Marketing Plan', unread: 0 },
  { id: 2, name: 'Mahmoud - Store', role: 'CRM System', unread: 2 },
  { id: 3, name: 'Yasser - Agency', role: 'Web Development', unread: 1 },
  { id: 4, name: 'Dr Karim - Clinic', role: 'Plan Pricing', unread: 0 },
];

const messagesAr: Record<ChatKey, ChatMessage[]> = {
  0: [
    { sender: 'client', text: 'مساء الخير محتاج تفاصيل عن الخطة التسويقية الشاملة لمشروعي' },
    { sender: 'agency', text: 'مساء النور أستاذ أحمد 🌟 الخطة مصممة لزيادة مبيعاتك 3x تشمل إدارة الإعلانات صفحات الهبوط وتحسين محركات البحث' },
    { sender: 'client', text: 'عظيم جداً ممكن نبدأ الأسبوع الجاي؟ 🔥' },
  ],
  1: [
    { sender: 'client', text: 'سمعت إنكم بتقدموا نظام CRM إيه فايدته لمتجري؟' },
    { sender: 'agency', text: 'أهلاً محمود الـ CRM بتاعنا بيربط كل رسايلك ومبيعاتك في مكان واحد وبيقدر يرد بالذكاء الاصطناعي عشان متخسرش ولا عميل 🚀' },
  ],
  2: [
    { sender: 'client', text: 'عاوز أصمم موقع للشركة يعكس احترافيتنا هل بتوفروا ده؟' },
    { sender: 'agency', text: 'أكيد أستاذ ياسر بنبرمج مواقع سريعة جداً بتصاميم حديثة ومناسبة تماماً للموبايل لضمان أعلى تجربة للمستخدم 📱' },
  ],
  3: [
    { sender: 'client', text: 'إيه هي أسعار خطط النمو الرقمي اللي عندكم؟' },
    { sender: 'agency', text: 'أهلاً د كريم عندنا خطط مرنة بتناسب حجم البزنس بتاعك تم إرسال ملف الـ PDF فيه كل الباقات والتفاصيل 📊' },
  ],
};

const messagesEn: Record<ChatKey, ChatMessage[]> = {
  0: [
    { sender: 'client', text: 'Good evening I need details about the comprehensive marketing plan' },
    { sender: 'agency', text: 'Good evening Ahmed 🌟 The plan is designed to 3x your sales It includes ad management landing pages and SEO' },
    { sender: 'client', text: 'Great can we start next week 🔥' },
  ],
  1: [
    { sender: 'client', text: 'I heard you offer a CRM system how does it help my store' },
    { sender: 'agency', text: 'Welcome Mahmoud Our CRM connects all your messages and sales in one place and uses AI to reply so you never lose a lead 🚀' },
  ],
  2: [
    { sender: 'client', text: 'I want to design a website that reflects our professionalism do you do that' },
    { sender: 'agency', text: 'Sure Yasser we build lightning-fast modern websites that are perfectly optimized for mobile 📱' },
  ],
  3: [
    { sender: 'client', text: 'What are the prices for your digital growth plans' },
    { sender: 'agency', text: 'Welcome Dr Karim We have flexible plans tailored to your business size We just sent a PDF with all pricing details 📊' },
  ],
};

function ChatInputSimulator({
  isAr,
  activeMessage,
  onComplete,
}: {
  isAr: boolean;
  activeMessage: ChatMessage | null;
  onComplete: () => void;
}) {
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!activeMessage || activeMessage.sender !== 'agency') {
      setInputText('');
      return;
    }

    let i = 0;
    setInputText('');
    const typeInterval = window.setInterval(() => {
      i += 4;
      if (i > activeMessage.text.length) i = activeMessage.text.length;
      setInputText(activeMessage.text.slice(0, i));
      if (i === activeMessage.text.length) {
        window.clearInterval(typeInterval);
        window.setTimeout(() => {
          setInputText('');
          onComplete();
        }, 500);
      }
    }, 45);

    return () => {
      window.clearInterval(typeInterval);
      setInputText('');
    };
  }, [activeMessage, onComplete]);

  return (
    <div className="p-5 bg-white border-t border-[#f1f5f9] z-10">
      <div className={`flex items-end gap-3 bg-[#f8fafc] border rounded-3xl px-5 py-3 transition-colors duration-300 ${inputText.length > 0 ? 'border-[#9d027c]/40' : 'border-[#e2e8f0]'}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 mb-0.5 ${inputText.length > 0 ? 'bg-[#9d027c] scale-110 shadow-md shadow-[#9d027c]/30' : 'bg-[#e2e8f0]'}`}>
          <Send className={`w-4 h-4 rtl:-scale-x-100 transition-colors ${inputText.length > 0 ? 'text-white' : 'text-[#64748b]'}`} />
        </div>
        <div className="flex-1 min-h-[24px] max-h-[72px] overflow-y-auto text-[14px] font-bold text-[#0f172a] pointer-events-none leading-relaxed break-words scrollbar-hide py-1 text-right">
          {inputText || <span className="text-[#94a3b8] font-medium">{isAr ? 'اكتب رسالتك...' : 'Type your message...'}</span>}
        </div>
      </div>
    </div>
  );
}

export default function LiveDashboardMockup({ lang }: LiveDashboardMockupProps) {
  const isAr = lang === 'ar';
  const clients = isAr ? clientsAr : clientsEn;
  const messagesData = isAr ? messagesAr : messagesEn;
  const [activeChat, setActiveChat] = useState<ChatKey>(0);
  const [msgCount, setMsgCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const activeMessages = messagesData[activeChat];
  const currentActiveMessage = msgCount < activeMessages.length ? activeMessages[msgCount] : null;

  useEffect(() => {
    if (!isInView || !currentActiveMessage) return;

    if (currentActiveMessage.sender === 'client') {
      const delay = msgCount === 0 ? 800 : 1800;
      const timer = window.setTimeout(() => {
        setMsgCount(prev => prev + 1);
      }, delay);
      return () => window.clearTimeout(timer);
    }
  }, [msgCount, currentActiveMessage, isInView]);

  const handleAgencyTypingComplete = () => {
    setMsgCount(prev => prev + 1);
  };

  const getInitial = (name: string) => name.charAt(0);

  return (
    <div ref={containerRef} className="relative mt-6 lg:mt-0 lg:col-span-6 w-full group cursor-pointer antialiased font-sans">
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#e2e8f0]/30 to-[#cbd5e1]/20 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative flex rounded-[32px] bg-white border border-[#e2e8f0] shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-[480px] overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-700 ease-out">
        <div className="w-[80px] sm:w-[130px] lg:w-[160px] border-e border-[#f1f5f9] bg-[#f8fafc] flex flex-col shrink-0">
          <div className="p-4 sm:p-5 flex items-center justify-center lg:justify-start gap-2">
            <Bell className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[11px] font-extrabold text-[#475569] tracking-wider hidden lg:block">
              {isAr ? 'صندوق الوارد' : 'INBOX'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pb-2 scrollbar-hide">
            {clients.map((client, idx) => (
              <div
                key={client.id}
                className={`py-3 px-3 sm:px-4 cursor-pointer transition-colors duration-300 flex items-center justify-center lg:justify-start gap-3 relative ${activeChat === idx ? 'bg-[#f1f5f9]' : 'bg-transparent hover:bg-[#f1f5f9]/50'}`}
                onClick={() => {
                  setActiveChat(idx as ChatKey);
                  setMsgCount(0);
                }}
              >
                {activeChat === idx && (
                  <div className={`absolute top-0 bottom-0 w-1 bg-[#9d027c] ${isAr ? 'right-0' : 'left-0'}`} />
                )}

                <div className="relative shrink-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e2e8f0] border border-[#cbd5e1] shadow-sm flex items-center justify-center text-[#334155] text-xs sm:text-sm font-bold">
                    {getInitial(client.name)}
                  </div>
                  {client.unread > 0 && activeChat !== idx && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#9d027c] rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm">
                      {client.unread}
                    </span>
                  )}
                </div>

                <div className="flex-col overflow-hidden hidden lg:flex">
                  <span className="text-[12px] font-extrabold text-[#0f172a] truncate">{client.name.split(' - ')[0]}</span>
                  <span className="text-[10px] text-[#9d027c] font-bold truncate mt-0.5">{client.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#fafafa]">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#f1f5f9] bg-white flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-2">
              <p className="text-[11px] sm:text-[12px] text-amber-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {msgCount < messagesData[activeChat].length ? (isAr ? 'يكتب...' : 'typing...') : (isAr ? 'متصل الآن' : 'Online')}
              </p>
            </div>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e2e8f0] border border-[#cbd5e1] shadow-sm flex items-center justify-center text-[#334155] text-xs sm:text-sm font-bold">
              {getInitial(clients[activeChat].name)}
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6 scrollbar-hide z-0">
            <AnimatePresence mode="popLayout">
              {messagesData[activeChat].slice(0, msgCount).map((msg, i) => (
                <motion.div
                  key={`${activeChat}-${i}`}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  className={`flex flex-col max-w-[95%] sm:max-w-[85%] ${msg.sender === 'agency' ? 'self-start' : 'self-end'}`}
                >
                  <div className={`flex items-end gap-2 sm:gap-3 ${msg.sender === 'agency' ? 'flex-row' : 'flex-row-reverse'}`}>
                    {msg.sender === 'agency' && (
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white p-1 shadow-md shrink-0 border border-[#e2e8f0] flex items-center justify-center">
                        <img src="/logo.png" alt="Select" className="w-full h-full object-contain" />
                      </div>
                    )}

                    <div className={`px-4 py-2.5 sm:px-5 sm:py-3.5 text-[12px] sm:text-[14px] font-bold rounded-2xl shadow-sm leading-relaxed ${
                      msg.sender === 'agency'
                        ? 'bg-[#9d027c] text-white rounded-br-sm'
                        : 'bg-[#e2e8f0] text-[#0f172a] rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {msgCount < messagesData[activeChat].length && messagesData[activeChat][msgCount].sender === 'client' && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex max-w-[95%] sm:max-w-[85%] mt-1 self-end"
                >
                  <div className="flex items-end gap-2.5 flex-row-reverse">
                    <div className="px-4 py-3 sm:px-5 sm:py-4 bg-[#e2e8f0] rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                      <div className="w-2 h-2 bg-[#94a3b8] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ChatInputSimulator
            isAr={isAr}
            activeMessage={currentActiveMessage}
            onComplete={handleAgencyTypingComplete}
          />
        </div>
      </div>
    </div>
  );
}
