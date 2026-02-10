// Backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Firebase config and initialize
const { initializeFirebase } = require('./config/firebase.config');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ STEP 1: Initialize Firebase FIRST (before importing routes)
initializeFirebase();

// ✅ STEP 2: Setup Middleware (after Firebase init)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ STEP 3: Import routes AFTER Firebase is initialized
const dischargeTicketRoutes = require('./DischargeSlips/DischargeTicket/routes');
const dischargeSummaryRoutes = require('./DischargeSlips/DischargeSummary/routes');
const clinicProfileRoutes = require('./ClinicProfile/routes');

// ✅ STEP 4: Register Routes
app.use('/api/discharge-slips/discharge-ticket', dischargeTicketRoutes);
app.use('/api/discharge-slips/discharge-summary', dischargeSummaryRoutes);
app.use('/api/clinic-profile', clinicProfileRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Madhu Rekha Eye Care Centre API is running"
  });
});


// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Madhurekha Eye Care Centre Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ✅ STEP 5: Start Server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Madhurekha Eye Care Centre Backend Started`);
  console.log('='.repeat(60));
  console.log('📡 Available APIs:');
  console.log(`   ✅ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   ✅ Discharge Tickets: http://localhost:${PORT}/api/discharge-slips/discharge-ticket`);
  console.log(`   ✅ Clinic Profile: http://localhost:${PORT}/api/clinic-profile`);
  console.log('='.repeat(60));
});