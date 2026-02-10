// // Backend/DischargeSlips/DischargeTicket/service.js
// // Complete service file with all business logic

// const firebaseService = require('./firebaseService');
// const googleSheetsService = require('./googleSheetsService');
// const { generateTicketId } = require('./utils');

// class DischargeTicketService {
  
//   /**
//    * Create a new discharge ticket
//    * @param {Object} ticketData - Ticket data from request
//    * @returns {Promise<Object>} Created ticket
//    */
//   async createTicket(ticketData) {
//     try {
//       console.log('📝 Creating new discharge ticket...');
      
//       // Generate unique ticket ID
//       const ticketId = await generateTicketId();
//       console.log('🎫 Generated Ticket ID:', ticketId);
      
//       // Build ticket object with all fields
//       const ticket = {
//         ticketId,
//         patientName: ticketData.patientName,
//         age: ticketData.age,
//         sex: ticketData.sex,
//         diagnosisRE: ticketData.diagnosisRE || '',
//         diagnosisLE: ticketData.diagnosisLE || '',
//         admissionDate: ticketData.admissionDate || '',
//         admissionTime: ticketData.admissionTime || '',
//         dischargeDate: ticketData.dischargeDate || '',
//         dischargeTime: ticketData.dischargeTime || '',
//         procedureDone: ticketData.procedureDone || '',
//         surgeryDate: ticketData.surgeryDate || '',
//         otNote: ticketData.otNote || '',
//         conditionsAtDischarge: ticketData.conditionsAtDischarge || '',
//         postOpAdvice: ticketData.postOpAdvice || '',
//         status: ticketData.status || 'Pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save to Firebase (Primary Database)
//       console.log('💾 Saving to Firebase...');
//       await firebaseService.createTicket(ticket);
//       console.log('✅ Saved to Firebase successfully');

//       // Try to save to Google Sheets (Secondary/Backup)
//       try {
//         console.log('📊 Saving to Google Sheets...');
//         await googleSheetsService.addTicket(ticket);
//         console.log('✅ Saved to Google Sheets successfully');
//       } catch (sheetsError) {
//         console.warn('⚠️ Failed to save to Google Sheets (non-critical):', sheetsError.message);
//         // Don't fail the whole operation if Google Sheets fails
//       }

//       console.log('✅ Ticket created successfully:', ticketId);
//       return ticket;
//     } catch (error) {
//       console.error('❌ Error in createTicket service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get all discharge tickets with optional filtering
//    * @param {Object} options - Query options (limit, offset, status)
//    * @returns {Promise<Array>} Array of tickets
//    */
//   async getAllTickets(options = {}) {
//     try {
//       console.log('🔍 Fetching all tickets with options:', options);
//       const { limit = 50, offset = 0, status } = options;
      
//       // Fetch from Firebase (Primary Database)
//       const tickets = await firebaseService.getAllTickets(limit, offset, status);
      
//       console.log('✅ Retrieved', tickets.length, 'tickets from Firebase');
//       return tickets;
//     } catch (error) {
//       console.error('❌ Error in getAllTickets service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get a single discharge ticket by ID
//    * @param {string} ticketId - Ticket ID
//    * @returns {Promise<Object|null>} Ticket data or null
//    */
//   async getTicketById(ticketId) {
//     try {
//       console.log('🔍 Fetching ticket by ID:', ticketId);
//       const ticket = await firebaseService.getTicketById(ticketId);
      
//       if (ticket) {
//         console.log('✅ Ticket found:', ticketId);
//       } else {
//         console.log('⚠️ Ticket not found:', ticketId);
//       }
      
//       return ticket;
//     } catch (error) {
//       console.error('❌ Error in getTicketById service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Update a discharge ticket
//    * @param {string} ticketId - Ticket ID
//    * @param {Object} updateData - Data to update
//    * @returns {Promise<Object>} Updated ticket
//    */
//   async updateTicket(ticketId, updateData) {
//     try {
//       console.log('✏️ Updating ticket:', ticketId);
//       console.log('📝 Update data:', updateData);
      
