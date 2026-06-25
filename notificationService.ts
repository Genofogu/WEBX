import nodemailer from 'nodemailer';

// Email configuration from environment variables
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  try {
    const info = await transporter.sendMail({
      from: '"InternBoard Notifications" <notifications@internboard.com>',
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // In a real app, we might want to queue this for retry
  }
}

export async function notifyNewApplication(orgEmail: string, studentName: string, role: string) {
  const subject = `New Application Received: ${role}`;
  const text = `Hello! You have received a new application from ${studentName} for the ${role} position. Check your dashboard for details.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">New Application Received</h2>
      <p>Hello!</p>
      <p>You have received a new application from <strong>${studentName}</strong> for the <strong>${role}</strong> position.</p>
      <p>Please log in to your dashboard to review the application.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">&copy; 2026 Student Internship & Project Board</p>
    </div>
  `;
  return sendEmail(orgEmail, subject, text, html);
}

export async function notifyStatusUpdate(studentEmail: string, role: string, orgName: string, status: string) {
  const subject = `Application Status Update: ${role} at ${orgName}`;
  const text = `Hello! Your application for the ${role} position at ${orgName} has been updated to: ${status}.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">Application Status Update</h2>
      <p>Hello!</p>
      <p>Your application for the <strong>${role}</strong> position at <strong>${orgName}</strong> has been updated to:</p>
      <div style="display: inline-block; padding: 8px 16px; background: #eff6ff; color: #1d4ed8; border-radius: 8px; font-weight: bold; margin: 10px 0;">
        ${status}
      </div>
      <p>Check your applications page for more details.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">&copy; 2026 Student Internship & Project Board</p>
    </div>
  `;
  return sendEmail(studentEmail, subject, text, html);
}

export async function notifyMatchingListing(studentEmail: string, role: string, orgName: string, skills: string) {
  const subject = `New Internship Match: ${role} at ${orgName}`;
  const text = `Hello! A new internship listing for ${role} at ${orgName} matches your skills: ${skills}.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">New Internship Match</h2>
      <p>Hello!</p>
      <p>A new internship listing matches your skills!</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; margin: 15px 0;">
        <h3 style="margin: 0; color: #1e293b;">${role}</h3>
        <p style="margin: 5px 0; color: #64748b;">${orgName}</p>
        <p style="margin: 10px 0; font-size: 14px;"><strong>Skills Required:</strong> ${skills}</p>
      </div>
      <p>Click the link below to view the listing and apply.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">&copy; 2026 Student Internship & Project Board</p>
    </div>
  `;
  return sendEmail(studentEmail, subject, text, html);
}
