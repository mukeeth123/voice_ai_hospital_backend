import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
            <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" /></svg>
                    </div>
                    <span className="font-bold text-text-primary text-lg tracking-tight">Amrutha.AI</span>
                </div>

                {/* Center Links */}
                <div className="hidden md:flex items-center gap-8">
                    {[{ label: 'How It Works', id: 'how-it-works' }, { label: 'Features', id: 'features' }, { label: 'Safety', id: 'safety' }].map(l => (
                        <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">{l.label}</button>
                    ))}
                </div>

                {/* CTA */}
                <button onClick={() => navigate('/language')} className="bg-primary hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
                    Start Consultation
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
