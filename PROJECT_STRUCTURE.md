# MedMap Project Structure

## Overview
The project has been reorganized to have a clean separation between frontend and backend, with each having their own package.json and dependencies.

## Project Structure

```
Doctor/
├── Frontend/                    # React Frontend Application
│   ├── package.json            # Frontend dependencies
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   └── node_modules/           # Frontend dependencies
├── backend/                    # Node.js Backend API
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Main server file
│   ├── config.js               # Database configuration
│   ├── routes/                 # API routes
│   ├── controllers/            # Route controllers
│   ├── models/                 # Database models
│   ├── middleware/             # Custom middleware
│   ├── services/               # Business logic
│   ├── utils/                  # Utility functions
│   └── node_modules/           # Backend dependencies
├── package.json                # Root package.json (orchestration)
├── package-lock.json           # Root dependencies lock
└── node_modules/               # Root dependencies
```

## Package.json Files

### Root package.json
- **Purpose**: Project orchestration and scripts
- **Scripts**:
  - `npm run frontend`: Start frontend development server
  - `npm run backend`: Start backend server
  - `npm run backend:dev`: Start backend with nodemon
  - `npm run dev`: Start both frontend and backend concurrently
  - `npm run build`: Build frontend for production

### Backend package.json
- **Purpose**: Backend-specific dependencies and scripts
- **Dependencies**: express, mongoose, bcryptjs, jsonwebtoken, cors, etc.
- **Scripts**:
  - `npm start`: Start production server
  - `npm run dev`: Start development server with nodemon

### Frontend package.json
- **Purpose**: Frontend-specific dependencies and scripts
- **Dependencies**: react, react-dom, vite, tailwindcss, etc.
- **Scripts**:
  - `npm start`: Start development server
  - `npm run build`: Build for production

## Running the Application

### Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run frontend    # Frontend only
npm run backend:dev # Backend only
```

### Production Mode
```bash
# Build frontend
npm run build

# Start backend
npm run backend
```

## Benefits of This Structure

1. **Clean Separation**: Frontend and backend are completely separate
2. **Independent Dependencies**: Each part manages its own dependencies
3. **Easier Deployment**: Can deploy frontend and backend separately
4. **Better Organization**: Clear structure for team collaboration
5. **Scalability**: Easy to add more services or microservices

## Environment Variables

### Backend (.env file in backend directory)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

### Frontend
Environment variables are handled through Vite's environment system.

## Deployment

### Backend Deployment
- Deploy the `backend/` directory as a Node.js application
- Set environment variables in your hosting platform
- Ensure MongoDB connection is accessible

### Frontend Deployment
- Build the frontend: `npm run build`
- Deploy the `Frontend/build/` directory as static files
- Update API URLs for production environment 