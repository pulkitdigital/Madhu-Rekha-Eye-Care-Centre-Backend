// Backend/ClinicProfile/controller.js
const service = require('./service');

// Create or Update clinic profile
exports.saveProfile = async (req, res) => {
  try {
    const profileData = req.body;
    const result = await service.saveProfile(profileData);
    
    res.status(200).json({
      success: true,
      message: 'Clinic profile saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in saveProfile controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save clinic profile',
      error: error.message
    });
  }
};

// Get clinic profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await service.getProfile();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Clinic profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in getProfile controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clinic profile',
      error: error.message
    });
  }
};

// Update specific fields
exports.updateProfile = async (req, res) => {
  try {
    const updateData = req.body;
    const result = await service.updateProfile(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Clinic profile updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateProfile controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update clinic profile',
      error: error.message
    });
  }
};

// Check if profile exists
exports.checkProfileExists = async (req, res) => {
  try {
    const exists = await service.checkProfileExists();
    
    res.status(200).json({
      success: true,
      exists: exists
    });
  } catch (error) {
    console.error('Error in checkProfileExists controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check profile existence',
      error: error.message
    });
  }
};