//       const updatedTicket = {
//         ...updateData,
//         updatedAt: new Date().toISOString()
//       };

//       // Update in Firebase (Primary Database)
//       console.log('💾 Updating in Firebase...');
//       await firebaseService.updateTicket(ticketId, updatedTicket);
//       console.log('✅ Updated in Firebase successfully');

//       // Try to update in Google Sheets (Secondary/Backup)
//       try {
//         console.log('📊 Updating in Google Sheets...');
//         await googleSheetsService.updateTicket(ticketId, updatedTicket);
//         console.log('✅ Updated in Google Sheets successfully');
//       } catch (sheetsError) {
//         console.warn('⚠️ Failed to update in Google Sheets (non-critical):', sheetsError.message);
//         // Don't fail the whole operation if Google Sheets fails
//         // The ticket might not exist in Sheets, but exists in Firebase
//       }

//       console.log('✅ Ticket updated successfully:', ticketId);
//       return updatedTicket;
//     } catch (error) {
//       console.error('❌ Error in updateTicket service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Delete a discharge ticket
//    * @param {string} ticketId - Ticket ID
//    * @returns {Promise<boolean>} Success status
//    */
//   async deleteTicket(ticketId) {
//     try {
//       console.log('🗑️ Deleting ticket:', ticketId);
      
//       // Delete from Firebase (Primary Database)
//       console.log('💾 Deleting from Firebase...');
//       await firebaseService.deleteTicket(ticketId);
//       console.log('✅ Deleted from Firebase successfully');

//       // Try to delete from Google Sheets (Secondary/Backup)
//       try {
//         console.log('📊 Deleting from Google Sheets...');
//         await googleSheetsService.deleteTicket(ticketId);
//         console.log('✅ Deleted from Google Sheets successfully');
//       } catch (sheetsError) {
//         console.warn('⚠️ Failed to delete from Google Sheets (non-critical):', sheetsError.message);
//         // Don't fail the whole operation if Google Sheets fails
//         // The ticket might not exist in Sheets, but exists in Firebase
//       }

//       console.log('✅ Ticket deleted successfully:', ticketId);
//       return true;
//     } catch (error) {
//       console.error('❌ Error in deleteTicket service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get dashboard statistics
//    * @returns {Promise<Object>} Statistics object
//    */
//   async getDashboardStats() {
//     try {
//       console.log('📊 Fetching dashboard statistics...');
//       const stats = await firebaseService.getDashboardStats();
//       console.log('✅ Dashboard stats retrieved:', stats);
//       return stats;
//     } catch (error) {
//       console.error('❌ Error in getDashboardStats service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get tickets by date range
//    * @param {string} startDate - Start date (YYYY-MM-DD)
//    * @param {string} endDate - End date (YYYY-MM-DD)
//    * @returns {Promise<Array>} Array of tickets
//    */
//   async getTicketsByDateRange(startDate, endDate) {
//     try {
//       console.log('📅 Fetching tickets by date range:', startDate, 'to', endDate);
//       const tickets = await firebaseService.getTicketsByDateRange(startDate, endDate);
//       console.log('✅ Retrieved', tickets.length, 'tickets in date range');
//       return tickets;
//     } catch (error) {
//       console.error('❌ Error in getTicketsByDateRange service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Search tickets by query
//    * @param {string} query - Search query
//    * @returns {Promise<Array>} Array of matching tickets
//    */
//   async searchTickets(query) {
//     try {
//       console.log('🔍 Searching tickets with query:', query);
//       const tickets = await firebaseService.searchTickets(query);
//       console.log('✅ Found', tickets.length, 'matching tickets');
//       return tickets;
//     } catch (error) {
//       console.error('❌ Error in searchTickets service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get clinic profile for PDF generation
//    * @returns {Promise<Object>} Clinic profile data
//    */
//   // async getClinicProfile() {
//   //   try {
//   //     console.log('🏥 Fetching clinic profile...');
      
