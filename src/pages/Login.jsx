import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import AmruthaLogo from '../components/AmruthaLogo';

const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setPatientData } = useHospital();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setPatientData(prev => ({ ...prev, name, email }));
        navigate('/language');
    };

    const fillDemoData = () => {
        setName('John Doe');
        setEmail('john.doe@example.com');
        setPassword('password123');
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">

            {/* ── LEFT BRANDING SECTION ── */}
            <div
                className="md:w-1/2 flex flex-col justify-between p-10 md:p-16 min-h-[340px] md:min-h-screen"
                style={{ background: 'linear-gradient(135deg, #EAF4FF 0%, #F0F6FF 50%, #E8F0FE 100%)' }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <AmruthaLogo size={36} textSize="text-lg" />
                </div>

                {/* Main Hero Content */}
                <div className="mt-12 md:mt-0 flex-1 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: '#1F2937' }}>
                        Your Voice,<br />
                        <span style={{ color: '#2D6CDF' }}>Your Health</span>
                    </h1>
                    <p className="text-base md:text-lg leading-relaxed mb-10" style={{ color: '#4B5563', maxWidth: '420px' }}>
                        The intelligent voice agent for instant medical intake and appointment booking. Experience the future of healthcare interaction.
                    </p>

                    {/* Feature Bullets */}
                    <div className="space-y-6">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                style={{ background: 'rgba(45,108,223,0.12)' }}
                            >
                                {/* Waveform icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6CDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12h2M6 8v8M10 5v14M14 9v6M18 7v10M22 12h-2" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-1" style={{ color: '#1F2937' }}>Voice-First Intake</p>
                                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                                    Capture patient details and symptoms naturally through conversation.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start gap-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                style={{ background: 'rgba(45,108,223,0.12)' }}
                            >
                                {/* Shield icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6CDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-1" style={{ color: '#1F2937' }}>Secure & Private</p>
                                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                                    Enterprise-grade security ensuring patient privacy and data protection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom tagline */}
                <p className="text-xs mt-10 md:mt-0" style={{ color: '#9CA3AF' }}>
                    © 2025 Amrutha AI · Intelligent Healthcare
                </p>
            </div>

            {/* ── RIGHT LOGIN SECTION ── */}
            <div
                className="md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-white"
            >
                <div
                    className="w-full max-w-md bg-white rounded-2xl p-8 md:p-10"
                    style={{
                        boxShadow: '0 8px 40px rgba(45,108,223,0.10), 0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid #E5E7EB'
                    }}
                >
                    {/* Top accent bar */}
                    <div
                        className="h-1 rounded-full mb-8 -mx-10 -mt-10 rounded-t-2xl"
                        style={{ background: 'linear-gradient(90deg, #2D6CDF, #60A5FA)' }}
                    />

                    {/* Card Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                            style={{ background: 'rgba(45,108,223,0.08)', border: '2px solid rgba(45,108,223,0.15)' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2D6CDF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
                            Welcome <span style={{ color: '#2D6CDF' }}>Back</span>
                        </h2>
                        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                            Access your medical assistant dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{
                                    border: '1.5px solid #E5E7EB',
                                    color: '#1F2937',
                                    background: '#FAFAFA'
                                }}
                                onFocus={e => e.target.style.borderColor = '#2D6CDF'}
                                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                required
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{
                                    border: '1.5px solid #E5E7EB',
                                    color: '#1F2937',
                                    background: '#FAFAFA'
                                }}
                                onFocus={e => e.target.style.borderColor = '#2D6CDF'}
                                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{
                                    border: '1.5px solid #E5E7EB',
                                    color: '#1F2937',
                                    background: '#FAFAFA'
                                }}
                                onFocus={e => e.target.style.borderColor = '#2D6CDF'}
                                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                            />
                            <div className="flex justify-end mt-1.5">
                                <button type="button" className="text-xs font-medium transition-colors hover:underline" style={{ color: '#2D6CDF' }}>
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all duration-200 mt-2"
                            style={{
                                background: 'linear-gradient(135deg, #2D6CDF 0%, #4A90E2 100%)',
                                boxShadow: '0 4px 14px rgba(45,108,223,0.35)'
                            }}
                            onMouseEnter={e => e.target.style.boxShadow = '0 6px 20px rgba(45,108,223,0.5)'}
                            onMouseLeave={e => e.target.style.boxShadow = '0 4px 14px rgba(45,108,223,0.35)'}
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
                        <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>OR</span>
                        <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
                    </div>

                    {/* Demo Button */}
                    <button
                        type="button"
                        onClick={fillDemoData}
                        className="w-full py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        style={{
                            border: '1.5px solid #2D6CDF',
                            color: '#2D6CDF',
                            background: 'transparent'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(45,108,223,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        <span>🪄</span>
                        Login with Demo Credentials
                    </button>

                    {/* Footer */}
                    <p className="text-center text-xs mt-6" style={{ color: '#6B7280' }}>
                        Don't have an account?{' '}
                        <span className="font-semibold cursor-pointer hover:underline" style={{ color: '#2D6CDF' }}>
                            Sign up for free
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
