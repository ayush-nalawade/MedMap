# MedMap Backend API

## Overview
This is the backend API for the MedMap Doctor Management System, built with Node.js, Express, and MongoDB.

## Features
- User authentication and authorization
- Doctor management
- Consultant management
- Doctor-Consultant mapping
- Dashboard statistics
- Activity tracking

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Project Structure
```
backend/
├── config.js           # Database configuration
├── server.js           # Main server file
├── routes/             # API routes
├── controllers/        # Route controllers
├── models/             # Database models
├── middleware/         # Custom middleware
├── services/           # Business logic
└── utils/              # Utility functions
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/<database-name>?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_secret_here
   NODE_ENV=development
   PORT=5000
   ```

3. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/change-password` - Change password

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `POST /api/doctors/bulk-delete` - Bulk delete doctors
- `POST /api/doctors/bulk-export` - Bulk export doctors

### Consultants
- `GET /api/consultants` - Get all consultants
- `POST /api/consultants` - Create new consultant
- `GET /api/consultants/:id` - Get consultant by ID
- `PUT /api/consultants/:id` - Update consultant
- `DELETE /api/consultants/:id` - Delete consultant
- `POST /api/consultants/:id/map-doctor` - Map doctor to consultant
- `PUT /api/consultants/:id/update-mapping/:doctorId` - Update doctor mapping
- `DELETE /api/consultants/:id/unmap-doctor/:doctorId` - Remove doctor mapping

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-doctors` - Get recent doctors
- `GET /api/dashboard/recent-consultants` - Get recent consultants
- `GET /api/dashboard/activity-feed` - Get activity feed

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 5000) | No |

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Input validation with express-validator
- CORS configuration
- Rate limiting
- Account lockout after failed attempts

## Development

### Running in Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Ensure all environment variables are set
3. Start the server with `npm start`
4. Use a process manager like PM2 for production

## API Documentation

For detailed API documentation, refer to the individual route files in the `routes/` directory. 