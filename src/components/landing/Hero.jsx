import React from 'react';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="pt-28 pb-16 px-6 bg-background overflow-hidden">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Left */}
                <div className="flex-1 animate-fade-in">
                    <span className="inline-block text-xs font-bold tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6 uppercase">
                        Intelligent Health Guidance
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-6">
                        Medical<br />Consultation in<br />
                        <span className="text-primary">Minutes</span>
                    </h1>
                    <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-lg">
                        Speak with Amrutha.AI, receive specialist recommendations, and get your medical report instantly. Professional healthcare guidance at your fingertips.
                    </p>
                    <div className="flex flex-col gap-3 mb-8">
                        {['Multilingual Voice Support', 'Smart Symptom Analysis', 'Instant Appointment Booking'].map(t => (
                            <div key={t} className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span className="text-sm font-medium text-text-primary">{t}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => navigate('/language')} className="bg-primary hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm">
                            Start Consultation
                        </button>
                        <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="border-2 border-border hover:border-primary text-text-primary font-semibold px-7 py-3 rounded-lg transition-all text-sm hover:text-primary">
                            How It Works
                        </button>
                    </div>
                </div>

                {/* Right — Doctor Illustration */}
                <div className="flex-1 flex items-center justify-center relative">
                    {/* Dotted circle bg */}
                    <div className="absolute w-80 h-80 rounded-full border-2 border-dashed border-blue-200 opacity-50" />
                    <div className="absolute w-64 h-64 rounded-full border-2 border-dashed border-blue-100 opacity-30" />

                    <div className="relative z-10 w-80 h-96 md:w-[420px] md:h-[480px] rounded-3xl bg-gradient-to-br from-blue-50 to-primary/10 flex items-end justify-center overflow-hidden shadow-xl animate-float">
                        <video src="/assets/avatar_1.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover object-top" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
