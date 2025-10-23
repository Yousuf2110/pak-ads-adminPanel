import React, { useEffect, useState } from 'react';
import { Gift, DollarSign, Users, Calendar, Search, Filter, Star, Trophy, Award, Crown } from 'lucide-react';
import { getOverallStats, getTopEarners } from '../services/commissions';

const RewardIncome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [overall, setOverall] = useState<any | null>(null);
  const [top, setTop] = useState<any[]>([]);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      setError('');
      try {
        const now = new Date();
        let startDate: string | undefined;
        let endDate: string | undefined;
        if (dateFilter === 'today') {
          const s = new Date();
          s.setHours(0, 0, 0, 0);
          startDate = s.toISOString();
          endDate = now.toISOString();
        } else if (dateFilter === 'week') {
          const s = new Date();
          s.setDate(s.getDate() - 7);
          startDate = s.toISOString();
          endDate = now.toISOString();
        }
        const [o, t] = await Promise.all([
          getOverallStats(startDate || endDate ? { startDate, endDate } : undefined).catch(() => null),
          getTopEarners(startDate || endDate ? { startDate, endDate } : undefined).catch(() => []),
        ]);
        setOverall(o);
        const list = Array.isArray((t as any)?.topEarners) ? (t as any).topEarners : (Array.isArray(t) ? t : []);
        setTop(list);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load reward stats');
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, [dateFilter]);

  // Helper functions for level display
  const getLevelIcon = (levelNumber: number) => {
    switch (levelNumber) {
      case 1: return <Star className="text-green-600" size={16} />;
      case 2: return <Trophy className="text-blue-600" size={16} />;
      case 3: return <Award className="text-purple-600" size={16} />;
      case 4: return <Crown className="text-orange-600" size={16} />;
      case 5: return <Crown className="text-red-600" size={16} />;
      default: return <Star className="text-gray-600" size={16} />;
    }
  };

  const getLevelColor = (levelNumber: number) => {
    switch (levelNumber) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 3: return 'bg-purple-100 text-purple-800 border-purple-200';
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 5: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Derived KPI values (fall back safely if backend fields differ)
  const totalDistributed = typeof overall?.totalCommissionDistributed === 'number' ? overall.totalCommissionDistributed : 0;
  const totalCommissions = typeof overall?.totalCommissions === 'number' ? overall.totalCommissions : 0;
  const usersWithReferrals = typeof overall?.usersWithReferrals === 'number' ? overall.usersWithReferrals : 0;
  const rewardsToday = 0;

  const stats = [
    {
      title: 'Total Distributed',
      value: `$${totalDistributed.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: ''
    },
    {
      title: 'Total Commissions',
      value: totalCommissions,
      icon: Gift,
      color: 'bg-orange-500',
      change: ''
    },
    {
      title: 'Users With Referrals',
      value: usersWithReferrals,
      icon: Users,
      color: 'bg-blue-500',
      change: ''
    },
    {
      title: 'Rewards Today',
      value: rewardsToday,
      icon: Calendar,
      color: 'bg-purple-500',
      change: ''
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Total Reward Income</h1>
        <p className="text-gray-600 mt-1">Track all rewards sent to users and reward recipients</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2 font-medium">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-4 bg-white border rounded-lg">Loading reward stats...</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Distribution by Level</h3>
            <p className="text-sm text-gray-600">Total commissions distributed per level</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {(overall?.distributionByLevel || []).map((lvl: any) => (
                <div key={String(lvl.level)} className={`flex items-center justify-between px-3 py-2 rounded border ${getLevelColor(lvl.level)}`}>
                  <div className="flex items-center space-x-2">
                    {getLevelIcon(lvl.level)}
                    <span className="text-sm font-medium">Level {lvl.level}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold mr-3">${typeof lvl.amount === 'number' ? lvl.amount.toFixed(2) : '0.00'}</span>
                    <span className="text-gray-600 mr-3">Count: {lvl.count ?? 0}</span>
                    <span className="text-gray-600">{typeof lvl.percentage === 'number' ? `${lvl.percentage}%` : ''}</span>
                  </div>
                </div>
              ))}
              {(!overall?.distributionByLevel || (overall?.distributionByLevel || []).length === 0) && (
                <div className="text-sm text-gray-500">No distribution data available.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Earners</h3>
            <p className="text-sm text-gray-600">Users with the highest referral commissions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commissions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {top.map((row: any, idx: number) => (
                  <tr key={String(row.userId || idx)} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{row.name || row.email || `#${row.userId}`}</div>
                      <div className="text-sm text-gray-500">{row.email}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-green-600">${typeof row.totalEarned === 'number' ? row.totalEarned.toFixed(2) : '0.00'}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{row.commissionCount ?? ''}</td>
                  </tr>
                ))}
                {top.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-sm text-gray-500">No top earners to display.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardIncome;