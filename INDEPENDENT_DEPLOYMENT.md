# Independent Frontend and Backend Deployment

## Overview
The project has been successfully reorganized to allow frontend and backend to run completely independently. Each directory now has its own package.json, dependencies, and can be deployed separately.

## Project Structure

```
Doctor/
├── Frontend/                    # Independent React Frontend
│   ├── package.json            # Frontend dependencies
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   ├── build/                  # Production build
│   ├── node_modules/           # Frontend dependencies
│   └── README.md               # Frontend documentation
├── backend/                    # Independent Node.js Backend
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Main server file
│   ├── config.js               # Database configuration
│   ├── routes/                 # API routes
│   ├── controllers/            # Route controllers
│   ├── models/                 # Database models
│   ├── middleware/             # Custom middleware
│   ├── services/               # Business logic
│   ├── utils/                  # Utility functions
│   ├── node_modules/           # Backend dependencies
│   └── README.md               # Backend documentation
├── .gitignore                  # Root gitignore
├── PROJECT_STRUCTURE.md        # Project structure documentation
└── INDEPENDENT_DEPLOYMENT.md   # This file
```

## Running Independently

### Frontend (React + Vite)

**Navigate to Frontend directory:**
```bash
cd Frontend
```

**Install dependencies:**
```bash
npm install
```

**Development mode:**
```bash
npm start
# or
npm run dev
```
- Frontend will run on: http://localhost:4028

**Build for production:**
```bash
npm run build
```
- Build output: `Frontend/build/`

### Backend (Node.js + Express)

**Navigate to Backend directory:**
```bash
cd backend
```

**Install dependencies:**
```bash
npm install
```

**Development mode:**
```bash
npm run dev
```
- Backend will run on: http://localhost:5000

**Production mode:**
```bash
npm start
```

## Environment Setup

### Backend Environment Variables
Create `.env` file in `backend/` directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
PORT=5000
```

### Frontend Environment Variables
Update API URL in `Frontend/src/utils/api.js`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'
  : 'http://localhost:5000/api';
```

## Independent Deployment

### Frontend Deployment (Static Files)
1. Build the frontend: `cd Frontend && npm run build`
2. Deploy the `Frontend/build/` directory to any static hosting service:
   - Vercel
   - Netlify
   - AWS S3
   - GitHub Pages
   - Any CDN

### Backend Deployment (Node.js API)
1. Deploy the `backend/` directory to any Node.js hosting service:
   - Vercel
   - Heroku
   - Railway
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk
   - Google Cloud Run

## Benefits of Independent Deployment

1. **Scalability**: Scale frontend and backend independently
2. **Technology Flexibility**: Use different hosting services for each
3. **Cost Optimization**: Choose cost-effective hosting for each part
4. **Team Separation**: Frontend and backend teams can work independently
5. **Deployment Flexibility**: Deploy updates to one without affecting the other
6. **Performance**: Optimize each part for its specific needs

## Testing Independent Deployment

### Test Frontend Build
```bash
cd Frontend
npm run build
# Check that build/ directory is created successfully
```

### Test Backend Server
```bash
cd backend
npm start
# Check that server starts and connects to MongoDB
```

### Test API Connection
```bash
curl http://localhost:5000/api/auth
# Should return a response (even if it's an error, it means server is running)
```

## Troubleshooting

### Frontend Issues
- Check if all dependencies are installed: `npm install`
- Verify Vite configuration in `vite.config.mjs`
- Check import paths in React components

### Backend Issues
- Verify MongoDB connection string in `.env`
- Check if all dependencies are installed: `npm install`
- Ensure JWT_SECRET is set in environment variables

### CORS Issues
- Backend CORS is configured to allow all origins in development
- For production, update CORS configuration in `backend/server.js`

## Next Steps

1. **Set up environment variables** for both frontend and backend
2. **Deploy backend** to your preferred hosting service
3. **Update frontend API URL** to point to your deployed backend
4. **Deploy frontend** to your preferred hosting service
5. **Test the complete application** in production environment 