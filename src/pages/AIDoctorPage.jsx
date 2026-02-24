import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import AmruthaLogo from '../components/AmruthaLogo';
import { SCENARIOS, fetchTTS, playBase64Audio } from './aiDoctorMockData';

/* ─── AI Doctor status phases ─── */
const PHASES = [
    { key: 'listening', icon: '🎙️', label: { English: 'Listening', Hindi: 'सुन रहा है', Kannada: 'ಕೇಳುತ್ತಿದೆ' } },
    { key: 'thinking', icon: '🧠', label: { English: 'Thinking', Hindi: 'सोच रहा है', Kannada: 'ಯೋಚಿಸುತ್ತಿದೆ' } },
    { key: 'speaking', icon: '🗣️', label: { English: 'Speaking', Hindi: 'बोल रहा है', Kannada: 'ಮಾತನಾಡುತ್ತಿದೆ' } },
];

const DISCLAIMER = {
    English: 'AI recommendations are for informational purposes. For emergencies, please contact your local emergency services immediately.',
    Hindi: 'AI सिफारिशें केवल सूचनात्मक उद्देश्यों के लिए हैं। आपातकाल में, कृपया तुरंत अपनी स्थानीय आपातकालीन सेवाओं से संपर्क करें।',
    Kannada: 'AI ಶಿಫಾರಸುಗಳು ಮಾಹಿತಿ ಉದ್ದೇಶಗಳಿಗೆ ಮಾತ್ರ. ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.',
};

const PAGE_TITLE = { English: 'Patient Onboarding & Appointment', Hindi: 'रोगी ऑनबोर्डिंग और अपॉइंटमेंट', Kannada: 'ರೋಗಿ ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಮತ್ತು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್' };
const TITLE = { English: 'Active Consultation', Hindi: 'सक्रिय परामर्श', Kannada: 'ಸಕ್ರಿಯ ಸಮಾಲೋಚನೆ' };
const PROCEED_BTN = { English: 'Proceed to Specialist Selection', Hindi: 'विशेषज्ञ चयन पर जाएं', Kannada: 'ತಜ್ಞರ ಆಯ್ಕೆಗೆ ಮುಂದುವರಿಯಿರಿ' };
const PLACEHOLDER = { English: 'Describe any other symptoms or ask a question...', Hindi: 'अन्य लक्षण बताएं या प्रश्न पूछें...', Kannada: 'ಇತರ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ ಅಥವಾ ಪ್ರಶ್ನೆ ಕೇಳಿ...' };
const ASSISTANT_ROLE = { English: 'Virtual AI Doctor Consultant', Hindi: 'Virtual AI Doctor Consultant', Kannada: 'Virtual AI Doctor Consultant' };
const CHOOSE = { English: 'Choose a symptom scenario:', Hindi: 'एक लक्षण परिदृश्य चुनें:', Kannada: 'ಒಂದು ಲಕ್ಷಣ ಸನ್ನಿವೇಶ ಆಯ್ಕೆ ಮಾಡಿ:' };
const PRIORITY = { English: 'PRIORITY REFERRAL', Hindi: 'प्राथमिकता रेफरल', Kannada: 'ಆದ್ಯತೆ ರೆಫರಲ್' };
const SLOT_LABEL = { English: 'Earliest slot:', Hindi: 'सबसे पहला स्लॉट:', Kannada: 'ಮೊದಲ ಸ್ಲಾಟ್:' };

