import React from 'react';

const Footer = () => (
    <footer className="bg-[#0F172A] text-white pt-14 pb-6 px-6">
        <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                {/* About */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" /></svg>
                        </div>
                        <span className="font-bold text-sm">Amrutha.AI</span>
                    </div>
                    <p className="text-sm text-blue-200/60 leading-relaxed">
                        Amrutha.AI is an intelligent medical voice assistant designed to simplify healthcare consultations and reporting through advanced AI technology.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-sm mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        {[
                            { label: 'Home', href: '#' },
                            { label: 'How It Works', href: '#how-it-works' },
                            { label: 'Features', href: '#features' },
                            { label: 'Privacy Policy', href: '#' },
                        ].map(l => (
                            <li key={l.label}>
                                <a href={l.href} className="text-sm text-blue-200/60 hover:text-white transition-colors">{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold text-sm mb-4">Contact</h4>
                    <ul className="space-y-2 text-sm text-blue-200/60">
                        <li>support@amrutha.ai</li>
                        <li>+91-800-AMRUTHA</li>
                        <li>Bangalore, India</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="text-xs text-blue-200/40">© 2026 Amrutha.AI All rights reserved.</p>
                <p className="text-[10px] text-blue-200/30 max-w-xl text-center md:text-right leading-relaxed">
                    Medical Disclaimer: Amrutha.AI provides preliminary health information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
