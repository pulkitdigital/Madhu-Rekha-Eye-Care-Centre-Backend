const service = require('./service');
const pdfService = require('./pdfService');

// =======================================
// CREATE
// =======================================

// Create a new discharge summary
exports.createSummary = async (req, res) => {
  try {
    const summaryData = req.body;

    const result = await service.createSummary(summaryData);

    res.status(201).json({
      success: true,
      message: 'Discharge summary created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in createSummary controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create discharge summary',
      error: error.message
    });
  }
};

// =======================================
// READ
// =======================================

// Get all discharge summaries
exports.getAllSummaries = async (req, res) => {
  try {
    const { limit, offset, status } = req.query;

    const result = await service.getAllSummaries({ limit, offset, status });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getAllSummaries controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discharge summaries',
      error: error.message
    });
  }
};

// Get a single discharge summary by ID
exports.getSummaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await service.getSummaryById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Discharge summary not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getSummaryById controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discharge summary',
      error: error.message
    });
  }
};

// =======================================
// UPDATE
// =======================================

// Update a discharge summary
exports.updateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await service.updateSummary(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Discharge summary updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateSummary controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update discharge summary',
      error: error.message
    });
  }
};

// =======================================
// DELETE
// =======================================

// Delete a discharge summary
exports.deleteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    await service.deleteSummary(id);

    res.status(200).json({
      success: true,
      message: 'Discharge summary deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteSummary controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete discharge summary',
      error: error.message
    });
  }
};

// =======================================
// DASHBOARD
// =======================================

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await service.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getDashboardStats controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// =======================================
// SEARCH
// =======================================

// Search summaries
exports.searchSummaries = async (req, res) => {
  try {
    const { q } = req.query;

    const result = await service.searchSummaries(q);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in searchSummaries controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search discharge summaries',
      error: error.message
    });
  }
};

// =======================================
// PDF GENERATION  ✅ THIS WAS MISSING
// =======================================

exports.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('📄 Generating Discharge Summary PDF:', id);

    // Fetch summary
    const summary = await service.getSummaryById(id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'Discharge summary not found'
      });
    }

    // Fetch clinic profile
    const clinicProfile = await service.getClinicProfile();

    // Generate PDF
    const pdfBuffer = await pdfService.generatePDF(summary, clinicProfile);

    const filename = `DischargeSummary-${id}-${summary.patientName.replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error generating summary PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate discharge summary PDF',
      error: error.message
    });
  }
};
