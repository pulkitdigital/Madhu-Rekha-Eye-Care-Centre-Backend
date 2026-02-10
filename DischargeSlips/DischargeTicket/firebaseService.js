// // Backend/DischargeSlips/DischargeTicket/firebaseService.js
// const { getFirestore } = require('../../config/firebase.config');

// class FirebaseDischargeTicketService {
//   constructor() {
//     this.collectionPath = 'MadhuRekhaEyeCare/DischargeSlips/DischargeTicket';
//   }

//   getCollection() {
//     const db = getFirestore();
//     return db.collection(this.collectionPath);
//   }

//   // Create a new ticket
//   async createTicket(ticketData) {
//     try {
//       const collection = this.getCollection();
//       await collection.doc(ticketData.ticketId).set(ticketData);
//       return ticketData;
//     } catch (error) {
//       console.error('Firebase createTicket error:', error);
//       throw error;
//     }
//   }

//   // Get all tickets
//   async getAllTickets(limit = 50, offset = 0, status = null) {
//     try {
//       const collection = this.getCollection();
//       let query = collection.orderBy('createdAt', 'desc');

//       if (status) {
//         query = query.where('status', '==', status);
//       }

//       query = query.limit(parseInt(limit));
      
//       if (offset > 0) {
//         const snapshot = await collection.orderBy('createdAt', 'desc').limit(parseInt(offset)).get();
//         const lastDoc = snapshot.docs[snapshot.docs.length - 1];
//         if (lastDoc) {
//           query = query.startAfter(lastDoc);
//         }
//       }

//       const snapshot = await query.get();
//       const tickets = [];
//       snapshot.forEach(doc => {
//         tickets.push({ id: doc.id, ...doc.data() });
//       });

//       return tickets;
//     } catch (error) {
//       console.error('Firebase getAllTickets error:', error);
//       throw error;
//     }
//   }

//   // Get ticket by ID
//   async getTicketById(ticketId) {
//     try {
//       const collection = this.getCollection();
//       const doc = await collection.doc(ticketId).get();
      
//       if (!doc.exists) {
//         return null;
//       }

//       return { id: doc.id, ...doc.data() };
//     } catch (error) {
//       console.error('Firebase getTicketById error:', error);
//       throw error;
//     }
//   }

//   // Update ticket
//   async updateTicket(ticketId, updateData) {
//     try {
//       const collection = this.getCollection();
//       await collection.doc(ticketId).update(updateData);
//       return { ticketId, ...updateData };
//     } catch (error) {
//       console.error('Firebase updateTicket error:', error);
//       throw error;
//     }
//   }

//   // Delete ticket
//   async deleteTicket(ticketId) {
//     try {
//       const collection = this.getCollection();
//       await collection.doc(ticketId).delete();
//       return true;
//     } catch (error) {
//       console.error('Firebase deleteTicket error:', error);
//       throw error;
//     }
//   }

//   // Get dashboard statistics
//   async getDashboardStats() {
//     try {
//       const collection = this.getCollection();
      
//       // Get all tickets
//       const allTicketsSnapshot = await collection.get();
//       const totalTickets = allTicketsSnapshot.size;

//       // Get today's tickets
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const todayISO = today.toISOString();
      
//       const todayTicketsSnapshot = await collection
//         .where('createdAt', '>=', todayISO)
//         .get();
//       const todayTickets = todayTicketsSnapshot.size;

//       // Get completed tickets
//       const completedSnapshot = await collection
//         .where('status', '==', 'Completed')
//         .get();
//       const completedTickets = completedSnapshot.size;

//       // Get pending tickets
//       const pendingSnapshot = await collection
//         .where('status', '==', 'Pending')
//         .get();
//       const pendingTickets = pendingSnapshot.size;

//       return {
//         totalTickets,
//         todayTickets,
//         completedTickets,
//         pendingTickets
//       };
//     } catch (error) {
//       console.error('Firebase getDashboardStats error:', error);
//       throw error;
//     }
//   }

//   // Get tickets by date range
//   async getTicketsByDateRange(startDate, endDate) {
//     try {
//       const collection = this.getCollection();
//       const snapshot = await collection
//         .where('dischargeDate', '>=', startDate)
//         .where('dischargeDate', '<=', endDate)
//         .orderBy('dischargeDate', 'desc')
//         .get();

//       const tickets = [];
//       snapshot.forEach(doc => {
//         tickets.push({ id: doc.id, ...doc.data() });
//       });

//       return tickets;
//     } catch (error) {
//       console.error('Firebase getTicketsByDateRange error:', error);
//       throw error;
//     }
//   }

//   // Search tickets
//   async searchTickets(query) {
//     try {
//       const collection = this.getCollection();
//       const snapshot = await collection.get();
      
//       const tickets = [];
//       const searchLower = query.toLowerCase();

//       snapshot.forEach(doc => {
//         const data = doc.data();
//         if (
//           data.ticketId?.toLowerCase().includes(searchLower) ||
//           data.patientName?.toLowerCase().includes(searchLower) ||
//           data.diagnosisRE?.toLowerCase().includes(searchLower) ||
//           data.diagnosisLE?.toLowerCase().includes(searchLower)
//         ) {
//           tickets.push({ id: doc.id, ...data });
//         }
//       });

//       return tickets;
//     } catch (error) {
//       console.error('Firebase searchTickets error:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new FirebaseDischargeTicketService();






// Backend/DischargeSlips/DischargeTicket/firebaseService.js
const { getFirestore } = require('../../config/firebase.config');

class FirebaseDischargeTicketService {
  constructor() {
    this.collectionPath = 'MadhuRekhaEyeCare/DischargeSlips/DischargeTicket';
  }

  getCollection() {
    const db = getFirestore();
    return db.collection(this.collectionPath);
  }

  // ✅ UPDATED: Now accepts internalId as first param
  async createTicket(internalId, ticketData) {
    try {
      const collection = this.getCollection();
      // Uses internalId: 25-26_DT-0001 ✅
      await collection.doc(internalId).set(ticketData);
      return ticketData;
    } catch (error) {
      console.error('Firebase createTicket error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: getAllTickets now supports financialYear filter
  async getAllTickets(limit = 50, offset = 0, status = null, financialYear = null) {
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
      const tickets = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        tickets.push({ 
          id: doc.id,  // internalId: 25-26_DT-0001
          internalId: doc.id,
          ...data 
        });
      });

      return tickets;
    } catch (error) {
      console.error('Firebase getAllTickets error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: Uses internalId
  async getTicketById(internalId) {
    try {
      const collection = this.getCollection();
      const doc = await collection.doc(internalId).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return { 
        id: doc.id,
        internalId: doc.id,  // 25-26_DT-0001
        ...data 
      };
    } catch (error) {
      console.error('Firebase getTicketById error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: Uses internalId
  async updateTicket(internalId, updateData) {
    try {
      const collection = this.getCollection();
      await collection.doc(internalId).update(updateData);
      return { internalId, ...updateData };
    } catch (error) {
      console.error('Firebase updateTicket error:', error);
      throw error;
    }
  }

  // ✅ UPDATED: Uses internalId
  async deleteTicket(internalId) {
    try {
      const collection = this.getCollection();
      await collection.doc(internalId).delete();
      return true;
    } catch (error) {
      console.error('Firebase deleteTicket error:', error);
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
      const totalTickets = allSnapshot.size;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const todaySnapshot = await collection
        .where('createdAt', '>=', todayISO)
        .get();
      const todayTickets = todaySnapshot.size;

      const completedSnapshot = await query.where('status', '==', 'Completed').get();
      const completedTickets = completedSnapshot.size;

      const pendingSnapshot = await query.where('status', '==', 'Pending').get();
      const pendingTickets = pendingSnapshot.size;

      return {
        totalTickets,
        todayTickets,
        completedTickets,
        pendingTickets,
        financialYear: financialYear || 'All'
      };
    } catch (error) {
      console.error('Firebase getDashboardStats error:', error);
      throw error;
    }
  }

  async getTicketsByDateRange(startDate, endDate) {
    try {
      const collection = this.getCollection();
      const snapshot = await collection
        .where('dischargeDate', '>=', startDate)
        .where('dischargeDate', '<=', endDate)
        .orderBy('dischargeDate', 'desc')
        .get();

      const tickets = [];
      snapshot.forEach(doc => {
        tickets.push({ 
          id: doc.id,
          internalId: doc.id,
          ...doc.data() 
        });
      });

      return tickets;
    } catch (error) {
      console.error('Firebase getTicketsByDateRange error:', error);
      throw error;
    }
  }

  // ✅ Search works with both ticketId and internalId
  async searchTickets(query) {
    try {
      const collection = this.getCollection();
      const snapshot = await collection.get();

      const tickets = [];
      const searchLower = query.toLowerCase();

      snapshot.forEach(doc => {
        const data = doc.data();

        if (
          data.ticketId?.toLowerCase().includes(searchLower) ||        // 25-26/DT-0001
          doc.id.toLowerCase().includes(searchLower) ||                // 25-26_DT-0001
          data.patientName?.toLowerCase().includes(searchLower) ||
          data.diagnosisRE?.toLowerCase().includes(searchLower) ||
          data.diagnosisLE?.toLowerCase().includes(searchLower)
        ) {
          tickets.push({ 
            id: doc.id,
            internalId: doc.id,
            ...data 
          });
        }
      });

      return tickets;
    } catch (error) {
      console.error('Firebase searchTickets error:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseDischargeTicketService();