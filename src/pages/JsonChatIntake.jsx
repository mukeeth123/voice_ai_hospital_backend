import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../components/Avatar';
import { useHospital } from '../context/HospitalContext';
import AmruthaLogo from '../components/AmruthaLogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Sidebar Status Pill ────────────────────────────────────────────────────
const StatusPill = ({ label, icon, active }) => (
    <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${active
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
            : 'bg-gray-100 text-gray-500'
            }`}
    >
        <span>{icon}</span>
        {label}
    </span>
);

// ── Consultation Fee Card ──────────────────────────────────────────────────
const FeeCard = ({ onPay }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 my-2 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-base shadow">
                ₹
            </div>
            <div>
                <p className="font-bold text-gray-800 text-sm">Consultation Fee</p>
                <p className="text-xs text-gray-500">Secure immediate specialist review</p>
            </div>
            <div className="ml-auto opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
            </div>
        </div>
        <div className="mb-4">
            <span className="text-3xl font-extrabold text-gray-900">₹499</span>
            <span className="text-sm text-gray-400 line-through ml-2">₹999</span>
        </div>
        <button
            onClick={onPay}
            className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
        >
            Pay & Continue Consultation →
        </button>
    </div>
);

// ── Chat Bubble ────────────────────────────────────────────────────────────
const ChatBubble = ({ msg, onPay }) => {
    const isUser = msg.role === 'user';
    const isPayment = msg.type === 'payment';

    if (isPayment) {
        return (
            <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs">🤖</span>
                    </div>
                    <FeeCard onPay={onPay} />
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            {!isUser && (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                    <span className="text-xs">🤖</span>
                </div>
            )}
            <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.isError
                            ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}
                >
                    {msg.content}
                </div>
                {msg.timestamp && (
                    <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                )}
            </div>
            {isUser && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1 ml-2">
                    <span className="text-xs text-white">👤</span>
                </div>
            )}
        </div>
    );
};

// ── Thinking Indicator ─────────────────────────────────────────────────────
const ThinkingIndicator = () => (
    <div className="flex items-center gap-2 px-4 py-2 animate-fadeIn">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs">🤖</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm italic">
            <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            processing...
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const JsonChatIntake = () => {
    const { patientData } = useHospital();
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [collectedData, setCollectedData] = useState({ language: patientData?.language || 'English' });
    const [currentField, setCurrentField] = useState({ key: null, type: 'text', options: null });
    const [error, setError] = useState(null);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [activeTab, setActiveTab] = useState('Consultation');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const initialBackendCalled = useRef(false);

    const tabs = ['Consultation', 'History', 'Profile', 'AI Doctor'];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (!initialBackendCalled.current) {
            initialBackendCalled.current = true;
            handleBackendInteraction('', null);
        }
    }, []);

    // ── Backend Logic (unchanged) ──────────────────────────────────────────
    const handleBackendInteraction = async (input, lastKey) => {
        try {
            setLoading(true);
            setError(null);
            const payload = {
                collected_data: collectedData,
                latest_input: input,
                last_field_key: lastKey
            };
            const response = await axios.post(`${API_URL}/api/v1/json-intake`, payload);
            const data = response.data;

            if (data.error_message) {
                setError(data.error_message);
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: data.question,
                    isError: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                if (data.tts_audio_base64) setCurrentAudio(data.tts_audio_base64);
                return;
            }

            if (lastKey) {
                setCollectedData(prev => ({ ...prev, [lastKey]: input }));
            }

            // Check if this is a payment step
            if (data.expected_type === 'payment') {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: data.question,
                    type: 'payment',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: data.question,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }

            if (data.tts_audio_base64) setCurrentAudio(data.tts_audio_base64);

            if (data.is_complete) {
                setTimeout(() => {
                    navigate('/json-report', { state: { report: data.report, collectedData } });
                }, 3000);
            } else {
                setCurrentField({
                    key: data.field_key,
                    type: data.expected_type,
                    options: data.options
                });
            }
        } catch (err) {
            console.error(err);
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => {
        if (!userInput.trim() || loading) return;
        const msg = userInput.trim();
        setUserInput('');
        setMessages(prev => [...prev, {
            role: 'user',
            content: msg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        handleBackendInteraction(msg, currentField.key);
    };

    const handleOptionClick = (opt) => {
        if (loading) return;
        setMessages(prev => [...prev, {
            role: 'user',
            content: opt,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        handleBackendInteraction(opt, currentField.key);
    };

    const handlePayment = () => {
        const msg = 'Paid';
        setMessages(prev => [...prev, {
            role: 'user',
            content: '💳 Payment Confirmed',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        handleBackendInteraction(msg, currentField.key);
    };

    // ── Input Area ─────────────────────────────────────────────────────────
    const renderInputArea = () => {
        if (loading) return null;

        if ((currentField.type === 'options' || currentField.type === 'choice') && currentField.options) {
            return (
                <div className="flex flex-wrap gap-2 px-4 pb-3">
                    {currentField.options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="px-4 py-2 rounded-full text-sm font-medium border border-blue-300 text-blue-600 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 hover:shadow-md"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            );
        }

        if (currentField.type === 'payment') {
            return null; // Fee card is rendered inline in chat
        }

        return null; // Text input is always shown in the bottom bar
    };

    const isTextInput = !loading && currentField.type !== 'options' && currentField.type !== 'payment';

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

            {/* ── TOP NAV ── */}
            <nav className="bg-white border-b border-gray-200 flex items-center px-4 md:px-8 h-14 flex-shrink-0 z-20">
                {/* Left: Logo + mobile menu */}
                <div className="flex items-center gap-3 min-w-[160px]">
                    <button
                        className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setSidebarOpen(o => !o)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <AmruthaLogo size={28} textSize="text-sm" />
                </div>

                {/* Center: Tabs */}
                <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => {
                                    if (tab === 'AI Doctor') {
                                        navigate('/ai-doctor');
                                    } else {
                                        setActiveTab(tab);
                                    }
                                }}
                                className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab
                                    ? 'text-blue-600'
                                    : tab === 'AI Doctor'
                                        ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                {tab === 'AI Doctor' && <span className="mr-1">🩺</span>}
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Icons */}
                <div className="flex items-center gap-2 min-w-[80px] justify-end">
                    <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {patientData?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                </div>
            </nav>

            {/* ── BODY ── */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ── LEFT SIDEBAR ── */}
                <aside
                    className={`
                        fixed md:relative z-40 md:z-auto
                        top-14 md:top-auto bottom-0 md:bottom-auto
                        left-0 w-64 md:w-72
                        bg-white border-r border-gray-200
                        flex flex-col items-center py-8 px-5
                        transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                        overflow-y-auto
                    `}
                >
                    {/* Doctor Avatar */}
                    <div className="relative mb-5">
                        <div
                            className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl"
                            style={{ boxShadow: '0 0 0 4px rgba(45,108,223,0.15), 0 8px 24px rgba(0,0,0,0.12)' }}
                        >
                            <Avatar audioBase64={currentAudio} compact />
                        </div>
                        {/* Online indicator */}
                        <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow" />
                    </div>

                    {/* Label */}
                    <p className="text-[10px] font-bold tracking-widest text-blue-500 uppercase mb-1">
                        AI Appointment & Onboarding Assistant
                    </p>

                    {/* Name */}
                    <h2 className="text-xl font-extrabold text-gray-900 mb-2 text-center">
                        Amrutha.AI
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xs text-gray-500 text-center leading-relaxed mb-6 px-2">
                        Your secure AI assistant for preliminary medical screening and management.
                    </p>

                    {/* Status Pills */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        <StatusPill label="Listening" icon="🎙️" active={!loading && currentField.type !== 'payment'} />
                        <StatusPill label="Thinking" icon="🧠" active={loading} />
                        <StatusPill label="Speaking" icon="🔊" active={!!currentAudio} />
                    </div>

                    {/* Replay Voice */}
                    <button
                        onClick={() => {
                            if (currentAudio) {
                                const audio = new Audio(`data:audio/mp3;base64,${currentAudio}`);
                                audio.play().catch(() => { });
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Replay Voice
                    </button>

                    {/* Language badge */}
                    <div className="mt-auto pt-8">
                        <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
                            🌐 {patientData?.language || 'English'}
                        </span>
                    </div>
                </aside>

                {/* ── MAIN CHAT AREA ── */}
                <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
                        {messages.map((msg, idx) => (
                            <ChatBubble key={idx} msg={msg} onPay={handlePayment} />
                        ))}

                        {/* Thinking indicator */}
                        {loading && <ThinkingIndicator />}

                        {/* Suggestion chips (options) — shown inline after last AI message */}
                        {!loading && (currentField.type === 'options' || currentField.type === 'choice') && currentField.options && (
                            <div className="flex flex-wrap gap-2 pl-9 animate-fadeIn">
                                {currentField.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleOptionClick(opt)}
                                        className="px-4 py-2 rounded-full text-sm font-medium border border-blue-300 text-blue-600 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 hover:shadow-md active:scale-95"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mx-4 md:mx-8 mb-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center">
                            {error}
                        </div>
                    )}

                    {/* ── BOTTOM INPUT BAR ── */}
                    <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 md:px-8 py-4">
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all duration-200">
                            {/* + icon */}
                            <button className="w-7 h-7 rounded-full bg-gray-200 hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>

                            {/* Input */}
                            <input
                                type={currentField.type === 'date' ? 'date' : currentField.type === 'number' ? 'number' : 'text'}
                                value={userInput}
                                onChange={e => setUserInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && isTextInput && handleSend()}
                                placeholder={
                                    loading
                                        ? 'Amrutha.AI is thinking...'
                                        : currentField.type === 'options'
                                            ? 'Select an option above...'
                                            : currentField.type === 'payment'
                                                ? 'Complete payment above...'
                                                : 'Type your symptoms or health query...'
                                }
                                disabled={!isTextInput}
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
                            />

                            {/* Send button */}
                            <button
                                onClick={handleSend}
                                disabled={!isTextInput || !userInput.trim()}
                                className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-gray-400 mt-2">
                            Amrutha AI can make mistakes. Verify important medical info.
                        </p>
                    </div>
                </main>
            </div>

            {/* Fade-in animation */}
            <style>{`
@keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
}
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease forwards;
                }
`}</style>
        </div>
    );
};

export default JsonChatIntake;
