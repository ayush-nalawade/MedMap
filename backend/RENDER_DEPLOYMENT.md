# Render Deployment Guide for MedMap Backend

## Prerequisites
- Render account (sign up at https://render.com)
- GitHub repository with your code

## Deployment Steps

### 1. Connect to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository

### 2. Configure the Service
- **Name**: `medmap-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: Leave empty (or specify `backend` if deploying from root)

### 3. Environment Variables
Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://ayushnalawade2233:Ayush%402233%232233@medmap-pro.cgzstj.mongodb.net/?retryWrites=true&w=majority&appName=medmap-pro
JWT_SECRET=uwersdfghytunbvawqsp
```

### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your application
- Wait for deployment to complete

### 5. Get Your Backend URL
- Once deployed, you'll get a URL like: `https://medmap-backend.onrender.com`
- This is your backend API URL

## Testing the Deployment

### Health Check
```bash
curl https://your-backend-url.onrender.com/api/test/health
```

### Expected Response
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-01-XX...",
  "environment": "production"
}
```

## API Endpoints

Your backend will be available at:
- **Base URL**: `https://your-backend-url.onrender.com`
- **API Base**: `https://your-backend-url.onrender.com/api`

### Available Endpoints:
- `GET /api/test/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/doctors` - Get all doctors
- `GET /api/consultants` - Get all consultants
- `GET /api/dashboard/stats` - Dashboard statistics

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check if all dependencies are in package.json
2. **Environment Variables**: Ensure all required env vars are set
3. **MongoDB Connection**: Verify MONGO_URI is correct
4. **Port Issues**: Render uses PORT environment variable

### Logs:
- Check deployment logs in Render dashboard
- Monitor application logs for errors

## Next Steps
After successful deployment:
1. Test all API endpoints
2. Update frontend API URL to point to your Render backend
3. Deploy frontend to Vercel 