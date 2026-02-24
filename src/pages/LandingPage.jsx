import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import WhatWeDo from '../components/landing/WhatWeDo';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import Safety from '../components/landing/Safety';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
    useEffect(() => {
        // Fade-in on scroll observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('opacity-100', 'translate-y-0');
                        e.target.classList.remove('opacity-0', 'translate-y-6');
                    }
                });
            },
            { threshold: 0.1 }
        );
        document.querySelectorAll('.scroll-fade').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            <Hero />
            <div className="scroll-fade opacity-0 translate-y-6 transition-all duration-700"><WhatWeDo /></div>
            <div className="scroll-fade opacity-0 translate-y-6 transition-all duration-700"><HowItWorks /></div>
            <div className="scroll-fade opacity-0 translate-y-6 transition-all duration-700"><Features /></div>
            <div className="scroll-fade opacity-0 translate-y-6 transition-all duration-700"><Safety /></div>
            <div className="scroll-fade opacity-0 translate-y-6 transition-all duration-700"><CTA /></div>
            <Footer />
        </div>
    );
};

export default LandingPage;
