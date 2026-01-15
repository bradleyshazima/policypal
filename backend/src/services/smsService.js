const twilioClient = require('../config/twilio');
const supabase = require('../config/supabase');

class SMSService {
  async sendSMS(to, message, userId, clientId = null) {
    try {
      // Send SMS via Twilio
      const result = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });

      // Update SMS usage
      await this.updateSMSUsage(userId);

      // Log the reminder
      if (clientId) {
        await supabase.from('reminders').insert([{
          user_id: userId,
          client_id: clientId,
          delivery_method: 'sms',
          message_content: message,
          status: 'sent',
          sent_date: new Date().toISOString(),
          delivery_status: result.status,
          cost: 0.05 // Approximate cost per SMS
        }]);
      }

      return {
        success: true,
        messageId: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('SMS send error:', error);

      // Log failed reminder
      if (clientId) {
        await supabase.from('reminders').insert([{
          user_id: userId,
          client_id: clientId,
          delivery_method: 'sms',
          message_content: message,
          status: 'failed',
          delivery_status: 'failed',
          failure_reason: error.message
        }]);
      }

      throw error;
    }
  }

  async updateSMSUsage(userId) {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);
      const monthKey = currentMonth.toISOString().split('T')[0];

      // Get or create usage record
      const { data: usage, error: fetchError } = await supabase
        .from('sms_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month', monthKey)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
        throw fetchError;
      }

      if (usage) {
        // Update existing
        await supabase
          .from('sms_usage')
          .update({ sms_sent: usage.sms_sent + 1 })
          .eq('id', usage.id);
      } else {
        // Get user's quota
        const { data: user } = await supabase
          .from('users')
          .select('subscription_plan_id')
          .eq('id', userId)
          .single();

        const { data: plan } = await supabase
          .from('subscription_plans')
          .select('sms_quota')
          .eq('id', user.subscription_plan_id)
          .single();

        // Create new
        await supabase
          .from('sms_usage')
          .insert([{
            user_id: userId,
            month: monthKey,
            sms_sent: 1,
            quota_limit: plan?.sms_quota
          }]);
      }
    } catch (error) {
      console.error('Update SMS usage error:', error);
    }
  }

  async getSMSUsage(userId) {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const { data: usage, error } = await supabase
        .from('sms_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth.toISOString().split('T')[0])
        .single();

      return usage || { sms_sent: 0, quota_limit: 0 };
    } catch (error) {
      console.error('Get SMS usage error:', error);
      return { sms_sent: 0, quota_limit: 0 };
    }
  }
}

module.exports = new SMSService();