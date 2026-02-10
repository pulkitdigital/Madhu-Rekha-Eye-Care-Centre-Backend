// // Backend/DischargeSlips/DischargeTicket/controller.js
// const service = require('./service');
// const pdfService = require('./pdfService');

// // Create a new discharge ticket
// exports.createTicket = async (req, res) => {
//   try {
//     const ticketData = req.body;
//     const result = await service.createTicket(ticketData);
    
//     res.status(201).json({
//       success: true,
//       message: 'Discharge ticket created successfully',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error in createTicket controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create discharge ticket',
//       error: error.message
//     });
//   }
// };

// // Get all discharge tickets
// exports.getAllTickets = async (req, res) => {
//   try {
//     const { limit, offset, status } = req.query;
//     const result = await service.getAllTickets({ limit, offset, status });
    
//     res.status(200).json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error in getAllTickets controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch discharge tickets',
//       error: error.message
//     });
//   }
// };

// // Get a single discharge ticket by ID
// exports.getTicketById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await service.getTicketById(id);
    
//     if (!result) {
//       return res.status(404).json({
//         success: false,
//         message: 'Discharge ticket not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error in getTicketById controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch discharge ticket',
//       error: error.message
//     });
//   }
// };

// // Update a discharge ticket
// exports.updateTicket = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;
//     const result = await service.updateTicket(id, updateData);
    
//     res.status(200).json({
//       success: true,
//       message: 'Discharge ticket updated successfully',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error in updateTicket controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update discharge ticket',
//       error: error.message
//     });
//   }
// };

// // Delete a discharge ticket
// exports.deleteTicket = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await service.deleteTicket(id);
    
//     res.status(200).json({
//       success: true,
//       message: 'Discharge ticket deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error in deleteTicket controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete discharge ticket',
//       error: error.message
//     });
//   }
// };

// // Get dashboard statistics
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const stats = await service.getDashboardStats();
    
//     res.status(200).json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     console.error('Error in getDashboardStats controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard statistics',
//       error: error.message
//     });
//   }
// };

// // Get tickets by date range
// exports.getTicketsByDateRange = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const result = await service.getTicketsByDateRange(startDate, endDate);
    
//     res.status(200).json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error in getTicketsByDateRange controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch tickets by date range',
//       error: error.message
//     });
//   }
// };

// // Search tickets
// exports.searchTickets = async (req, res) => {
//   try {
//     const { q } = req.query;
//     const result = await service.searchTickets(q);
    
//     res.status(200).json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error in searchTickets controller:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to search tickets',
//       error: error.message
//     });
//   }
// };

// // Generate and download PDF
// exports.generatePDF = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     console.log('📄 PDF Generation Request');
//     console.log('🎫 Ticket ID:', id);
//     console.log('🌐 Request URL:', req.originalUrl);
    
//     // Get ticket data
//     const ticket = await service.getTicketById(id);
    
//     if (!ticket) {
//       console.error('❌ Ticket not found:', id);
//       return res.status(404).json({
//         success: false,
//         message: 'Discharge ticket not found'
//       });
//     }
    
//     console.log('✅ Ticket data retrieved');
//     console.log('👤 Patient:', ticket.patientName);
    
//     // Get clinic profile
//     const clinicProfile = await service.getClinicProfile();
//     console.log('✅ Clinic profile loaded');
//     console.log('🏥 Clinic:', clinicProfile.clinicName);
    
//     // Generate PDF
//     console.log('🔨 Generating PDF...');
//     const pdfBuffer = await pdfService.generatePDF(ticket, clinicProfile);
    
//     console.log('✅ PDF generated successfully');
//     console.log('📦 Buffer size:', pdfBuffer.length, 'bytes');
//     console.log('📦 Buffer size (KB):', (pdfBuffer.length / 1024).toFixed(2), 'KB');
    
//     // Set response headers for PDF download
//     const filename = `DischargeTicket-${id}-${ticket.patientName.replace(/\s+/g, '_')}.pdf`;
    
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Length', pdfBuffer.length);
//     res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');
    
//     console.log('📤 Sending PDF to client...');
//     console.log('📝 Filename:', filename);
    
//     // Send PDF buffer
//     res.send(pdfBuffer);
    
//     console.log('✅ PDF sent successfully');
    
//   } catch (error) {
//     console.error('❌ Error generating PDF:', error);
//     console.error('📋 Error stack:', error.stack);
    
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate PDF',
//       error: error.message,
//       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };











// Backend/DischargeSlips/DischargeTicket/controller.js
const service = require('./service');
const pdfService = require('./pdfService');

// Create a new discharge ticket
exports.createTicket = async (req, res) => {
  try {
    console.log('🎯 POST /discharge-ticket - Controller started');
    console.log('📥 Request Body:', JSON.stringify(req.body, null, 2));

    const ticketData = req.body;
    
    // Validate request body
    if (!ticketData || Object.keys(ticketData).length === 0) {
      console.error('❌ Empty request body');
      return res.status(400).json({
        success: false,
        message: 'Request body is empty'
      });
    }

    const result = await service.createTicket(ticketData);
    
    console.log('✅ Controller: Ticket created successfully');
    console.log('🎫 Ticket ID:', result.ticketId);
    
    res.status(201).json({
      success: true,
      message: 'Discharge ticket created successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Error in createTicket controller:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create discharge ticket',
      error: error.message
    });
  }
};

// Get all discharge tickets
exports.getAllTickets = async (req, res) => {
  try {
    console.log('🎯 GET /discharge-ticket - Controller started');
    
    const { limit, offset, status, financialYear } = req.query;
    
    const result = await service.getAllTickets({ 
      limit, 
      offset, 
      status,
      financialYear 
    });
    
    console.log(`✅ Controller: Retrieved ${result.length} tickets`);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Error in getAllTickets controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discharge tickets',
      error: error.message
    });
  }
};

// Get a single discharge ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    console.log('🎯 GET /discharge-ticket/:id - Controller started');
    
    const ticketId = decodeURIComponent(req.params.id);
    console.log('🔑 Ticket ID:', ticketId);
    
    const result = await service.getTicketById(ticketId);
    
    if (!result) {
      console.log('⚠️ Ticket not found:', ticketId);
      return res.status(404).json({
        success: false,
        message: 'Discharge ticket not found'
      });
    }
    
    console.log('✅ Controller: Ticket found');
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Error in getTicketById controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discharge ticket',
      error: error.message
    });
  }
};

// Update a discharge ticket
exports.updateTicket = async (req, res) => {
  try {
    console.log('🎯 PUT /discharge-ticket/:id - Controller started');
    
    const ticketId = decodeURIComponent(req.params.id);
    console.log('🔑 Ticket ID:', ticketId);
    console.log('📝 Update Data:', JSON.stringify(req.body, null, 2));
    
    const updateData = req.body;
    const result = await service.updateTicket(ticketId, updateData);
    
    console.log('✅ Controller: Ticket updated');
    
    res.status(200).json({
      success: true,
      message: 'Discharge ticket updated successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Error in updateTicket controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update discharge ticket',
      error: error.message
    });
  }
};

// Delete a discharge ticket
exports.deleteTicket = async (req, res) => {
  try {
    console.log('🎯 DELETE /discharge-ticket/:id - Controller started');
    
    const ticketId = decodeURIComponent(req.params.id);
    console.log('🔑 Ticket ID:', ticketId);
    
    await service.deleteTicket(ticketId);
    
    console.log('✅ Controller: Ticket deleted');
    
    res.status(200).json({
      success: true,
      message: 'Discharge ticket deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error in deleteTicket controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete discharge ticket',
      error: error.message
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    console.log('🎯 GET /stats/dashboard - Controller started');
    
    const { financialYear } = req.query;
    
    const stats = await service.getDashboardStats({ financialYear });
    
    console.log('✅ Controller: Stats retrieved');
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error in getDashboardStats controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get tickets by date range
exports.getTicketsByDateRange = async (req, res) => {
  try {
    console.log('🎯 GET /filter/date-range - Controller started');
    
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const result = await service.getTicketsByDateRange(startDate, endDate);
    
    console.log(`✅ Controller: Found ${result.length} tickets in range`);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Error in getTicketsByDateRange controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets by date range',
      error: error.message
    });
  }
};

// Search tickets
exports.searchTickets = async (req, res) => {
  try {
    console.log('🎯 GET /search/query - Controller started');
    
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const result = await service.searchTickets(q);
    
    console.log(`✅ Controller: Found ${result.length} matching tickets`);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Error in searchTickets controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search tickets',
      error: error.message
    });
  }
};

// Generate and download PDF
exports.generatePDF = async (req, res) => {
  try {
    const ticketId = decodeURIComponent(req.params.id);
    
    console.log('📄 PDF Generation Request');
    console.log('🎫 Ticket ID:', ticketId);
    console.log('🌐 Request URL:', req.originalUrl);
    
    // Get ticket data
    const ticket = await service.getTicketById(ticketId);
    
    if (!ticket) {
      console.error('❌ Ticket not found:', ticketId);
      return res.status(404).json({
        success: false,
        message: 'Discharge ticket not found'
      });
    }
    
    console.log('✅ Ticket data retrieved');
    console.log('👤 Patient:', ticket.patientName);
    
    // Get clinic profile
    const clinicProfile = await service.getClinicProfile();
    console.log('✅ Clinic profile loaded');
    console.log('🏥 Clinic:', clinicProfile.clinicName);
    
    // Generate PDF
    console.log('🔨 Generating PDF...');
    const pdfBuffer = await pdfService.generatePDF(ticket, clinicProfile);
    
    console.log('✅ PDF generated successfully');
    console.log('📦 Buffer size:', pdfBuffer.length, 'bytes');
    console.log('📦 Buffer size (KB):', (pdfBuffer.length / 1024).toFixed(2), 'KB');
    
    // Set response headers for PDF download
    const filename = `DischargeTicket-${ticketId.replace(/\//g, '-')}-${ticket.patientName.replace(/\s+/g, '_')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log('📤 Sending PDF to client...');
    console.log('📝 Filename:', filename);
    
    // Send PDF buffer
    res.send(pdfBuffer);
    
    console.log('✅ PDF sent successfully');
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    console.error('📋 Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};