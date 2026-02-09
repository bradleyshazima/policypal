const supabase = require('../config/supabase');

// Get all subscription plans
exports.getPlans = async (req, res) => {
  try {
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_monthly', { ascending: true });

    if (error) throw error;

    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

// Get current subscription
exports.getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get active subscription - Using ilike for case-insensitivity
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .ilike('status', 'active') // Use ilike to handle 'Active' or 'active'
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    let trialStatus = null;
    if (!subscription && req.user.subscription_status === 'trial') {
      const trialEndDate = new Date(req.user.trial_end_date);
      const now = new Date();
      const daysRemaining = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));

      trialStatus = {
        status: 'trial',
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        endDate: req.user.trial_end_date
      };
    }

    // Return the response
    res.json({
      subscription: subscription || null,
      trial: trialStatus
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

// Create subscription (will integrate with Network.ae later)
exports.createSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, billingCycle } = req.body;

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // For now, create subscription without payment
    // Payment integration will be added later
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        plan_id: planId,
        status: 'pending_payment',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        billing_cycle: billingCycle
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Subscription created. Please complete payment.',
      subscription,
      // Payment URL will be added when Network.ae is integrated
      paymentRequired: true
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

// Get usage statistics
exports.getUsage = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get SMS usage
    const { data: smsUsage } = await supabase
      .from('sms_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth.toISOString().split('T')[0])
      .single();

    // Get client count
    const { count: clientCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    res.json({
      usage: {
        sms: smsUsage || { sms_sent: 0, quota_limit: 0 },
        clients: clientCount || 0
      }
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
};