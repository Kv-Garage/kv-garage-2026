import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Query orders table for matching order
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderNumber)
        .eq('customer_email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Order not found. Please check your order number and email.');
        } else {
          setError('An error occurred while searching for your order.');
        }
        return;
      }

      if (!data) {
        setError('Order not found. Please check your order number and email.');
        return;
      }

      setOrder(data);
    } catch (err) {
      console.error('Track order error:', err);
      setError('An error occurred while searching for your order.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-yellow-500';
      case 'shipped': return 'text-blue-500';
      case 'delivered': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return '📦';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Order | KV Garage</title>
        <meta name="description" content="Track your KV Garage order status and get shipping updates." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Shop
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Enter your order details to check the status of your shipment
            </p>
          </div>

          {/* Tracking Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter your order ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Track Order'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  <span className="text-2xl">{getStatusIcon(order.status)}</span>
                  <span className="text-lg font-semibold capitalize">{order.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{order.id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{order.customer_name || 'Customer'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">${Number(order.total || 0).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>

              {/* Tracking Information */}
              {order.tracking_number && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-2">Tracking Number</p>
                    <p className="text-lg font-mono font-semibold text-blue-900">{order.tracking_number}</p>
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Track on carrier website →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Order Timeline */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-sm text-gray-600">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-4 ${order.status !== 'processing' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status !== 'processing' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <span className={order.status !== 'processing' ? 'text-blue-600' : 'text-gray-400'}>📦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Processing</p>
                      <p className="text-sm text-gray-600">Your order is being prepared for shipment</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 ${order.status === 'shipped' || order.status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <span className={order.status === 'shipped' || order.status === 'delivered' ? 'text-blue-600' : 'text-gray-400'}>🚚</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Shipped</p>
                      <p className="text-sm text-gray-600">
                        {order.tracking_number ? `Tracking: ${order.tracking_number}` : 'Your order has been shipped'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 ${order.status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <span className={order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}>✅</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Delivered</p>
                      <p className="text-sm text-gray-600">Your order has been successfully delivered</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
                <Link href="/contact" className="text-orange-500 hover:text-orange-600 font-medium">
                  Contact Customer Support →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}