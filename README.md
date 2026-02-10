# Madhurekha Eye Care Centre - Backend Setup

## 📁 Folder Structure

```
Backend/
├── config/
│   ├── firebase.config.js          # Firebase initialization
│   ├── googleSheets.config.js      # Google Sheets API configuration
│   └── google-credentials.json     # Google Service Account credentials (add this)
├── DischargeSlips/
│   └── DischargeTicket/
│       ├── controller.js            # Request handlers
│       ├── service.js               # Business logic
│       ├── firebaseService.js       # Firebase operations
│       ├── googleSheetsService.js   # Google Sheets operations
│       ├── routes.js                # API routes
│       └── utils.js                 # Utility functions
├── .env                             # Environment variables (create this)
├── .env.example                     # Environment variables example
├── package.json                     # Dependencies
└── server.js                        # Main server file
```

## 🚀 Installation Steps

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file
6. Copy the following values to your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### 3. Setup Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create Service Account:
   - Go to IAM & Admin → Service Accounts
   - Create Service Account
   - Grant "Editor" role
   - Create Key (JSON format)
5. Save the JSON file as `Backend/config/google-credentials.json`
6. Create a Google Sheet and share it with the service account email
7. Copy the Sheet ID from URL and add to `.env` as `GOOGLE_SHEET_ID`

### 4. Setup Environment Variables

Create a `.env` file in Backend folder:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Google Sheets Configuration
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_CREDENTIALS_PATH=./config/google-credentials.json

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 5. Firebase Structure

Your Firebase Firestore should have this structure:

```
MadhuRekhaEyeCare (Collection)
└── DischargeSlips (Document)
    └── DischargeTicket (Collection)
        ├── DT0001 (Document)
        ├── DT0002 (Document)
        └── ... (more ticket documents)
```

Each ticket document contains:
- ticketId
- patientName
- age
- sex
- diagnosisRE
- diagnosisLE
- admissionDate
- admissionTime
- dischargeDate
- dischargeTime
- procedureDone
- surgeryDate
- otNote
- conditionsAtDischarge
- postOpAdvice
- status
- createdAt
- updatedAt

### 6. Google Sheets Structure

The Google Sheet will have a sheet named "DischargeTickets" with these columns:

| Ticket ID | Patient Name | Age | Sex | Diagnosis (RE) | Diagnosis (LE) | Date of Admission | Time of Admission | Date of Discharge | Time of Discharge | Procedure Done | Date of Surgery | O.T. Note | Conditions at Discharge | Post OP Advice | Status | Created At | Updated At |
|-----------|--------------|-----|-----|----------------|----------------|-------------------|-------------------|-------------------|-------------------|----------------|-----------------|-----------|-------------------------|----------------|--------|------------|------------|

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Discharge Ticket APIs

- **POST** `/api/discharge-slips/discharge-ticket` - Create new ticket
- **GET** `/api/discharge-slips/discharge-ticket` - Get all tickets
- **GET** `/api/discharge-slips/discharge-ticket/:id` - Get ticket by ID
- **PUT** `/api/discharge-slips/discharge-ticket/:id` - Update ticket
- **DELETE** `/api/discharge-slips/discharge-ticket/:id` - Delete ticket
- **GET** `/api/discharge-slips/discharge-ticket/stats/dashboard` - Dashboard stats
- **GET** `/api/discharge-slips/discharge-ticket/filter/date-range` - Filter by date
- **GET** `/api/discharge-slips/discharge-ticket/search/query` - Search tickets

### Health Check
- **GET** `/api/health` - Server health check

## 🔧 Frontend Integration

Add this to your Frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Testing APIs

You can test APIs using:

### Using cURL
```bash
# Create ticket
curl -X POST http://localhost:5000/api/discharge-slips/discharge-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test Patient",
    "age": "45",
    "sex": "M",
    "diagnosisRE": "Cataract",
    "status": "Pending"
  }'

# Get all tickets
curl http://localhost:5000/api/discharge-slips/discharge-ticket
```

### Using Postman
1. Import the endpoints
2. Set method and URL
3. Add JSON body for POST/PUT requests
4. Send request

## 🛡️ Security Notes

- Never commit `.env` file to git
- Never commit `google-credentials.json` to git
- Add both files to `.gitignore`
- Use environment variables for all sensitive data
- Enable Firebase Security Rules in production

## 📞 Support

For issues or questions, contact the development team.

---

**Made with ❤️ for Madhurekha Eye Care Centre**