const nodemailer = require('nodemailer');
const supabase = require('../config/supabase');

// Configure nodemailer (use SendGrid, AWS SES, or other service)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class EmailService {
  async sendEmail(to, subject, message, userId, clientId = null) {
    try {
      const result = await transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: message,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`
      });

      // Log the reminder
      if (clientId) {
        await supabase.from('reminders').insert([{
          user_id: userId,
          client_id: clientId,
          delivery_method: 'email',
          message_content: message,
          status: 'sent',
          sent_date: new Date().toISOString(),
          delivery_status: 'delivered',
          cost: 0 // Email is free
        }]);
      }

      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Email send error:', error);

      // Log failed reminder
      if (clientId) {
        await supabase.from('reminders').insert([{
          user_id: userId,
          client_id: clientId,
          delivery_method: 'email',
          message_content: message,
          status: 'failed',
          delivery_status: 'failed',
          failure_reason: error.message
        }]);
      }

      throw error;
    }
  }
}

module.exports = new EmailService();