import React, { useEffect, useState } from 'react';
import { Star, Trophy, Users, DollarSign, Calendar, Filter, Search, Award } from 'lucide-react';
import { getDailyStatus, getDailyHistory, checkAndAward } from '../services/dailyBonus';

const BonusManager: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<any | null>(null);
  const [history, setHistory] = useState<any | null>(null);
  const [awarding, setAwarding] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      setError('');
      try {
        const [s, h] = await Promise.all([
          getDailyStatus().catch(() => null),
          getDailyHistory({ page: 1, limit: 20 }).catch(() => null),
        ]);
        setStatus(s);
        setHistory(h);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load bonus data');
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, []);

  // KPIs from daily status (fallbacks)
  const todayReferrals = typeof status?.todayReferrals === 'number' ? status.todayReferrals : 0;
  const bonusAwarded = status?.bonusAwarded === true;
  const bonusAwardedCount = typeof status?.bonusAwardedCount === 'number' ? status.bonusAwardedCount : 0;
  const potentialCount = typeof status?.potentialBonus?.count === 'number' ? status.potentialBonus.count : 0;
  const totalBonusTodayPKR = typeof status?.bonusAwardedAmount?.pkr === 'number' ? status.bonusAwardedAmount.pkr : 0;

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
              <p className="text-sm font-medium text-gray-600">Today's Bonus (PKR)</p>
              <p className="text-2xl font-bold text-gray-900">{totalBonusTodayPKR.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{todayReferrals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Star className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Potential Bonuses Today</p>
              <p className="text-2xl font-bold text-gray-900">{potentialCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Trophy className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bonuses Awarded Today</p>
              <p className="text-2xl font-bold text-gray-900">{bonusAwarded ? bonusAwardedCount : 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daily Bonus</h3>
            <p className="text-sm text-gray-600">Check and award today's referral bonus based on today's referrals.</p>
          </div>
          <button
            disabled={awarding}
            onClick={async () => {
              try {
                setError('');
                setAwarding(true);
                await checkAndAward();
                const [s, h] = await Promise.all([
                  getDailyStatus().catch(() => null),
                  getDailyHistory({ page: 1, limit: 20 }).catch(() => null),
                ]);
                setStatus(s);
                setHistory(h);
              } catch (e: any) {
                const status = e?.response?.status;
                const msg = e?.response?.data?.message || e?.message || 'Failed to award bonus';
                setError(status ? `${msg} (HTTP ${status})` : msg);
              } finally {
                setAwarding(false);
              }
            }}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white ${awarding ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
          >
            {awarding ? 'Processing...' : (bonusAwarded ? 'Recheck Bonus' : 'Award Today\'s Bonus')}
          </button>
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

      {loading && (
        <div className="p-4 bg-white border rounded-lg">Loading bonus stats...</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonuses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(history?.bonuses || history?.data?.bonuses || []).filter((item: any) => {
                if (!searchTerm) return true;
                const dateStr = (item.bonusDate || item.createdAt || '').toString();
                return dateStr.toLowerCase().includes(searchTerm.toLowerCase());
              }).map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.bonusDate || item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.referralsCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.bonusCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{(item.bonusAmount?.pkr ?? 0).toLocaleString()}</td>
                </tr>
              ))}
              {(!history || (history?.bonuses?.length === 0 && history?.data?.bonuses?.length === 0)) && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-sm text-gray-500">No bonus history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BonusManager;