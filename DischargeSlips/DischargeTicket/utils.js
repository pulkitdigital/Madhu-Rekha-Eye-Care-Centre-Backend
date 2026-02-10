// // Backend/DischargeSlips/DischargeTicket/utils.js
// const { getFirestore } = require('../../config/firebase.config');

// // Generate unique ticket ID
// const generateTicketId = async () => {
//   try {
//     const db = getFirestore();
//     const collection = db.collection('MadhuRekhaEyeCare/DischargeSlips/DischargeTicket');
    
//     // Get the count of existing tickets
//     const snapshot = await collection.get();
//     const count = snapshot.size + 1;
    
//     // Generate ID in format: DT0001, DT0002, etc.
//     const ticketId = `DT${String(count).padStart(4, '0')}`;
    
//     // Check if ID already exists
//     const existingDoc = await collection.doc(ticketId).get();
//     if (existingDoc.exists) {
//       // If exists, try next number
//       return `DT${String(count + 1).padStart(4, '0')}`;
//     }
    
//     return ticketId;
//   } catch (error) {
//     console.error('Error generating ticket ID:', error);
//     // Fallback to timestamp-based ID
//     return `DT${Date.now()}`;
//   }
// };

// // Format date for display
// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-IN');
// };

// // Format time for display
// const formatTime = (timeString) => {
//   if (!timeString) return '';
//   return timeString;
// };

// // Validate ticket data
// const validateTicketData = (ticketData) => {
//   const errors = [];

//   if (!ticketData.patientName || ticketData.patientName.trim() === '') {
//     errors.push('Patient name is required');
//   }

//   if (!ticketData.age || ticketData.age <= 0) {
//     errors.push('Valid age is required');
//   }

//   if (!ticketData.sex) {
//     errors.push('Sex is required');
//   }

//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// };

// // Sanitize ticket data
// const sanitizeTicketData = (ticketData) => {
//   return {
//     patientName: ticketData.patientName?.trim() || '',
//     age: parseInt(ticketData.age) || 0,
//     sex: ticketData.sex || 'M',
//     diagnosisRE: ticketData.diagnosisRE?.trim() || '',
//     diagnosisLE: ticketData.diagnosisLE?.trim() || '',
//     admissionDate: ticketData.admissionDate || '',
//     admissionTime: ticketData.admissionTime || '',
//     dischargeDate: ticketData.dischargeDate || '',
//     dischargeTime: ticketData.dischargeTime || '',
//     procedureDone: ticketData.procedureDone?.trim() || '',
//     surgeryDate: ticketData.surgeryDate || '',
//     otNote: ticketData.otNote?.trim() || '',
//     conditionsAtDischarge: ticketData.conditionsAtDischarge?.trim() || '',
//     postOpAdvice: ticketData.postOpAdvice?.trim() || '',
//     status: ticketData.status || 'Pending'
//   };
// };

// module.exports = {
//   generateTicketId,
//   formatDate,
//   formatTime,
//   validateTicketData,
//   sanitizeTicketData
// };






// Backend/DischargeSlips/DischargeTicket/utils.js
const { getFirestore } = require('../../config/firebase.config');

/**
 * Returns financial year in format "25-26"
 */
function getFinancialYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  const fy = `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
  console.log(`📅 Financial Year calculated: ${fy} (Month: ${month}, Year: ${year})`);
  
  return fy;
}

/**
 * Generate unique discharge ticket ID 
 * Display: 25-26/DT-0001 ✅
 * Internal: 25-26_DT-0001 ✅ (Firestore safe)
 */
const generateTicketId = async () => {
  try {
    console.log('🎫 Starting ticket ID generation...');
    
    const db = getFirestore();
    const collection = db.collection(
      'MadhuRekhaEyeCare/DischargeSlips/DischargeTicket'
    );
    
    const financialYear = getFinancialYear();
    console.log(`📊 Using Financial Year: ${financialYear}`);
    
    // Query current FY documents
    const q = collection.where('financialYear', '==', financialYear);
    const querySnapshot = await q.get();
    
    console.log(`📦 Found ${querySnapshot.size} existing tickets for FY ${financialYear}`);
    
    const count = querySnapshot.size + 1;
    const sequenceNumber = String(count).padStart(4, '0');
    
    // ✅ Internal Firestore-safe ID
    const internalId = `${financialYear}_DT-${sequenceNumber}`;
    console.log(`🔑 Internal ID: ${internalId}`);
    
    // Double-check uniqueness
    const existingDoc = await collection.doc(internalId).get();
    if (existingDoc.exists) {
      console.warn(`⚠️ ID ${internalId} already exists, regenerating...`);
      return generateTicketId(); // Recursive call
    }
    
    // ✅ Return display-friendly ID
    const displayId = `${financialYear}/DT-${sequenceNumber}`;
    console.log(`✅ Generated Display ID: ${displayId}`);
    
    return displayId;
  } catch (error) {
    console.error('❌ Error generating ticket ID:', error);
    console.error('Stack trace:', error.stack);
    
    // Fallback with timestamp
    const financialYear = getFinancialYear();
    const fallbackId = `${financialYear}/DT-${Date.now().toString().slice(-4)}`;
    console.log(`⚠️ Using fallback ID: ${fallbackId}`);
    
    return fallbackId;
  }
};

/**
 * Convert display ID to internal Firestore ID
 * 25-26/DT-0001 → 25-26_DT-0001
 * DT0001 → DT0001 (old format, unchanged)
 */
const getInternalId = (displayId) => {
  if (!displayId) {
    console.error('❌ getInternalId: displayId is null/undefined');
    return null;
  }
  
  // Check if new format (contains slash)
  if (displayId.includes('/')) {
    const internal = displayId.replace('/', '_');
    console.log(`🔄 Converting Display → Internal: ${displayId} → ${internal}`);
    return internal;
  }
  
  // Old format (DT0001) - return as is
  console.log(`⚠️ Old format detected, using as-is: ${displayId}`);
  return displayId;
};

/**
 * Convert internal ID to display ID
 * 25-26_DT-0001 → 25-26/DT-0001
 * DT0001 → DT0001 (old format, unchanged)
 */
const getDisplayId = (internalId) => {
  if (!internalId) {
    console.error('❌ getDisplayId: internalId is null/undefined');
    return null;
  }
  
  // Check if new format (contains underscore before DT)
  if (internalId.includes('_DT-')) {
    const display = internalId.replace('_DT-', '/DT-');
    console.log(`🔄 Converting Internal → Display: ${internalId} → ${display}`);
    return display;
  }
  
  // Old format (DT0001) - return as is
  console.log(`⚠️ Old format detected, returning as-is: ${internalId}`);
  return internalId;
};

/**
 * Format date for display (India)
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format time for display
 */
const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

/**
 * Validate ticket data
 */
const validateTicketData = (ticketData) => {
  console.log('🔍 Validating ticket data...');
  const errors = [];

  if (!ticketData.patientName || ticketData.patientName.trim() === '') {
    errors.push('Patient name is required');
  }

  if (!ticketData.age || ticketData.age <= 0) {
    errors.push('Valid age is required');
  }

  if (!ticketData.sex) {
    errors.push('Sex is required');
  }

  if (errors.length > 0) {
    console.error('❌ Validation failed:', errors);
  } else {
    console.log('✅ Validation passed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize ticket data
 */
const sanitizeTicketData = (ticketData) => {
  console.log('🧹 Sanitizing ticket data...');
  
  const sanitized = {
    patientName: ticketData.patientName?.trim() || '',
    age: parseInt(ticketData.age) || 0,
    sex: ticketData.sex || 'M',
    diagnosisRE: ticketData.diagnosisRE?.trim() || '',
    diagnosisLE: ticketData.diagnosisLE?.trim() || '',
    admissionDate: ticketData.admissionDate || '',
    admissionTime: ticketData.admissionTime || '',
    dischargeDate: ticketData.dischargeDate || '',
    dischargeTime: ticketData.dischargeTime || '',
    procedureDone: ticketData.procedureDone?.trim() || '',
    surgeryDate: ticketData.surgeryDate || '',
    otNote: ticketData.otNote?.trim() || '',
    conditionsAtDischarge: ticketData.conditionsAtDischarge?.trim() || '',
    postOpAdvice: ticketData.postOpAdvice?.trim() || '',
    status: ticketData.status || 'Pending'
  };
  
  console.log('✅ Data sanitized');
  return sanitized;
};

module.exports = {
  generateTicketId,
  getInternalId,
  getDisplayId,
  getFinancialYear,
  formatDate,
  formatTime,
  validateTicketData,
  sanitizeTicketData
};