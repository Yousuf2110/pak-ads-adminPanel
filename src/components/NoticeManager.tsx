import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Bell, Phone, Save, X } from 'lucide-react';

const NoticeManager: React.FC = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      type: 'phone',
      title: 'WhatsApp Support',
      content: '+92 300 1234567',
      isActive: true,
      createdDate: '2025-01-15',
      priority: 'high'
    },
    {
      id: 2,
      type: 'phone',
      title: 'Telegram Support',
      content: '+92 301 2345678',
      isActive: true,
      createdDate: '2025-01-15',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'general',
      title: 'System Maintenance',
      content: 'System will be under maintenance on Jan 25th from 2:00 AM to 4:00 AM.',
      isActive: true,
      createdDate: '2025-01-20',
      priority: 'high'
    },
    {
      id: 4,
      type: 'general',
      title: 'New Feature Alert',
      content: 'We have launched a new referral tracking system. Check it out now!',
      isActive: true,
      createdDate: '2025-01-18',
      priority: 'medium'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: 'general',
    title: '',
    content: '',
    priority: 'medium'
  });

  const handleAddNotice = () => {
    const newNotice = {
      id: Date.now(),
      ...formData,
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setNotices([newNotice, ...notices]);
    setShowModal(false);
    setFormData({ type: 'general', title: '', content: '', priority: 'medium' });
  };

  const handleEditNotice = (notice: any) => {
    setEditingNotice(notice);
    setFormData({
      type: notice.type,
      title: notice.title,
      content: notice.content,
      priority: notice.priority
    });
    setShowModal(true);
  };

  const handleUpdateNotice = () => {
    setNotices(notices.map(notice => 
      notice.id === editingNotice.id 
        ? { ...notice, ...formData }
        : notice
    ));
    setShowModal(false);
    setEditingNotice(null);
    setFormData({ type: 'general', title: '', content: '', priority: 'medium' });
  };

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  const handleToggleActive = (id: number) => {
    setNotices(notices.map(notice => 
      notice.id === id 
        ? { ...notice, isActive: !notice.isActive }
        : notice
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'phone' ? <Phone size={20} /> : <Bell size={20} />;
  };

  const activeNotices = notices.filter(n => n.isActive).length;
  const phoneNumbers = notices.filter(n => n.type === 'phone' && n.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notice Manager</h1>
          <p className="text-gray-600 mt-1">Manage notices and update contact numbers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Notice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Bell className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notices</p>
              <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Bell className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Notices</p>
              <p className="text-2xl font-bold text-gray-900">{activeNotices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Phone className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contact Numbers</p>
              <p className="text-2xl font-bold text-gray-900">{phoneNumbers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notices.map((notice) => (
          <div key={notice.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${
            !notice.isActive ? 'opacity-60' : ''
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  notice.type === 'phone' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {getTypeIcon(notice.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(notice.priority)}`}>
                    {notice.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(notice.id)}
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors ${
                    notice.isActive
                      ? 'text-green-700 bg-green-100 hover:bg-green-200'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {notice.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              {notice.type === 'phone' ? (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-green-600" size={18} />
                  <span className="text-lg font-mono font-semibold text-gray-900">
                    {notice.content}
                  </span>
                </div>
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {notice.content}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created: {notice.createdDate}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditNotice(notice)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <Edit size={12} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={12} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="general">General Notice</option>
                  <option value="phone">Contact Number</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={formData.type === 'phone' ? 'e.g., WhatsApp Support' : 'Enter notice title'}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'phone' ? 'Phone Number' : 'Content'}
                </label>
                {formData.type === 'phone' ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+92 300 1234567"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                ) : (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter notice content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingNotice(null);
                  setFormData({ type: 'general', title: '', content: '', priority: 'medium' });
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={editingNotice ? handleUpdateNotice : handleAddNotice}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Save size={16} className="mr-2" />
                {editingNotice ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeManager;