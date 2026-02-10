// Backend/ClinicProfile/firebaseService.js
const admin = require('firebase-admin');
const db = admin.firestore();

class ClinicProfileFirebaseService {
  constructor() {
    this.collectionName = 'clinic-profile';
    this.documentId = 'profile'; // Single document for clinic profile
  }

  // Save clinic profile (create or update)
  async saveProfile(profileData) {
    try {
      console.log('💾 Saving clinic profile to Firebase...');
      
      const profileRef = db.collection(this.collectionName).doc(this.documentId);
      
      // Check if profile already exists
      const doc = await profileRef.get();
      
      if (doc.exists) {
        // Update existing profile
        await profileRef.update(profileData);
        console.log('✅ Clinic profile updated in Firebase');
      } else {
        // Create new profile
        await profileRef.set(profileData);
        console.log('✅ Clinic profile created in Firebase');
      }
      
      return profileData;
    } catch (error) {
      console.error('❌ Error saving clinic profile to Firebase:', error);
      throw error;
    }
  }

  // Get clinic profile
  async getProfile() {
    try {
      console.log('📥 Fetching clinic profile from Firebase...');
      
      const profileRef = db.collection(this.collectionName).doc(this.documentId);
      const doc = await profileRef.get();
      
      if (!doc.exists) {
        console.log('⚠️ Clinic profile not found');
        return null;
      }
      
      const profile = doc.data();
      console.log('✅ Clinic profile fetched from Firebase');
      
      return profile;
    } catch (error) {
      console.error('❌ Error fetching clinic profile from Firebase:', error);
      throw error;
    }
  }

  // Update clinic profile
  async updateProfile(updateData) {
    try {
      console.log('🔄 Updating clinic profile in Firebase...');
      
      const profileRef = db.collection(this.collectionName).doc(this.documentId);
      await profileRef.update(updateData);
      
      console.log('✅ Clinic profile updated in Firebase');
      return updateData;
    } catch (error) {
      console.error('❌ Error updating clinic profile in Firebase:', error);
      throw error;
    }
  }

  // Check if profile exists
  async checkProfileExists() {
    try {
      const profileRef = db.collection(this.collectionName).doc(this.documentId);
      const doc = await profileRef.get();
      
      return doc.exists;
    } catch (error) {
      console.error('❌ Error checking profile existence:', error);
      throw error;
    }
  }

  // Delete clinic profile (optional - for testing)
  async deleteProfile() {
    try {
      console.log('🗑️ Deleting clinic profile from Firebase...');
      
      const profileRef = db.collection(this.collectionName).doc(this.documentId);
      await profileRef.delete();
      
      console.log('✅ Clinic profile deleted from Firebase');
      return true;
    } catch (error) {
      console.error('❌ Error deleting clinic profile from Firebase:', error);
      throw error;
    }
  }
}

module.exports = new ClinicProfileFirebaseService();