// Transactional Email integration skeleton helper (Nodemailer/Resend)
export const sendEmail = async ({ to, subject, html }) => {
  console.log(`Mock email sent to ${to} with subject: "${subject}"`);
  return { success: true, messageId: "mock-message-id" };
};
