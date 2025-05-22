const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateInvoice(info, cheminFichier) {
  return new Promise((resolve, reject) => {
    if (!cheminFichier || typeof cheminFichier !== 'string') {
      return reject(new Error('cheminFichier est invalide ou non défini.'));
    }

    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      bufferPages: true
    });
    
    const stream = fs.createWriteStream(cheminFichier);
    doc.pipe(stream);

    const primaryColor = '#3498db';
    const secondaryColor = '#2c3e50';
    const accentColor = '#e74c3c';
    const lightGray = '#f5f5f5';

    // Header
    doc.rect(0, 0, doc.page.width, 100).fill(lightGray);

    const logoPath = path.join(__dirname, 'public', 'images', 'logo.jpg');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 35, { width: 80 });
    }

    doc
      .fontSize(24)
      .fillColor(secondaryColor)
      .font('Helvetica-Bold')
      .text('FACTURE', 0, 50, { align: 'center' });

    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .text('ZIGUADE TOUR', 0, 80, { align: 'center' });

    doc
      .fontSize(10)
      .fillColor('#555')
      .text(`N° FACTURE: ${info.numeroFacture || '0001'}`, 400, 50, { align: 'right' })
      .text(`Date: ${info.date ? new Date(info.date).toLocaleDateString() : new Date().toLocaleDateString()}`, 400, 65, { align: 'right' });

    // Infos client
    doc.moveTo(50, 140).lineTo(550, 140).stroke(primaryColor);

    doc
      .fontSize(12)
      .fillColor(secondaryColor)
      .font('Helvetica-Bold')
      .text('INFORMATIONS CLIENT', 50, 150);

    doc
      .fontSize(11)
      .fillColor('#333')
      .font('Helvetica')
      .text(`Nom: ${info.nom || 'Non spécifié'} ${info.prenom || ''}`, 50, 170)
      .text(`Email: ${info.email || 'Non spécifié'}`, 50, 190)
      .text(`Téléphone: ${info.telephone || 'Non spécifié'}`, 50, 210);

    // Détails facture
    doc.moveTo(50, 240).lineTo(550, 240).stroke(primaryColor);

    doc
      .fontSize(12)
      .fillColor(secondaryColor)
      .font('Helvetica-Bold')
      .text('DÉTAILS DE LA FACTURE', 50, 250);

    const startY = 270;

    // En-tête du tableau
    doc
      .fontSize(10)
      .fillColor('#fff')
      .rect(50, startY, 500, 20)
      .fill(primaryColor);

    doc
      .fillColor('#fff')
      .font('Helvetica-Bold')
      .text('Destination', 60, startY + 5)
      .text('Montant', 450, startY + 5, { width: 90, align: 'right' });

    // Corps du tableau
    doc
      .rect(50, startY + 20, 500, 20)
      .fill('#fff');

    doc
      .lineWidth(0.5)
      .strokeColor('#eee')
      .moveTo(50, startY + 40)
      .lineTo(550, startY + 40)
      .stroke();

    doc
      .fontSize(10)
      .fillColor('#333')
      .font('Helvetica')
      .text(info.destination || 'Non spécifié', 60, startY + 25, { 
        width: 380,
        align: 'left'
      })
      .text(`${info.montant || '0'} DZD`, 450, startY + 25, { 
        width: 90, 
        align: 'right' 
      });

    // Total
    doc
      .fontSize(12)
      .fillColor(secondaryColor)
      .font('Helvetica-Bold')
      .text('TOTAL:', 350, startY + 60)
      .text(`${info.montant || '0'} DZD`, 450, startY + 60, { width: 90, align: 'right' });

    doc
      .fontSize(10)
      .fillColor(accentColor)
      .text(`Statut: ${info.statut || ''}`, 450, startY + 80, { width: 90, align: 'right' });

    // Notes
    doc.moveTo(50, startY + 120).lineTo(550, startY + 120).stroke(lightGray);

    doc
      .fontSize(9)
      .fillColor('#777')
      .text('Merci pour votre confiance!', 50, startY + 130)
      .text('Pour toute question, contactez-nous à contact@ziguadetour.com', 50, startY + 145);

    // Footer
    doc
      .fontSize(8)
      .fillColor('#aaa')
      .text('ZIGUADE TOUR - Agence de voyage digitale', 0, doc.page.height - 50, { align: 'center' })
      .text('www.ziguadetour.com | contact@ziguadetour.com | +213 560 63 58 06', { 
        align: 'center',
        lineGap: 5
      });

    doc.end();

    stream.on('finish', () => resolve(cheminFichier));
    stream.on('error', reject);
  });
}

module.exports = generateInvoice;