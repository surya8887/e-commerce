export const emailVerificationLink = (link: string) => {
  const safeLink = encodeURI(link);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f3f4f6;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 40px 30px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
        text-align: center;
      }

      .logo {
        max-width: 120px;
        margin-bottom: 30px;
      }

      h1 {
        font-size: 26px;
        color: #111827;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        color: #4b5563;
        line-height: 1.6;
        margin: 15px 0;
      }

      .verify-btn {
        display: inline-block;
        margin: 30px auto 20px;
        padding: 14px 36px;
        background: #6366f1;
        color: #fff;
        border-radius: 40px;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        transition: background 0.3s ease;
      }

      .verify-btn:hover {
        background: #4f46e5;
      }

      .link-copy {
        font-size: 14px;
        word-break: break-all;
        margin: 20px 0;
      }

      .footer {
        font-size: 13px;
        color: #9ca3af;
        margin-top: 30px;
      }

      @media (max-width: 600px) {
        .container {
          padding: 30px 20px;
        }

        .verify-btn {
          width: 100%;
          box-sizing: border-box;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <img class="logo" src="https://res.cloudinary.com/do7xdfl3y/image/upload/v1737487850/next-ecommerce/rb_27348_hfzgxd.png" alt="Company Logo" />

      <h1>Verify Your Email</h1>
      <p>Hi there! 👋</p>
      <p>
        You're almost ready to start using your account. Please confirm your email address by clicking the button below.
      </p>

      <a href="${safeLink}" class="verify-btn">Verify Email</a>

      <p class="link-copy">
        Or copy and paste this URL into your browser:<br />
        <a href="${safeLink}" target="_blank">${safeLink}</a>
      </p>

      <p class="footer">
        This link will expire in 10 minutes. If you did not request this email, you can safely ignore it.
      </p>

      <p class="footer">
        — Vijay Kumar
      </p>
    </div>
  </body>
</html>
`;
};
