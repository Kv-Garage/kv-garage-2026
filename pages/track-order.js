import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DesktopLayoutMega from '../components/layout/DesktopLayoutMega';
import MobileLayout from '../components/layout/MobileLayout';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to tracking service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock tracking data
      const mockTracking = {
        orderNumber: orderNumber.toUpperCase(),
        status: 'In Transit',
        estimatedDelivery: 'April 15, 2026',
        trackingNumber: 'KVGA-TRK-' + Math.floor(Math.random() * 1000000),
        items: [
          {
            name: 'Heavy-Duty Shelving Unit',
            image: '/placeholder.jpg',
            quantity: 1,
            price: 299.99
          },
          {
            name: 'Wall-Mounted Hooks Set',
            image: '/placeholder.jpg',
            quantity: 2,
            price: 49.99
          }
        ],
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'Grand Rapids',
          state: 'MI',
          zip: '49501'
        },
        timeline: [
          {
            status: 'Order Placed',
            date: 'April 5, 2026',
            time: '2:30 PM',
            location: 'Processing Center'
          },
          {
            status: 'Order Confirmed',
            date: 'April 6, 2026',
            time: '10:15 AM',
            location: 'Processing Center'
          },
          {
            status: 'Shipped',
            date: 'April 7, 2026',
            time: '3:45 PM',
            location: 'Distribution Center'
          },
          {
            status: 'In Transit',
            date: 'April 8, 2026',
            time: '9:20 AM',
            location: 'Grand Rapids, MI'
          }
        ]
      };

      setTrackingInfo(mockTracking);
    } catch (err) {
      setError('Unable to retrieve tracking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-400';
      case 'in transit':
        return 'text-yellow-400';
      case 'shipped':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/10 border-green-500/30';
      case 'in transit':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'shipped':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <DesktopLayoutMega title="Track Your Order | KV Garage">
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#111827] to-[#0F0F0F] text-white">
        {/* Hero Section */}
        <section className="py-20 border-t border-white/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-semibold">TRACK ORDER</span>
              <span className="text-gray-400 text-sm">EST. 2022</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">Track Your Order</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Enter your order number to get real-time updates on your shipment status, 
              estimated delivery date, and shipping details.
            </p>
          </div>
        </section>

        {/* Tracking Form */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter your order number (e.g., KVGA-12345)"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-4 px-6 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-black border-t-[#D4AF37] rounded-full animate-spin"></div>
                      <span>Looking up your order...</span>
                    </div>
                  ) : (
                    'Track Order'
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Tracking Results */}
        {trackingInfo && (
          <section className="py-16 border-t border-white/20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    
                    <div className={`p-4 rounded-lg border ${getStatusBg(trackingInfo.status)} mb-6`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Status</span>
                        <span className={`text-sm font-semibold ${getStatusColor(trackingInfo.status)}`}>
                          {trackingInfo.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Tracking #</span>
                        <span className="text-sm font-mono">{trackingInfo.trackingNumber}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Order Number</span>
                        <span className="font-semibold">{trackingInfo.orderNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Estimated Delivery</span>
                        <span className="font-semibold text-[#D4AF37]">{trackingInfo.estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total</span>
                        <span className="font-semibold">
                          ${(trackingInfo.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>{trackingInfo.shippingAddress.name}</div>
                        <div>{trackingInfo.shippingAddress.address}</div>
                        <div>{trackingInfo.shippingAddress.city}, {trackingInfo.shippingAddress.state} {trackingInfo.shippingAddress.zip}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Items in Your Order</h3>
                    <div className="space-y-4">
                      {trackingInfo.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{item.name}</h4>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#D4AF37]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">Each: ${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8">
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-6">Shipping Timeline</h3>
                  <div className="space-y-4">
                    {trackingInfo.timeline.map((event, index) => (
                      <div key={index} className="flex items-center gap-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full text-black font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{event.status}</h4>
                            <span className="text-sm text-gray-400">{event.date} • {event.time}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Help Section */}
        <section className="py-16 border-t border-white/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Need Help?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="font-bold mb-2">Customer Support</h3>
                <p className="text-gray-400 text-sm">Available 24/7 to help with any tracking questions</p>
                <Link href="/contact" className="mt-4 inline-block text-[#D4AF37] hover:text-yellow-400 font-semibold">
                  Contact Us
                </Link>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="font-bold mb-2">Email Updates</h3>
                <p className="text-gray-400 text-sm">Get automatic updates sent to your inbox</p>
                <button className="mt-4 inline-block text-[#D4AF37] hover:text-yellow-400 font-semibold">
                  Subscribe
                </button>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="font-bold mb-2">Mobile App</h3>
                <p className="text-gray-400 text-sm">Track orders on the go with our mobile app</p>
                <button className="mt-4 inline-block text-[#D4AF37] hover:text-yellow-400 font-semibold">
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DesktopLayoutMega>
  );
}