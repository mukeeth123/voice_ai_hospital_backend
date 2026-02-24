import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import AmruthaLogo from '../components/AmruthaLogo';

// ── Constants ──────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const LANGUAGES = [
    {
        key: 'English',
        label: 'English',
        script: 'A',
        flag: '🇬🇧',
        greeting: "Thank you for selecting English. I will assist you throughout your consultation.",
        badge: 'Full Voice Support',
        preview: "Hello, I will assist you today.",
    },
    {
        key: 'Hindi',
        label: 'Hindi',
        script: 'अ',
        flag: '🇮🇳',
        greeting: "आपने हिंदी चुनी है। मैं आपकी पूरी प्रक्रिया में सहायता करूंगी।",
        badge: 'Full Voice Support',
        preview: "नमस्ते, मैं आज आपकी सहायता करूंगी।",
    },
    {
        key: 'Kannada',
        label: 'Kannada',
        script: 'ಕ',
        flag: '🇮🇳',
        greeting: "ನೀವು ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಿಕೊಂಡಿದ್ದೀರಿ. ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಸಲಹೆಯಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
        badge: 'Full Voice Support',
        preview: "ನಮಸ್ಕಾರ, ನಾನು ಇಂದು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    },
];

// ── TTS Helper ─────────────────────────────────────────────────────────────
async function fetchTTS(text, language) {
    const res = await fetch(`${API_URL}/api/v1/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
    });
    if (!res.ok) throw new Error('TTS request failed');
    const data = await res.json();
    return data.audio_base64;
}

function playBase64Audio(base64) {
    const audio = new Audio(`data:audio/mp3;base64,${base64}`);
    audio.play().catch(() => { });
    return audio;
}

// ── Component ──────────────────────────────────────────────────────────────
const LanguageSelection = () => {
    const { setPatientData } = useHospital();
    const navigate = useNavigate();

    const [selected, setSelected] = useState('English');
    const [previewLoading, setPreviewLoading] = useState(null); // language key
    const [greetingLoading, setGreetingLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const currentAudioRef = useRef(null);

    // Fade-in on mount
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const stopCurrentAudio = () => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }
    };

    // Handle card selection + play greeting
    const handleSelect = async (lang) => {
        if (selected === lang.key) return;
        stopCurrentAudio();
        setSelected(lang.key);
        setGreetingLoading(true);
        try {
            const b64 = await fetchTTS(lang.greeting, lang.key);
            stopCurrentAudio();
            currentAudioRef.current = playBase64Audio(b64);
        } catch {
            // silent fail — selection still works
        } finally {
            setGreetingLoading(false);
        }
    };

    // Preview voice sample
    const handlePreview = async (e, lang) => {
        e.stopPropagation();
        stopCurrentAudio();
        setPreviewLoading(lang.key);
        try {
            const b64 = await fetchTTS(lang.preview, lang.key);
            stopCurrentAudio();
            currentAudioRef.current = playBase64Audio(b64);
        } catch {
            // silent fail
        } finally {
            setPreviewLoading(null);
        }
    };

    // Continue
    const handleContinue = () => {
        stopCurrentAudio();
        setPatientData(prev => ({ ...prev, language: selected }));
        navigate('/details');
    };

    const selectedLang = LANGUAGES.find(l => l.key === selected);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: 'linear-gradient(135deg, #EAF4FF 0%, #F8FBFF 60%, #EEF3FF 100%)' }}
        >
            {/* Ambient glow */}
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse, rgba(45,108,223,0.10) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    zIndex: 0,
                }}
            />

            {/* ── Header ── */}
            <header
                className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4"
                style={{ borderBottom: '1px solid rgba(45,108,223,0.10)' }}
            >
                <div className="flex items-center gap-3">
                    <AmruthaLogo size={30} textSize="text-base" />
                </div>
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: 'rgba(45,108,223,0.08)', border: '1.5px solid rgba(45,108,223,0.15)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#2D6CDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main
                className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(18px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
            >
                {/* Hero */}
                <div className="text-center mb-10 max-w-xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#1F2937' }}>
                        Choose Your{' '}
                        <span style={{ color: '#2D6CDF' }}>Consultation Language</span>
                    </h1>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: '#6B7280' }}>
                        Select the language you are most comfortable speaking.
                        Our AI nurse will guide you throughout your consultation.
                    </p>
                </div>

                {/* Language Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-10">
                    {LANGUAGES.map((lang) => {
                        const isSelected = selected === lang.key;
                        const isPreviewing = previewLoading === lang.key;
                        return (
                            <button
                                key={lang.key}
                                onClick={() => handleSelect(lang)}
                                className="relative flex flex-col items-center text-center p-7 rounded-2xl outline-none cursor-pointer"
                                style={{
                                    background: isSelected
                                        ? 'linear-gradient(135deg, #EBF2FF 0%, #F0F6FF 100%)'
                                        : '#FFFFFF',
                                    border: isSelected
                                        ? '2px solid #2D6CDF'
                                        : '2px solid #E5E7EB',
                                    boxShadow: isSelected
                                        ? '0 8px 30px rgba(45,108,223,0.18)'
                                        : '0 2px 12px rgba(0,0,0,0.06)',
                                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                }}
                                onMouseEnter={e => {
                                    if (!isSelected) e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={e => {
                                    if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                {/* Selected checkmark */}
                                {isSelected && (
                                    <div
                                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{ background: '#2D6CDF' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}

                                {/* Language Script Icon */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl font-bold"
                                    style={{
                                        background: isSelected
                                            ? 'rgba(45,108,223,0.12)'
                                            : 'rgba(45,108,223,0.06)',
                                        color: '#2D6CDF',
                                        transition: 'background 0.25s',
                                    }}
                                >
                                    {lang.script}
                                </div>

                                {/* Language Name */}
                                <p className="font-bold text-base mb-2" style={{ color: '#1F2937' }}>
                                    {lang.flag} {lang.label}
                                </p>

                                {/* Badge */}
                                <span
                                    className="text-xs font-semibold px-3 py-1 rounded-full mb-4"
                                    style={{
                                        background: isSelected ? 'rgba(45,108,223,0.12)' : '#F3F4F6',
                                        color: isSelected ? '#2D6CDF' : '#6B7280',
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    {lang.badge}
                                </span>

                                {/* Preview Voice Button */}
                                <button
                                    onClick={(e) => handlePreview(e, lang)}
                                    disabled={isPreviewing}
                                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                                    style={{
                                        border: '1.5px solid rgba(45,108,223,0.3)',
                                        color: '#2D6CDF',
                                        background: 'transparent',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,108,223,0.06)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {isPreviewing ? (
                                        <>
                                            <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block" />
                                            Playing...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                            </svg>
                                            Preview Voice
                                        </>
                                    )}
                                </button>
                            </button>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <div className="w-full max-w-sm flex flex-col items-center gap-4">
                    <button
                        onClick={handleContinue}
                        disabled={greetingLoading}
                        className="w-full py-4 rounded-full font-bold text-base text-white transition-all duration-200 flex items-center justify-center gap-2"
                        style={{
                            background: 'linear-gradient(135deg, #2D6CDF 0%, #4A90E2 100%)',
                            boxShadow: '0 6px 20px rgba(45,108,223,0.35)',
                            opacity: greetingLoading ? 0.75 : 1,
                        }}
                        onMouseEnter={e => { if (!greetingLoading) e.currentTarget.style.boxShadow = '0 8px 28px rgba(45,108,223,0.5)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,108,223,0.35)'; }}
                    >
                        {greetingLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Loading voice...
                            </>
                        ) : (
                            <>
                                Continue in {selected}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>

                    <p className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2D6CDF' }}>
                            <circle cx="12" cy="12" r="10" fill="rgba(45,108,223,0.15)" />
                            <path d="M12 8v4M12 16h.01" stroke="#2D6CDF" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        You can change your language settings anytime during the session.
                    </p>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="relative z-10 text-center py-4">
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    © 2025 Amrutha AI Healthcare. Secure and Encrypted Consultation.
                </p>
            </footer>
        </div>
    );
};

export default LanguageSelection;
