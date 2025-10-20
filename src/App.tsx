import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AccountRequests from './components/AccountRequests';
import WithdrawalRequests from './components/WithdrawalRequests';
import ManageUsers from './components/ManageUsers';
import RewardIncome from './components/RewardIncome';
import Leaderboard from './components/Leaderboard';
import AdsManager from './components/AdsManager';
import NoticeManager from './components/NoticeManager';
import BonusManager from './components/BonusManager';
import DepositsManager from './components/DepositsManager';
import api from './lib/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pakads_admin_token') || localStorage.getItem('pakads_token');
    if (!token) return;
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data?.role && String(data.role).toLowerCase() === 'admin') {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('pakads_admin_token');
          localStorage.removeItem('pakads_token');
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem('pakads_admin_token');
        localStorage.removeItem('pakads_token');
        setIsAuthenticated(false);
      }
    })();
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pakads_admin_token');
    localStorage.removeItem('pakads_token');
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'account-requests':
        return <AccountRequests />;
      case 'withdrawal-requests':
        return <WithdrawalRequests />;
      case 'manage-users':
        return <ManageUsers />;
      case 'reward-income':
        return <RewardIncome />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'ads-manager':
        return <AdsManager />;
      case 'notice':
        return <NoticeManager />;
      case 'bonus':
        return <BonusManager />;
      case 'deposits':
        return <DepositsManager />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      
      <div className="lg:ml-64 transition-all duration-300">
        <main className="p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;