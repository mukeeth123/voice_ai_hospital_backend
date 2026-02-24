import React from 'react';

const CARDS = [
    {
        icon: (
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Intelligent Symptom Assessment',
        points: ['Real-time voice interaction', 'Dynamic clinical questioning', 'Pattern recognition for accuracy'],
    },
    {
        icon: (
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
            </svg>
        ),
        title: 'Specialist Recommendation',
        points: ['Precise medical department routing', 'Urgency level categorization', 'Local hospital integrations'],
    },
    {
        icon: (
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        title: 'Instant Medical Report',
        points: ['Comprehensive PDF generation', 'Secure email delivery', 'Easy-to-share digital copy'],
    },
];

const WhatWeDo = () => (
    <section className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary text-center mb-14">
                What Amrutha.AI Does
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {CARDS.map((c, i) => (
                    <div key={i} className="bg-white rounded-[20px] border border-border p-8 text-center shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">{c.icon}</div>
                        <h3 className="font-bold text-lg text-text-primary mb-4">{c.title}</h3>
                        <ul className="text-left space-y-2">
                            {c.points.map((p, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default WhatWeDo;
