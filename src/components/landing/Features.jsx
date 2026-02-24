import React from 'react';

const FEATURES = [
    {
        icon: '🌐',
        title: 'Multilingual Voice Assistant',
        desc: 'Communicate in your preferred language.',
    },
    {
        icon: '⚡',
        title: 'Real-Time Guidance',
        desc: 'Adaptive questions based on your responses.',
    },
    {
        icon: '🎯',
        title: 'Age & Gender Smart Questions',
        desc: 'Clinically relevant, context-aware assessment.',
    },
    {
        icon: '📧',
        title: 'Secure Email Delivery',
        desc: 'Receive your detailed report directly to your inbox.',
    },
    {
        icon: '🚨',
        title: 'Emergency Alert Detection',
        desc: 'Urgent symptom recognition and immediate alerts.',
    },
    {
        icon: '🏥',
        title: 'Professional Appointment Card',
        desc: 'Book and share your appointment instantly.',
    },
];

const Features = () => (
    <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary text-center mb-14">
                Powerful Features for Precision
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                        <span className="text-2xl mb-3 block">{f.icon}</span>
                        <h3 className="font-bold text-sm text-text-primary mb-1 group-hover:text-primary transition-colors">{f.title}</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Features;
