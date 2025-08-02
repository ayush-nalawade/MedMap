const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config');

dotenv.config();
connectDB();

const allowedOrigins = [
    'https://med-map-8msp.vercel.app', // your frontend Vercel URL
    'http://localhost:3000',           // for local development (optional)
  ];

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // if you use cookies/auth
  }));

app.options('*', cors({
    origin: allowedOrigins,
    credentials: true,
  }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctor'));
app.use('/api/consultants', require('./routes/consultant'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/test', require('./routes/test'));

module.exports = app;

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 
