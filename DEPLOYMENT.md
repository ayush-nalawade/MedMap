# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab Account**: Your code should be in a Git repository
3. **MongoDB Atlas**: Set up your MongoDB database

## Environment Variables Setup

### Backend Environment Variables (Set in Vercel Dashboard)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
PORT=5000
```

### Frontend Environment Variables

Update the API URL in `Frontend/src/utils/api.js` with your actual backend Vercel URL:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-backend-url.vercel.app/api'
  : 'http://localhost:5000/api';
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set build settings
   - Deploy

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**
2. **Connect Vercel to GitHub**:
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings

3. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `Frontend/build`
   - **Install Command**: `npm install`

4. **Set Environment Variables** (as mentioned above)

5. **Deploy**

## Build Configuration

The project is configured with:
- **Frontend**: Vite + React (builds to `Frontend/build/`)
- **Backend**: Node.js + Express (serverless functions)
- **Monorepo**: Single repository with both frontend and backend

## Post-Deployment

1. **Update API URLs**: Replace placeholder URLs with actual Vercel URLs
2. **Test Authentication**: Ensure JWT tokens work correctly
3. **Test Database Connection**: Verify MongoDB Atlas connection
4. **Set up Custom Domain** (optional)

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check if all dependencies are in `package.json`
   - Verify build commands in `vercel.json`

2. **API Connection Issues**:
   - Ensure environment variables are set correctly
   - Check CORS configuration
   - Verify API endpoints are working

3. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas

### Debug Commands

```bash
# Check build locally
npm run build

# Test backend locally
npm start

# Test frontend locally
cd Frontend && npm start
```

## Security Notes

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random secret
3. **MongoDB**: Use connection string with proper authentication
4. **CORS**: Configure properly for production domains

## Performance Optimization

1. **Frontend**: Vite handles optimization automatically
2. **Backend**: Vercel serverless functions scale automatically
3. **Database**: Consider MongoDB Atlas performance tiers
4. **CDN**: Vercel provides global CDN automatically 