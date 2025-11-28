import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Appointments.css';

const Appointments = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchAppointments();
    }, [isAuthenticated]);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('/api/appointments/my-appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'scheduled': return 'badge-primary';
            case 'completed': return 'badge-success';
            case 'cancelled': return 'badge-warning';
            default: return '';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="appointments-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Appointments</h1>
                    <p>View and manage your healthcare appointments</p>
                </div>

                {appointments.length > 0 ? (
                    <div className="appointments-list">
                        {appointments.map((appointment) => (
                            <div key={appointment._id} className="appointment-card">
                                <div className="appointment-header">
                                    <div className="appointment-info">
                                        <h3>{appointment.doctor?.name || 'Doctor'}</h3>
                                        <p className="appointment-spec">
                                            {appointment.doctor?.specialization || 'General Practice'}
                                        </p>
                                    </div>
                                    <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>

                                <div className="appointment-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">📅</span>
                                        <span>{formatDate(appointment.appointmentDate)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">🕐</span>
                                        <span>{appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">💵</span>
                                        <span>${appointment.doctor?.consultationFee || 50}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">📍</span>
                                        <span>{appointment.consultationType === 'online' ? 'Online' : 'In-Person'}</span>
                                    </div>
                                </div>

                                {appointment.symptoms && (
                                    <div className="appointment-symptoms">
                                        <strong>Symptoms:</strong> {appointment.symptoms}
                                    </div>
                                )}

                                {appointment.diagnosis && (
                                    <div className="appointment-diagnosis">
                                        <strong>Diagnosis:</strong> {appointment.diagnosis}
                                    </div>
                                )}

                                {appointment.prescription && (
                                    <div className="appointment-prescription">
                                        <strong>Prescription:</strong> {appointment.prescription}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>No appointments yet</h3>
                        <p>Book your first appointment with a doctor</p>
                        <button onClick={() => navigate('/doctors')} className="btn btn-primary">
                            Find Doctors
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
