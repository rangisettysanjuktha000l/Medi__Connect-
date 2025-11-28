import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Doctors.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');

    const specializations = [
        'All', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics',
        'Orthopedics', 'Psychiatry', 'Dentistry', 'General Practice'
    ];

    useEffect(() => {
        fetchDoctors();
    }, [selectedSpecialization, searchTerm]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedSpecialization && selectedSpecialization !== 'All') {
                params.specialization = selectedSpecialization;
            }
            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axios.get('/api/doctors', { params });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="doctors-page">
            <div className="container">
                <div className="page-header">
                    <h1>Find a Doctor</h1>
                    <p>Browse through our network of qualified healthcare professionals</p>
                </div>

                <div className="search-filters">
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-input search-input"
                            placeholder="Search doctors by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    <div className="specialization-filters">
                        {specializations.map((spec) => (
                            <button
                                key={spec}
                                className={`filter-chip ${selectedSpecialization === spec || (spec === 'All' && !selectedSpecialization) ? 'active' : ''}`}
                                onClick={() => setSelectedSpecialization(spec === 'All' ? '' : spec)}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : doctors.length > 0 ? (
                    <div className="doctors-grid">
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="doctor-card">
                                <div className="doctor-avatar">
                                    {doctor.name.charAt(0)}
                                </div>
                                <div className="doctor-info">
                                    <h3>{doctor.name}</h3>
                                    <p className="doctor-spec">
                                        <span className="badge badge-primary">{doctor.specialization || 'General Practice'}</span>
                                    </p>
                                    <p className="doctor-detail">
                                        <strong>Experience:</strong> {doctor.experience || 0} years
                                    </p>
                                    <p className="doctor-detail">
                                        <strong>Consultation Fee:</strong> ${doctor.consultationFee || 50}
                                    </p>
                                    {doctor.qualifications && (
                                        <p className="doctor-qualifications">{doctor.qualifications}</p>
                                    )}
                                </div>
                                <Link to={`/doctors/${doctor._id}`} className="btn btn-primary btn-block">
                                    View Profile & Book
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No doctors found</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;
