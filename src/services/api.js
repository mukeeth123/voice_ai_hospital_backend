import axios from 'axios';

// Create instance using VITE_BACKEND_URL
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60s timeout for AI generation
});

// Response interceptor for generic error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error("Request timed out. The server took too long to respond."));
        }
        return Promise.reject(error.response?.data || error);
    }
);

export const analyzeMedical = async (patientData) => {
    try {
        const response = await api.post('/medical-analysis', patientData);
        // Clean response: Return only what's needed
        return { success: true, data: response.data };
    } catch (error) {
        // Clean error: Return a structure the UI can handle without crashing
        const errMsg = error.detail || error.message || "Failed to analyze medical condition.";
        return { success: false, error: errMsg };
    }
};

export const bookAppointment = async (bookingData) => {
    try {
        const response = await api.post('/book-appointment', bookingData);
        return { success: true, data: response.data };
    } catch (error) {
        const errMsg = error.detail || error.message || "Failed to book appointment.";
        return { success: false, error: errMsg };
    }
};

export const registerPatient = async (patientData) => {
    try {
        // Expects { name: "...", email: "..." }
        const response = await api.post('/register-patient', patientData);
        return { success: true, data: response.data };
    } catch (error) {
        console.warn("Registration email failed (non-blocking):", error);
        return { success: false, error: error.message };
    }
};

export default api;
