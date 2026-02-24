import React from 'react';

const Safety = () => (
    <section id="safety" className="py-20 px-6 bg-[#0F172A]">
        <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Safe. Secure. Guided.
            </h2>
            <p className="text-blue-200/80 text-base max-w-2xl mx-auto mb-12 leading-relaxed">
                Your health and data privacy are our top priorities. Amrutha.AI provides preliminary clinical guidance and connects you with emergency services when needed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-left backdrop-blur-sm">
                    <h3 className="font-bold text-white text-base mb-2">Preliminary Guidance</h3>
                    <p className="text-sm text-blue-200/70 leading-relaxed">
                        Our AI identifies patterns to provide helpful medical suggestions, ensuring you see the right specialist at the right time.
                    </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-left backdrop-blur-sm">
                    <h3 className="font-bold text-white text-base mb-2">Data Protection</h3>
                    <p className="text-sm text-blue-200/70 leading-relaxed">
                        We adhere to strict medical data handling standards. Your information is processed securely and not stored beyond the session.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default Safety;
