import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Environment variable se domain get karein, na milne par localhost use karein
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendPasswordResetEmail(email: string, token: string) {
  // Yeh link ab dynamically Vercel domain ya localhost par redirect karega
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev", 
    to: email, 
    subject: "Reset your password - TechSocial",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password. Please click the link below to set a new password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #065f46; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="margin-top: 20px; font-size: 12px; color: gray;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}