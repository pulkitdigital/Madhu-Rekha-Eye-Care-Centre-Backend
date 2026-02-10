// Backend/DischargeSlips/DischargeTicket/googleSheetsService.js
const googleSheets = require('../../config/googleSheets.config');

class GoogleSheetsDischargeTicketService {
  constructor() {
    this.sheetName = 'DischargeTickets';
    this.headers = [
      'Ticket ID',
      'Patient Name',
      'Age',
      'Sex',
      'Diagnosis (RE)',
      'Diagnosis (LE)',
      'Date of Admission',
      'Time of Admission',
      'Date of Discharge',
      'Time of Discharge',
      'Procedure Done',
      'Date of Surgery',
      'O.T. Note',
      'Conditions at Discharge',
      'Post OP Advice',
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
      
      // If sheet is empty, add headers
      if (!rows || rows.length === 0) {
        await googleSheets.appendRow(this.sheetName, this.headers);
      }
    } catch (error) {
      // If sheet doesn't exist, create it
      try {
        await googleSheets.createSheet(this.sheetName);
        await googleSheets.appendRow(this.sheetName, this.headers);
      } catch (createError) {
        console.error('Error creating sheet:', createError);
      }
    }
  }

  // Convert ticket object to array for Google Sheets
  ticketToArray(ticket) {
    return [
      ticket.ticketId || '',
      ticket.patientName || '',
      ticket.age || '',
      ticket.sex || '',
      ticket.diagnosisRE || '',
      ticket.diagnosisLE || '',
      ticket.admissionDate || '',
      ticket.admissionTime || '',
      ticket.dischargeDate || '',
      ticket.dischargeTime || '',
      ticket.procedureDone || '',
      ticket.surgeryDate || '',
      ticket.otNote || '',
      ticket.conditionsAtDischarge || '',
      ticket.postOpAdvice || '',
      ticket.status || 'Pending',
      ticket.createdAt || new Date().toISOString(),
      ticket.updatedAt || new Date().toISOString()
    ];
  }

  // Add ticket to Google Sheets
  async addTicket(ticket) {
    try {
      const values = this.ticketToArray(ticket);
      await googleSheets.appendRow(this.sheetName, values);
      return true;
    } catch (error) {
      console.error('Error adding ticket to Google Sheets:', error);
      throw error;
    }
  }

  // Find ticket row index by ticket ID
  async findTicketRowIndex(ticketId) {
    try {
      const rows = await googleSheets.getRows(this.sheetName);
      
      for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
        if (rows[i][0] === ticketId) {
          return i + 1; // Google Sheets is 1-indexed
        }
      }
      return -1;
    } catch (error) {
      console.error('Error finding ticket row:', error);
      throw error;
    }
  }

  // Update ticket in Google Sheets
  async updateTicket(ticketId, updateData) {
    try {
      const rowIndex = await this.findTicketRowIndex(ticketId);
      
      if (rowIndex === -1) {
        throw new Error('Ticket not found in Google Sheets');
      }

      // Get existing row data
      const rows = await googleSheets.getRows(this.sheetName);
      const existingRow = rows[rowIndex - 1];

      // Merge existing data with update
      const ticket = {
        ticketId: existingRow[0],
        patientName: updateData.patientName || existingRow[1],
        age: updateData.age || existingRow[2],
        sex: updateData.sex || existingRow[3],
        diagnosisRE: updateData.diagnosisRE !== undefined ? updateData.diagnosisRE : existingRow[4],
        diagnosisLE: updateData.diagnosisLE !== undefined ? updateData.diagnosisLE : existingRow[5],
        admissionDate: updateData.admissionDate || existingRow[6],
        admissionTime: updateData.admissionTime || existingRow[7],
        dischargeDate: updateData.dischargeDate || existingRow[8],
        dischargeTime: updateData.dischargeTime || existingRow[9],
        procedureDone: updateData.procedureDone || existingRow[10],
        surgeryDate: updateData.surgeryDate || existingRow[11],
        otNote: updateData.otNote || existingRow[12],
        conditionsAtDischarge: updateData.conditionsAtDischarge || existingRow[13],
        postOpAdvice: updateData.postOpAdvice || existingRow[14],
        status: updateData.status || existingRow[15],
        createdAt: existingRow[16],
        updatedAt: updateData.updatedAt || new Date().toISOString()
      };

      const values = this.ticketToArray(ticket);
      const range = `A${rowIndex}:R${rowIndex}`;
      await googleSheets.updateRow(this.sheetName, range, values);
      
      return true;
    } catch (error) {
      console.error('Error updating ticket in Google Sheets:', error);
      throw error;
    }
  }

  // Delete ticket from Google Sheets
  async deleteTicket(ticketId) {
    try {
      const rowIndex = await this.findTicketRowIndex(ticketId);
      
      if (rowIndex === -1) {
        throw new Error('Ticket not found in Google Sheets');
      }

      await googleSheets.deleteRow(this.sheetName, rowIndex - 1); // Convert to 0-indexed
      return true;
    } catch (error) {
      console.error('Error deleting ticket from Google Sheets:', error);
      throw error;
    }
  }

  // Get all tickets from Google Sheets
  async getAllTickets() {
    try {
      const rows = await googleSheets.getRows(this.sheetName);
      
      if (!rows || rows.length <= 1) {
        return [];
      }

      const tickets = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        tickets.push({
          ticketId: row[0],
          patientName: row[1],
          age: row[2],
          sex: row[3],
          diagnosisRE: row[4],
          diagnosisLE: row[5],
          admissionDate: row[6],
          admissionTime: row[7],
          dischargeDate: row[8],
          dischargeTime: row[9],
          procedureDone: row[10],
          surgeryDate: row[11],
          otNote: row[12],
          conditionsAtDischarge: row[13],
          postOpAdvice: row[14],
          status: row[15],
          createdAt: row[16],
          updatedAt: row[17]
        });
      }

      return tickets;
    } catch (error) {
      console.error('Error getting all tickets from Google Sheets:', error);
      throw error;
    }
  }
}

module.exports = new GoogleSheetsDischargeTicketService();