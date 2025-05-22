const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'melimelina284@gmail.com',
    pass: 'xzkvpgcxpulcdysv' // utiliser un mot de passe d’application sécurisé
  }
});

transporter.sendMail({
  from: '"ZIGUADE TOUR" <melimelina284@gmail.com>',
  to: 'lilissanani@gmail.com',
  subject: 'Test email',
  text: 'Ceci est un test',
}, (err, info) => {
  if (err) {
    console.error('Erreur lors de l’envoi :', err);
  } else {
    console.log('Email envoyé :', info.response);
  }
});


async function sendMail({ to, subject, text, attachments = [] }) {
  await transporter.sendMail({
    from: '"ZIGUADE TOUR" <ton.email@gmail.com>',
    to,
    subject,
    text,
    attachments
  });
}

module.exports = sendMail;
