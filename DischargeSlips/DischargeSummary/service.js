// // Backend/DischargeSlips/DischargeSummary/service.js

// const firebaseService = require('./firebaseService');
// const googleSheetsService = require('./googleSheetsService');
// const { generateSummaryId, getFinancialYear } = require('./utils');
// const admin = require('firebase-admin');

// class DischargeSummaryService {

//   /**
//    * Create a new discharge summary
//    */
//   async createSummary(summaryData) {
//     try {
//       console.log('📝 Creating discharge summary...');

//       const summaryId = await generateSummaryId();
//       console.log('🧾 Generated Summary ID:', summaryId);

//       const summary = {
//         summaryId,
//         patientName: summaryData.patientName,
//         age: summaryData.age,
//         sex: summaryData.sex,
//         diagnosis: summaryData.diagnosis || '',
//         eyeRE: summaryData.eyeRE || '',
//         eyeLE: summaryData.eyeLE || '',
//         procedure: summaryData.procedure || '',
//         procedureDate: summaryData.procedureDate || '',
//         status: summaryData.status || 'Pending',   // ✅ ADDED
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save to Firebase (primary)
//       await firebaseService.createSummary(summary);

//       // Save to Google Sheets (secondary – non-blocking)
//       try {
//         await googleSheetsService.addSummary(summary);
//       } catch (err) {
//         console.warn('⚠️ Google Sheets save failed (non-critical):', err.message);
//       }

//       console.log('✅ Discharge summary created:', summaryId);
//       return summary;

//     } catch (error) {
//       console.error('❌ createSummary error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get all discharge summaries
//    */
//   async getAllSummaries({ limit = 50, offset = 0, status } = {}) {
//     try {
//       console.log('🔍 Fetching all discharge summaries...');
//       return await firebaseService.getAllSummaries(limit, offset, status);
//     } catch (error) {
//       console.error('❌ getAllSummaries error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get discharge summary by ID
//    */
//   async getSummaryById(summaryId) {
//     try {
//       console.log('🔍 Fetching summary:', summaryId);
//       return await firebaseService.getSummaryById(summaryId);
//     } catch (error) {
//       console.error('❌ getSummaryById error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Update discharge summary
//    */
//   async updateSummary(summaryId, updateData) {
//     try {
//       console.log('✏️ Updating summary:', summaryId);

//       const updatedSummary = {
//         ...updateData,
//         status: updateData.status || 'Pending',   // ✅ ENSURED
//         updatedAt: new Date().toISOString()
//       };

//       await firebaseService.updateSummary(summaryId, updatedSummary);

//       try {
//         await googleSheetsService.updateSummary(summaryId, updatedSummary);
//       } catch (err) {
//         console.warn('⚠️ Google Sheets update failed (non-critical):', err.message);
//       }

//       return updatedSummary;

//     } catch (error) {
//       console.error('❌ updateSummary error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Delete discharge summary
//    */
//   async deleteSummary(summaryId) {
//     try {
//       console.log('🗑️ Deleting summary:', summaryId);

//       await firebaseService.deleteSummary(summaryId);

//       try {
//         await googleSheetsService.deleteSummary(summaryId);
//       } catch (err) {
//         console.warn('⚠️ Google Sheets delete failed (non-critical):', err.message);
//       }

//       return true;
//     } catch (error) {
//       console.error('❌ deleteSummary error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Search discharge summaries
//    */
//   async searchSummaries(query) {
//     try {
//       console.log('🔍 Searching summaries:', query);
//       return await firebaseService.searchSummaries(query);
//     } catch (error) {
//       console.error('❌ searchSummaries error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Dashboard stats
//    */
//   async getDashboardStats() {
//     try {
//       console.log('📊 Fetching summary dashboard stats...');
//       return await firebaseService.getDashboardStats();
//     } catch (error) {
//       console.error('❌ getDashboardStats error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Clinic profile (used by PDF)
//    */
//   async getClinicProfile() {
//     try {
//       const admin = require('firebase-admin');
//       const db = admin.firestore();

//       const profileDoc = await db
//         .collection('clinic-profile')
//         .doc('profile')
//         .get();

//       if (!profileDoc.exists) {
//         throw new Error('Clinic profile missing');
//       }

//       return profileDoc.data();
//     } catch (error) {
//       console.error('❌ Clinic profile error:', error.message);
//       throw error;
//     }
//   }
// }

// module.exports = new DischargeSummaryService();


















const firebaseService = require('./firebaseService');
const googleSheetsService = require('./googleSheetsService');
const { 
  generateSummaryId, 
  getInternalId, 
  getDisplayId,
  getFinancialYear 
} = require('./utils');
const admin = require('firebase-admin');

class DischargeSummaryService {

