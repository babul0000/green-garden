// Transactional Email integration skeleton helper (Nodemailer/Resend)
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html: _html }: SendEmailOptions): Promise<{ success: boolean; messageId: string }> => {
  console.log(`Mock email sent to ${to} with subject: "${subject}"`);
  return { success: true, messageId: "mock-message-id" };
};
