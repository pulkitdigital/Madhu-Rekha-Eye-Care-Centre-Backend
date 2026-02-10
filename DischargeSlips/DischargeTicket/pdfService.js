// const PDFDocument = require('pdfkit');
// const path = require('path');
// const fs = require('fs');

// class DischargeTicketPDFService {
  
//   /**
//    * Generate discharge ticket PDF with professional header matching full-payment PDF
//    * @param {Object} ticketData - Discharge ticket data
//    * @param {Object} clinicProfile - Clinic profile data
//    * @returns {Promise<Buffer>} - PDF buffer
//    */
//   async generatePDF(ticketData, clinicProfile) {
//     return new Promise((resolve, reject) => {
//       try {
//         console.log('📄 Starting PDF generation...');
//         console.log('📋 Ticket ID:', ticketData.ticketId);
        
//         // Create PDF document with A4 size
//         const doc = new PDFDocument({
//           size: 'A4',
//           margin: 0,
//           info: {
//             Title: `Discharge Ticket - ${ticketData.ticketId}`,
//             Author: clinicProfile.clinicName,
//             Subject: 'Patient Discharge Ticket',
//             Keywords: 'discharge, ticket, medical'
//           }
//         });

//         // Collect PDF data in buffer
//         const buffers = [];
//         doc.on('data', (chunk) => buffers.push(chunk));
//         doc.on('end', () => {
//           const pdfBuffer = Buffer.concat(buffers);
//           console.log('✅ PDF generated successfully');
//           console.log('📦 PDF size:', pdfBuffer.length, 'bytes');
//           resolve(pdfBuffer);
//         });
//         doc.on('error', (err) => {
//           console.error('❌ PDF generation error:', err);
//           reject(err);
//         });

//         // Register fonts
//         try {
//           const workSansPath = path.join(__dirname, '..', '..', '..', 'resources', 'WorkSans-Regular.ttf');
//           if (fs && fs.existsSync(workSansPath)) {
//             doc.registerFont('WorkSans', workSansPath);
//             doc.font('WorkSans');
//           } else {
//             doc.font('Helvetica');
//           }
//         } catch (e) {
//           doc.font('Helvetica');
//         }

//         // Generate PDF content
//         this.generateContent(doc, ticketData, clinicProfile);

//         // Finalize PDF
//         doc.end();

//       } catch (error) {
//         console.error('❌ Error in generatePDF:', error);
//         reject(error);
//       }
//     });
//   }

//   /**
//    * Generate the complete PDF content
//    */
//   generateContent(doc, ticketData, clinicProfile) {
//     const pageMargin = 15;
//     const borderPadding = 20;

//     // Draw page border
//     this.drawPageBorder(doc, pageMargin);

//     // Calculate content area
//     const contentArea = this.computeContentArea(doc, pageMargin, borderPadding);
//     let { contentLeft, contentTop, contentRight, usableWidth } = contentArea;
//     let y = contentTop;

//     // Add professional header with logos (matching full-payment PDF)
//     y = this.addProfessionalHeader(doc, clinicProfile, contentLeft, contentTop, contentRight, usableWidth, y);

//     // Add doctors info
//     y = this.addDoctorInfo(doc, clinicProfile, contentLeft, contentRight, usableWidth, y);

//     // NOW USE OLD FORMAT FOR REST OF THE CONTENT
//     const pageWidth = doc.page.width;
//     const leftMargin = contentLeft;
//     const rightMargin = contentRight;

//     // DISCHARGE TICKET badge (OLD STYLE - rounded black badge)
//     y = this.addDischargeTicketBadgeOldStyle(doc, pageWidth, y);

//     // Patient details form (OLD STYLE - with underlines)
//     y = this.addPatientDetailsFormOldStyle(doc, ticketData, leftMargin, rightMargin, usableWidth, y);

//     // Signature section (OLD STYLE)
//     y = this.addSignatureOldStyle(doc, rightMargin, y);

//     // Do's and Don'ts section (OLD STYLE)
//     this.addDosAndDontsOldStyle(doc, leftMargin, rightMargin, pageWidth, y);
//   }

//   /**
//    * Draw page border
//    */
//   drawPageBorder(doc, pageMargin) {
//     try {
//       const pw = doc.page.width;
//       const ph = doc.page.height;
//       doc.save();
//       doc.lineWidth(0.8);
//       doc.rect(pageMargin, pageMargin, pw - pageMargin * 2, ph - pageMargin * 2).stroke();
//       doc.restore();
//     } catch (e) {
//       /* ignore */
//     }
//   }

//   /**
//    * Compute content area
//    */
//   computeContentArea(doc, pageMargin, borderPadding) {
//     const pw = doc.page.width;
//     const ph = doc.page.height;
//     const contentLeft = pageMargin + borderPadding;
//     const contentTop = pageMargin + borderPadding;
//     const contentRight = pw - (pageMargin + borderPadding);
//     const contentBottom = ph - (pageMargin + borderPadding);
//     const usableWidth = contentRight - contentLeft;
//     const usableHeight = contentBottom - contentTop;
//     return { contentLeft, contentTop, contentRight, contentBottom, usableWidth, usableHeight };
//   }

//   /**
//    * Add professional header with logos (matching full-payment PDF format)
//    */
//   addProfessionalHeader(doc, clinicProfile, contentLeft, contentTop, contentRight, usableWidth, startY) {
//     let y = startY;

//     // Fix: Resources folder is at Backend level (same as DischargeSlips)
//     const logoLeftPath = path.join(__dirname, '..', '..', 'resources', 'logo-left.png');
//     const logoRightPath = path.join(__dirname, '..', '..', 'resources', 'logo-right.png');
    