  /**
   * Create a new discharge summary
   */
  async createSummary(summaryData) {
    try {
      console.log('📝 Creating discharge summary...');

      // Generate display ID: 25-26/DS-0001 ✅
      const displayId = await generateSummaryId();
      console.log('🧾 Generated Display ID:', displayId);

      // Convert to internal ID for Firestore: 25-26_DS-0001 ✅
      const internalId = getInternalId(displayId);
      
      const financialYear = getFinancialYear();

      const summary = {
        summaryId: displayId,        // ✅ Shows 25-26/DS-0001 everywhere
        internalId,                  // ✅ Firestore document ID
        financialYear,               // 25-26
        patientName: summaryData.patientName,
        age: summaryData.age,
        sex: summaryData.sex,
        diagnosis: summaryData.diagnosis || '',
        eyeRE: summaryData.eyeRE || '',
        eyeLE: summaryData.eyeLE || '',
        procedure: summaryData.procedure || '',
        procedureDate: summaryData.procedureDate || '',
        status: summaryData.status || 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firebase using INTERNAL ID
      await firebaseService.createSummary(internalId, summary);

      // Save to Google Sheets using DISPLAY ID
      try {
        await googleSheetsService.addSummary(summary);
      } catch (err) {
        console.warn('⚠️ Google Sheets save failed:', err.message);
      }

      console.log('✅ Created:', displayId);
      return summary;

    } catch (error) {
      console.error('❌ createSummary error:', error);
      throw error;
    }
  }

  /**
   * Get all discharge summaries
   */
  async getAllSummaries({ limit = 50, offset = 0, status, financialYear } = {}) {
    try {
      console.log('🔍 Fetching summaries...');
      const summaries = await firebaseService.getAllSummaries(limit, offset, status, financialYear);
      
      // Convert internal IDs back to display format
      return summaries.map(summary => ({
        ...summary,
        summaryId: getDisplayId(summary.internalId) // ✅ Returns 25-26/DS-0001
      }));
    } catch (error) {
      console.error('❌ getAllSummaries error:', error);
      throw error;
    }
  }

  /**
   * Get by display ID (25-26/DS-0001)
   */
  async getSummaryById(displayId) {
    try {
      console.log('🔍 Fetching:', displayId);
      const internalId = getInternalId(displayId);
      const summary = await firebaseService.getSummaryById(internalId);
      
      if (summary) {
        summary.summaryId = displayId; // ✅ Ensure display format
      }
      
      return summary;
    } catch (error) {
      console.error('❌ getSummaryById error:', error);
      throw error;
    }
  }

  /**
   * Update by display ID
   */
  async updateSummary(displayId, updateData) {
    try {
      console.log('✏️ Updating:', displayId);
      const internalId = getInternalId(displayId);

      const updatedSummary = {
        ...updateData,
        status: updateData.status || 'Pending',
        updatedAt: new Date().toISOString()
      };

      await firebaseService.updateSummary(internalId, updatedSummary);

      try {
        await googleSheetsService.updateSummary(displayId, updatedSummary);
      } catch (err) {
        console.warn('⚠️ Google Sheets update failed:', err.message);
      }

      updatedSummary.summaryId = displayId;
      return updatedSummary;
    } catch (error) {
      console.error('❌ updateSummary error:', error);
      throw error;
    }
  }

  /**
   * Delete by display ID
   */
  async deleteSummary(displayId) {
    try {
      console.log('🗑️ Deleting:', displayId);
      const internalId = getInternalId(displayId);

      await firebaseService.deleteSummary(internalId);

      try {
        await googleSheetsService.deleteSummary(displayId);
      } catch (err) {
        console.warn('⚠️ Google Sheets delete failed:', err.message);
      }

      return true;
    } catch (error) {
      console.error('❌ deleteSummary error:', error);
      throw error;
    }
  }

  async searchSummaries(query) {
    try {
      console.log('🔍 Searching:', query);
      const results = await firebaseService.searchSummaries(query);
      return results.map(summary => ({
        ...summary,
        summaryId: getDisplayId(summary.internalId)
      }));
    } catch (error) {
      console.error('❌ searchSummaries error:', error);
      throw error;
    }
  }

  async getDashboardStats({ financialYear } = {}) {
    try {
      console.log('📊 Dashboard stats...');
      return await firebaseService.getDashboardStats(financialYear);
    } catch (error) {
      console.error('❌ getDashboardStats error:', error);
      throw error;
    }
  }

  async getClinicProfile() {
    try {
      const db = admin.firestore();
      const profileDoc = await db
        .collection('clinic-profile')
        .doc('profile')
        .get();

      if (!profileDoc.exists) {
        throw new Error('Clinic profile missing');
      }
      return profileDoc.data();
    } catch (error) {
      console.error('❌ Clinic profile error:', error.message);
      throw error;
    }
  }
}

module.exports = new DischargeSummaryService();
