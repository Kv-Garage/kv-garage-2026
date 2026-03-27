import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  // Get auth headers for admin access
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Verify admin access
    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    switch (method) {
      case 'GET':
        return handleGetOrders(req, res);
      case 'POST':
        return handleCreateOrder(req, res);
      case 'PUT':
        return handleUpdateOrder(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Orders API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetOrders(req, res) {
  try {
    const { page = 1, limit = 20, status, customer_email } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq('status', status);
    }

    if (customer_email) {
      query = query.ilike('customer_email', `%${customer_email}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      orders: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function handleCreateOrder(req, res) {
  try {
    const orderData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ order: data });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

async function handleUpdateOrder(req, res) {
  try {
    const { id, ...updateData } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Order ID required' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ order: data });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
}