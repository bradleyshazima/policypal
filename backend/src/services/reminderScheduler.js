const cron = require('node-cron');
const supabase = require('../config/supabase');
const smsService = require('./smsService');
const whatsappService = require('./whatsappService');
const emailService = require('./emailService');

class ReminderScheduler {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Reminder scheduler already running');
      return;
    }

    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running reminder scheduler...');
      await this.processReminders();
    });

    // Also run every hour to check for manual reminders
    cron.schedule('0 * * * *', async () => {
      await this.processScheduledReminders();
    });

    this.isRunning = true;
    console.log('Reminder scheduler started');
  }

  async processReminders() {
    try {
      // Get all active clients with reminders enabled
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*, users(*)')
        .eq('status', 'active')
        .eq('reminders_enabled', true)
        .not('expiry_date', 'is', null);

      if (error) throw error;

      for (const client of clients) {
        await this.checkAndSendReminder(client);
      }

      console.log(`Processed ${clients.length} clients for reminders`);
    } catch (error) {
      console.error('Process reminders error:', error);
    }
  }

  async checkAndSendReminder(client) {
    try {
      const expiryDate = new Date(client.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      // Get reminder timings (default: [15, 10, 5, 1])
      const reminderTimings = client.reminder_timings || [15, 10, 5, 1];

      // Check if we should send a reminder today
      if (reminderTimings.includes(daysUntilExpiry)) {
        // Check if already sent today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { data: existingReminder } = await supabase
          .from('reminders')
          .select('id')
          .eq('client_id', client.id)
          .eq('days_before_expiry', daysUntilExpiry)
          .gte('created_at', todayStart.toISOString())
          .single();

        if (existingReminder) {
          console.log(`Reminder already sent for client ${client.id}`);
          return;
        }

        // Prepare message
        const message = this.prepareMessage(client, daysUntilExpiry);

        // Send based on delivery method
        const deliveryMethod = client.delivery_method || 'sms';

        try {
          if (deliveryMethod === 'sms') {
            await smsService.sendSMS(client.phone, message, client.user_id, client.id);
          } else if (deliveryMethod === 'whatsapp') {
            await whatsappService.sendWhatsApp(client.phone, message, client.user_id, client.id);
          } else if (deliveryMethod === 'email' && client.email) {
            await emailService.sendEmail(
              client.email,
              'Insurance Renewal Reminder',
              message,
              client.user_id,
              client.id
            );
          }

          // Log activity
          await supabase.from('activity_log').insert([{
            user_id: client.user_id,
            client_id: client.id,
            activity_type: 'reminder_sent',
            description: `Reminder sent to ${client.full_name} (${daysUntilExpiry} days before expiry)`,
            metadata: { delivery_method: deliveryMethod, days_before: daysUntilExpiry }
          }]);

          console.log(`Reminder sent to ${client.full_name} via ${deliveryMethod}`);
        } catch (sendError) {
          console.error(`Failed to send reminder to ${client.full_name}:`, sendError);
          
          // Log failed activity
          await supabase.from('activity_log').insert([{
            user_id: client.user_id,
            client_id: client.id,
            activity_type: 'reminder_failed',
            description: `Failed to send reminder to ${client.full_name}`,
            metadata: { error: sendError.message }
          }]);
        }
      }
    } catch (error) {
      console.error('Check and send reminder error:', error);
    }
  }

  prepareMessage(client, daysUntilExpiry) {
    // Use custom message if available
    let message = client.custom_message;

    // Default message template
    if (!message) {
      if (daysUntilExpiry === 1) {
        message = `Hi {client_name}, your insurance for {car_model} ({plate_number}) expires TOMORROW on {expiry_date}. Please renew immediately to avoid coverage gaps.`;
      } else {
        message = `Hi {client_name}, this is a reminder that your insurance for {car_model} ({plate_number}) expires in {days} days on {expiry_date}. Please renew on time.`;
      }
    }

    // Replace placeholders
    message = message
      .replace(/{client_name}/g, client.full_name)
      .replace(/{car_model}/g, `${client.car_make} ${client.car_model}`)
      .replace(/{plate_number}/g, client.plate_number || 'your vehicle')
      .replace(/{expiry_date}/g, new Date(client.expiry_date).toLocaleDateString())
      .replace(/{days}/g, daysUntilExpiry)
      .replace(/{insurance_type}/g, client.insurance_type || 'insurance')
      .replace(/{policy_number}/g, client.policy_number || '');

    return message;
  }

  async processScheduledReminders() {
    try {
      const now = new Date();

      // Get scheduled reminders that should be sent now
      const { data: reminders, error } = await supabase
        .from('reminders')
        .select('*, clients(*), users(*)')
        .eq('status', 'scheduled')
        .lte('scheduled_date', now.toISOString());

      if (error) throw error;

      for (const reminder of reminders) {
        await this.sendScheduledReminder(reminder);
      }

      if (reminders.length > 0) {
        console.log(`Processed ${reminders.length} scheduled reminders`);
      }
    } catch (error) {
      console.error('Process scheduled reminders error:', error);
    }
  }

  async sendScheduledReminder(reminder) {
    try {
      const { clients: client, delivery_method, message_content } = reminder;

      if (delivery_method === 'sms') {
        await smsService.sendSMS(client.phone, message_content, reminder.user_id, client.id);
      } else if (delivery_method === 'whatsapp') {
        await whatsappService.sendWhatsApp(client.phone, message_content, reminder.user_id, client.id);
      } else if (delivery_method === 'email' && client.email) {
        await emailService.sendEmail(
          client.email,
          'Insurance Reminder',
          message_content,
          reminder.user_id,
          client.id
        );
      }

      // Update reminder status
      await supabase
        .from('reminders')
        .update({
          status: 'sent',
          sent_date: new Date().toISOString(),
          delivery_status: 'delivered'
        })
        .eq('id', reminder.id);

    } catch (error) {
      console.error('Send scheduled reminder error:', error);

      // Update reminder status to failed
      await supabase
        .from('reminders')
        .update({
          status: 'failed',
          delivery_status: 'failed',
          failure_reason: error.message
        })
        .eq('id', reminder.id);
    }
  }
}

module.exports = new ReminderScheduler();