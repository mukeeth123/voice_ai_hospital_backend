import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 px-6 bg-background">
            <div className="max-w-[800px] mx-auto rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-10 md:p-14 text-center shadow-2xl relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                        Start Your Consultation Now
                    </h2>
                    <p className="text-blue-100 text-base mb-8 max-w-md mx-auto">
                        Get expert clinical direction and your report in just a few clicks.
                    </p>
                    <button
                        onClick={() => navigate('/language')}
                        className="bg-white text-primary font-bold px-8 py-3.5 rounded-full text-sm hover:shadow-xl transition-all duration-300 hover:scale-105 animate-glow"
                    >
                        Begin with Amrutha.AI
                    </button>
                    <p className="text-blue-200/70 text-xs mt-4">Takes less than 5 minutes.</p>
                </div>
            </div>
        </section>
    );
};

export default CTA;
