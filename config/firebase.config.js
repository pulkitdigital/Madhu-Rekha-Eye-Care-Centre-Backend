// Backend/config/firebase.config.js
const admin = require('firebase-admin');

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Check if required environment variables exist
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID is not defined in .env file');
    }
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('FIREBASE_PRIVATE_KEY is not defined in .env file');
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('FIREBASE_CLIENT_EMAIL is not defined in .env file');
    }

    // Option 1: Using environment variables
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });

    console.log('✅ Firebase Admin initialized successfully');
    console.log('📦 Project ID:', process.env.FIREBASE_PROJECT_ID);
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.error('💡 Please check your .env file and ensure all Firebase credentials are set correctly');
    throw error;
  }
};

const getFirestore = () => {
  return admin.firestore();
};

const getStorage = () => {
  return admin.storage();
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getStorage,
  admin
};