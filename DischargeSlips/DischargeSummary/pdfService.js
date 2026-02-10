const PDFDocument = require('pdfkit');

class DischargeSummaryPDFService {

  async generatePDF(summaryData, clinicProfile) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 40, bottom: 40, left: 50, right: 50 },
          info: {
            Title: `Discharge Summary - ${summaryData.summaryId}`,
            Author: clinicProfile.clinicName,
            Subject: 'Patient Discharge Summary',
            Keywords: 'discharge, summary, medical'
          }
        });

        const buffers = [];
        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        this.generateContent(doc, summaryData, clinicProfile);
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  generateContent(doc, summary, clinic) {
    let y = 40;

    y = this.addTopRegistrationLine(doc, clinic, y);
    y = this.addClinicName(doc, clinic, y);
    y = this.addAddress(doc, clinic, y);
    y = this.addDoctorInfo(doc, clinic, y);
    y = this.addSummaryBadge(doc, y);
    y = this.addPatientSummary(doc, summary, y);
    this.addFooterSignature(doc);
  }

  addTopRegistrationLine(doc, clinic, y) {
    const pageWidth = doc.page.width;

    doc.fontSize(9)
      .fillColor('#000')
      .text(`Regn. No.: ${clinic.registrationNumber}`, 50, y);

    doc.text(
      `PAN No. - ${clinic.panNumber}`,
      pageWidth - 200,
      y,
      { width: 150, align: 'right' }
    );

    return y + 25;
  }

  addClinicName(doc, clinic, y) {
    const left = 50;
    const right = doc.page.width - 50;

    doc.fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#DC2626')
      .text(clinic.clinicName.toUpperCase(), left, y, {
        width: right - left,
        align: 'center'
      });

    const h = doc.heightOfString(clinic.clinicName.toUpperCase(), {
      width: right - left
    });

    doc.moveTo(left, y + h + 3)
       .lineTo(right, y + h + 3)
       .stroke();

    return y + h + 12;
  }

  addAddress(doc, clinic, y) {
    const left = 50;
    const right = doc.page.width - 50;

    doc.fontSize(9)
      .fillColor('#000')
      .font('Helvetica')
      .text(clinic.address, left, y, {
        width: right - left,
        align: 'center'
      });

    return y + 30;
  }

  addDoctorInfo(doc, clinic, y) {
    const mid = doc.page.width / 2;

    doc.fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#DC2626')
      .text(clinic.doctor1Name.toUpperCase(), 50, y);

    doc.fontSize(8)
      .fillColor('#000')
      .font('Helvetica')
      .text(clinic.doctor1Qualification, 50, y + 15)
      .text(`MOB.: ${clinic.doctor1Mobile}`, 50, y + 27);

    if (clinic.doctor2Name) {
      doc.fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#DC2626')
        .text(clinic.doctor2Name.toUpperCase(), mid + 20, y, {
          width: doc.page.width - mid - 70,
          align: 'right'
        });

      doc.fontSize(8)
        .fillColor('#000')
        .font('Helvetica')
        .text(clinic.doctor2Qualification, mid + 20, y + 15, {
          width: doc.page.width - mid - 70,
          align: 'right'
        })
        .text(`MOB.: ${clinic.doctor2Mobile}`, mid + 20, y + 27, {
          width: doc.page.width - mid - 70,
          align: 'right'
        });
    }

    return y + 55;
  }

  addSummaryBadge(doc, y) {
    const width = 260;
    const x = (doc.page.width - width) / 2;

    doc.roundedRect(x, y, width, 35, 17).fill('#000');
    doc.fontSize(15)
      .fillColor('#fff')
      .font('Helvetica-Bold')
      .text('DISCHARGE SUMMARY', x, y + 10, {
        width,
        align: 'center'
      });

    return y + 65;
  }

  addPatientSummary(doc, s, y) {
    const left = 50;
    const right = doc.page.width - 50;

    doc.fontSize(11).fillColor('#000').font('Helvetica')
      .text('Name :', left, y);
    doc.text(s.patientName, left + 60, y);

    doc.text('Age / Sex :', 360, y);
    doc.text(`${s.age}/${s.sex}`, 450, y);

    y += 30;

    doc.text('Diagnosis :', left, y);
    doc.text(s.diagnosis || '', left + 90, y);

    y += 30;

    doc.text('Eye (RE) :', left, y);
    doc.text(s.eyeRE || '', left + 90, y);

    doc.text('Eye (LE) :', 360, y);
    doc.text(s.eyeLE || '', 450, y);

    y += 30;

    doc.text('Procedure :', left, y);
    doc.text(s.procedure || '', left + 90, y);

    y += 30;

    doc.text('Procedure / Surgery Date :', left, y);
    doc.text(s.procedureDate || '', left + 190, y);

    return y + 40;
  }

  addFooterSignature(doc) {
    const y = doc.page.height - 80;
    const right = doc.page.width - 50;

    doc.moveTo(right - 150, y).lineTo(right, y).stroke();
    doc.fontSize(10)
      .font('Helvetica-Oblique')
      .text('Signature of Doctor', right - 150, y + 10, {
        width: 150,
        align: 'center'
      });
  }
}

module.exports = new DischargeSummaryPDFService();
