// Backend/DischargeSlips/DischargeTicket/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// ========================================
// IMPORTANT: Route Order Matters!
// ========================================
// Specific routes MUST come BEFORE parameterized routes (/:id)
// Otherwise /:id will match everything including "stats", "search", "pdf", etc.

// ========================================
// STATIC ROUTES (Come first)
// ========================================

// Get dashboard statistics
router.get('/stats/dashboard', controller.getDashboardStats);

// Get tickets by date range
router.get('/filter/date-range', controller.getTicketsByDateRange);

// Search tickets
router.get('/search/query', controller.searchTickets);

// ========================================
// PDF GENERATION ROUTE
// ========================================
// CRITICAL: This MUST be before the /:id route
// Format: GET /api/discharge-slips/discharge-ticket/:id/pdf
router.get('/:id/pdf', controller.generatePDF);

// ========================================
// CRUD ROUTES
// ========================================

// Create a new discharge ticket
// POST /api/discharge-slips/discharge-ticket
router.post('/', controller.createTicket);

// Get all discharge tickets
// GET /api/discharge-slips/discharge-ticket
router.get('/', controller.getAllTickets);

// Get a single discharge ticket by ID
// GET /api/discharge-slips/discharge-ticket/:id
router.get('/:id', controller.getTicketById);

// Update a discharge ticket
// PUT /api/discharge-slips/discharge-ticket/:id
router.put('/:id', controller.updateTicket);

// Delete a discharge ticket
// DELETE /api/discharge-slips/discharge-ticket/:id
router.delete('/:id', controller.deleteTicket);

module.exports = router;