//   //     const admin = require('firebase-admin');
//   //     const db = admin.firestore();
//   //     const profileDoc = await db.collection('clinic-profile').doc('profile').get();
      
//   //     // Default clinic profile (fallback)
//   //     let clinicProfile = {
//   //       clinicName: 'MADHUREKHA EYE CARE CENTRE',
//   //       address: 'E-501, Sonari East (Beside Sabuj Sangha Kali Puja Maidan), Jamshedpur - 831011',
//   //       registrationNumber: '',
//   //       panNumber: '',
//   //       doctor1Name: 'DR. PRADIPTA KUNDU',
//   //       doctor1RegNumber: 'MBBS (HONS.), MS, D.O., DNB, FICO (I)',
//   //       doctor2Name: 'Dr. (Mrs.) AMITA KUNDU',
//   //       doctor2RegNumber: 'MBBS, MS, FCLI, FICO (I)',
//   //       phone: '9431346646'
//   //     };
      
//   //     // Merge with data from Firestore if it exists
//   //     if (profileDoc.exists) {
//   //       const firestoreData = profileDoc.data();
//   //       clinicProfile = { ...clinicProfile, ...firestoreData };
//   //       console.log('✅ Clinic profile loaded from Firestore');
//   //     } else {
//   //       console.log('⚠️ Using default clinic profile (Firestore doc not found)');
//   //     }
      
//   //     console.log('🏥 Clinic:', clinicProfile.clinicName);
//   //     return clinicProfile;
//   //   } catch (error) {
//   //     console.error('❌ Error fetching clinic profile:', error);
//   //     console.log('⚠️ Returning default clinic profile due to error');
      
//   //     // Return default profile if there's an error
//   //     return {
//   //       clinicName: 'MADHUREKHA EYE CARE CENTRE',
//   //       address: 'E-501, Sonari East (Beside Sabuj Sangha Kali Puja Maidan), Jamshedpur - 831011',
//   //       registrationNumber: '',
//   //       panNumber: '',
//   //       doctor1Name: 'DR. PRADIPTA KUNDU',
//   //       doctor1RegNumber: 'MBBS (HONS.), MS, D.O., DNB, FICO (I)',
//   //       doctor2Name: 'Dr. (Mrs.) AMITA KUNDU',
//   //       doctor2RegNumber: 'MBBS, MS, FCLI, FICO (I)',
//   //       phone: '9431346646'
//   //     };
//   //   }
//   // }
//   // Replace the entire getClinicProfile() method with this:
// async getClinicProfile() {
//   try {
//     console.log('🏥 Fetching clinic profile from Firebase Firestore...');
    
//     const admin = require('firebase-admin');
//     const db = admin.firestore();
    
//     const profileDoc = await db.collection('clinic-profile').doc('profile').get();
    
//     if (!profileDoc.exists) {
//       throw new Error('Clinic profile document not found in Firestore (clinic-profile/profile)');
//     }
    
//     const clinicProfile = profileDoc.data();
    
//     // Validate required fields
//     if (!clinicProfile.clinicName) {
//       throw new Error('Clinic name is missing in Firestore profile');
//     }
    
//     console.log('✅ Clinic profile loaded:', clinicProfile.clinicName);
//     return clinicProfile;
    
//   } catch (error) {
//     console.error('❌ Clinic profile error:', error.message);
//     throw new Error(`Clinic profile unavailable: ${error.message}`);
//   }
// }


//   /**
//    * Get recent tickets (last 10)
//    * @returns {Promise<Array>} Array of recent tickets
//    */
//   async getRecentTickets() {
//     try {
//       console.log('⏰ Fetching recent tickets...');
//       const tickets = await firebaseService.getAllTickets(10, 0);
//       console.log('✅ Retrieved', tickets.length, 'recent tickets');
//       return tickets;
//     } catch (error) {
//       console.error('❌ Error in getRecentTickets service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get tickets count by status
//    * @returns {Promise<Object>} Count by status
//    */
//   async getTicketCountByStatus() {
//     try {
//       console.log('📊 Fetching ticket count by status...');
      
