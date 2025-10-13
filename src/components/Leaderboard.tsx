import React, { useState } from 'react';
import { Trophy, Crown, Star, Medal, Gift, Calendar } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState('current');

  const leaderboardData = [
    {
      rank: 1,
      name: 'Hassan Sheikh',
      email: 'hassan.sheikh@email.com',
      phone: '+92 304 5678901',
      points: 2850,
      referrals: 45,
      bonus: 100,
      avatar: 'H',
      isEligible: true
    },
    {
      rank: 2,
      name: 'Aisha Ahmed',
      email: 'aisha.ahmed@email.com',
      phone: '+92 303 4567890',
      points: 2650,
      referrals: 38,
      bonus: 80,
      avatar: 'A',
      isEligible: true
    },
    {
      rank: 3,
      name: 'Ahmad Hassan',
      email: 'ahmad.hassan@email.com',
      phone: '+92 300 1234567',
      points: 2450,
      referrals: 35,
      bonus: 60,
      avatar: 'A',
      isEligible: true
    },
    {
      rank: 4,
      name: 'Fatima Khan',
      email: 'fatima.khan@email.com',
      phone: '+92 301 2345678',
      points: 2200,
      referrals: 32,
      bonus: 50,
      avatar: 'F',
      isEligible: true
    },
    {
      rank: 5,
      name: 'Muhammad Ali',
      email: 'muhammad.ali@email.com',
      phone: '+92 302 3456789',
      points: 2100,
      referrals: 28,
      bonus: 40,
      avatar: 'M',
      isEligible: true
    },
    {
      rank: 6,
      name: 'Sara Malik',
      email: 'sara.malik@email.com',
      phone: '+92 305 6789012',
      points: 1950,
      referrals: 26,
      bonus: 35,
      avatar: 'S',
      isEligible: true
    },
    {
      rank: 7,
      name: 'Omar Khan',
      email: 'omar.khan@email.com',
      phone: '+92 306 7890123',
      points: 1850,
      referrals: 24,
      bonus: 30,
      avatar: 'O',
      isEligible: true
    },
    {
      rank: 8,
      name: 'Zainab Ali',
      email: 'zainab.ali@email.com',
      phone: '+92 307 8901234',
      points: 1750,
      referrals: 22,
      bonus: 25,
      avatar: 'Z',
      isEligible: true
    },
    {
      rank: 9,
      name: 'Usman Ahmed',
      email: 'usman.ahmed@email.com',
      phone: '+92 308 9012345',
      points: 1650,
      referrals: 20,
      bonus: 20,
      avatar: 'U',
      isEligible: true
    },
    {
      rank: 10,
      name: 'Hina Sheikh',
      email: 'hina.sheikh@email.com',
      phone: '+92 309 0123456',
      points: 1550,
      referrals: 18,
      bonus: 15,
      avatar: 'H',
      isEligible: true
    }
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Medal className="text-orange-500" size={24} />;
    return <Star className="text-green-500" size={20} />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
  };

  const totalBonusPool = leaderboardData.reduce((sum, leader) => sum + leader.bonus, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard (Fortnight Bonus)</h1>
        <p className="text-gray-600 mt-1">Top 10 performers who will receive extra bonus rewards</p>
      </div>

      {/* Period Selector and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Period</h3>
              <Calendar className="text-green-600" size={20} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Period:</span>
                <span className="text-sm font-medium text-gray-900">Jan 1 - Jan 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days Left:</span>
                <span className="text-sm font-medium text-red-600">5 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                className={`w-full py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  currentPeriod === 'current'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentPeriod('current')}
              >
                Current Fortnight
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Trophy className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bonus Pool</p>
                  <p className="text-2xl font-bold text-gray-900">${totalBonusPool}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Gift className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Qualified Leaders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {leaderboardData.filter(l => l.isEligible).length}/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaderboardData.slice(0, 3).map((leader) => (
          <div key={leader.rank} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`p-4 ${getRankBadge(leader.rank)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getRankIcon(leader.rank)}
                  <span className="font-bold text-lg">#{leader.rank}</span>
                </div>
                <span className="text-lg font-bold">${leader.bonus}</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-bold text-lg">{leader.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{leader.name}</p>
                  <p className="text-sm text-gray-500 truncate">{leader.email}</p>
                  <p className="text-sm text-gray-500">{leader.phone}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{leader.points}</p>
                  <p className="text-xs text-gray-500">Points</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{leader.referrals}</p>
                  <p className="text-xs text-gray-500">Referrals</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Complete Leaderboard</h3>
          <p className="text-sm text-gray-600">Top 10 performers for the current fortnight period</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader Info</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus Reward</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((leader) => (
                <tr key={leader.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(leader.rank)}
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadge(leader.rank)}`}>
                        {leader.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-800 font-medium text-sm">{leader.avatar}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{leader.name}</div>
                        <div className="text-sm text-gray-500">{leader.email}</div>
                        <div className="text-sm text-gray-500">{leader.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-blue-600">
                      {leader.points.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-purple-600">
                      {leader.referrals}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-green-600">
                      ${leader.bonus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      leader.isEligible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {leader.isEligible ? 'Qualified' : 'Not Qualified'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;