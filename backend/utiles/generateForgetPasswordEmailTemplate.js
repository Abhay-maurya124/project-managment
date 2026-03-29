export const GenerateForgetPasswordEmailTemplate = (url, name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
            .header { text-align: center; color: #4A90E2; }
            .content { line-height: 1.6; color: #333; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 class="header">Password Reset Request</h2>
            <div class="content">
                <p>Hello <strong>${name}</strong>,</p>
                <p>We received a request to reset your password for your Project Management account. Click the button below to set a new password:</p>
                <div style="text-align: center;">
                    <a href="${url}" class="button">Reset My Password</a>
                </div>
                <p>If you didn't request this, you can safely ignore this email. This link will expire in 15 minutes.</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Project Management Tool. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};