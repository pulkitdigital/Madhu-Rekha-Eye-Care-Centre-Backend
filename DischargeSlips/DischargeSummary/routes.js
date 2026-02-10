const express = require('express');
const router = express.Router();
const controller = require('./controller');

// ========================================
// IMPORTANT: Route Order Matters!
// ========================================
// Specific routes MUST come BEFORE parameterized routes (/:id)
// Otherwise /:id will capture everything

// ========================================
// STATIC ROUTES (Come first)
// ========================================

// Get dashboard statistics
// GET /api/discharge-slips/discharge-summary/stats/dashboard
router.get('/stats/dashboard', controller.getDashboardStats);

// Search discharge summaries
// GET /api/discharge-slips/discharge-summary/search/query?q=...
router.get('/search/query', controller.searchSummaries);

// ========================================
// PDF GENERATION ROUTE
// ========================================
// MUST be before /:id
// GET /api/discharge-slips/discharge-summary/:id/pdf
router.get('/:id/pdf', controller.generatePDF);

// ========================================
// CRUD ROUTES
// ========================================

// Create a new discharge summary
// POST /api/discharge-slips/discharge-summary
router.post('/', controller.createSummary);

// Get all discharge summaries
// GET /api/discharge-slips/discharge-summary
router.get('/', controller.getAllSummaries);

// Get a single discharge summary by ID
// GET /api/discharge-slips/discharge-summary/:id
router.get('/:id', controller.getSummaryById);

// Update a discharge summary
// PUT /api/discharge-slips/discharge-summary/:id
router.put('/:id', controller.updateSummary);

// Delete a discharge summary
// DELETE /api/discharge-slips/discharge-summary/:id
router.delete('/:id', controller.deleteSummary);

module.exports = router;
