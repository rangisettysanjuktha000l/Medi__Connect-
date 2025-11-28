import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorRegister from './pages/DoctorRegister';
import DoctorLogin from './pages/DoctorLogin';
import PharmacistLogin from './pages/PharmacistLogin';
import PatientLogin from './pages/PatientLogin';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Appointments from './pages/Appointments';
import Pharmacy from './pages/Pharmacy';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/login/doctor" element={<DoctorLogin />} />
                            <Route path="/login/pharmacist" element={<PharmacistLogin />} />
                            <Route path="/login/patient" element={<PatientLogin />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/register/doctor" element={<DoctorRegister />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/verify-otp" element={<VerifyOTP />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/doctors" element={<Doctors />} />
                            <Route path="/doctors/:id" element={<DoctorProfile />} />
                            <Route path="/appointments" element={<Appointments />} />
                            <Route path="/pharmacy" element={<Pharmacy />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
