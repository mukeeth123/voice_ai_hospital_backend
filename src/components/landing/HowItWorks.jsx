import React from 'react';

const STEPS = [
    { num: 1, title: 'Choose Language', desc: 'Select EN, HI, or KN' },
    { num: 2, title: 'Answer Questions', desc: 'Guided clinical questions' },
    { num: 3, title: 'Review & Confirm', desc: 'Verify details' },
    { num: 4, title: 'Receive Report', desc: 'Download PDF or get via email' },
];

const HowItWorks = () => (
    <section id="how-it-works" className="py-20 px-6 bg-background">
        <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary text-center mb-14">
                How It Works
            </h2>
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-4">
                {/* Connecting dotted line (desktop) */}
                <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-blue-200 z-0" />

                {STEPS.map((s) => (
                    <div key={s.num} className="relative z-10 flex flex-col items-center text-center flex-1">
                        <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                            {s.num}
                        </div>
                        <h3 className="font-bold text-base text-text-primary mb-1">{s.title}</h3>
                        <p className="text-sm text-text-secondary">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;
