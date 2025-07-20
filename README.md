# Doctor Portal - React + Node.js + MongoDB

A scalable web application for managing doctors and consultants with authentication, CRUD operations, and mapping functionality.

## Features

- 🔐 JWT-based authentication (register/login)
- 👨‍⚕️ Doctor management with CRUD operations
- 👨‍💼 Consultant management with CRUD operations
- 🔗 Doctor-Consultant mapping with cover money
- 🔍 Advanced filtering and search
- 📄 Pagination for large datasets
- 🎨 Modern Material-UI interface
- 📱 Responsive design
- 🔔 Toast notifications

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- React with TypeScript
- Material-UI components
- React Router v6
- Axios for API calls
- React Toastify for notifications

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd Doctor
npm install
cd frontend && npm install
```

2. **Set up environment variables:**

Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/doctor_db
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

4. **Run the application:**

**Development mode:**
```bash
# Terminal 1 - Backend (with auto-restart)
npm run dev

# Terminal 2 - Frontend
npm run frontend
```

**Production mode:**
```bash
# Backend
npm start

# Frontend
npm run build
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage Guide

### Authentication
1. Register a new account at `/register`
2. Login with your credentials at `/login`
3. JWT token is automatically stored and used for API calls

### Doctor Management
- **View:** Main page shows all doctors with pagination
- **Add:** Click "Add Doctor" button
- **Edit:** Click edit icon on any doctor row
- **Delete:** Click delete icon (with confirmation)
- **Filter:** Use search, location, and specialization filters

### Consultant Management
- **View:** Navigate to `/consultants`
- **Add/Edit/Delete:** Similar to doctors
- **Profile:** Click on any consultant row to view profile

### Doctor-Consultant Mapping
1. Navigate to a consultant's profile
2. Click "Add Doctor Mapping"
3. Select a doctor and enter cover money
4. View all mapped doctors in the table
5. Remove mappings using the "Remove" button

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Doctors
- `GET /api/doctors` - Get all doctors (with filtering/pagination)
- `POST /api/doctors` - Create new doctor
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Consultants
- `GET /api/consultants` - Get all consultants (with filtering/pagination)
- `POST /api/consultants` - Create new consultant
- `GET /api/consultants/:id` - Get consultant by ID
- `PUT /api/consultants/:id` - Update consultant
- `DELETE /api/consultants/:id` - Delete consultant
- `POST /api/consultants/:id/map-doctor` - Add doctor mapping
- `DELETE /api/consultants/:id/unmap-doctor/:doctorId` - Remove doctor mapping

## Project Structure

```
Doctor/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── config.js       # Database configuration
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── api/        # API utilities
│   │   ├── components/ # Reusable components
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Page components
│   │   └── utils/      # Utility functions
│   └── public/
└── package.json
```

## Development

### Available Scripts
- `npm start` - Start backend server
- `npm run dev` - Start backend with nodemon (auto-restart)
- `npm run frontend` - Start React development server
- `npm run build` - Build React app for production

### Adding New Features
1. Create models in `backend/models/`
2. Add controllers in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Create React components in `frontend/src/`
5. Update routing in `frontend/src/App.tsx`

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Protected routes middleware
- Input validation with express-validator
- CORS configuration

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
ISC 