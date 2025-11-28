# MediConnect - Online Healthcare Appointment & Pharmacy System

A comprehensive MERN stack web application that enables patients to book appointments with doctors, consult online, and purchase prescribed medicines through an integrated pharmacy system.

## Features

### For Patients
- 🔐 User registration and authentication
- 👨‍⚕️ Search and filter doctors by specialization
- 📅 Book appointments (in-person or online consultations)
- 💊 Browse and purchase medicines
- 📋 View appointment history and prescriptions
- 🛒 Shopping cart with prescription upload

### For Doctors
- 📊 Manage appointment schedule
- 👥 View patient records
- 💬 Provide consultation feedback and prescriptions

### For Pharmacists
- ✅ Verify prescription orders
- 📦 Manage medicine inventory
- 🚚 Process and dispatch orders

## Tech Stack

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
mediconnect4/
├── backend/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── server.js         # Express server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── context/      # React context (Auth)
    │   ├── pages/        # Page components
    │   ├── App.jsx       # Main app component
    │   └── index.css     # Global styles
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update MongoDB connection string in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your_secure_secret_key
PORT=5000
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor profile

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Pharmacy
- `GET /api/pharmacy/medicines` - Get all medicines
- `GET /api/pharmacy/medicines/:id` - Get medicine by ID
- `POST /api/pharmacy/medicines` - Create medicine (pharmacist only)
- `PUT /api/pharmacy/medicines/:id` - Update medicine (pharmacist only)
- `POST /api/pharmacy/orders` - Create order
- `GET /api/pharmacy/orders` - Get user orders
- `PUT /api/pharmacy/orders/:id` - Update order status (pharmacist only)

## Usage Guide

### As a Patient

1. **Register**: Create an account as a patient
2. **Find Doctors**: Browse and search doctors by specialization
3. **Book Appointment**: Select a doctor, choose date/time, and provide symptoms
4. **Browse Pharmacy**: Search for medicines and add to cart
5. **Checkout**: Provide delivery address and prescription (if required)
6. **Dashboard**: View appointments and manage your health

### As a Doctor

1. **Register**: Create an account as a doctor with qualifications
2. **Manage Profile**: Update specialization, fees, and availability
3. **View Appointments**: See scheduled appointments
4. **Provide Care**: Add diagnosis and prescriptions

### As a Pharmacist

1. **Register**: Create an account as a pharmacist
2. **Manage Inventory**: Add and update medicine stock
3. **Verify Orders**: Review prescription orders
4. **Process Orders**: Update order status and dispatch

## Default Test Accounts

After seeding the database (optional), you can use:
- **Patient**: patient@test.com / password123
- **Doctor**: doctor@test.com / password123
- **Pharmacist**: pharmacist@test.com / password123

## Design Features

- 🎨 Premium modern UI with gradient backgrounds
- ✨ Smooth animations and micro-interactions
- 📱 Fully responsive design
- 🎭 Glassmorphism effects
- 🌈 Vibrant color palette
- 🔤 Google Fonts (Inter & Outfit)

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Role-based access control
- Input validation

## Future Enhancements

- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Medical records upload
- [ ] Lab test booking
- [ ] Multi-language support
- [ ] Mobile app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@mediconnect.com or create an issue in the repository.

---

**MediConnect** - Making Healthcare Accessible 🏥
"# Medi_Connect_" 
"# Medi_Connect_" 
"# mediconnect" 
