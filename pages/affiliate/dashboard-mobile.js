import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function AffiliateDashboardMobile() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    activeReferrals: 0,
  });
  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      router.push('/affiliate/login');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      setStats({
        totalEarnings: 1250.50,
        pendingEarnings: 250.00,
        totalClicks: 1250,
        totalConversions: 45,
        conversionRate: 3.6,
        activeReferrals: 12,
      });
      
      setReferrals([
        { id: 1, name: 'John Doe', email: 'john@example.com', date: '2024-03-15', status: 'Active', earnings: 150.00 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2024-03-12', status: 'Active', earnings: 85.50 },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', date: '2024-03-10', status: 'Pending', earnings: 0.00 },
      ]);
      
      setPayouts([
        { id: 1, amount: 500.00, date: '2024-03-01', status: 'Paid', method: 'PayPal' },
        { id: 2, amount: 350.00, date: '2024-02-01', status: 'Paid', method: 'Bank Transfer' },
        { id: 3, amount: 250.00, date: '2024-03-15', status: 'Processing', method: 'PayPal' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutRequest = async () => {
    if (stats.pendingEarnings < 50) {
      alert('Minimum payout amount is $50');
      return;
    }
    
    // Mock payout request
    alert('Payout request submitted successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Affiliate Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-[#D4AF37]">${stats.totalEarnings}</div>
            <div className="text-sm text-gray-400">Total Earnings</div>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">${stats.pendingEarnings}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.totalConversions}</div>
            <div className="text-sm text-gray-400">Conversions</div>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.conversionRate}%</div>
            <div className="text-sm text-gray-400">Conversion Rate</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={handlePayoutRequest}
            disabled={stats.pendingEarnings < 50}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
              stats.pendingEarnings < 50
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105'
            }`}
          >
            Request Payout - ${stats.pendingEarnings}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 mb-6">
        <div className="flex space-x-2 bg-white/5 border border-white/20 rounded-xl p-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'referrals', label: 'Referrals', icon: '👥' },
            { id: 'payouts', label: 'Payouts', icon: '💰' },
            { id: 'links', label: 'Links', icon: '🔗' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Earnings Chart Placeholder */}
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Earnings Overview</h3>
              <div className="h-48 bg-gradient-to-br from-[#1f2937] to-[#0b0f19] rounded-lg flex items-center justify-center">
                <div className="text-gray-400">Chart visualization would go here</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <div className="font-medium text-white">New referral: John Doe</div>
                    <div className="text-sm text-gray-400">March 15, 2024</div>
                  </div>
                  <div className="text-[#D4AF37] font-bold">+$150.00</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Payout processed</div>
                    <div className="text-sm text-gray-400">March 01, 2024</div>
                  </div>
                  <div className="text-green-400 font-bold">-$500.00</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Referrals</h3>
            {referrals.map((referral) => (
              <div key={referral.id} className="bg-white/5 border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-white">{referral.name}</div>
                    <div className="text-sm text-gray-400">{referral.email}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    referral.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {referral.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Joined: {referral.date}</div>
                  <div className="text-[#D4AF37] font-bold">Earned: ${referral.earnings}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Payout History</h3>
            {payouts.map((payout) => (
              <div key={payout.id} className="bg-white/5 border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-white">${payout.amount}</div>
                    <div className="text-sm text-gray-400">{payout.method}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payout.status === 'Paid' 
                      ? 'bg-green-500/20 text-green-400' 
                      : payout.status === 'Processing'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {payout.status}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Requested: {payout.date}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Affiliate Links</h3>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <div className="font-medium text-white mb-2">Shop Page</div>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={`https://kvgarage.com/shop?ref=${user?.id}`}
                    readOnly
                    className="flex-1 bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black rounded-lg font-medium">
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <div className="font-medium text-white mb-2">Wholesale Page</div>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={`https://kvgarage.com/wholesale?ref=${user?.id}`}
                    readOnly
                    className="flex-1 bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black rounded-lg font-medium">
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <div className="font-medium text-white mb-2">Mentorship Page</div>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={`https://kvgarage.com/mentorship?ref=${user?.id}`}
                    readOnly
                    className="flex-1 bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black rounded-lg font-medium">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}