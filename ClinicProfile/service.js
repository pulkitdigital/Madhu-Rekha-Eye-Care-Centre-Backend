const firebaseService = require("./firebaseService");

class ClinicProfileService {
  normalizeProfile(data, existingProfile = null) {
    return {
      clinicName: data.clinicName,
      address: data.address,
      panNumber: data.panNumber || "",
      registrationNumber: data.registrationNumber || "",

      doctor1Name: data.doctor1Name,
      doctor1RegNumber: data.doctor1RegNumber || "",
      doctor1Qualification: data.doctor1Qualification || "",
      doctor1Mobile: data.doctor1Mobile || "",

      doctor2Name: data.doctor2Name || "",
      doctor2RegNumber: data.doctor2RegNumber || "",
      doctor2Qualification: data.doctor2Qualification || "",
      doctor2Mobile: data.doctor2Mobile || "",

      phone: data.phone,
      email: data.email || "",
      website: data.website || "",

      patientSignatureLabel:
        data.patientSignatureLabel || "Patient / Representative",

      doctorSignatureLabel:
        data.doctorSignatureLabel || "Madhu Rekha Eye Care Centre",

      createdAt:
        existingProfile?.createdAt || new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };
  }

  async saveProfile(profileData) {
    try {
      const existingProfile = await firebaseService.getProfile();

      const profile = this.normalizeProfile(
        profileData,
        existingProfile,
      );

      await firebaseService.saveProfile(profile);
      return profile;
    } catch (error) {
      console.error("Error in saveProfile service:", error);
      throw error;
    }
  }

  async getProfile() {
    return firebaseService.getProfile();
  }

  async updateProfile(updateData) {
    try {
      const existingProfile = await firebaseService.getProfile();
      if (!existingProfile) {
        throw new Error("Profile does not exist");
      }

      const updatedProfile = this.normalizeProfile(
        { ...existingProfile, ...updateData },
        existingProfile,
      );

      await firebaseService.updateProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error("Error in updateProfile service:", error);
      throw error;
    }
  }

  async checkProfileExists() {
    return firebaseService.checkProfileExists();
  }
}

module.exports = new ClinicProfileService();
