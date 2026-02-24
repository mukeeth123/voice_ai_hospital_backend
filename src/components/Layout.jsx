import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { Languages } from 'lucide-react';
import AmruthaLogo from './AmruthaLogo';

const Layout = ({ children }) => {
    const { patientData } = useHospital();

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <AmruthaLogo size={32} textSize="text-lg" />

                    <div className="flex items-center gap-4">
                        {patientData.language && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium">
                                <Languages size={14} />
                                <span>{patientData.language}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full h-full flex flex-col items-center">
                    {children}
                </div>
            </main>

        </div>
    );
};

export default Layout;