//     const logoW = 40;
//     const logoH = 40;

//     // Left logo
//     try {
//       if (fs && fs.existsSync(logoLeftPath)) {
//         doc.image(logoLeftPath, contentLeft, y, { width: logoW, height: logoH });
//       }
//     } catch (e) {}

//     // Right logo
//     try {
//       if (fs && fs.existsSync(logoRightPath)) {
//         doc.image(logoRightPath, contentRight - logoW, y, { width: logoW, height: logoH });
//       }
//     } catch (e) {}

//     // Clinic name (centered, bold)
//     doc.fontSize(14)
//        .font('Helvetica-Bold')
//        .text(clinicProfile.clinicName || '', contentLeft, y + 6, {
//          width: usableWidth,
//          align: 'center'
//        });

//     // Address (centered)
//     doc.fontSize(9)
//        .font('Helvetica')
//        .text(clinicProfile.address || '', contentLeft, y + 26, {
//          width: usableWidth,
//          align: 'center'
//        });

//     // PAN and Registration number (centered)
//     const panText = clinicProfile.panNumber || clinicProfile.pan || '';
//     const regText = clinicProfile.registrationNumber || clinicProfile.regNo || '';
//     doc.text(`PAN : ${panText}   |   Reg. No: ${regText}`, contentLeft, y + 40, {
//       width: usableWidth,
//       align: 'center'
//     });

//     y += 56;

//     // Horizontal line separator
//     doc.moveTo(contentLeft, y).lineTo(contentRight, y).stroke();
//     y += 8;

//     return y;
//   }

//   /**
//    * Add doctor information (two columns) - matching full-payment PDF
//    */
//   addDoctorInfo(doc, clinicProfile, contentLeft, contentRight, usableWidth, startY) {
//     let y = startY;

//     const doctor1Name = clinicProfile.doctor1Name || '';
//     const doctor1RegNo = clinicProfile.doctor1RegNo || clinicProfile.doctor1Qualification || '';
//     const doctor2Name = clinicProfile.doctor2Name || '';
//     const doctor2RegNo = clinicProfile.doctor2RegNo || clinicProfile.doctor2Qualification || '';

//     // Doctor 1 (Left side)
//     doc.fontSize(9).font('Helvetica-Bold');
//     doc.text(doctor1Name, contentLeft, y);

//     // Doctor 2 (Right side)
//     doc.text(doctor2Name, contentLeft, y, {
//       width: usableWidth,
//       align: 'right'
//     });

//     y += 12;

//     // Doctor 1 Reg No (Left)
//     doc.font('Helvetica').fontSize(8);
//     doc.text(doctor1RegNo ? `Reg. No.: ${doctor1RegNo}` : '', contentLeft, y);

//     // Doctor 2 Reg No (Right)
//     doc.text(doctor2RegNo ? `Reg. No.: ${doctor2RegNo}` : '', contentLeft, y, {
//       width: usableWidth,
//       align: 'right'
//     });

//     y += 18;

//     return y;
//   }

//   /**
//    * Add DISCHARGE TICKET badge (OLD STYLE - rounded black badge)
//    */
//   addDischargeTicketBadgeOldStyle(doc, pageWidth, startY) {
//     let y = startY;
//     const badgeWidth = 220;
//     const badgeHeight = 28;
//     const badgeX = (pageWidth - badgeWidth) / 2;
//     const cornerRadius = 14;

//     // Black rounded rectangle
//     doc.roundedRect(badgeX, y, badgeWidth, badgeHeight, cornerRadius)
//        .fillAndStroke('#000000', '#000000');

//     // White text
//     doc.fontSize(13)
//        .fillColor('#FFFFFF')
//        .font('Helvetica-Bold')
//        .text('DISCHARGE TICKET', badgeX, y + 8, {
//          width: badgeWidth,
//          align: 'center'
//        });

//     return y + badgeHeight + 18;
//   }

//   /**
//    * Add patient details form fields (OLD STYLE - with underlines)
//    */
//   addPatientDetailsFormOldStyle(doc, ticketData, leftMargin, rightMargin, usableWidth, startY) {
//     let y = startY;

//     // Name and Age/Sex on same line
//     doc.fontSize(10)
//        .fillColor('#000000')
//        .font('Helvetica')
//        .text('Name :-', leftMargin, y);

//     const nameLabelWidth = doc.widthOfString('Name :-');
//     const nameLineStart = leftMargin + nameLabelWidth + 8;
//     const nameLineEnd = 420;
    
//     // Name underline
//     doc.moveTo(nameLineStart, y + 12)
//        .lineTo(nameLineEnd, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     // Fill name if available
//     if (ticketData.patientName) {
//       doc.fontSize(10)
//          .font('Helvetica-Bold')
//          .fillColor('#000000')
//          .text(ticketData.patientName, nameLineStart + 5, y);
//     }

//     // Age/Sex
//     doc.fontSize(10)
//        .font('Helvetica')
//        .fillColor('#000000')
//        .text('Age/Sex :-', 435, y);

//     const ageSexLabelWidth = doc.widthOfString('Age/Sex :-');
//     const ageSexLineStart = 435 + ageSexLabelWidth + 8;

//     doc.moveTo(ageSexLineStart, y + 12)
//        .lineTo(rightMargin, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     if (ticketData.age && ticketData.sex) {
//       doc.fontSize(10)
//          .font('Helvetica-Bold')
//          .fillColor('#000000')
//          .text(`${ticketData.age}/${ticketData.sex}`, ageSexLineStart + 5, y);
//     }

//     y += 28;

//     // Diagnosis line
//     doc.fontSize(10)
//        .font('Helvetica')
//        .fillColor('#000000')
//        .text('Diagnosis (Right Eye) :-', leftMargin, y);

