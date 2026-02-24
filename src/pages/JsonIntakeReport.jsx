import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const val = (v) => v || 'N/A';

const VOICE_GREETING =
    'Please review your consultation details carefully. If everything looks correct, click confirm to generate your medical report.';

async function playTTSGreeting(language) {
    try {
        const res = await fetch(`${API_URL}/api/v1/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: VOICE_GREETING, language: language || 'English' }),
        });
        if (!res.ok) return;
        const { audio_base64 } = await res.json();
        const audio = new Audio(`data:audio/mp3;base64,${audio_base64}`);
        audio.play().catch(() => { });
    } catch {
        /* silent */
    }
}

// ── Icons ────────────────────────────────────────────────────────────────────
const IconUser = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const IconClock = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconStar = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);
const IconShield = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const IconArrow = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
const IconEdit = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const IconEmail = () => (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const IconDoctor = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const IconCalendar = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// ── Small components ─────────────────────────────────────────────────────────
const SectionLabel = ({ roman, title }) => (
    <div className="flex items-center gap-2.5 mb-5">
        <span className="text-[10px] font-extrabold tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            {roman}
        </span>
        <h3 className="text-xs font-extrabold tracking-[0.15em] text-slate-500 uppercase">{title}</h3>
        <div className="flex-1 h-px bg-slate-100" />
    </div>
);

const InfoCard = ({ label, value, icon }) => (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        {icon && <div className="text-blue-400 mb-2">{icon}</div>}
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-800 leading-snug">{val(value)}</p>
    </div>
);

const ClinicalRow = ({ label, value }) => (
    <div className="flex items-start gap-4 py-3 border-b border-slate-100 last:border-0">
        <span className="w-44 flex-shrink-0 text-[10px] font-bold tracking-widest text-slate-400 uppercase pt-0.5">
            {label}
        </span>
        <span className="text-sm text-slate-700 font-medium leading-relaxed">{val(value)}</span>
    </div>
);

const UrgencyBadge = ({ urgency }) => {
    const config = {
        High: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', label: '● HIGH PRIORITY' },
        Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', label: '● MEDIUM PRIORITY' },
    };
    const c = config[urgency] || { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: '● STANDARD' };
    return (
        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider border ${c.bg} ${c.border} ${c.text}`}>
            {c.label}
        </span>
    );
};

// ── No Report Fallback ────────────────────────────────────────────────────────
const NoReport = ({ navigate }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FBFF] p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-slate-200">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Report Data Found</h2>
            <p className="text-slate-500 text-sm mb-6">Please complete the intake assessment first.</p>
            <button
                onClick={() => navigate('/details')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all"
            >
                Start Assessment
            </button>
        </div>
    </div>
);

const CONFIRMATION_VOICE = "Your appointment is confirmed. Your medical report has been generated and sent to your email. Please check your inbox for complete details.";

