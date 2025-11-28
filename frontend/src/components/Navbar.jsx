import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isDashboard = location.pathname === '/dashboard';

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🏥</span>
                    <span className="brand-text">MediConnect</span>
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    {isDashboard && isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/appointments" className="nav-link">My Appointments</Link>
                            <Link to="/pharmacy" className="nav-link">My Prescriptions</Link>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/doctors" className="nav-link">Find Doctors</Link>
                            <Link to="/pharmacy" className="nav-link">Pharmacy</Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/appointments" className="nav-link">My Appointments</Link>
                                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                    <button onClick={handleLogout} className="btn btn-secondary">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-secondary">Login</Link>
                                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
