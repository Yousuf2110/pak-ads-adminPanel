import React from 'react';
import { Users, UserCheck, CreditCard, DollarSign, TrendingUp, Eye, Activity, Calendar } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import RankRewardChart from './RankRewardChart';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      icon: Users,
      color: 'bg-blue-500',        // icon circle (optional, can keep or darken)
      bgColor: 'bg-blue-800',      // 👈 DARK CARD BACKGROUND
      textColor: 'text-white',     // card text white
      change: '+12%',
      changeColor: 'text-green-300' // lighter green for dark bg
    },
    {
      title: 'Verified Users',
      value: '9,234',
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-800',
      textColor: 'text-white',
      change: '+8%',
      changeColor: 'text-green-300'
    },
    {
      title: 'Total Withdrawals',
      value: '$87,450',
      icon: CreditCard,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-800',
      textColor: 'text-white',
      change: '+15%',
      changeColor: 'text-green-300'
    },
    {
      title: 'Total Deposits',
      value: '$156,890',
      icon: DollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-800',
      textColor: 'text-white',
      change: '+22%',
      changeColor: 'text-green-300'
    }
  ];

  const recentActivities = [
    { 
      user: 'Ahmad Hassan', 
      action: 'Withdrawal Request', 
      amount: '$50', 
      time: '2 mins ago',
      type: 'withdrawal'
    },
    { 
      user: 'Fatima Khan', 
      action: 'Account Created', 
      amount: '-', 
      time: '5 mins ago',
      type: 'account'
    },
    { 
      user: 'Muhammad Ali', 
      action: 'Deposit Made', 
      amount: '$25', 
      time: '10 mins ago',
      type: 'deposit'
    },
    { 
      user: 'Aisha Ahmed', 
      action: 'Bonus Earned', 
      amount: '$1', 
      time: '15 mins ago',
      type: 'bonus'
    },
    { 
      user: 'Hassan Sheikh', 
      action: 'Withdrawal Request', 
      amount: '$75', 
      time: '20 mins ago',
      type: 'withdrawal'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with BSP Pakistan 🇵🇰</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
          <Eye size={16} />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel maxVisible={3} />

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
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{activity.amount}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Quick Overview</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div>
                <p className="text-sm text-green-700 font-medium">Active Users Today</p>
                <p className="text-2xl font-bold text-green-800">3,847</p>
              </div>
              <div className="text-green-600">
                <TrendingUp size={32} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Pending Requests</p>
                <p className="text-xl font-bold text-blue-800">23</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-medium">Daily Revenue</p>
                <p className="text-xl font-bold text-purple-800">$2,430</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium mb-2">System Status</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">All Systems Operational</span>
                  </div>
                </div>
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
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