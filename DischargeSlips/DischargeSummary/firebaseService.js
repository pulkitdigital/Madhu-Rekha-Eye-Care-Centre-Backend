//Backend/DischargeSlips/DischargeSummary/firebaseService.js
const { getFirestore } = require('../../config/firebase.config');

class FirebaseDischargeSummaryService {
  constructor() {
    this.collectionPath = 'MadhuRekhaEyeCare/DischargeSlips/DischargeSummary';
  }

  getCollection() {
    const db = getFirestore();
    return db.collection(this.collectionPath);
  }

  // ✅ UPDATED: Now accepts internalId as first param
  async createSummary(internalId, summaryData) {
    try {
      const collection = this.getCollection();
      // Uses internalId: 25-26_DS-0001 ✅
      await collection.doc(internalId).set(summaryData);
      return summaryData;
    } catch (error) {
      console.error('Firebase createSummary error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: getAllSummaries now supports financialYear filter
  async getAllSummaries(limit = 50, offset = 0, status = null, financialYear = null) {
    try {
      const collection = this.getCollection();
      let query = collection.orderBy('createdAt', 'desc');

      // ✅ Filter by financialYear if provided
      if (financialYear) {
        query = query.where('financialYear', '==', financialYear);
      }

      if (status) {
        query = query.where('status', '==', status);
      }

      query = query.limit(parseInt(limit));

      if (offset > 0) {
        const snapshot = await collection
          .orderBy('createdAt', 'desc')
          .limit(parseInt(offset))
          .get();

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        if (lastDoc) {
          query = query.startAfter(lastDoc);
        }
      }

      const snapshot = await query.get();
      const summaries = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        summaries.push({ 
          id: doc.id,  // internalId: 25-26_DS-0001
          internalId: doc.id,
          ...data 
        });
      });

      return summaries;
    } catch (error) {
      console.error('Firebase getAllSummaries error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: Uses internalId
  async getSummaryById(internalId) {
    try {
      const collection = this.getCollection();
      const doc = await collection.doc(internalId).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return { 
        id: doc.id,
        internalId: doc.id,  // 25-26_DS-0001
        ...data 
      };
    } catch (error) {
      console.error('Firebase getSummaryById error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: Uses internalId
  async updateSummary(internalId, updateData) {
    try {
      const collection = this.getCollection();
      await collection.doc(internalId).update(updateData);
      return { internalId, ...updateData };
    } catch (error) {
      console.error('Firebase updateSummary error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: Uses internalId
  async deleteSummary(internalId) {
    try {
      const collection = this.getCollection();
      await collection.doc(internalId).delete();
      return true;
    } catch (error) {
      console.error('Firebase deleteSummary error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: Supports financialYear filter
  async getDashboardStats(financialYear = null) {
    try {
      const collection = this.getCollection();
      let query = collection;

      // ✅ Filter by financialYear if provided
      if (financialYear) {
        query = query.where('financialYear', '==', financialYear);
      }

      const allSnapshot = await query.get();
      const totalSummaries = allSnapshot.size;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const todaySnapshot = await collection
        .where('createdAt', '>=', todayISO)
        .get();
      const todaySummaries = todaySnapshot.size;

      const completedSnapshot = await query.where('status', '==', 'Completed').get();
      const completedSummaries = completedSnapshot.size;

      const pendingSnapshot = await query.where('status', '==', 'Pending').get();
      const pendingSummaries = pendingSnapshot.size;

      return {
        totalSummaries,
        todaySummaries,
        completedSummaries,
        pendingSummaries,
        financialYear: financialYear || 'All'
      };
    } catch (error) {
      console.error('Firebase getDashboardStats error:', error);
      throw error;
    }
  }

  // ✅ Search works with both summaryId and internalId
  async searchSummaries(query) {
    try {
      const collection = this.getCollection();
      const snapshot = await collection.get();

      const summaries = [];
      const searchLower = query.toLowerCase();

      snapshot.forEach(doc => {
        const data = doc.data();

        if (
          data.summaryId?.toLowerCase().includes(searchLower) ||        // 25-26/DS-0001
          doc.id.toLowerCase().includes(searchLower) ||                 // 25-26_DS-0001
          data.patientName?.toLowerCase().includes(searchLower) ||
          data.diagnosis?.toLowerCase().includes(searchLower) ||
          data.procedure?.toLowerCase().includes(searchLower)
        ) {
          summaries.push({ 
            id: doc.id,
            internalId: doc.id,
            ...data 
          });
        }
      });

      return summaries;
    } catch (error) {
      console.error('Firebase searchSummaries error:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseDischargeSummaryService();
