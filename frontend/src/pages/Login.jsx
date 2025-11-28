import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-container">
                    <div className="auth-box">
                        <div className="auth-header">
                            <h1>Welcome Back</h1>
                            <p>Sign in to access your healthcare dashboard</p>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="forgot-password-link">
                                <Link to="/forgot-password" className="auth-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="auth-link">Sign up</Link>
                            </p>
                        </div>

                        <div className="role-options">
                            <div className="role-options-header">
                                <h3>Healthcare Professional?</h3>
                                <p>Access your dedicated portal by selecting your role below</p>
                            </div>
                            <div className="role-cards">
                                <Link to="/login/doctor" className="role-card">
                                    <div className="role-icon">👨‍⚕️</div>
                                    <div className="role-info">
                                        <h4>Doctor Login</h4>
                                        <p>Access your doctor portal</p>
                                    </div>
                                    <div className="role-arrow">→</div>
                                </Link>
                                <Link to="/login/pharmacist" className="role-card">
                                    <div className="role-icon">💊</div>
                                    <div className="role-info">
                                        <h4>Pharmacist Login</h4>
                                        <p>Access your pharmacy portal</p>
                                    </div>
                                    <div className="role-arrow">→</div>
                                </Link>
                                <Link to="/login/patient" className="role-card">
                                    <div className="role-icon">🏥</div>
                                    <div className="role-info">
                                        <h4>Patient Login</h4>
                                        <p>Access your health records</p>
                                    </div>
                                    <div className="role-arrow">→</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="auth-visual">
                        <div className="visual-content">
                            <div className="visual-icon">🔐</div>
                            <h2>Secure Access</h2>
                            <p>Your health information is protected with industry-leading security</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
