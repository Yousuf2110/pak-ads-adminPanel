import React, { useEffect, useState } from 'react';
import { Users, UserCheck, CreditCard, DollarSign, TrendingUp, Eye, Activity, Calendar } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import RankRewardChart from './RankRewardChart';
import { getAdminStats } from '../services/dashboard';
import { getAdminNotifications, type AdminNotification } from '../services/notifications';
import { getAdminStats as getTransferStats, type TransferStats } from '../services/transfers';
import { getStats as getWithdrawalStats, type WithdrawalStats } from '../services/adminWithdrawals';

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [transferStats, setTransferStats] = useState<TransferStats | null>(null);
  const [withdrawalStats, setWithdrawalStats] = useState<WithdrawalStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getAdminStats()
      .then((d) => setStatsData(d))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getAdminNotifications()
      .then((items) => setNotifications(items || []))
      .catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    getTransferStats()
      .then((d) => setTransferStats(d || null))
      .catch(() => setTransferStats(null));
    getWithdrawalStats()
      .then((d) => setWithdrawalStats(d || null))
      .catch(() => setWithdrawalStats(null));
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: statsData?.overview?.total_users?.toLocaleString?.() || '—',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-800',
      textColor: 'text-white',
      change: '',
      changeColor: 'text-green-300'
    },
    {
      title: 'Active Ads',
      value: statsData?.overview?.active_ads?.toLocaleString?.() || '—',
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-800',
      textColor: 'text-white',
      change: '',
      changeColor: 'text-green-300'
    },
    {
      title: 'Pending Ads',
      value: statsData?.overview?.pending_ads?.toLocaleString?.() || '—',
      icon: CreditCard,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-800',
      textColor: 'text-white',
      change: '',
      changeColor: 'text-green-300'
    },
    {
      title: 'Pending Reports',
      value: statsData?.overview?.pending_reports?.toLocaleString?.() || '—',
      icon: DollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-800',
      textColor: 'text-white',
      change: '',
      changeColor: 'text-green-300'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'withdrawal': return '💸';
      case 'deposit': return '💰';
      case 'bonus': return '🎁';
      case 'account': return '👤';
      default: return '📊';
    }
  };

  const quickPendingRequests = typeof statsData?.overview?.pending_reports === 'number'
    ? statsData.overview.pending_reports
    : (typeof statsData?.pendingRequests === 'number' ? statsData.pendingRequests : undefined);
  const quickDailyRevenue = typeof statsData?.dailyRevenue === 'number' ? statsData.dailyRevenue : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with PakAdz Pakistan 🇵🇰</p>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel notifications={notifications} maxVisible={3} />

      {loading && (
        <div className="p-4 bg-white border rounded-lg">Loading admin stats...</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${stat.textColor} opacity-90 mb-1`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                    <span className={`text-sm ${stat.textColor} opacity-70 ml-1`}>
                      from last month
                    </span>
                  </div>
                </div>
                {/* Icon container: solid color with WHITE icon */}
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Stats: Transfers & Withdrawals */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transfers Total</p>
              <p className="text-2xl font-bold text-gray-900">{transferStats?.total ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Today: {transferStats?.today ?? '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
              <p className="text-2xl font-bold text-gray-900">{typeof withdrawalStats?.totalAmount === 'number' ? withdrawalStats.totalAmount : '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Requests: {withdrawalStats?.totalWithdrawals ?? '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <CreditCard className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div> */}

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="text-green-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            {(notifications || []).slice(0, 6).map((n) => (
              <div key={String(n.id)} className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span>{getActivityIcon(n.type || '')}</span>
                  <span>{n.message}</span>
                </div>
                <span className="text-xs text-gray-500">{n.time || ''}</span>
              </div>
            ))}
            {(!notifications || notifications.length === 0) && (
              <div className="text-sm text-gray-500">No recent activity to display.</div>
            )}
          </div>
        </div>

        {/* Quick Stats (API-driven only) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Quick Overview</h3>
          </div>
          {(typeof quickPendingRequests === 'number' || typeof quickDailyRevenue === 'number') ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Pending Requests</p>
                <p className="text-xl font-bold text-blue-800">{typeof quickPendingRequests === 'number' ? quickPendingRequests : '—'}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-medium">Daily Revenue</p>
                <p className="text-xl font-bold text-purple-800">{typeof quickDailyRevenue === 'number' ? `$${quickDailyRevenue.toLocaleString?.()}` : '—'}</p>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">No quick stats available from API.</div>
          )}
        </div>
      </div>

      {/* Rank Reward Chart Section */}
      <div className="mt-8">
        <RankRewardChart />
      </div>
    </div>
  );
};

export default Dashboard;