import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  ShoppingCart, 
  Eye, 
  TrendingUp, 
  Activity, 
  RefreshCw,
  Mail,
  DollarSign,
  Clock
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    activeVisitors: 0,
    totalOrders: 0,
    totalRevenue: 0,
    emailSubscriptions: 0,
    viewedProducts: 0,
    addedToCart: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [liveMode, setLiveMode] = useState(true);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const { data: events, error } = await supabase
        .from('traffic_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Calculate metrics
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const activeVisitors = events.filter(e => 
        e.event_type === 'Active on Site' && 
        new Date(e.timestamp) > oneHourAgo
      ).length;

      const totalVisitors = new Set(events.map(e => e.profile_data?.email || e.profile_data?.id)).size;
      const totalOrders = events.filter(e => e.event_type === 'Placed Order').length;
      const emailSubscriptions = events.filter(e => e.event_type === 'Subscribed to Email').length;
      const viewedProducts = events.filter(e => e.event_type === 'Viewed Product').length;
      const addedToCart = events.filter(e => e.event_type === 'Added to Cart').length;

      const totalRevenue = events
        .filter(e => e.event_type === 'Placed Order')
        .reduce((sum, e) => sum + (e.properties?.value || 0), 0);

      setAnalytics({
        totalVisitors,
        activeVisitors,
        totalOrders,
        totalRevenue,
        emailSubscriptions,
        viewedProducts,
        addedToCart
      });

      // Get recent events
      setRecentEvents(events.slice(0, 20));
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {
    fetchAnalytics();

    if (liveMode) {
      const interval = setInterval(fetchAnalytics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [liveMode]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!liveMode) return;

    const channel = supabase
      .channel('traffic_events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'traffic_events'
        },
        (payload) => {
          console.log('New event:', payload);
          fetchAnalytics(); // Refresh data when new events come in
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [liveMode]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-white/20 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              Live Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Real-time tracking of website events and conversions</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLiveMode(!liveMode)}
              className={`flex items-center gap-2 ${
                liveMode 
                  ? 'bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30' 
                  : 'bg-gray-500/20 border border-gray-500/40 text-gray-300 hover:bg-gray-500/30'
              }`}
            >
              <Activity className="w-4 h-4" />
              {liveMode ? 'Live Mode' : 'Paused'}
            </Button>
            
            <Button
              onClick={fetchAnalytics}
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Visitors */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-[#D4AF37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-gray-400">All time unique visitors</p>
            </CardContent>
          </Card>

          {/* Active Visitors */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{analytics.activeVisitors}</div>
              <p className="text-xs text-gray-400">Last 60 minutes</p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{analytics.totalOrders}</div>
              <p className="text-xs text-gray-400">All time orders</p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(analytics.totalRevenue)}</div>
              <p className="text-xs text-gray-400">All time revenue</p>
            </CardContent>
          </Card>

          {/* Email Subscriptions */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Email Subs</CardTitle>
              <Mail className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{analytics.emailSubscriptions}</div>
              <p className="text-xs text-gray-400">Newsletter subscribers</p>
            </CardContent>
          </Card>

          {/* Product Views */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Product Views</CardTitle>
              <Eye className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{analytics.viewedProducts}</div>
              <p className="text-xs text-gray-400">Total product views</p>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Add to Cart</CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{analytics.addedToCart}</div>
              <p className="text-xs text-gray-400">Items added to cart</p>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {analytics.totalVisitors > 0 
                  ? ((analytics.totalOrders / analytics.totalVisitors) * 100).toFixed(2) 
                  : '0.00'}%
              </div>
              <p className="text-xs text-gray-400">Orders / Visitors</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#D4AF37]" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.slice(0, 15).map((event, index) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-1 ${
                          event.event_type === 'Active on Site' ? 'bg-blue-500/20 text-blue-300' :
                          event.event_type === 'Viewed Product' ? 'bg-yellow-500/20 text-yellow-300' :
                          event.event_type === 'Added to Cart' ? 'bg-orange-500/20 text-orange-300' :
                          event.event_type === 'Placed Order' ? 'bg-green-500/20 text-green-300' :
                          event.event_type === 'Subscribed to Email' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {event.event_type}
                      </Badge>
                      <div>
                        <p className="font-medium text-white">{event.properties?.ProductName || event.properties?.email || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{formatTime(event.timestamp)}</p>
                      </div>
                    </div>
                    {event.properties?.value && (
                      <span className="text-green-400 font-bold">
                        {formatCurrency(event.properties.value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Summary */}
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/20">
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active on Site</span>
                  <span className="font-bold text-blue-400">
                    {recentEvents.filter(e => e.event_type === 'Active on Site').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Viewed Product</span>
                  <span className="font-bold text-yellow-400">
                    {recentEvents.filter(e => e.event_type === 'Viewed Product').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Added to Cart</span>
                  <span className="font-bold text-orange-400">
                    {recentEvents.filter(e => e.event_type === 'Added to Cart').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Placed Order</span>
                  <span className="font-bold text-green-400">
                    {recentEvents.filter(e => e.event_type === 'Placed Order').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subscribed to Email</span>
                  <span className="font-bold text-purple-400">
                    {recentEvents.filter(e => e.event_type === 'Subscribed to Email').length}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-gray-400">
                  Last updated: {formatTime(new Date())}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Events tracked: {recentEvents.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}