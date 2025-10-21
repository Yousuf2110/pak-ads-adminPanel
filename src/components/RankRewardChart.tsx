import React, { useState, useEffect } from 'react';
import { Star, Trophy, Award, Crown, TrendingUp, Users, DollarSign, Target, BarChart3, PieChart } from 'lucide-react';
import { getAdminCommissions } from '../services/dashboard';

interface LevelData {
  level: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  textColor: string;
  requiredReferrals: number;
  rewardAmount: number;
  totalMembers: number;
  totalEarnings: number;
  description: string;
}

const RankRewardChart: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [levelData, setLevelData] = useState<LevelData[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    getAdminCommissions()
      .then((res: any) => {
        const distribution: Array<{ level: number; count: number; amount: number; percentage?: number }> = res?.distributionByLevel || [];

        const palette = [
          { icon: <Star size={24} />, color: 'text-green-600', bg: 'bg-green-100', text: 'text-green-800' },
          { icon: <Trophy size={24} />, color: 'text-blue-600', bg: 'bg-blue-100', text: 'text-blue-800' },
          { icon: <Award size={24} />, color: 'text-purple-600', bg: 'bg-purple-100', text: 'text-purple-800' },
          { icon: <Crown size={24} />, color: 'text-orange-600', bg: 'bg-orange-100', text: 'text-orange-800' },
          { icon: <Crown size={24} />, color: 'text-red-600', bg: 'bg-red-100', text: 'text-red-800' },
          { icon: <Crown size={24} />, color: 'text-teal-600', bg: 'bg-teal-100', text: 'text-teal-800' },
          { icon: <Crown size={24} />, color: 'text-amber-600', bg: 'bg-amber-100', text: 'text-amber-800' },
        ];

        const list: LevelData[] = distribution.map((d, idx) => {
          const perMember = d.count > 0 ? d.amount / d.count : 0;
          const colors = palette[(d.level - 1) % palette.length];
          return {
            level: d.level,
            name: `Level ${d.level}`,
            icon: colors.icon,
            color: colors.color,
            bgColor: colors.bg,
            textColor: colors.text,
            requiredReferrals: d.percentage || 0,
            rewardAmount: perMember,
            totalMembers: d.count,
            totalEarnings: d.amount,
            description: `Commission level ${d.level}`,
          };
        });

        setLevelData(list);
        const members = list.reduce((s, l) => s + l.totalMembers, 0);
        const earnings = list.reduce((s, l) => s + l.totalEarnings, 0);
        setTotalMembers(members);
        setTotalEarnings(earnings);
      })
      .catch(() => {
        setLevelData([]);
        setTotalMembers(0);
        setTotalEarnings(0);
      });
  }, []);

  const getProgressPercentage = (level: number) => {
    if (!levelData.length) return 0;
    const maxMembers = Math.max(...levelData.map(l => l.totalMembers));
    const currentLevel = levelData.find(l => l.level === level);
    return currentLevel && maxMembers > 0 ? (currentLevel.totalMembers / maxMembers) * 100 : 0;
  };

  const getEarningsPercentage = (level: number) => {
    const currentLevel = levelData.find(l => l.level === level);
    return currentLevel ? (currentLevel.totalEarnings / totalEarnings) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 text-blue-600" size={32} />
            Rank Reward Chart 📊
          </h1>
          <p className="text-gray-600 mt-1">Level-wise reward distribution and earning analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chart View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Target className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Levels</p>
              <p className="text-2xl font-bold text-gray-900">{levelData.filter(l => l.totalMembers > 0).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Reward</p>
              <p className="text-2xl font-bold text-gray-900">${totalMembers > 0 ? (totalEarnings / totalMembers).toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart/Table View */}
      {viewMode === 'chart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Level Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <PieChart className="mr-2 text-blue-600" size={20} />
              Level Distribution
            </h3>
            <div className="space-y-4">
              {levelData.map((level) => (
                <div key={level.level} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${level.bgColor}`}>
                        <span className={level.color}>{level.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{level.name}</p>
                        <p className="text-xs text-gray-500">{level.totalMembers} members</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {((level.totalMembers / totalMembers) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${level.bgColor.replace('bg-', 'bg-').replace('-100', '-500')}`}
                      style={{ width: `${(level.totalMembers / totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="mr-2 text-green-600" size={20} />
              Earnings by Level
            </h3>
            <div className="space-y-4">
              {levelData.map((level) => (
                <div key={level.level} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${level.bgColor}`}>
                        <span className={level.color}>{level.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{level.name}</p>
                        <p className="text-xs text-gray-500">${level.rewardAmount.toFixed(2)} per member</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      ${level.totalEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${getEarningsPercentage(level.level)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Members</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {levelData.map((level) => (
                  <tr 
                    key={level.level} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedLevel === level.level ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${level.bgColor}`}>
                          <span className={level.color}>{level.icon}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{level.name}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${level.bgColor} ${level.textColor}`}>
                        {level.requiredReferrals} Direct Referrals
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-green-600">
                        ${level.rewardAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <span className="text-lg font-bold text-blue-600">{level.totalMembers}</span>
                        <p className="text-xs text-gray-500">
                          {((level.totalMembers / totalMembers) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-purple-600">
                        ${level.totalEarnings.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${level.bgColor.replace('bg-', 'bg-').replace('-100', '-500')}`}
                          style={{ width: `${getProgressPercentage(level.level)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(level.level).toFixed(1)}% of max
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Level Details Modal */}
      {selectedLevel && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {(() => {
            const level = levelData.find(l => l.level === selectedLevel);
            if (!level) return null;
            
            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${level.bgColor}`}>
                      <span className={level.color}>{level.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{level.name}</h3>
                      <p className="text-gray-600">{level.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLevel(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Required Referrals</p>
                    <p className="text-2xl font-bold text-blue-600">{level.requiredReferrals}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Reward Amount</p>
                    <p className="text-2xl font-bold text-green-600">${level.rewardAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-purple-600">{level.totalMembers}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-orange-600">${level.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default RankRewardChart;