//     const diagnosisRELabelWidth = doc.widthOfString('Diagnosis (Right Eye) :-');
//     const diagnosisRELineStart = leftMargin + diagnosisRELabelWidth + 8;
//     const diagnosisRELineEnd = 350;

//     doc.moveTo(diagnosisRELineStart, y + 12)
//        .lineTo(diagnosisRELineEnd, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     if (ticketData.diagnosisRE) {
//       doc.fontSize(9)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(ticketData.diagnosisRE, diagnosisRELineStart + 5, y + 1);
//     }

//     doc.fontSize(10)
//        .font('Helvetica')
//        .fillColor('#000000')
//        .text('(Left Eye) :-', 360, y);

//     const diagnosisLELabelWidth = doc.widthOfString('(Left Eye) :-');
//     const diagnosisLELineStart = 360 + diagnosisLELabelWidth + 8;

//     doc.moveTo(diagnosisLELineStart, y + 12)
//        .lineTo(rightMargin, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     if (ticketData.diagnosisLE) {
//       doc.fontSize(9)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(ticketData.diagnosisLE, diagnosisLELineStart + 5, y + 1);
//     }

//     y += 28;

//     // Date & Time of Admission
//     doc.fontSize(10)
//        .font('Helvetica')
//        .fillColor('#000000')
//        .text('Date & Time of Admission :-', leftMargin, y);

//     const admissionLabelWidth = doc.widthOfString('Date & Time of Admission :-');
//     const admissionLineStart = leftMargin + admissionLabelWidth + 8;

//     doc.moveTo(admissionLineStart, y + 12)
//        .lineTo(rightMargin, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     if (ticketData.admissionDate) {
//       const admissionText = ticketData.admissionTime 
//         ? `${ticketData.admissionDate} at ${ticketData.admissionTime}`
//         : ticketData.admissionDate;
//       doc.fontSize(9)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(admissionText, admissionLineStart + 5, y + 1);
//     }

//     y += 28;

//     // Date & Time of Discharge
//     doc.fontSize(10)
//        .font('Helvetica')
//        .fillColor('#000000')
//        .text('Date & Time of Discharge :-', leftMargin, y);

//     const dischargeLabelWidth = doc.widthOfString('Date & Time of Discharge :-');
//     const dischargeLineStart = leftMargin + dischargeLabelWidth + 8;

//     doc.moveTo(dischargeLineStart, y + 12)
//        .lineTo(rightMargin, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     if (ticketData.dischargeDate) {
//       const dischargeText = ticketData.dischargeTime 
//         ? `${ticketData.dischargeDate} at ${ticketData.dischargeTime}`
//         : ticketData.dischargeDate;
//       doc.fontSize(9)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(dischargeText, dischargeLineStart + 5, y + 1);
//     }

//     y += 28;

//     // Procedure Done and Date of Surgery on same line
//     doc.fontSize(10)
//        .font('Helvetica')
//        .fillColor('#000000')
//        .text('Procedure Done :-', leftMargin, y);

//     const procedureLabelWidth = doc.widthOfString('Procedure Done :-');
//     const procedureLineStart = leftMargin + procedureLabelWidth + 8;
//     const procedureLineEnd = 350;

//     doc.moveTo(procedureLineStart, y + 12)
//        .lineTo(procedureLineEnd, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     if (ticketData.procedureDone) {
//       doc.fontSize(9)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(ticketData.procedureDone, procedureLineStart + 5, y + 1);
//     }

//     doc.fontSize(10)
//        .font('Helvetica')
//        .fillColor('#000000')
//        .text('Date of Surgery :-', 365, y);

//     const surgeryLabelWidth = doc.widthOfString('Date of Surgery :-');
//     const surgeryLineStart = 365 + surgeryLabelWidth + 8;

//     doc.moveTo(surgeryLineStart, y + 12)
//        .lineTo(rightMargin, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     if (ticketData.surgeryDate) {
//       doc.fontSize(9)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(ticketData.surgeryDate, surgeryLineStart + 5, y + 1);
//     }

//     y += 35;

//     // O.T. Note section (BOLD)
//     doc.fontSize(10)
//        .font('Helvetica-Bold')
//        .fillColor('#000000')
//        .text('O.T. Note :-', leftMargin, y);

//     // Underline for O.T. Note (matching text width)
//     const otNoteWidth = doc.widthOfString('O.T. Note :-');
//     doc.moveTo(leftMargin, y + 12)
//        .lineTo(leftMargin + otNoteWidth, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     y += 18;

//     if (ticketData.otNote) {
//       doc.fontSize(8)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(ticketData.otNote, leftMargin + 15, y, {
//            width: rightMargin - leftMargin - 15,
//            align: 'left',
//            lineGap: 1
//          });
//       y += doc.heightOfString(ticketData.otNote, { 
//         width: rightMargin - leftMargin - 15 
//       }) + 15;
//     } else {
//       y += 25;
//     }

//     // CONDITIONS AT DISCHARGE (BOLD)
//     doc.fontSize(10)
//        .font('Helvetica-Bold')
//        .fillColor('#000000')
//        .text('CONDITIONS AT DISCHARGE :-', leftMargin, y);

//     // Underline for CONDITIONS AT DISCHARGE (matching text width)
//     const conditionsWidth = doc.widthOfString('CONDITIONS AT DISCHARGE :-');
//     doc.moveTo(leftMargin, y + 12)
//        .lineTo(leftMargin + conditionsWidth, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     y += 18;

