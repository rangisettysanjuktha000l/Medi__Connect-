import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated]);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-search-section">
                        <h1 className="hero-title">Your Health, Our Priority</h1>
                        <p className="hero-subtitle">
                            Order medicines, book lab tests and consult doctors online
                        </p>
                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search for medicines, doctors, and services"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="search-btn">Search</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="section services">
                <div className="container">
                    <h2 className="section-title text-center">Our Services</h2>

                    <div className="services-grid">
                        <Link to="/pharmacy" className="service-card">
                            <div className="service-icon green">💊</div>
                            <h3>Order Medicines</h3>
                            <p>Prescription & OTC medicine delivery to doorstep</p>
                            <span className="explore-link">Explore →</span>
                        </Link>

                        <Link to="/appointments" className="service-card">
                            <div className="service-icon blue">🧪</div>
                            <h3>Book Lab Tests</h3>
                            <p>Home sample collection & reports online</p>
                            <span className="explore-link">Explore →</span>
                        </Link>

                        <Link to="/doctors" className="service-card">
                            <div className="service-icon red">🎥</div>
                            <h3>Consult Doctors</h3>
                            <p>Video consultation with qualified doctors</p>
                            <span className="explore-link">Explore →</span>
                        </Link>

                        <div className="service-card service-card-full">
                            <div className="service-icon purple">👥</div>
                            <h3>Health Tracker</h3>
                            <p>Store & track health records library digitally</p>
                            <span className="explore-link">Explore →</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="section categories">
                <div className="container">
                    <h2 className="section-title text-center">Popular Categories</h2>
                    
                    <div className="category-pills">
                        <button className="category-pill">Diabetes Care</button>
                        <button className="category-pill">Heart Care</button>
                        <button className="category-pill">Stomach & Supplements</button>
                        <button className="category-pill">Pain Relief</button>
                        <button className="category-pill">Skin Care</button>
                        <button className="category-pill">Baby Care</button>
                        <button className="category-pill">Ayurveda</button>
                        <button className="category-pill">Personal Care</button>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="section statistics">
                <div className="container">
                    <div className="stats-row">
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Happy Patients</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Medicines</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Orders</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Features */}
            <section className="section bottom-features">
                <div className="container">
                    <div className="bottom-features-grid">
                        <div className="bottom-feature">
                            <div className="bottom-feature-icon">🚚</div>
                            <h4>Free Delivery</h4>
                            <p>On orders above ₹499</p>
                        </div>
                        <div className="bottom-feature">
                            <div className="bottom-feature-icon">✓</div>
                            <h4>100% Authentic</h4>
                            <p>Genuine medicine guarantee</p>
                        </div>
                        <div className="bottom-feature">
                            <div className="bottom-feature-icon">₹</div>
                            <h4>Best Prices</h4>
                            <p>Save up to 25% on medicines</p>
                        </div>
                        <div className="bottom-feature">
                            <div className="bottom-feature-icon">🕐</div>
                            <h4>24/7 Service</h4>
                            <p>Round-the-clock support</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Dashboard;
