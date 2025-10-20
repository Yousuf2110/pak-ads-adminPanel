import React, { useEffect, useState } from 'react';
import { Gift, DollarSign, Users, Calendar, Search, Filter, Star, Trophy, Award, Crown } from 'lucide-react';
import { getOverallStats } from '../services/commissions';

const RewardIncome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [overall, setOverall] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    getOverallStats()
      .then((d) => setOverall(d))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load reward stats'))
      .finally(() => setLoading(false));
  }, []);

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
  const totalRewardsSent = typeof overall?.totalRewardsSent === 'number' ? overall.totalRewardsSent : 0;
  const totalRewardsPending = typeof overall?.totalRewardsPending === 'number' ? overall.totalRewardsPending : 0;
  const uniqueRecipients = typeof overall?.rewardRecipients === 'number' ? overall.rewardRecipients : 0;
  const rewardsToday = typeof overall?.rewardsToday === 'number' ? overall.rewardsToday : 0;

  const stats = [
    {
      title: 'Total Rewards Sent',
      value: `$${totalRewardsSent.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+$125 today'
    },
    {
      title: 'Pending Rewards',
      value: `$${totalRewardsPending.toFixed(2)}`,
      icon: Gift,
      color: 'bg-orange-500',
      change: '2 pending'
    },
    {
      title: 'Reward Recipients',
      value: uniqueRecipients,
      icon: Users,
      color: 'bg-blue-500',
      change: '+3 this week'
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

      {/* Rewards Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reward History</h3>
          <p className="text-sm text-gray-600">Complete list of all rewards sent to users</p>
        </div>
        
        <div className="p-6 text-sm text-gray-500">No reward history endpoint provided yet. Once available, I will wire it here.</div>

        
      </div>
    </div>
  );
};

export default RewardIncome;