//       const allTickets = await firebaseService.getAllTickets();
      
//       const counts = {
//         total: allTickets.length,
//         pending: allTickets.filter(t => t.status === 'Pending').length,
//         completed: allTickets.filter(t => t.status === 'Completed').length
//       };
      
//       console.log('✅ Ticket counts:', counts);
//       return counts;
//     } catch (error) {
//       console.error('❌ Error in getTicketCountByStatus service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Bulk delete tickets
//    * @param {Array<string>} ticketIds - Array of ticket IDs to delete
//    * @returns {Promise<Object>} Result with success and failed IDs
//    */
//   async bulkDeleteTickets(ticketIds) {
//     try {
//       console.log('🗑️ Bulk deleting', ticketIds.length, 'tickets...');
      
//       const results = {
//         success: [],
//         failed: []
//       };

//       for (const ticketId of ticketIds) {
//         try {
//           await this.deleteTicket(ticketId);
//           results.success.push(ticketId);
//         } catch (error) {
//           console.error('❌ Failed to delete ticket:', ticketId, error.message);
//           results.failed.push({ ticketId, error: error.message });
//         }
//       }

//       console.log('✅ Bulk delete completed. Success:', results.success.length, 'Failed:', results.failed.length);
//       return results;
//     } catch (error) {
//       console.error('❌ Error in bulkDeleteTickets service:', error);
//       throw error;
//     }
//   }

//   /**
//    * Update ticket status
//    * @param {string} ticketId - Ticket ID
//    * @param {string} status - New status
//    * @returns {Promise<Object>} Updated ticket
//    */
//   async updateTicketStatus(ticketId, status) {
//     try {
//       console.log('🔄 Updating ticket status:', ticketId, 'to', status);
      
//       const ticket = await this.getTicketById(ticketId);
//       if (!ticket) {
//         throw new Error('Ticket not found');
//       }

//       const updatedTicket = await this.updateTicket(ticketId, {
//         ...ticket,
//         status: status
//       });

//       console.log('✅ Ticket status updated successfully');
//       return updatedTicket;
//     } catch (error) {
//       console.error('❌ Error in updateTicketStatus service:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new DischargeTicketService();




























// Backend/DischargeSlips/DischargeTicket/service.js
const firebaseService = require('./firebaseService');
const googleSheetsService = require('./googleSheetsService');
const { 
  generateTicketId, 
  getInternalId, 
  getDisplayId,
  getFinancialYear,
  validateTicketData,
  sanitizeTicketData
} = require('./utils');

class DischargeTicketService {
  
  /**
   * Create a new discharge ticket
   */
  async createTicket(ticketData) {
    try {
      console.log('📝 Creating discharge ticket...');
      console.log('📦 Received data:', JSON.stringify(ticketData, null, 2));

      // Validate data
      const validation = validateTicketData(ticketData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Sanitize data
      const sanitizedData = sanitizeTicketData(ticketData);

      // Generate display ID: 25-26/DT-0001 ✅
      console.log('🎫 Generating ticket ID...');
      const displayId = await generateTicketId();
      
      if (!displayId) {
        throw new Error('Failed to generate ticket ID');
      }
      
      console.log('🧾 Generated Display ID:', displayId);

      // Convert to internal ID for Firestore: 25-26_DT-0001 ✅
      const internalId = getInternalId(displayId);
      
      if (!internalId) {
        throw new Error('Failed to convert to internal ID');
      }
      
      console.log('🔑 Internal ID:', internalId);
      
      const financialYear = getFinancialYear();
      console.log('📅 Financial Year:', financialYear);

      const ticket = {
        ticketId: displayId,         // ✅ Shows 25-26/DT-0001 everywhere
        internalId,                  // ✅ Firestore document ID
        financialYear,               // 25-26
        ...sanitizedData,            // Use sanitized data
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('💾 Ticket object prepared:', JSON.stringify(ticket, null, 2));

      // Save to Firebase using INTERNAL ID
      console.log('💾 Saving to Firebase...');
      await firebaseService.createTicket(internalId, ticket);
      console.log('✅ Saved to Firebase successfully');

      // Save to Google Sheets using DISPLAY ID
      try {
        console.log('📊 Saving to Google Sheets...');
        await googleSheetsService.addTicket(ticket);
        console.log('✅ Saved to Google Sheets successfully');
      } catch (err) {
        console.warn('⚠️ Google Sheets save failed (non-critical):', err.message);
      }

      console.log('✅ Ticket created successfully:', displayId);
      return ticket;

    } catch (error) {
      console.error('❌ createTicket error:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  /**
   * Get all discharge tickets
   */
  async getAllTickets({ limit = 50, offset = 0, status, financialYear } = {}) {
    try {
      console.log('🔍 Fetching tickets...');
      console.log(`📊 Params: limit=${limit}, offset=${offset}, status=${status}, FY=${financialYear}`);
      
      const tickets = await firebaseService.getAllTickets(limit, offset, status, financialYear);
      console.log(`✅ Found ${tickets.length} tickets`);
      
      // Convert internal IDs back to display format
      const converted = tickets.map(ticket => ({
        ...ticket,
        ticketId: getDisplayId(ticket.internalId) // ✅ Returns 25-26/DT-0001
      }));
      
      return converted;
    } catch (error) {
      console.error('❌ getAllTickets error:', error);
      throw error;
    }
  }

  /**
   * Get by display ID (25-26/DT-0001)
   */
  async getTicketById(displayId) {
    try {
      console.log('🔍 Fetching ticket:', displayId);
      const internalId = getInternalId(displayId);
      
      if (!internalId) {
        throw new Error('Invalid ticket ID format');
      }
      
      console.log('🔑 Using internal ID:', internalId);
      const ticket = await firebaseService.getTicketById(internalId);
      
      if (ticket) {
        ticket.ticketId = displayId; // ✅ Ensure display format
        console.log('✅ Ticket found');
      } else {
        console.log('⚠️ Ticket not found');
      }
      
      return ticket;
    } catch (error) {
      console.error('❌ getTicketById error:', error);
      throw error;
    }
  }

  /**
   * Update by display ID
   */
  async updateTicket(displayId, updateData) {
    try {
      console.log('✏️ Updating ticket:', displayId);
      console.log('📝 Update data:', JSON.stringify(updateData, null, 2));
      
      const internalId = getInternalId(displayId);
      
      if (!internalId) {
        throw new Error('Invalid ticket ID format');
      }

      const updatedTicket = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await firebaseService.updateTicket(internalId, updatedTicket);
      console.log('✅ Updated in Firebase');

      try {
        await googleSheetsService.updateTicket(displayId, updatedTicket);
        console.log('✅ Updated in Google Sheets');
      } catch (err) {
        console.warn('⚠️ Google Sheets update failed:', err.message);
      }

      updatedTicket.ticketId = displayId;
      return updatedTicket;
    } catch (error) {
      console.error('❌ updateTicket error:', error);
      throw error;
    }
  }

  /**
   * Delete by display ID
   */
  async deleteTicket(displayId) {
    try {
      console.log('🗑️ Deleting ticket:', displayId);
      const internalId = getInternalId(displayId);
      
      if (!internalId) {
        throw new Error('Invalid ticket ID format');
      }

      await firebaseService.deleteTicket(internalId);
      console.log('✅ Deleted from Firebase');

      try {
        await googleSheetsService.deleteTicket(displayId);
        console.log('✅ Deleted from Google Sheets');
      } catch (err) {
        console.warn('⚠️ Google Sheets delete failed:', err.message);
      }

      return true;
    } catch (error) {
      console.error('❌ deleteTicket error:', error);
      throw error;
    }
  }

  async getDashboardStats({ financialYear } = {}) {
    try {
      console.log('📊 Dashboard stats...');
      const stats = await firebaseService.getDashboardStats(financialYear);
      console.log('✅ Stats retrieved:', stats);
      return stats;
    } catch (error) {
      console.error('❌ getDashboardStats error:', error);
      throw error;
    }
  }

  async getTicketsByDateRange(startDate, endDate) {
    try {
      console.log('📅 Fetching by date range:', startDate, 'to', endDate);
      const tickets = await firebaseService.getTicketsByDateRange(startDate, endDate);
      
      return tickets.map(ticket => ({
        ...ticket,
        ticketId: getDisplayId(ticket.internalId)
      }));
    } catch (error) {
      console.error('❌ getTicketsByDateRange error:', error);
      throw error;
    }
  }

  async searchTickets(query) {
    try {
      console.log('🔍 Searching:', query);
      const results = await firebaseService.searchTickets(query);
      
      return results.map(ticket => ({
        ...ticket,
        ticketId: getDisplayId(ticket.internalId)
      }));
    } catch (error) {
      console.error('❌ searchTickets error:', error);
      throw error;
    }
  }

  async getClinicProfile() {
    try {
      console.log('🏥 Fetching clinic profile from Firebase Firestore...');
      
      const admin = require('firebase-admin');
      const db = admin.firestore();
      
      const profileDoc = await db.collection('clinic-profile').doc('profile').get();
      
      if (!profileDoc.exists) {
        throw new Error('Clinic profile document not found in Firestore (clinic-profile/profile)');
      }
      
      const clinicProfile = profileDoc.data();
      
      if (!clinicProfile.clinicName) {
        throw new Error('Clinic name is missing in Firestore profile');
      }
      
      console.log('✅ Clinic profile loaded:', clinicProfile.clinicName);
      return clinicProfile;
      
    } catch (error) {
      console.error('❌ Clinic profile error:', error.message);
      throw new Error(`Clinic profile unavailable: ${error.message}`);
    }
  }

  async getRecentTickets() {
    try {
      console.log('⏰ Fetching recent tickets...');
      const tickets = await firebaseService.getAllTickets(10, 0);
      
      return tickets.map(ticket => ({
        ...ticket,
        ticketId: getDisplayId(ticket.internalId)
      }));
    } catch (error) {
      console.error('❌ getRecentTickets error:', error);
      throw error;
    }
  }

  async getTicketCountByStatus() {
    try {
      console.log('📊 Fetching ticket count by status...');
      
      const allTickets = await firebaseService.getAllTickets();
      
      const counts = {
        total: allTickets.length,
        pending: allTickets.filter(t => t.status === 'Pending').length,
        completed: allTickets.filter(t => t.status === 'Completed').length
      };
      
      console.log('✅ Ticket counts:', counts);
      return counts;
    } catch (error) {
      console.error('❌ getTicketCountByStatus error:', error);
      throw error;
    }
  }

  async bulkDeleteTickets(ticketIds) {
    try {
      console.log('🗑️ Bulk deleting', ticketIds.length, 'tickets...');
      
      const results = {
        success: [],
        failed: []
      };

      for (const ticketId of ticketIds) {
        try {
          await this.deleteTicket(ticketId);
          results.success.push(ticketId);
        } catch (error) {
          console.error('❌ Failed to delete ticket:', ticketId, error.message);
          results.failed.push({ ticketId, error: error.message });
        }
      }

      console.log('✅ Bulk delete completed. Success:', results.success.length, 'Failed:', results.failed.length);
      return results;
    } catch (error) {
      console.error('❌ bulkDeleteTickets error:', error);
      throw error;
    }
  }

  async updateTicketStatus(ticketId, status) {
    try {
      console.log('🔄 Updating ticket status:', ticketId, 'to', status);
      
      const ticket = await this.getTicketById(ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      const updatedTicket = await this.updateTicket(ticketId, {
        ...ticket,
        status: status
      });

      console.log('✅ Ticket status updated successfully');
      return updatedTicket;
    } catch (error) {
      console.error('❌ updateTicketStatus error:', error);
      throw error;
    }
  }
}

module.exports = new DischargeTicketService();