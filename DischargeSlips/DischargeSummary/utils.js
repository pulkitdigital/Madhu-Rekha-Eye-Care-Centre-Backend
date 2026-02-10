//Backend/DischargeSlips/DischargeSummary/utils.js
const { getFirestore } = require('../../config/firebase.config');

/**
 * Generate unique discharge summary ID 
 * Display: 25-26/DS-0001 ✅
 * Internal: 25-26_DS-0001 ✅ (Firestore safe)
 */
const generateSummaryId = async () => {
  try {
    const db = getFirestore();
    const collection = db.collection(
      'MadhuRekhaEyeCare/DischargeSlips/DischargeSummary'
    );
    
    const financialYear = getFinancialYear();
    
    // Query current FY documents
    const q = collection.where('financialYear', '==', financialYear);
    const querySnapshot = await q.get();
    
    const count = querySnapshot.size + 1;
    const sequenceNumber = String(count).padStart(4, '0');
    
    // ✅ Internal Firestore-safe ID
    const internalId = `${financialYear}_DS-${sequenceNumber}`;
    
    // Double-check uniqueness
    const existingDoc = await collection.doc(internalId).get();
    if (existingDoc.exists) {
      return generateSummaryId();
    }
    
    // ✅ Return display-friendly ID
    return `${financialYear}/DS-${sequenceNumber}`;
  } catch (error) {
    console.error('Error generating summary ID:', error);
    const financialYear = getFinancialYear();
    return `${financialYear}/DS-${Date.now().toString().slice(-4)}`;
  }
};

/**
 * Convert display ID to internal Firestore ID
 * 25-26/DS-0001 → 25-26_DS-0001
 */
const getInternalId = (displayId) => {
  return displayId.replace('/', '_');
};

/**
 * Convert internal ID to display ID
 * 25-26_DS-0001 → 25-26/DS-0001
 */
const getDisplayId = (internalId) => {
  return internalId.replace('_DS-', '/DS-');
};

/**
 * Format date for display (India)
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN');
};

/**
 * Returns financial year in format "25-26"
 */
function getFinancialYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
}

/**
 * Validate discharge summary data
 */
const validateSummaryData = (summaryData) => {
  const errors = [];

  if (!summaryData.patientName || summaryData.patientName.trim() === '') {
    errors.push('Patient name is required');
  }
  if (!summaryData.age || summaryData.age <= 0) {
    errors.push('Valid age is required');
  }
  if (!summaryData.sex) {
    errors.push('Sex is required');
  }
  if (!summaryData.diagnosis || summaryData.diagnosis.trim() === '') {
    errors.push('Diagnosis is required');
  }
  if (!summaryData.procedure || summaryData.procedure.trim() === '') {
    errors.push('Procedure is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize discharge summary data
 */
const sanitizeSummaryData = (summaryData) => {
  return {
    patientName: summaryData.patientName?.trim() || '',
    age: parseInt(summaryData.age) || 0,
    sex: summaryData.sex || 'M',
    diagnosis: summaryData.diagnosis?.trim() || '',
    eyeRE: summaryData.eyeRE?.trim() || '',
    eyeLE: summaryData.eyeLE?.trim() || '',
    procedure: summaryData.procedure?.trim() || '',
    procedureDate: summaryData.procedureDate || '',
    status: summaryData.status || 'Pending'
  };
};

module.exports = {
  generateSummaryId,
  getInternalId,
  getDisplayId,
  formatDate,
  validateSummaryData,
  sanitizeSummaryData,
  getFinancialYear
};