const AIDoctorPage = () => {
    const { patientData } = useHospital();
    const lang = patientData?.language || 'English';

    const [selectedScenario, setSelectedScenario] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgIndex, setMsgIndex] = useState(0);
    const [phase, setPhase] = useState('listening');
    const [typing, setTyping] = useState(false);
    const [visible, setVisible] = useState(false);

    const chatEndRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

    /* ─── pick scenario ─── */
    const handlePickScenario = (sc) => {
        setSelectedScenario(sc);
        setMessages([]);
        setMsgIndex(0);
        // auto-play first message after short delay
        setTimeout(() => playNextMessage(sc, 0), 400);
    };

    /* ─── auto-advance conversation ─── */
    const playNextMessage = async (sc, idx) => {
        const convo = sc.conversation[lang];
        if (idx >= convo.length) return;
        const msg = convo[idx];

        if (msg.role === 'user') {
            setPhase('listening');
            setMessages(prev => [...prev, { ...msg, time: formatTime() }]);
            // after short pause, advance to AI reply
            setTimeout(() => playNextMessage(sc, idx + 1), 1200);
        } else {
            // AI response: show thinking → typing → speaking
            setPhase('thinking');
            setTyping(true);
            await new Promise(r => setTimeout(r, 1500));
            setPhase('speaking');
            setTyping(false);
            const aiMsg = { ...msg, time: formatTime() };
            setMessages(prev => [...prev, aiMsg]);

            // TTS
            try {
                const b64 = await fetchTTS(msg.text.substring(0, 200), lang);
                if (b64) {
                    if (audioRef.current) audioRef.current.pause();
                    audioRef.current = playBase64Audio(b64);
                }
            } catch { /* silent */ }

            // wait then play next user message
            const nextIdx = idx + 1;
            setMsgIndex(nextIdx);
            if (nextIdx < convo.length) {
                setTimeout(() => playNextMessage(sc, nextIdx), 3000);
            } else {
                setPhase('listening');
            }
        }
    };

    const formatTime = () => {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    /* ─── RENDER ─── */
    return (
        <div className="min-h-screen flex" style={{ background: '#F7F9FC', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
            {/* ─── LEFT SIDEBAR ─── */}
            <aside className="hidden md:flex flex-col w-[300px] border-r" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                {/* Logo */}
                <div className="px-5 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
                    <AmruthaLogo size={28} textSize="text-sm" />
                </div>

                {/* Doctor Avatar */}
                <div className="flex flex-col items-center py-8 px-4">
                    <div className="w-36 h-36 rounded-full overflow-hidden mb-4" style={{ border: '3px solid #2D6CDF', boxShadow: '0 4px 20px rgba(45,108,223,0.2)' }}>
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EBF2FF 0%, #D6E4FF 100%)' }}>
                            <span className="text-6xl">👨‍⚕️</span>
                        </div>
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: '#1F2937' }}>Amrutha.AI</h2>
                    <p className="text-sm font-medium" style={{ color: '#2D6CDF' }}>{ASSISTANT_ROLE[lang]}</p>
                </div>

                {/* Status Phases */}
                <div className="px-5 flex-1">
                    {PHASES.map((p) => {
                        const active = phase === p.key;
                        return (
                            <div key={p.key} className="flex items-center gap-3 py-3 px-3 rounded-xl mb-1" style={{ background: active ? 'rgba(45,108,223,0.08)' : 'transparent', transition: 'all 0.3s' }}>
                                <span className="text-lg">{p.icon}</span>
                                <span className="text-sm font-semibold" style={{ color: active ? '#2D6CDF' : '#9CA3AF' }}>{p.label[lang]}</span>
                                {active && <span className="ml-auto flex gap-1">{phase === 'thinking' ? <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> : <span className="text-xs" style={{ color: '#2D6CDF' }}>●</span>}</span>}
                                {p.key === 'listening' && !active && <span className="ml-auto text-gray-300 text-xs">• • •</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Disclaimer */}
                <div className="px-5 py-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#1F2937' }}>Disclaimer:</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{DISCLAIMER[lang]}</p>
                </div>
            </aside>

            {/* ─── MAIN CHAT AREA ─── */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-3 border-b" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                    <div>
                        <h1 className="text-base font-bold" style={{ color: '#1F2937' }}>{PAGE_TITLE[lang]}</h1>
                        {selectedScenario && <p className="text-xs" style={{ color: '#9CA3AF' }}>Case #{selectedScenario.caseId}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Mobile doctor icon */}
                        <div className="md:hidden w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(45,108,223,0.08)' }}>
                            <span className="text-lg">👨‍⚕️</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: 'rgba(0,0,0,0.04)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                    </div>
                </header>

                {/* Chat Messages or Scenario Picker */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6" style={{ background: '#F7F9FC' }}>
                    {!selectedScenario ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #EBF2FF 0%, #D6E4FF 100%)' }}>
                                <span className="text-4xl">👨‍⚕️</span>
                            </div>
                            <h2 className="text-xl font-bold mb-2" style={{ color: '#1F2937' }}>Amrutha.AI</h2>
                            <p className="text-sm mb-8" style={{ color: '#6B7280' }}>{CHOOSE[lang]}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                                {SCENARIOS.map(sc => (
                                    <button key={sc.id} onClick={() => handlePickScenario(sc)} className="flex items-center gap-3 p-4 rounded-xl text-left cursor-pointer" style={{ background: '#FFFFFF', border: '2px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D6CDF'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(45,108,223,0.15)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
                                        <span className="text-2xl">{sc.icon}</span>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: '#1F2937' }}>{sc.label[lang]}</p>
                                            <p className="text-xs" style={{ color: '#9CA3AF' }}>{sc.doctor} • {sc.specialist}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-5">
                            {messages.map((msg, i) => (
                                msg.role === 'user' ? (
                                    /* ─── User Bubble ─── */
                                    <div key={i} className="flex justify-end gap-2">
                                        <div className="max-w-[85%]">
                                            <div className="rounded-2xl px-5 py-3.5" style={{ background: '#EBF2FF', color: '#1F2937', borderBottomRightRadius: 4 }}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                            </div>
                                            <p className="text-right text-xs mt-1" style={{ color: '#9CA3AF' }}>Sent {msg.time}</p>
                                        </div>
                                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: '#D1D5DB' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#6B7280"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        </div>
                                    </div>
                                ) : (
                                    /* ─── AI Bubble ─── */
                                    <div key={i} className="flex gap-2">
                                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6CDF, #4A90E2)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" /></svg>
                                        </div>
                                        <div className="max-w-[85%]">
                                            <div className="rounded-2xl px-5 py-3.5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderBottomLeftRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>{msg.text}</p>
                                            </div>
                                            {/* Referral Card */}
                                            {msg.referral && (
                                                <div className="mt-3 rounded-2xl px-5 py-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: '#DCFCE7', color: '#15803D' }}>{PRIORITY[lang]}</span>
                                                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(45,108,223,0.08)' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#2D6CDF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                                        </div>
                                                    </div>
                                                    <p className="font-bold text-sm mb-0.5" style={{ color: '#1F2937' }}>{msg.referral.type}</p>
                                                    <p className="text-xs mb-3" style={{ color: '#6B7280' }}>{msg.referral.spec}</p>
                                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                                        <p className="text-xs flex items-center gap-1" style={{ color: '#6B7280' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none" /></svg>
                                                            {SLOT_LABEL[lang]} {msg.referral.slot}
                                                        </p>
                                                        <button className="px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: '#EF4444', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}>
                                                            {PROCEED_BTN[lang]} →
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Amrutha.AI • {msg.time}</p>
                                        </div>
                                    </div>
                                )
                            ))}

                            {/* Typing indicator */}
                            {typing && (
                                <div className="flex gap-2">
                                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6CDF, #4A90E2)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" /></svg>
                                    </div>
                                    <div className="rounded-2xl px-5 py-3.5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                                        <div className="flex gap-1.5 items-center">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                {/* Bottom Input Bar */}
                <div className="border-t px-4 md:px-8 py-3" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: '#F3F4F6', border: '1.5px solid #E5E7EB' }}>
                            <input type="text" readOnly placeholder={PLACEHOLDER[lang]} className="flex-1 bg-transparent outline-none text-sm" style={{ color: '#6B7280' }} />
                            <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 17.3a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                            </button>
                            <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                            </button>
                            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6CDF, #4A90E2)', boxShadow: '0 2px 8px rgba(45,108,223,0.35)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                            </button>
                        </div>
                        {/* Quick Actions */}
                        {selectedScenario && (
                            <div className="flex gap-3 mt-2 justify-center">
                                <button className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
                                    📄 {lang === 'Hindi' ? 'लैब रिपोर्ट अपलोड करें' : lang === 'Kannada' ? 'ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'UPLOAD LAB REPORTS'}
                                </button>
                                <button className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
                                    ✨ {lang === 'Hindi' ? 'गंभीर दर्द की रिपोर्ट करें' : lang === 'Kannada' ? 'ತೀವ್ರ ನೋವು ವರದಿ ಮಾಡಿ' : 'REPORT ACUTE PAIN'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIDoctorPage;
