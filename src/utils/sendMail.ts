import nodemailer from 'nodemailer';

const sendMail = async (subject: string, receiver: string, body: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_PORT || "587"),
      secure: false, // true for port 465
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"SuryaExportAndImport" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject,
      text: body,
      html: `<b>${body}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;
