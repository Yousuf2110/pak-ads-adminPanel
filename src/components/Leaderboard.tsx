import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Star, Medal, Gift, Calendar } from 'lucide-react';
import { getTopEarners } from '../services/commissions';

const Leaderboard: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState('current');
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getFortnightRange = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
      const firstHalf = day <= 15;
      const start = new Date(year, month, firstHalf ? 1 : 16, 0, 0, 0, 0);
      const end = new Date(year, month, firstHalf ? 15 : new Date(year, month + 1, 0).getDate(), 23, 59, 59, 999);
      return { start, end };
    };

    const refresh = async () => {
      setLoading(true);
      setError('');
      try {
        const { start, end } = getFortnightRange();
        const res: any = await getTopEarners({ startDate: start.toISOString(), endDate: end.toISOString(), limit: 10 });
        const raw = Array.isArray(res?.topEarners) ? res.topEarners : (Array.isArray(res) ? res : []);
        const mapped = raw.map((r: any, idx: number) => ({
          rank: idx + 1,
          name: r.name,
          email: r.email,
          phone: r.phone,
          points: r.commissionCount ?? r.points ?? 0,
          referrals: r.totalReferrals ?? r.referrals ?? 0,
          bonus: r.totalEarned ?? r.bonus ?? 0,
          userId: r.userId,
        }));
        setLeaders(mapped);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, [currentPeriod]);

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

  const totalBonusPool = leaders.reduce((sum, leader) => sum + (leader.bonus || 0), 0);

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
                <span className="text-sm font-medium text-gray-900">{
                  (() => {
                    const now = new Date();
                    const y = now.getFullYear();
                    const m = now.getMonth();
                    const d = now.getDate();
                    const start = new Date(y, m, d <= 15 ? 1 : 16);
                    const end = new Date(y, m, d <= 15 ? 15 : new Date(y, m + 1, 0).getDate());
                    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
                  })()
                }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days Left:</span>
                <span className="text-sm font-medium text-red-600">{
                  (() => {
                    const now = new Date();
                    const y = now.getFullYear();
                    const m = now.getMonth();
                    const d = now.getDate();
                    const end = new Date(y, m, d <= 15 ? 15 : new Date(y, m + 1, 0).getDate());
                    const diff = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                    return `${diff} days`;
                  })()
                }</span>
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
                    {leaders.filter(l => (l.bonus || 0) > 0).length}/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaders.slice(0, 3).map((leader, idx) => (
          <div key={leader.rank} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`p-4 ${getRankBadge(leader.rank)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getRankIcon(leader.rank)}
                  <span className="font-bold text-lg">#{leader.rank}</span>
                </div>
                <span className="text-lg font-bold">${leader.bonus ?? 0}</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-bold text-lg">{(leader.name || '?').charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{leader.name}</p>
                  <p className="text-sm text-gray-500 truncate">{leader.email}</p>
                  <p className="text-sm text-gray-500">{leader.phone}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{leader.points ?? 0}</p>
                  <p className="text-xs text-gray-500">Points</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{leader.referrals ?? 0}</p>
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
              {leaders.map((leader, i) => (
                <tr key={i} className="hover:bg-gray-50">
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
                        <span className="text-green-800 font-medium text-sm">{(leader.name || '?').charAt(0)}</span>
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
                      {(leader.points || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-purple-600">
                      {leader.referrals ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-green-600">
                      ${leader.bonus ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (leader.bonus || 0) > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(leader.bonus || 0) > 0 ? 'Qualified' : 'Not Qualified'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loading && (
        <div className="p-4 bg-white border rounded-lg">Loading leaderboard...</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}
    </div>
  );
};

export default Leaderboard;