//     if (ticketData.conditionsAtDischarge) {
//       doc.fontSize(8)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(ticketData.conditionsAtDischarge, leftMargin + 15, y, {
//            width: rightMargin - leftMargin - 15,
//            align: 'left',
//            lineGap: 1
//          });
//       y += doc.heightOfString(ticketData.conditionsAtDischarge, { 
//         width: rightMargin - leftMargin - 15 
//       }) + 15;
//     } else {
//       y += 25;
//     }

//     // POST OP ADVICE (BOLD)
//     doc.fontSize(10)
//        .font('Helvetica-Bold')
//        .fillColor('#000000')
//        .text('POST OP ADVICE :-', leftMargin, y);

//     // Underline for POST OP ADVICE (matching text width)
//     const postOpWidth = doc.widthOfString('POST OP ADVICE :-');
//     doc.moveTo(leftMargin, y + 12)
//        .lineTo(leftMargin + postOpWidth, y + 12)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     y += 18;

//     if (ticketData.postOpAdvice) {
//       doc.fontSize(8)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(ticketData.postOpAdvice, leftMargin + 15, y, {
//            width: rightMargin - leftMargin - 15,
//            align: 'left',
//            lineGap: 1
//          });
//       y += doc.heightOfString(ticketData.postOpAdvice, { 
//         width: rightMargin - leftMargin - 15 
//       }) + 20;
//     } else {
//       y += 25;
//     }

//     return y;
//   }

//   /**
//    * Add signature section (OLD STYLE)
//    */
//   addSignatureOldStyle(doc, rightMargin, startY) {
//     let y = startY + 10;

//     // Signature line
//     doc.moveTo(rightMargin - 140, y)
//        .lineTo(rightMargin, y)
//        .lineWidth(0.5)
//        .stroke('#000000');

//     // Signature text
//     doc.fontSize(9)
//        .font('Helvetica-Oblique')
//        .fillColor('#000000')
//        .text('Signature of Doctor', rightMargin - 140, y + 8, {
//          width: 140,
//          align: 'center'
//        });

//     return y + 30;
//   }

//   /**
//    * Add Do's and Don'ts section (OLD STYLE - perfect table layout)
//    */
//   addDosAndDontsOldStyle(doc, leftMargin, rightMargin, pageWidth, startY) {
//     const centerX = pageWidth / 2;
//     let y = startY;

//     // Table top border
//     doc.moveTo(leftMargin, y)
//        .lineTo(rightMargin, y)
//        .lineWidth(1)
//        .stroke('#000000');

//     y += 12;

//     // Headers with background
//     const headerHeight = 16;
//     const headerY = y;
    
//     // Left header background
//     doc.rect(leftMargin, headerY, centerX - leftMargin, headerHeight)
//        .stroke('#000000');
    
//     // Right header background
//     doc.rect(centerX, headerY, rightMargin - centerX, headerHeight)
//        .stroke('#000000');

//     // Headers text
//     doc.fontSize(11)
//        .font('Helvetica-Bold')
//        .fillColor('#000000')
//        .text("Do's", leftMargin, headerY + 4, {
//          width: centerX - leftMargin,
//          align: 'center'
//        });

//     doc.fontSize(11)
//        .font('Helvetica-Bold')
//        .fillColor('#000000')
//        .text("Don'ts", centerX, headerY + 4, {
//          width: rightMargin - centerX,
//          align: 'center'
//        });

//     y += headerHeight;

//     // Do's items
//     const dosItems = [
//       'Wear protective glasses.',
//       'Carefully wash hands with soap & water & dry before applying eye drops.',
//       'Put the eye drops as advised by your doctor.',
//       'Can watch television.',
//       'Take adequate rest after operation to promote healing.',
//       'Go for regular visits as advised by your doctor.',
//       'Clean the operated eye as advised.',
//       'Light walking is allowed as exercise.'
//     ];

//     // Don'ts items
//     const dontsItems = [
//       'Avoid heavy exercise, swimming, driving and playing with children until advised.',
//       'Do not rub your eyes with dirty hand or linen.',
//       'Do not sleep on the operated side for 5 days.',
//       'Avoid bending & lifting heavy objects.',
//       'Do not have a head bath until advised.',
//       'Avoid deep cough, Sneeze and constipation.',
//       'Do not open the eye drop with unsterile objects.'
//     ];

//     const leftColumnWidth = centerX - leftMargin - 10;
//     const rightColumnWidth = rightMargin - centerX - 10;
//     const cellPadding = 5;
//     const rowHeight = 22;

//     // Draw content rows
//     const maxItems = Math.max(dosItems.length, dontsItems.length);
    
//     for (let i = 0; i < maxItems; i++) {
//       const rowY = y + (i * rowHeight);
      
//       // Left cell border
//       doc.rect(leftMargin, rowY, centerX - leftMargin, rowHeight)
//          .stroke('#000000');
      
//       // Right cell border
//       doc.rect(centerX, rowY, rightMargin - centerX, rowHeight)
//          .stroke('#000000');
      
//       // Do's item
//       if (i < dosItems.length) {
//         doc.fontSize(7.5)
//            .font('Helvetica')
//            .fillColor('#000000');
        
//         // Bullet point
//         doc.circle(leftMargin + 8, rowY + 7, 1.5)
//            .fill('#000000');
        
//         // Text
//         doc.text(dosItems[i], leftMargin + 15, rowY + cellPadding - 1, {
//           width: leftColumnWidth - 10,
//           align: 'left',
//           lineGap: 0
//         });
//       }
      
//       // Don'ts item
//       if (i < dontsItems.length) {
//         doc.fontSize(7.5)
//            .font('Helvetica')
//            .fillColor('#000000');
        
//         // Bullet point
//         doc.circle(centerX + 8, rowY + 7, 1.5)
//            .fill('#000000');
        
