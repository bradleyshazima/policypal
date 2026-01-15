const supabase = require('../config/supabase');
const smsService = require('../services/smsService');
const whatsappService = require('../services/whatsappService');
const emailService = require('../services/emailService');

// Get all reminders for user
exports.getAllReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type, startDate, endDate } = req.query;

    let query = supabase
      .from('reminders')
      .select('*, clients(full_name, phone, car_make, car_model, plate_number)')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('reminder_type', type);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    query = query.order('created_at', { ascending: false });

    const { data: reminders, error } = await query;

    if (error) throw error;

    res.json({
      reminders,
      count: reminders.length
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
};

// Send manual reminder
exports.sendManualReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { clientIds, message, deliveryMethod, scheduleDate } = req.body;

    if (!clientIds || clientIds.length === 0) {
      return res.status(400).json({ error: 'Client IDs required' });
    }

    // Get clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .in('id', clientIds)
      .eq('user_id', userId);

    if (error) throw error;

    const results = [];

    for (const client of clients) {
      try {
        // Prepare message
        let finalMessage = message
          .replace(/{client_name}/g, client.full_name)
          .replace(/{car_model}/g, `${client.car_make} ${client.car_model}`)
          .replace(/{plate_number}/g, client.plate_number || '')
          .replace(/{expiry_date}/g, new Date(client.expiry_date).toLocaleDateString());

        if (scheduleDate) {
          // Schedule for later
          await supabase.from('reminders').insert([{
            user_id: userId,
            client_id: client.id,
            delivery_method: deliveryMethod,
            message_content: finalMessage,
            scheduled_date: scheduleDate,
            status: 'scheduled',
            reminder_type: 'manual'
          }]);

          results.push({
            clientId: client.id,
            clientName: client.full_name,
            status: 'scheduled',
            scheduledFor: scheduleDate
          });
        } else {
          // Send immediately
          let sendResult;
          if (deliveryMethod === 'sms') {
            sendResult = await smsService.sendSMS(client.phone, finalMessage, userId, client.id);
          } else if (deliveryMethod === 'whatsapp') {
            sendResult = await whatsappService.sendWhatsApp(client.phone, finalMessage, userId, client.id);
          } else if (deliveryMethod === 'email' && client.email) {
            sendResult = await emailService.sendEmail(client.email, 'Insurance Reminder', finalMessage, userId, client.id);
          }

          results.push({
            clientId: client.id,
            clientName: client.full_name,
            status: 'sent',
            result: sendResult
          });
        }
      } catch (clientError) {
        results.push({
          clientId: client.id,
          clientName: client.full_name,
          status: 'failed',
          error: clientError.message
        });
      }
    }

    res.json({
      message: 'Reminders processed',
      results,
      totalProcessed: results.length,
      successful: results.filter(r => r.status === 'sent' || r.status === 'scheduled').length,
      failed: results.filter(r => r.status === 'failed').length
    });
  } catch (error) {
    console.error('Send manual reminder error:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
};

// Get reminder statistics
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: reminders, error } = await query;

    if (error) throw error;

    const stats = {
      total: reminders.length,
      sent: reminders.filter(r => r.status === 'sent').length,
      scheduled: reminders.filter(r => r.status === 'scheduled').length,
      failed: reminders.filter(r => r.status === 'failed').length,
      byMethod: {
        sms: reminders.filter(r => r.delivery_method === 'sms').length,
        whatsapp: reminders.filter(r => r.delivery_method === 'whatsapp').length,
        email: reminders.filter(r => r.delivery_method === 'email').length
      },
      totalCost: reminders.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0),
      successRate: reminders.length > 0 
        ? ((reminders.filter(r => r.status === 'sent').length / reminders.length) * 100).toFixed(2)
        : 0
    };

    res.json({ statistics: stats });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};