const supabase = require('../config/supabase');

// Get all clients for user
exports.getAllClients = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, sortBy = 'created_at', order = 'desc' } = req.query;

    let query = supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId);

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Search by name, phone, or plate number
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,plate_number.ilike.%${search}%`);
    }

    // Sort
    query = query.order(sortBy, { ascending: order === 'asc' });

    const { data: clients, error } = await query;

    if (error) throw error;

    res.json({
      clients,
      count: clients.length
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

// Get single client
exports.getClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data: client, error } = await supabase
      .from('clients')
      .select('*, documents(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const clientData = {
      ...req.body,
      user_id: userId
    };

    const { data: client, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('activity_log').insert([{
      user_id: userId,
      client_id: client.id,
      activity_type: 'client_added',
      description: `New client added: ${client.full_name}`
    }]);

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    console.error('Create client error:', error);
    
    if (error.message && error.message.includes('Client limit reached')) {
      return res.status(403).json({ 
        error: 'Client limit reached',
        requiresUpgrade: true 
      });
    }
    
    res.status(500).json({ error: 'Failed to create client' });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    // Don't allow changing user_id
    delete updates.user_id;
    delete updates.id;

    const { data: client, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};

// Get clients expiring soon
exports.getExpiringClients = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lte('expiry_date', futureDate.toISOString().split('T')[0])
      .gte('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error) throw error;

    res.json({
      clients,
      count: clients.length
    });
  } catch (error) {
    console.error('Get expiring clients error:', error);
    res.status(500).json({ error: 'Failed to fetch expiring clients' });
  }
};