//         // Text
//         doc.text(dontsItems[i], centerX + 15, rowY + cellPadding - 1, {
//           width: rightColumnWidth - 10,
//           align: 'left',
//           lineGap: 0
//         });
//       }
//     }

//     y += (maxItems * rowHeight) + 10;

//     // Bottom warning message (without border)
//     doc.fontSize(7.5)
//        .font('Helvetica')
//        .fillColor('#000000');
    
//     // Bullet point for warning
//     doc.circle(leftMargin + 75, y + 7, 1.5)
//        .fill('#000000');
    
//     const warningText = 'Please report immediately if the patient feels pain, redness or diminution of vision after cataract surgery.';
//     doc.text(warningText, leftMargin + 82, y + 4, {
//       width: rightMargin - leftMargin - 87,
//       align: 'left'
//     });

//     return y + 25;
//   }
// }

// module.exports = new DischargeTicketPDFService();

const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

class DischargeTicketPDFService {
  
  /**
   * Generate discharge ticket PDF with professional header matching full-payment PDF
   * @param {Object} ticketData - Discharge ticket data
   * @param {Object} clinicProfile - Clinic profile data
   * @returns {Promise<Buffer>} - PDF buffer
   */
  async generatePDF(ticketData, clinicProfile) {
    return new Promise((resolve, reject) => {
      try {
        console.log('📄 Starting PDF generation...');
        console.log('📋 Ticket ID:', ticketData.ticketId);
        
        // Create PDF document with A4 size
        const doc = new PDFDocument({
          size: 'A4',
          margin: 0,
          info: {
            Title: `Discharge Ticket - ${ticketData.ticketId}`,
            Author: clinicProfile.clinicName,
            Subject: 'Patient Discharge Ticket',
            Keywords: 'discharge, ticket, medical'
          }
        });

        // Collect PDF data in buffer
        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log('✅ PDF generated successfully');
          console.log('📦 PDF size:', pdfBuffer.length, 'bytes');
          resolve(pdfBuffer);
        });
        doc.on('error', (err) => {
          console.error('❌ PDF generation error:', err);
          reject(err);
        });

        // Register fonts
        try {
          const workSansPath = path.join(__dirname, '..', '..', '..', 'resources', 'WorkSans-Regular.ttf');
          if (fs && fs.existsSync(workSansPath)) {
            doc.registerFont('WorkSans', workSansPath);
            doc.font('WorkSans');
          } else {
            doc.font('Helvetica');
          }
        } catch (e) {
          doc.font('Helvetica');
        }

        // Generate PDF content
        this.generateContent(doc, ticketData, clinicProfile);

        // Finalize PDF
        doc.end();

      } catch (error) {
        console.error('❌ Error in generatePDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Generate the complete PDF content
   */
  generateContent(doc, ticketData, clinicProfile) {
    const pageMargin = 15;
    const borderPadding = 20;

    // Draw page border
    this.drawPageBorder(doc, pageMargin);

    // Calculate content area
    const contentArea = this.computeContentArea(doc, pageMargin, borderPadding);
    let { contentLeft, contentTop, contentRight, usableWidth } = contentArea;
    let y = contentTop;

    // Add professional header with logos (matching full-payment PDF)
    y = this.addProfessionalHeader(doc, clinicProfile, contentLeft, contentTop, contentRight, usableWidth, y);

    // Add doctors info
    y = this.addDoctorInfo(doc, clinicProfile, contentLeft, contentRight, usableWidth, y);

    // NOW USE OLD FORMAT FOR REST OF THE CONTENT
    const pageWidth = doc.page.width;
    const leftMargin = contentLeft;
    const rightMargin = contentRight;

    // DISCHARGE TICKET badge (OLD STYLE - rounded black badge)
    y = this.addDischargeTicketBadgeOldStyle(doc, pageWidth, y);

    // Patient details form (OLD STYLE - with underlines)
    y = this.addPatientDetailsFormOldStyle(doc, ticketData, leftMargin, rightMargin, usableWidth, y);

    // Signature section (OLD STYLE)
    y = this.addSignatureOldStyle(doc, rightMargin, y);

    // Do's and Don'ts section (OLD STYLE) - WITH PAGE BREAK CHECK
    this.addDosAndDontsOldStyle(doc, leftMargin, rightMargin, pageWidth, y, pageMargin, borderPadding);
  }

  /**
   * Draw page border
   */
  drawPageBorder(doc, pageMargin) {
    try {
      const pw = doc.page.width;
      const ph = doc.page.height;
      doc.save();
      doc.lineWidth(0.8);
      doc.rect(pageMargin, pageMargin, pw - pageMargin * 2, ph - pageMargin * 2).stroke();
      doc.restore();
    } catch (e) {
      /* ignore */
    }
  }

  /**
   * Compute content area
   */
  computeContentArea(doc, pageMargin, borderPadding) {
    const pw = doc.page.width;
    const ph = doc.page.height;
    const contentLeft = pageMargin + borderPadding;
    const contentTop = pageMargin + borderPadding;
    const contentRight = pw - (pageMargin + borderPadding);
    const contentBottom = ph - (pageMargin + borderPadding);
    const usableWidth = contentRight - contentLeft;
    const usableHeight = contentBottom - contentTop;
    return { contentLeft, contentTop, contentRight, contentBottom, usableWidth, usableHeight };
  }

  /**
   * Add professional header with logos (matching full-payment PDF format)
   */
  addProfessionalHeader(doc, clinicProfile, contentLeft, contentTop, contentRight, usableWidth, startY) {
    let y = startY;

    // Fix: Resources folder is at Backend level (same as DischargeSlips)
    const logoLeftPath = path.join(__dirname, '..', '..', 'resources', 'logo-left.png');
    const logoRightPath = path.join(__dirname, '..', '..', 'resources', 'logo-right.png');
    
    const logoW = 40;
    const logoH = 40;

    // Left logo
    try {
      if (fs && fs.existsSync(logoLeftPath)) {
        doc.image(logoLeftPath, contentLeft, y, { width: logoW, height: logoH });
      }
    } catch (e) {}

    // Right logo
    try {
      if (fs && fs.existsSync(logoRightPath)) {
        doc.image(logoRightPath, contentRight - logoW, y, { width: logoW, height: logoH });
      }
    } catch (e) {}

    // Clinic name (centered, bold)
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text(clinicProfile.clinicName || '', contentLeft, y + 6, {
         width: usableWidth,
         align: 'center'
       });

    // Address (centered)
    doc.fontSize(9)
       .font('Helvetica')
       .text(clinicProfile.address || '', contentLeft, y + 26, {
         width: usableWidth,
         align: 'center'
       });

    // PAN and Registration number (centered)
    const panText = clinicProfile.panNumber || clinicProfile.pan || '';
    const regText = clinicProfile.registrationNumber || clinicProfile.regNo || '';
    doc.text(`PAN : ${panText}   |   Reg. No: ${regText}`, contentLeft, y + 40, {
      width: usableWidth,
      align: 'center'
    });

    y += 56;

    // Horizontal line separator
    doc.moveTo(contentLeft, y).lineTo(contentRight, y).stroke();
    y += 8;

    return y;
  }

  /**
   * Add doctor information (two columns) - matching full-payment PDF
   */
  addDoctorInfo(doc, clinicProfile, contentLeft, contentRight, usableWidth, startY) {
    let y = startY;

    const doctor1Name = clinicProfile.doctor1Name || '';
    const doctor1RegNo = clinicProfile.doctor1RegNo || clinicProfile.doctor1Qualification || '';
    const doctor2Name = clinicProfile.doctor2Name || '';
    const doctor2RegNo = clinicProfile.doctor2RegNo || clinicProfile.doctor2Qualification || '';

    // Doctor 1 (Left side)
    doc.fontSize(9).font('Helvetica-Bold');
    doc.text(doctor1Name, contentLeft, y);

    // Doctor 2 (Right side)
    doc.text(doctor2Name, contentLeft, y, {
      width: usableWidth,
      align: 'right'
    });

    y += 12;

    // Doctor 1 Reg No (Left)
    doc.font('Helvetica').fontSize(8);
    doc.text(doctor1RegNo ? `Reg. No.: ${doctor1RegNo}` : '', contentLeft, y);

    // Doctor 2 Reg No (Right)
    doc.text(doctor2RegNo ? `Reg. No.: ${doctor2RegNo}` : '', contentLeft, y, {
      width: usableWidth,
      align: 'right'
    });

    y += 18;

    return y;
  }

  /**
   * Add DISCHARGE TICKET badge (OLD STYLE - rounded black badge)
   */
  addDischargeTicketBadgeOldStyle(doc, pageWidth, startY) {
    let y = startY;
    const badgeWidth = 220;
    const badgeHeight = 28;
    const badgeX = (pageWidth - badgeWidth) / 2;
    const cornerRadius = 14;

    // Black rounded rectangle
    doc.roundedRect(badgeX, y, badgeWidth, badgeHeight, cornerRadius)
       .fillAndStroke('#000000', '#000000');

    // White text
    doc.fontSize(13)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text('DISCHARGE TICKET', badgeX, y + 8, {
         width: badgeWidth,
         align: 'center'
       });

    return y + badgeHeight + 18;
  }

  /**
   * Add patient details form fields (OLD STYLE - with underlines)
   */
  addPatientDetailsFormOldStyle(doc, ticketData, leftMargin, rightMargin, usableWidth, startY) {
    let y = startY;

    // Name and Age/Sex on same line
    doc.fontSize(10)
       .fillColor('#000000')
       .font('Helvetica')
       .text('Name :-', leftMargin, y);

    const nameLabelWidth = doc.widthOfString('Name :-');
    const nameLineStart = leftMargin + nameLabelWidth + 8;
    const nameLineEnd = 420;
    
    // Name underline
    doc.moveTo(nameLineStart, y + 12)
       .lineTo(nameLineEnd, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    // Fill name if available
    if (ticketData.patientName) {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text(ticketData.patientName, nameLineStart + 5, y);
    }

    // Age/Sex
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#000000')
       .text('Age/Sex :-', 435, y);

    const ageSexLabelWidth = doc.widthOfString('Age/Sex :-');
    const ageSexLineStart = 435 + ageSexLabelWidth + 8;

    doc.moveTo(ageSexLineStart, y + 12)
       .lineTo(rightMargin, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    if (ticketData.age && ticketData.sex) {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text(`${ticketData.age}/${ticketData.sex}`, ageSexLineStart + 5, y);
    }

    y += 28;

    // Diagnosis line
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#000000')
       .text('Diagnosis (Right Eye) :-', leftMargin, y);

    const diagnosisRELabelWidth = doc.widthOfString('Diagnosis (Right Eye) :-');
    const diagnosisRELineStart = leftMargin + diagnosisRELabelWidth + 8;
    const diagnosisRELineEnd = 350;

    doc.moveTo(diagnosisRELineStart, y + 12)
       .lineTo(diagnosisRELineEnd, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    if (ticketData.diagnosisRE) {
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#000000')
         .text(ticketData.diagnosisRE, diagnosisRELineStart + 5, y + 1);
    }

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#000000')
       .text('(Left Eye) :-', 360, y);

    const diagnosisLELabelWidth = doc.widthOfString('(Left Eye) :-');
    const diagnosisLELineStart = 360 + diagnosisLELabelWidth + 8;

    doc.moveTo(diagnosisLELineStart, y + 12)
       .lineTo(rightMargin, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    if (ticketData.diagnosisLE) {
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#000000')
         .text(ticketData.diagnosisLE, diagnosisLELineStart + 5, y + 1);
    }

    y += 28;

    // Date & Time of Admission
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#000000')
       .text('Date & Time of Admission :-', leftMargin, y);

    const admissionLabelWidth = doc.widthOfString('Date & Time of Admission :-');
    const admissionLineStart = leftMargin + admissionLabelWidth + 8;

    doc.moveTo(admissionLineStart, y + 12)
       .lineTo(rightMargin, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    if (ticketData.admissionDate) {
      const admissionText = ticketData.admissionTime 
        ? `${ticketData.admissionDate} at ${ticketData.admissionTime}`
        : ticketData.admissionDate;
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#000000')
         .text(admissionText, admissionLineStart + 5, y + 1);
    }

    y += 28;

    // Date & Time of Discharge
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#000000')
       .text('Date & Time of Discharge :-', leftMargin, y);

    const dischargeLabelWidth = doc.widthOfString('Date & Time of Discharge :-');
    const dischargeLineStart = leftMargin + dischargeLabelWidth + 8;

    doc.moveTo(dischargeLineStart, y + 12)
       .lineTo(rightMargin, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    if (ticketData.dischargeDate) {
      const dischargeText = ticketData.dischargeTime 
        ? `${ticketData.dischargeDate} at ${ticketData.dischargeTime}`
        : ticketData.dischargeDate;
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#000000')
         .text(dischargeText, dischargeLineStart + 5, y + 1);
    }

    y += 28;

    // Procedure Done and Date of Surgery on same line
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#000000')
       .text('Procedure Done :-', leftMargin, y);

    const procedureLabelWidth = doc.widthOfString('Procedure Done :-');
    const procedureLineStart = leftMargin + procedureLabelWidth + 8;
    const procedureLineEnd = 350;

    doc.moveTo(procedureLineStart, y + 12)
       .lineTo(procedureLineEnd, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    if (ticketData.procedureDone) {
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#000000')
         .text(ticketData.procedureDone, procedureLineStart + 5, y + 1);
    }

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#000000')
       .text('Date of Surgery :-', 365, y);

    const surgeryLabelWidth = doc.widthOfString('Date of Surgery :-');
    const surgeryLineStart = 365 + surgeryLabelWidth + 8;

    doc.moveTo(surgeryLineStart, y + 12)
       .lineTo(rightMargin, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    if (ticketData.surgeryDate) {
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#000000')
         .text(ticketData.surgeryDate, surgeryLineStart + 5, y + 1);
    }

    y += 35;

    // O.T. Note section (BOLD)
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('O.T. Note :-', leftMargin, y);

    // Underline for O.T. Note (matching text width)
    const otNoteWidth = doc.widthOfString('O.T. Note :-');
    doc.moveTo(leftMargin, y + 12)
       .lineTo(leftMargin + otNoteWidth, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    y += 18;

    if (ticketData.otNote) {
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#000000')
         .text(ticketData.otNote, leftMargin + 15, y, {
           width: rightMargin - leftMargin - 15,
           align: 'left',
           lineGap: 1
         });
      y += doc.heightOfString(ticketData.otNote, { 
        width: rightMargin - leftMargin - 15 
      }) + 15;
    } else {
      y += 25;
    }

    // CONDITIONS AT DISCHARGE (BOLD)
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('CONDITIONS AT DISCHARGE :-', leftMargin, y);

    // Underline for CONDITIONS AT DISCHARGE (matching text width)
    const conditionsWidth = doc.widthOfString('CONDITIONS AT DISCHARGE :-');
    doc.moveTo(leftMargin, y + 12)
       .lineTo(leftMargin + conditionsWidth, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    y += 18;

    if (ticketData.conditionsAtDischarge) {
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#000000')
         .text(ticketData.conditionsAtDischarge, leftMargin + 15, y, {
           width: rightMargin - leftMargin - 15,
           align: 'left',
           lineGap: 1
         });
      y += doc.heightOfString(ticketData.conditionsAtDischarge, { 
        width: rightMargin - leftMargin - 15 
      }) + 15;
    } else {
      y += 25;
    }

    // POST OP ADVICE (BOLD)
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text('POST OP ADVICE :-', leftMargin, y);

    // Underline for POST OP ADVICE (matching text width)
    const postOpWidth = doc.widthOfString('POST OP ADVICE :-');
    doc.moveTo(leftMargin, y + 12)
       .lineTo(leftMargin + postOpWidth, y + 12)
       .lineWidth(0.5)
       .stroke('#000000');

    y += 18;

    if (ticketData.postOpAdvice) {
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#000000')
         .text(ticketData.postOpAdvice, leftMargin + 15, y, {
           width: rightMargin - leftMargin - 15,
           align: 'left',
           lineGap: 1
         });
      y += doc.heightOfString(ticketData.postOpAdvice, { 
        width: rightMargin - leftMargin - 15 
      }) + 20;
    } else {
      y += 25;
    }

    return y;
  }

  /**
   * Add signature section (OLD STYLE)
   */
  addSignatureOldStyle(doc, rightMargin, startY) {
    let y = startY + 10;

    // Signature line
    doc.moveTo(rightMargin - 140, y)
       .lineTo(rightMargin, y)
       .lineWidth(0.5)
       .stroke('#000000');

    // Signature text
    doc.fontSize(9)
       .font('Helvetica-Oblique')
       .fillColor('#000000')
       .text('Signature of Doctor', rightMargin - 140, y + 8, {
         width: 140,
         align: 'center'
       });

    return y + 30;
  }

  /**
   * Add Do's and Don'ts section (OLD STYLE - with automatic page break)
   * IMPROVED: Entire table moves to next page if not enough space
   */
  addDosAndDontsOldStyle(doc, leftMargin, rightMargin, pageWidth, startY, pageMargin, borderPadding) {
    const centerX = pageWidth / 2;
    let y = startY;

    // Calculate required height for Do's and Don'ts table
    const dosItems = [
      'Wear protective glasses.',
      'Carefully wash hands with soap & water & dry before applying eye drops.',
      'Put the eye drops as advised by your doctor.',
      'Can watch television.',
      'Take adequate rest after operation to promote healing.',
      'Go for regular visits as advised by your doctor.',
      'Clean the operated eye as advised.',
      'Light walking is allowed as exercise.'
    ];

    const dontsItems = [
      'Avoid heavy exercise, swimming, driving and playing with children until advised.',
      'Do not rub your eyes with dirty hand or linen.',
      'Do not sleep on the operated side for 5 days.',
      'Avoid bending & lifting heavy objects.',
      'Do not have a head bath until advised.',
      'Avoid deep cough, Sneeze and constipation.',
      'Do not open the eye drop with unsterile objects.'
    ];

    const maxItems = Math.max(dosItems.length, dontsItems.length);
    const rowHeight = 22;
    const headerHeight = 16;
    const topBorderSpace = 12;
    const warningHeight = 30;
    
    // Calculate total height needed for COMPLETE table
    const totalTableHeight = topBorderSpace + headerHeight + (maxItems * rowHeight) + 10 + warningHeight;

    // Check if we need a new page
    const pageHeight = doc.page.height;
    const bottomMargin = pageMargin + borderPadding;
    const availableSpace = pageHeight - bottomMargin - y;

    console.log('📏 Table height check:');
    console.log('   Required height:', totalTableHeight);
    console.log('   Available space:', availableSpace);
    console.log('   Current Y:', y);
    console.log('   Page height:', pageHeight);
    console.log('   Bottom margin:', bottomMargin);

    // If not enough space for COMPLETE table, move to new page
    if (availableSpace < totalTableHeight) {
      console.log('⚠️ Not enough space - moving entire table to new page');
      
      // Add new page
      doc.addPage({
        size: 'A4',
        margin: 0
      });
      
      // Draw border on new page
      this.drawPageBorder(doc, pageMargin);
      
      // Reset y to top of new page content area
      y = pageMargin + borderPadding;
      
      console.log('✅ New page added - Y position reset to:', y);
    }

    // Table top border
    doc.moveTo(leftMargin, y)
       .lineTo(rightMargin, y)
       .lineWidth(1)
       .stroke('#000000');

    y += topBorderSpace;

    // Headers with background
    const headerY = y;
    
    // Left header background
    doc.rect(leftMargin, headerY, centerX - leftMargin, headerHeight)
       .stroke('#000000');
    
    // Right header background
    doc.rect(centerX, headerY, rightMargin - centerX, headerHeight)
       .stroke('#000000');

    // Headers text
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text("Do's", leftMargin, headerY + 4, {
         width: centerX - leftMargin,
         align: 'center'
       });

    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#000000')
       .text("Don'ts", centerX, headerY + 4, {
         width: rightMargin - centerX,
         align: 'center'
       });

    y += headerHeight;

    const leftColumnWidth = centerX - leftMargin - 10;
    const rightColumnWidth = rightMargin - centerX - 10;
    const cellPadding = 5;

    // Draw content rows
    for (let i = 0; i < maxItems; i++) {
      const rowY = y + (i * rowHeight);
      
      // Left cell border
      doc.rect(leftMargin, rowY, centerX - leftMargin, rowHeight)
         .stroke('#000000');
      
      // Right cell border
      doc.rect(centerX, rowY, rightMargin - centerX, rowHeight)
         .stroke('#000000');
      
      // Do's item
      if (i < dosItems.length) {
        doc.fontSize(7.5)
           .font('Helvetica')
           .fillColor('#000000');
        
        // Bullet point
        doc.circle(leftMargin + 8, rowY + 7, 1.5)
           .fill('#000000');
        
        // Text
        doc.text(dosItems[i], leftMargin + 15, rowY + cellPadding - 1, {
          width: leftColumnWidth - 10,
          align: 'left',
          lineGap: 0
        });
      }
      
      // Don'ts item
      if (i < dontsItems.length) {
        doc.fontSize(7.5)
           .font('Helvetica')
           .fillColor('#000000');
        
        // Bullet point
        doc.circle(centerX + 8, rowY + 7, 1.5)
           .fill('#000000');
        
        // Text
        doc.text(dontsItems[i], centerX + 15, rowY + cellPadding - 1, {
          width: rightColumnWidth - 10,
          align: 'left',
          lineGap: 0
        });
      }
    }

    y += (maxItems * rowHeight) + 10;

    // Bottom warning message (without border)
    doc.fontSize(7.5)
       .font('Helvetica')
       .fillColor('#000000');
    
    // Bullet point for warning
    doc.circle(leftMargin + 75, y + 7, 1.5)
       .fill('#000000');
    
    const warningText = 'Please report immediately if the patient feels pain, redness or diminution of vision after cataract surgery.';
    doc.text(warningText, leftMargin + 82, y + 4, {
      width: rightMargin - leftMargin - 87,
      align: 'left'
    });

    return y + 25;
  }
}

module.exports = new DischargeTicketPDFService();