async function playConfirmationTTS(language) {
    try {
        const res = await fetch(`${API_URL}/api/v1/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: CONFIRMATION_VOICE, language: language || 'English' }),
        });
        if (!res.ok) return;
        const { audio_base64 } = await res.json();
        const audio = new Audio(`data:audio/mp3;base64,${audio_base64}`);
        audio.play().catch(() => { });
    } catch { /* silent */ }
}

// ── Appointment Confirmed ─────────────────────────────────────────────────────
const AppointmentConfirmed = ({ details, patientData, navigate }) => {
    const [visible, setVisible] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const voicePlayed = useRef(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!voicePlayed.current) {
            voicePlayed.current = true;
            setSpeaking(true);
            playConfirmationTTS(patientData?.language || 'English').finally(() => setSpeaking(false));
        }
    }, []);

    const handleDownload = () => window.print();

    const apptId = details?.appointment_id || `#AMD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const doctorName = details?.doctor_specialist || patientData?.assigned_doctor || 'Dr. Arun Kumar';
    const apptTime = details?.appointment_time || patientData?.selected_slot || 'To be confirmed';
    const consultType = details?.consultation_type || 'Online Consultation';

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#F8FBFF' }}>

            {/* ── HEADER ── */}
            <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-extrabold text-sm text-slate-900 leading-none">Amrutha AI</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Health Intelligence</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Step 3 of 3 – Confirmed
                    </span>
                    {/* Avatar glow when speaking */}
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
                            boxShadow: speaking ? '0 0 0 4px rgba(59,130,246,0.3), 0 0 16px rgba(59,130,246,0.4)' : undefined,
                        }}
                    >
                        {patientData?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                </div>
            </header>

            {/* ── BODY ── */}
            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <div
                    className="w-full max-w-xl"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(24px)',
                        transition: 'opacity 0.55s ease, transform 0.55s ease',
                    }}
                >
                    {/* Main Card */}
                    <div className="bg-white rounded-[20px] shadow-xl border border-slate-200 overflow-hidden">

                        {/* ── TOP HERO ── */}
                        <div className="bg-gradient-to-b from-emerald-50 to-white px-8 pb-6 pt-10 text-center border-b border-slate-100">
                            {/* Animated check icon */}
                            <div className="relative inline-flex items-center justify-center mb-5">
                                <div className="absolute w-24 h-24 bg-emerald-100 rounded-full animate-ping opacity-20" />
                                <div className="absolute w-20 h-20 bg-emerald-100 rounded-full opacity-40" />
                                <div className="relative w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                                Appointment Confirmed! 🎉
                            </h1>
                            <p className="text-sm text-slate-500 mb-4">
                                Your health consultation has been successfully scheduled.
                            </p>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-bold tracking-wider shadow-sm shadow-emerald-200">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                Confirmed &amp; Active
                            </span>
                        </div>

                        {/* ── APPOINTMENT DETAILS ── */}
                        <div className="px-8 py-6 border-b border-slate-100">
                            <p className="text-[10px] font-extrabold tracking-[0.17em] text-slate-400 uppercase mb-4">Appointment Details</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: 'Appointment ID', value: apptId, accent: true },
                                    { label: 'Appointment Type', value: consultType },
                                    { label: 'Doctor / Specialist', value: doctorName },
                                    { label: 'Doctor Expertise', value: details?.expertise || patientData?.doctor_specialty || 'General Medicine' },
                                    { label: 'Date & Time', value: apptTime, full: true },
                                ].map(({ label, value, accent, full }) => (
                                    <div
                                        key={label}
                                        className={`bg-slate-50 border border-slate-100 rounded-xl p-4 ${full ? 'sm:col-span-2' : ''}`}
                                    >
                                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">{label}</p>
                                        <p className={`text-sm font-bold ${accent ? 'text-blue-600' : 'text-slate-800'}`}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── EMAIL NOTE ── */}
                        <div className="px-8 py-5 border-b border-slate-100">
                            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        Your medical report and appointment details have been sent to your registered email address.
                                    </p>
                                    {patientData?.email && (
                                        <p className="text-sm font-bold text-blue-900 mt-1">{patientData.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── ACTIONS ── */}
                        <div className="px-8 py-6 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)' }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Confirmation
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Confirmation
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-[11px] text-slate-400 mt-5">
                        This is a digitally generated health summary for informational purposes. In case of emergency, please visit the nearest hospital.
                    </p>
                </div>
            </main>

            <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping { animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const JsonIntakeReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { report, collectedData } = location.state || {};

    const [bookingLoading, setBookingLoading] = useState(false);
    const [appointmentBooked, setAppointmentBooked] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [visible, setVisible] = useState(false);
    const greetingPlayed = useRef(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!greetingPlayed.current && report) {
            greetingPlayed.current = true;
            const lang = (report.patient_data || collectedData)?.language || 'English';
            playTTSGreeting(lang);
        }
    }, [report]);

    const handleBookAppointment = async () => {
        setBookingLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/v1/json-appointment`, {
                patient_data: report.patient_data || collectedData,
                medical_analysis: report.medical_analysis,
            });
            if (response.data.success) {
                setAppointmentDetails(response.data.appointment_details);
                setAppointmentBooked(true);
            }
        } catch (error) {
            console.error('Appointment booking error:', error);
            alert('Failed to book appointment. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (!report || !collectedData) return <NoReport navigate={navigate} />;

    const llm = report.medical_analysis || {};
    const patientData = report.patient_data || collectedData;
    const urgency = llm.doctor_recommendation?.consultation_priority || llm.doctor_recommendation?.urgency;
    const isHighPriority = urgency === 'High' || urgency === 'Emergency';
    const doctorName = patientData?.assigned_doctor || llm.doctor_recommendation?.specialist_type || 'General Physician';
    const selectedSlot = patientData?.selected_slot || 'To be assigned';

    if (appointmentBooked && appointmentDetails) {
        return <AppointmentConfirmed details={appointmentDetails} patientData={patientData} navigate={navigate} />;
    }

    return (
        <div className="min-h-screen" style={{ background: '#F8FBFF' }}>

            {/* ── HEADER ── */}
            <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-3 flex items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-[160px]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-extrabold text-sm text-slate-900 leading-none">Amrutha AI</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Health Intelligence</p>
                    </div>
                </div>

                <div className="flex-1 flex justify-center">
                    <span className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        Report Preview – Step 2 of 3
                    </span>
                </div>

                <div className="min-w-[160px] flex justify-end items-center gap-2">
                    <span className="text-xs text-slate-400 hidden md:block">{patientData?.name}</span>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">
                        {patientData?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                </div>
            </header>

            {/* ── MAIN ── */}
            <main
                className="max-w-4xl mx-auto px-4 py-8"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.55s ease, transform 0.55s ease',
                }}
            >

                {/* ── TITLE SECTION ── */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-[28px] font-extrabold text-slate-900 mb-2 tracking-tight">
                        Appointment Consultation Report
                    </h1>
                    <p className="text-sm text-slate-500 mb-4 max-w-xl mx-auto">
                        Please verify the information below before we proceed to generate your final medical report.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold tracking-wider">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        CONSULTATION STATUS: PRELIMINARY ANALYSIS COMPLETE
                    </span>
                </div>

                {/* ── DOCTOR + APPOINTMENT HERO CARD ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-5">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                                <IconDoctor />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-blue-100 uppercase">Assigned Specialist</p>
                                <p className="text-base font-extrabold text-white">{doctorName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold tracking-widest text-blue-100 uppercase">Consultation Fee</p>
                            <p className="text-lg font-extrabold text-white">₹ 500</p>
                        </div>
                    </div>
                    <div className="px-6 py-4 flex flex-wrap items-center gap-6 bg-white">
                        <div className="flex items-center gap-2 text-slate-600">
                            <div className="text-blue-400"><IconCalendar /></div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Appt. Slot</p>
                                <p className="text-sm font-bold text-slate-800">{selectedSlot}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <div className="text-blue-400"><IconShield /></div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Priority</p>
                                <UrgencyBadge urgency={urgency} />
                            </div>
                        </div>
                        <div className="ml-auto">
                            {isHighPriority && (
                                <span className="px-3 py-1.5 bg-red-100 border border-red-200 text-red-700 rounded-full text-[11px] font-bold tracking-wider animate-pulse">
                                    ⚠ URGENT ATTENTION REQUIRED
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── MAIN CARD ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-5">

                    {/* Section I – Patient Information */}
                    <div className="p-6 md:p-8 border-b border-slate-100">
                        <SectionLabel roman="I." title="Patient Information" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <InfoCard label="Patient Name" value={patientData?.name} />
                            <InfoCard label="Age / DOB" value={patientData?.dob || patientData?.age} />
                            <InfoCard label="Gender" value={patientData?.gender} />
                            <InfoCard label="Blood Group" value={patientData?.blood_group} />
                        </div>
                        {(patientData?.email || patientData?.phone) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                <InfoCard label="Email" value={patientData?.email} />
                                <InfoCard label="Phone" value={patientData?.phone} />
                                <InfoCard label="Weight" value={patientData?.weight ? `${patientData.weight} kg` : null} />
                                <InfoCard label="Location" value={patientData?.location} />
                            </div>
                        )}
                    </div>

                    {/* Section II – Clinical Observations */}
                    <div className="p-6 md:p-8 border-b border-slate-100">
                        <SectionLabel roman="II." title="Clinical Observations" />
                        <div className="bg-slate-50 rounded-xl border border-slate-200 px-5">
                            <ClinicalRow label="Primary Symptom" value={patientData?.symptoms} />
                            <ClinicalRow label="Clinical Duration" value={patientData?.symptom_duration || patientData?.duration} />
                            <ClinicalRow
                                label="Associated Conditions"
                                value={[patientData?.bp_history && `BP: ${patientData.bp_history}`, patientData?.sugar_history && `Diabetes: ${patientData.sugar_history}`].filter(Boolean).join(' · ') || patientData?.chronic_diseases}
                            />
                            <ClinicalRow label="Past Surgeries" value={patientData?.surgeries} />
                            {patientData?.medications && (
                                <ClinicalRow label="Current Medications" value={patientData.medications} />
                            )}
                        </div>
                    </div>

                    {/* Section III – Report Preferences */}
                    <div className="p-6 md:p-8 border-b border-slate-100">
                        <SectionLabel roman="III." title="Report Preferences" />
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="text-blue-400"><IconUser /></div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">Language Output</p>
                                    <p className="text-sm font-bold text-slate-800">{val(patientData?.language)}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="text-blue-400"><IconClock /></div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">Priority Status</p>
                                    <UrgencyBadge urgency={urgency} />
                                </div>
                            </div>
                            {llm.doctor_recommendation?.specialist_type && (
                                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
                                    <div className="text-blue-400"><IconStar /></div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">Recommended Specialist</p>
                                        <p className="text-sm font-bold text-slate-800">{llm.doctor_recommendation.specialist_type}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Preliminary Observation */}
                    {(llm.patient_summary || llm.explanation) && (
                        <div className="p-6 md:p-8">
                            <SectionLabel roman="IV." title="AI Preliminary Observation" />
                            <div className="flex items-start gap-4 bg-blue-50 border border-blue-100 rounded-xl p-5">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <div className="text-white"><IconStar /></div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wider">Clinical Insight by Amrutha AI</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        {llm.patient_summary || llm.explanation}
                                    </p>
                                    {llm.possible_conditions?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {llm.possible_conditions.map((c, i) => (
                                                <span key={i} className="text-[11px] bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── ADDITIONAL SECTIONS ── */}
                <div className="space-y-4 mb-6">

                    {/* Recommended Tests */}
                    {(llm.suggested_tests || llm.recommended_tests) && (() => {
                        const tests = llm.suggested_tests || llm.recommended_tests;
                        const allTests = [
                            ...(tests.blood_tests || []),
                            ...(tests.basic_tests || []),
                            ...(tests.imaging || []),
                            ...(tests.special_tests || []),
                            ...(tests.additional_tests || []),
                        ];
                        if (allTests.length === 0) return null;
                        return (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <SectionLabel roman="V." title="Recommended Tests" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {allTests.map((t, i) => (
                                        <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-blue-600 text-[10px] font-bold">{i + 1}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{t.test_name}</p>
                                                {t.reason && <p className="text-xs text-slate-500 mt-0.5">{t.reason}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Lifestyle + Precautions */}
                    {(llm.lifestyle_recommendations?.length > 0 || llm.precautions?.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {llm.lifestyle_recommendations?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <SectionLabel roman="VI." title="Lifestyle Recommendations" />
                                    <ul className="space-y-2">
                                        {llm.lifestyle_recommendations.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                                    ✓
                                                </span>
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {llm.precautions?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <SectionLabel roman="VII." title="Precautions" />
                                    <ul className="space-y-2">
                                        {llm.precautions.map((p, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                                    !
                                                </span>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Emergency Signs */}
                    {llm.emergency_signs?.length > 0 && (
                        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                            <SectionLabel roman="⚠" title="Emergency Warning Signs" />
                            <p className="text-xs text-red-500 mb-4 font-medium">Seek immediate medical attention if you experience any of the following:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {llm.emergency_signs.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2.5 bg-white border border-red-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium">
                                        <span className="text-red-500 font-bold">⚠</span>
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-5">
                    <button
                        onClick={() => navigate('/details')}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm bg-white hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <IconEdit />
                        Edit Details
                    </button>
                    <button
                        onClick={handleBookAppointment}
                        disabled={bookingLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                        style={{
                            background: bookingLoading
                                ? '#93C5FD'
                                : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)',
                        }}
                    >
                        {bookingLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating Report...
                            </>
                        ) : (
                            <>
                                Confirm &amp; Generate Report
                                <IconArrow />
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center text-[11px] text-slate-400 pb-10">
                    By proceeding, you confirm that this AI-generated summary is based on your provided information and is intended for preliminary clinical support only. This is not a substitute for professional medical advice.
                </p>
            </main>

            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default JsonIntakeReport;
