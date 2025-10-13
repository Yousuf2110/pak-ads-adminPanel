import React, { useState } from 'react';
import { Gift, DollarSign, Users, Calendar, Search, Filter, Star, Trophy, Award, Crown } from 'lucide-react';

const RewardIncome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const rewards = [
    {
      id: 1,
      userName: 'Ahmad Hassan',
      email: 'ahmad.hassan@email.com',
      phone: '+92 300 1234567',
      level: 'Level 1',
      levelNumber: 1,
      rewardType: 'Level 1 Reward',
      amount: 1.00,
      date: '2025-01-21',
      status: 'sent',
      description: '3 Direct Referrals Achievement',
      directReferrals: 3,
      totalReferrals: 12
    },
    {
      id: 2,
      userName: 'Fatima Khan',
      email: 'fatima.khan@email.com',
      phone: '+92 301 2345678',
      level: 'Level 2',
      levelNumber: 2,
      rewardType: 'Level 2 Reward',
      amount: 2.00,
      date: '2025-01-21',
      status: 'sent',
      description: '6 Direct Referrals Achievement',
      directReferrals: 6,
      totalReferrals: 18
    },
    {
      id: 3,
      userName: 'Muhammad Ali',
      email: 'muhammad.ali@email.com',
      phone: '+92 302 3456789',
      level: 'Level 3',
      levelNumber: 3,
      rewardType: 'Level 3 Reward',
      amount: 5.00,
      date: '2025-01-20',
      status: 'sent',
      description: '9 Direct Referrals Achievement',
      directReferrals: 9,
      totalReferrals: 25
    },
    {
      id: 4,
      userName: 'Aisha Ahmed',
      email: 'aisha.ahmed@email.com',
      phone: '+92 303 4567890',
      level: 'Level 4',
      levelNumber: 4,
      rewardType: 'Level 4 Reward',
      amount: 10.00,
      date: '2025-01-19',
      status: 'sent',
      description: '12 Direct Referrals Achievement',
      directReferrals: 12,
      totalReferrals: 35
    },
    {
      id: 5,
      userName: 'Hassan Sheikh',
      email: 'hassan.sheikh@email.com',
      phone: '+92 304 5678901',
      level: 'Level 5',
      levelNumber: 5,
      rewardType: 'Level 5 Reward',
      amount: 20.00,
      date: '2025-01-18',
      status: 'pending',
      description: '15 Direct Referrals Achievement',
      directReferrals: 15,
      totalReferrals: 45
    },
    {
      id: 6,
      userName: 'Sara Malik',
      email: 'sara.malik@email.com',
      phone: '+92 305 6789012',
      level: 'Level 1',
      levelNumber: 1,
      rewardType: 'Level 1 Reward',
      amount: 1.00,
      date: '2025-01-17',
      status: 'sent',
      description: '3 Direct Referrals Achievement',
      directReferrals: 3,
      totalReferrals: 8
    }
  ];

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

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    if (dateFilter === 'today') return matchesSearch && reward.date === '2025-01-21';
    if (dateFilter === 'week') return matchesSearch && new Date(reward.date) >= new Date('2025-01-15');
    
    return matchesSearch;
  });

  const totalRewardsSent = rewards.filter(r => r.status === 'sent').reduce((sum, r) => sum + r.amount, 0);
  const totalRewardsPending = rewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const uniqueRecipients = new Set(rewards.map(r => r.userName)).size;

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
      value: rewards.filter(r => r.date === '2025-01-21').length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'Active day'
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

      {/* Rewards Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reward History</h3>
          <p className="text-sm text-gray-600">Complete list of all rewards sent to users</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direct Referrals</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {reward.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reward.userName}</div>
                        <div className="text-sm text-gray-500">{reward.email}</div>
                        <div className="text-sm text-gray-500">{reward.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(reward.levelNumber)}
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getLevelColor(reward.levelNumber)}`}>
                        {reward.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-center">
                      <span className="text-lg font-bold text-blue-600">{reward.directReferrals}</span>
                      <p className="text-xs text-gray-500">of {reward.totalReferrals} total</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-green-600">
                      ${reward.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <span>🎯</span>
                      <span>{reward.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reward.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      reward.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reward.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reward records found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardIncome;