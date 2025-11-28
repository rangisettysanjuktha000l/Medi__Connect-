import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pharmacy.css';

const Pharmacy = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [cart, setCart] = useState([]);

    const categories = ['All', 'antibiotic', 'painkiller', 'vitamin', 'supplement', 'prescription', 'otc'];

    useEffect(() => {
        fetchMedicines();
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedCategory && selectedCategory !== 'All') {
                params.category = selectedCategory;
            }
            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axios.get('/api/pharmacy/medicines', { params });
            setMedicines(response.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (medicine) => {
        const existingItem = cart.find(item => item.medicine._id === medicine._id);

        let newCart;
        if (existingItem) {
            newCart = cart.map(item =>
                item.medicine._id === medicine._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCart = [...cart, { medicine, quantity: 1 }];
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="pharmacy-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Pharmacy</h1>
                        <p>Order medicines online with fast delivery</p>
                    </div>
                    <a href="/cart" className="btn btn-primary cart-btn">
                        🛒 Cart ({getCartCount()})
                    </a>
                </div>

                <div className="search-filters">
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-input search-input"
                            placeholder="Search medicines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    <div className="category-filters">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`filter-chip ${selectedCategory === category || (category === 'All' && !selectedCategory) ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : medicines.length > 0 ? (
                    <div className="medicines-grid">
                        {medicines.map((medicine) => (
                            <div key={medicine._id} className="medicine-card">
                                <div className="medicine-header">
                                    <h3>{medicine.name}</h3>
                                    {medicine.requiresPrescription && (
                                        <span className="badge badge-warning">Rx Required</span>
                                    )}
                                </div>

                                {medicine.genericName && (
                                    <p className="medicine-generic">Generic: {medicine.genericName}</p>
                                )}

                                <div className="medicine-info">
                                    <p><strong>Form:</strong> {medicine.dosageForm}</p>
                                    {medicine.strength && <p><strong>Strength:</strong> {medicine.strength}</p>}
                                    {medicine.manufacturer && <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>}
                                </div>

                                {medicine.description && (
                                    <p className="medicine-description">{medicine.description}</p>
                                )}

                                <div className="medicine-footer">
                                    <div className="medicine-price">${medicine.price}</div>
                                    <div className="medicine-stock">
                                        {medicine.stock > 0 ? (
                                            <span className="badge badge-success">In Stock ({medicine.stock})</span>
                                        ) : (
                                            <span className="badge badge-warning">Out of Stock</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => addToCart(medicine)}
                                    disabled={medicine.stock === 0}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">💊</div>
                        <h3>No medicines found</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pharmacy;
