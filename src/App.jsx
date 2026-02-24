import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HospitalProvider } from './context/HospitalContext';
import Layout from './components/Layout';
import { Login, JsonChatIntake, JsonIntakeReport, LanguageSelection, AIDoctorPage } from './pages';
import LandingPage from './pages/LandingPage';

function App() {
    return (
        <HospitalProvider>
            <Router>
                <Routes>
                    {/* Landing page has its own Navbar — no Layout wrapper */}
                    <Route path="/" element={<LandingPage />} />

                    {/* App pages inside Layout */}
                    <Route path="/login" element={<Layout><Login /></Layout>} />
                    <Route path="/language" element={<Layout><LanguageSelection /></Layout>} />
                    <Route path="/details" element={<Layout><JsonChatIntake /></Layout>} />
                    <Route path="/json-report" element={<Layout><JsonIntakeReport /></Layout>} />
                    <Route path="/ai-doctor" element={<Layout><AIDoctorPage /></Layout>} />
                </Routes>
            </Router>
        </HospitalProvider>
    );
}

export default App;

