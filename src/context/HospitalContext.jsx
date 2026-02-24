import React, { createContext, useContext, useState, useMemo } from 'react';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
    // --- State Definitions ---

    // Patient Demographics & Input
    const [patientData, setPatientData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        email: '',
        phone: '',
        language: 'English', // English, Hindi, Kannada
        medical_history: '',
        symptoms: '',
        bp: '',
        sugar: '',
    });

    // AI & Medical Report
    const [medicalReport, setMedicalReport] = useState(null); // Stores the full analysis JSON
    const [ttsAudio, setTtsAudio] = useState(null); // Stores base64 audio

    // Booking & Flow State
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState('');
    const [appointmentStatus, setAppointmentStatus] = useState(null); // 'confirmed', 'failed', 'cancelled'

    // UI / UX State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

    // --- Helper Functions ---

    const resetState = () => {
        setPatientData({
            name: '', age: '', gender: 'Male', email: '', phone: '',
            language: 'English', medical_history: '', symptoms: '', bp: '', sugar: ''
        });
        setMedicalReport(null);
        setTtsAudio(null);
        setSelectedDoctor(null);
        setAppointmentTime('');
        setAppointmentStatus(null);
        setLoading(false);
        setError(null);
    };

    // Memoize value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        patientData,
        setPatientData,
        medicalReport,
        setMedicalReport,
        ttsAudio,
        setTtsAudio,
        selectedDoctor,
        setSelectedDoctor,
        appointmentTime,
        setAppointmentTime,
        appointmentStatus,
        setAppointmentStatus,
        loading,
        setLoading,
        error,
        setError,
        isAvatarSpeaking,
        setIsAvatarSpeaking,
        resetState
    }), [
        patientData, medicalReport, ttsAudio, selectedDoctor, appointmentTime,
        appointmentStatus, loading, error, isAvatarSpeaking
    ]);

    return (
        <HospitalContext.Provider value={value}>
            {children}
        </HospitalContext.Provider>
    );
};

export const useHospital = () => {
    const context = useContext(HospitalContext);
    if (!context) {
        throw new Error('useHospital must be used within a HospitalProvider');
    }
    return context;
};
