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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('bsp_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('bsp_admin_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bsp_admin_auth');
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