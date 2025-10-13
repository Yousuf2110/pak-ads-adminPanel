import React, { useState } from 'react';
import { Star, Trophy, Users, DollarSign, Calendar, Filter, Search, Award } from 'lucide-react';

const BonusManager: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for bonus achievements
  const bonusAchievements = [
    {
      id: 1,
      userName: 'Ahmad Hassan',
      email: 'ahmad.hassan@email.com',
      phone: '+92 300 1234567',
      bonusType: '3 Direct Referrals',
      amount: 1.00,
      directCount: 3,
      totalReferrals: 12,
      achievedDate: '2025-01-21',
      achievedTime: '10:30 AM',
      level: 'Level 1'
    },
    {
      id: 2,
      userName: 'Fatima Khan',
      email: 'fatima.khan@email.com',
      phone: '+92 301 2345678',
      bonusType: '6 Direct Referrals',
      amount: 1.00,
      directCount: 6,
      totalReferrals: 18,
      achievedDate: '2025-01-21',
      achievedTime: '11:45 AM',
      level: 'Level 2'
    },
    {
      id: 3,
      userName: 'Muhammad Ali',
      email: 'muhammad.ali@email.com',
      phone: '+92 302 3456789',
      bonusType: '3 Direct Referrals',
      amount: 1.00,
      directCount: 3,
      totalReferrals: 8,
      achievedDate: '2025-01-21',
      achievedTime: '02:15 PM',
      level: 'Level 1'
    },
    {
      id: 4,
      userName: 'Aisha Ahmed',
      email: 'aisha.ahmed@email.com',
      phone: '+92 303 4567890',
      bonusType: '9 Direct Referrals',
      amount: 1.00,
      directCount: 9,
      totalReferrals: 25,
      achievedDate: '2025-01-21',
      achievedTime: '03:20 PM',
      level: 'Level 3'
    },
    {
      id: 5,
      userName: 'Hassan Sheikh',
      email: 'hassan.sheikh@email.com',
      phone: '+92 304 5678901',
      bonusType: '6 Direct Referrals',
      amount: 1.00,
      directCount: 6,
      totalReferrals: 22,
      achievedDate: '2025-01-20',
      achievedTime: '04:10 PM',
      level: 'Level 2'
    },
    {
      id: 6,
      userName: 'Sara Malik',
      email: 'sara.malik@email.com',
      phone: '+92 305 6789012',
      bonusType: '3 Direct Referrals',
      amount: 1.00,
      directCount: 3,
      totalReferrals: 15,
      achievedDate: '2025-01-20',
      achievedTime: '05:30 PM',
      level: 'Level 1'
    }
  ];

  const filteredAchievements = bonusAchievements.filter(achievement => {
    const matchesSearch = achievement.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'today') {
      return matchesSearch && achievement.achievedDate === '2025-01-21';
    } else if (dateFilter === 'yesterday') {
      return matchesSearch && achievement.achievedDate === '2025-01-20';
    } else if (dateFilter === 'week') {
      return matchesSearch && new Date(achievement.achievedDate) >= new Date('2025-01-15');
    }
    
    return matchesSearch;
  });

  const todayAchievements = bonusAchievements.filter(a => a.achievedDate === '2025-01-21');
  const totalBonusToday = todayAchievements.reduce((sum, a) => sum + a.amount, 0);
  const level1Count = todayAchievements.filter(a => a.level === 'Level 1').length;
  const level2Count = todayAchievements.filter(a => a.level === 'Level 2').length;

  const getBonusTypeColor = (bonusType: string) => {
    if (bonusType.includes('3 Direct')) return 'bg-green-100 text-green-800 border-green-200';
    if (bonusType.includes('6 Direct')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (bonusType.includes('9 Direct')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelIcon = (level: string) => {
    if (level === 'Level 1') return <Star className="text-green-600" size={16} />;
    if (level === 'Level 2') return <Trophy className="text-blue-600" size={16} />;
    if (level === 'Level 3') return <Award className="text-purple-600" size={16} />;
    return <Star className="text-gray-600" size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bonus Manager</h1>
        <p className="text-gray-600 mt-1">Track daily bonus achievements and direct referral milestones</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Bonuses</p>
              <p className="text-2xl font-bold text-gray-900">${totalBonusToday.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Achievers Today</p>
              <p className="text-2xl font-bold text-gray-900">{todayAchievements.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Star className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Level 1 Bonuses</p>
              <p className="text-2xl font-bold text-gray-900">{level1Count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Trophy className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Level 2 Bonuses</p>
              <p className="text-2xl font-bold text-gray-900">{level2Count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus System Explanation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bonus System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Star className="text-green-600 mr-3" size={24} />
            <div>
              <p className="font-medium text-green-900">Level 1: 3 Direct Referrals</p>
              <p className="text-sm text-green-700">Earn $1 bonus</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Trophy className="text-blue-600 mr-3" size={24} />
            <div>
              <p className="font-medium text-blue-900">Level 2: 6 Direct Referrals</p>
              <p className="text-sm text-blue-700">Earn additional $1 bonus</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <Award className="text-purple-600 mr-3" size={24} />
            <div>
              <p className="font-medium text-purple-900">Level 3: 9 Direct Referrals</p>
              <p className="text-sm text-purple-700">Earn additional $1 bonus</p>
            </div>
          </div>
        </div>
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
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Achievements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Bonus Achievements</h3>
          <p className="text-sm text-gray-600">Users who achieved referral milestones and earned bonuses</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achiever Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direct Referrals</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAchievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-800 font-medium text-sm">
                          {achievement.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{achievement.userName}</div>
                        <div className="text-sm text-gray-500">{achievement.email}</div>
                        <div className="text-sm text-gray-500">{achievement.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getBonusTypeColor(achievement.bonusType)}`}>
                      {achievement.bonusType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(achievement.level)}
                      <span className="text-sm font-medium text-gray-900">{achievement.level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-center">
                      <span className="text-lg font-bold text-blue-600">{achievement.directCount}</span>
                      <p className="text-xs text-gray-500">of {achievement.totalReferrals} total</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-green-600">
                      ${achievement.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{achievement.achievedDate}</div>
                      <div className="text-sm text-gray-500">{achievement.achievedTime}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No bonus achievements found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusManager;