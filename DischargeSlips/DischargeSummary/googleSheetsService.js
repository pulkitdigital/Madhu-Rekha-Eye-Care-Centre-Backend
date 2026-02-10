const googleSheets = require('../../config/googleSheets.config');

class GoogleSheetsDischargeSummaryService {
  constructor() {
    this.sheetName = 'DischargeSummaries';
    this.headers = [
      'Summary ID',
      'Patient Name',
      'Age',
      'Sex',
      'Diagnosis',
      'Eye (RE)',
      'Eye (LE)',
      'Procedure',
      'Procedure Date',
      'Status',
      'Created At',
      'Updated At'
    ];
  }

  async initialize() {
    try {
      await googleSheets.initialize();
      await this.ensureSheetExists();
    } catch (error) {
      console.error('Error initializing Google Sheets service:', error);
      throw error;
    }
  }

  async ensureSheetExists() {
    try {
      const rows = await googleSheets.getRows(this.sheetName, 'A1:Z1');

      if (!rows || rows.length === 0) {
        await googleSheets.appendRow(this.sheetName, this.headers);
      }
    } catch (error) {
      try {
        await googleSheets.createSheet(this.sheetName);
        await googleSheets.appendRow(this.sheetName, this.headers);
      } catch (createError) {
        console.error('Error creating summary sheet:', createError);
      }
    }
  }

  // Convert summary object to array
  summaryToArray(summary) {
    return [
      summary.summaryId || '',
      summary.patientName || '',
      summary.age || '',
      summary.sex || '',
      summary.diagnosis || '',
      summary.eyeRE || '',
      summary.eyeLE || '',
      summary.procedure || '',
      summary.procedureDate || '',
      summary.status || 'Pending',
      summary.createdAt || new Date().toISOString(),
      summary.updatedAt || new Date().toISOString()
    ];
  }

  // Add summary
  async addSummary(summary) {
    try {
      const values = this.summaryToArray(summary);
      await googleSheets.appendRow(this.sheetName, values);
      return true;
    } catch (error) {
      console.error('Error adding summary to Google Sheets:', error);
      throw error;
    }
  }

  // Find summary row
  async findSummaryRowIndex(summaryId) {
    try {
      const rows = await googleSheets.getRows(this.sheetName);

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === summaryId) {
          return i + 1; // 1-indexed
        }
      }
      return -1;
    } catch (error) {
      console.error('Error finding summary row:', error);
      throw error;
    }
  }

  // Update summary
  async updateSummary(summaryId, updateData) {
    try {
      const rowIndex = await this.findSummaryRowIndex(summaryId);

      if (rowIndex === -1) {
        throw new Error('Summary not found in Google Sheets');
      }

      const rows = await googleSheets.getRows(this.sheetName);
      const existingRow = rows[rowIndex - 1];

      const summary = {
        summaryId: existingRow[0],
        patientName: updateData.patientName || existingRow[1],
        age: updateData.age || existingRow[2],
        sex: updateData.sex || existingRow[3],
        diagnosis: updateData.diagnosis !== undefined ? updateData.diagnosis : existingRow[4],
        eyeRE: updateData.eyeRE !== undefined ? updateData.eyeRE : existingRow[5],
        eyeLE: updateData.eyeLE !== undefined ? updateData.eyeLE : existingRow[6],
        procedure: updateData.procedure !== undefined ? updateData.procedure : existingRow[7],
        procedureDate: updateData.procedureDate || existingRow[8],
        status: updateData.status || existingRow[9],
        createdAt: existingRow[10],
        updatedAt: updateData.updatedAt || new Date().toISOString()
      };

      const values = this.summaryToArray(summary);
      const range = `A${rowIndex}:L${rowIndex}`;
      await googleSheets.updateRow(this.sheetName, range, values);

      return true;
    } catch (error) {
      console.error('Error updating summary in Google Sheets:', error);
      throw error;
    }
  }

  // Delete summary
  async deleteSummary(summaryId) {
    try {
      const rowIndex = await this.findSummaryRowIndex(summaryId);

      if (rowIndex === -1) {
        throw new Error('Summary not found in Google Sheets');
      }

      await googleSheets.deleteRow(this.sheetName, rowIndex - 1);
      return true;
    } catch (error) {
      console.error('Error deleting summary from Google Sheets:', error);
      throw error;
    }
  }

  // Get all summaries
  async getAllSummaries() {
    try {
      const rows = await googleSheets.getRows(this.sheetName);

      if (!rows || rows.length <= 1) {
        return [];
      }

      const summaries = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        summaries.push({
          summaryId: row[0],
          patientName: row[1],
          age: row[2],
          sex: row[3],
          diagnosis: row[4],
          eyeRE: row[5],
          eyeLE: row[6],
          procedure: row[7],
          procedureDate: row[8],
          status: row[9],
          createdAt: row[10],
          updatedAt: row[11]
        });
      }

      return summaries;
    } catch (error) {
      console.error('Error getting summaries from Google Sheets:', error);
      throw error;
    }
  }
}

module.exports = new GoogleSheetsDischargeSummaryService();
