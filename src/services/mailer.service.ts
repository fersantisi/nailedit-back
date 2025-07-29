import nodemailer from 'nodemailer';

// Validate environment variables
if (!process.env.MAIL || !process.env.MAIL_PASSWORD) {
  console.error(
    'Missing email configuration. Please set MAIL and MAIL_PASSWORD environment variables.',
  );
}

// Gmail configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Alternative: SendGrid configuration
// const transporter = nodemailer.createTransport({
//   host: 'smtp.sendgrid.net',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'apikey',
//     pass: process.env.SENDGRID_API_KEY,
//   },
// });

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  // Check if email configuration is available
  if (!process.env.MAIL || !process.env.MAIL_PASSWORD) {
    console.error('Email configuration missing. Cannot send email.');
    return;
  }

  const mailOptions = {
    from: process.env.MAIL,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    // Re-throw the error so calling code can handle it
    throw error;
  }
};
