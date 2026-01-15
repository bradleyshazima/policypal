const twilioClient = require('../config/twilio');
const supabase = require('../config/supabase');

class WhatsAppService {
  async sendWhatsApp(to, message, userId, clientId = null) {
    try {
      // Format WhatsApp number
      const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      
      // Send WhatsApp message via Twilio
      const result = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio WhatsApp sandbox number
        to: whatsappTo
      });

      // Log the reminder
      if (clientId) {
        await supabase.from('reminders').insert([{
          user_id: userId,
          client_id: clientId,
          delivery_method: 'whatsapp',
          message_content: message,
          status: 'sent',
          sent_date: new Date().toISOString(),
          delivery_status: result.status,
          cost: 0 // WhatsApp is free via Twilio sandbox
        }]);
      }

      return {
        success: true,
        messageId: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('WhatsApp send error:', error);

      // Log failed reminder
      if (clientId) {
        await supabase.from('reminders').insert([{
          user_id: userId,
          client_id: clientId,
          delivery_method: 'whatsapp',
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

module.exports = new WhatsAppService();