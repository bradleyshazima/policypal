const supabase = require('../config/supabase');

// Check if user has active subscription or trial
const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check subscription status
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .single();

    if (error || !subscription) {
      // Check if still in trial
      if (req.user.subscription_status === 'trial') {
        const trialEndDate = new Date(req.user.trial_end_date);
        if (trialEndDate > new Date()) {
          // Trial is still active
          req.subscription = {
            status: 'trial',
            plan: { name: 'Trial', max_clients: 10, sms_quota: 50 }
          };
          return next();
        }
      }

      return res.status(403).json({ 
        error: 'Subscription required',
        message: 'Your trial has expired or you don\'t have an active subscription. Please upgrade to continue.',
        requiresUpgrade: true
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({ error: 'Error checking subscription' });
  }
};

// Check if user can add more clients
const checkClientLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const maxClients = req.subscription?.subscription_plans?.max_clients;

    // If unlimited (null), allow
    if (!maxClients) {
      return next();
    }

    // Count current clients
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      throw error;
    }

    if (count >= maxClients) {
      return res.status(403).json({
        error: 'Client limit reached',
        message: `Your current plan allows up to ${maxClients} clients. Please upgrade to add more.`,
        requiresUpgrade: true,
        currentCount: count,
        limit: maxClients
      });
    }

    next();
  } catch (error) {
    console.error('Client limit check error:', error);
    return res.status(500).json({ error: 'Error checking client limit' });
  }
};

// Check if user can send more SMS
const checkSMSQuota = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const smsQuota = req.subscription?.subscription_plans?.sms_quota;

    // If unlimited (null), allow
    if (!smsQuota) {
      return next();
    }

    // Get current month usage
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const { data: usage, error } = await supabase
      .from('sms_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth.toISOString().split('T')[0])
      .single();

    const currentUsage = usage?.sms_sent || 0;

    if (currentUsage >= smsQuota) {
      return res.status(403).json({
        error: 'SMS quota exceeded',
        message: `Your current plan allows ${smsQuota} SMS per month. You've used ${currentUsage}.`,
        requiresUpgrade: true,
        currentUsage,
        quota: smsQuota
      });
    }

    req.smsUsage = currentUsage;
    next();
  } catch (error) {
    console.error('SMS quota check error:', error);
    return res.status(500).json({ error: 'Error checking SMS quota' });
  }
};

module.exports = { 
  checkSubscription, 
  checkClientLimit, 
  checkSMSQuota 
};