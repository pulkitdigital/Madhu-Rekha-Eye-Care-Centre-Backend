// const { google } = require("googleapis");
// const path = require("path");
// const fs = require("fs");

// class GoogleSheetsService {
//   constructor() {
//     this.sheets = null;
//     this.spreadsheetId = process.env.GOOGLE_SHEET_ID;

//     if (!this.spreadsheetId) {
//       throw new Error("GOOGLE_SHEET_ID is not defined in environment variables");
//     }

//     this.initialize(); // 🔥 AUTO-INIT (fixes your bug)
//   }

//   initialize() {
//     const credentialsPath =
//       process.env.GOOGLE_CREDENTIALS_PATH ||
//       path.join(__dirname, "google-credentials.json");

//     if (!fs.existsSync(credentialsPath)) {
//       throw new Error(`Google credentials file not found at ${credentialsPath}`);
//     }

//     const auth = new google.auth.GoogleAuth({
//       keyFile: credentialsPath,
//       scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//     });

//     this.sheets = google.sheets({
//       version: "v4",
//       auth,
//     });

//     console.log("✅ Google Sheets API initialized successfully");
//   }

//   ensureInitialized() {
//     if (!this.sheets) {
//       throw new Error("Google Sheets API not initialized");
//     }
//   }

//   async appendRow(sheetName, values) {
//     this.ensureInitialized();

//     return this.sheets.spreadsheets.values.append({
//       spreadsheetId: this.spreadsheetId,
//       range: `${sheetName}!A:Z`,
//       valueInputOption: "USER_ENTERED",
//       requestBody: {
//         values: [values],
//       },
//     });
//   }

//   async getRows(sheetName, range = "A:Z") {
//     this.ensureInitialized();

//     const res = await this.sheets.spreadsheets.values.get({
//       spreadsheetId: this.spreadsheetId,
//       range: `${sheetName}!${range}`,
//     });

//     return res.data.values || [];
//   }

//   async updateRow(sheetName, range, values) {
//     this.ensureInitialized();

//     return this.sheets.spreadsheets.values.update({
//       spreadsheetId: this.spreadsheetId,
//       range: `${sheetName}!${range}`,
//       valueInputOption: "USER_ENTERED",
//       requestBody: {
//         values: [values],
//       },
//     });
//   }

//   async deleteRow(sheetName, rowIndex) {
//     this.ensureInitialized();

//     const sheetId = await this.getSheetId(sheetName);

//     return this.sheets.spreadsheets.batchUpdate({
//       spreadsheetId: this.spreadsheetId,
//       requestBody: {
//         requests: [
//           {
//             deleteDimension: {
//               range: {
//                 sheetId,
//                 dimension: "ROWS",
//                 startIndex: rowIndex,
//                 endIndex: rowIndex + 1,
//               },
//             },
//           },
//         ],
//       },
//     });
//   }

//   async getSheetId(sheetName) {
//     this.ensureInitialized();

//     const res = await this.sheets.spreadsheets.get({
//       spreadsheetId: this.spreadsheetId,
//     });

//     const sheet = res.data.sheets.find(
//       (s) => s.properties.title === sheetName
//     );

//     if (!sheet) {
//       throw new Error(`Sheet "${sheetName}" not found`);
//     }

//     return sheet.properties.sheetId;
//   }

//   async createSheet(sheetName) {
//     this.ensureInitialized();

//     return this.sheets.spreadsheets.batchUpdate({
//       spreadsheetId: this.spreadsheetId,
//       requestBody: {
//         requests: [
//           {
//             addSheet: {
//               properties: { title: sheetName },
//             },
//           },
//         ],
//       },
//     });
//   }
// }

// module.exports = new GoogleSheetsService();



const { google } = require("googleapis");

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!this.spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not defined in environment variables");
    }

    this.initialize(); // auto-init
  }

  initialize() {
    if (!process.env.GOOGLE_CREDENTIALS_JSON) {
      throw new Error("GOOGLE_CREDENTIALS_JSON is not defined in environment variables");
    }

    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    } catch (err) {
      throw new Error("Invalid GOOGLE_CREDENTIALS_JSON format");
    }

    const auth = new google.auth.GoogleAuth({
      credentials, // 🔥 ENV-based credentials
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({
      version: "v4",
      auth,
    });

    console.log("✅ Google Sheets API initialized using ENV credentials");
  }

  ensureInitialized() {
    if (!this.sheets) {
      throw new Error("Google Sheets API not initialized");
    }
  }

  async appendRow(sheetName, values) {
    this.ensureInitialized();

    return this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  }

  async getRows(sheetName, range = "A:Z") {
    this.ensureInitialized();

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!${range}`,
    });

    return res.data.values || [];
  }

  async updateRow(sheetName, range, values) {
    this.ensureInitialized();

    return this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!${range}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  }

  async deleteRow(sheetName, rowIndex) {
    this.ensureInitialized();

    const sheetId = await this.getSheetId(sheetName);

    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });
  }

  async getSheetId(sheetName) {
    this.ensureInitialized();

    const res = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const sheet = res.data.sheets.find(
      (s) => s.properties.title === sheetName
    );

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    return sheet.properties.sheetId;
  }

  async createSheet(sheetName) {
    this.ensureInitialized();

    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: sheetName },
            },
          },
        ],
      },
    });
  }
}

module.exports = new GoogleSheetsService();
