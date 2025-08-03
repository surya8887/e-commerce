// utils/emailTemplates/getOtpEmailTemplate.ts

export function getOtpEmailTemplate(otp: string, username?: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Your Login OTP</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f9fc;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .otp-box {
        font-size: 32px;
        font-weight: bold;
        background-color: #f0f4ff;
        color: #0033cc;
        text-align: center;
        padding: 15px 0;
        border-radius: 6px;
        letter-spacing: 6px;
        margin: 20px 0;
      }
      .footer {
        font-size: 13px;
        color: #777;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>🔐 Your One-Time Password (OTP)</h2>
        <p>Hello${username ? ` ${username}` : ""}, use the OTP below to complete your login.</p>
      </div>

      <div class="otp-box">${otp}</div>

      <p style="text-align:center;">This OTP will expire in 5 minutes.</p>
      <p style="text-align:center;">If you did not request this, please ignore this email.</p>

      <div class="footer">
        &copy; ${new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}
