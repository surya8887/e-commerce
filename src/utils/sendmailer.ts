import nodemailer from 'nodemailer';

type MailOptions = {
  subject: string;
  receiver: string;
  body: string;
};
if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASS) {
  throw new Error("Nodemailer credentials are missing in environment variables.");
}

const transporter = nodemailer.createTransport({
  service:'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Send mail function
const sendMail = async ({ subject, receiver, body }: MailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"SuryaExportAndImport" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject,
      // text: body,
      html: body,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendMail;
