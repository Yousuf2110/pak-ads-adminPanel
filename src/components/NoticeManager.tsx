import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Bell, Save, X } from 'lucide-react';
import { listAll as listNotices, create as createNotice, update as updateNotice, remove as removeNotice, type Notice } from '../services/notices';

const NoticeManager: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    type: 'general',
    title: '',
    content: '',
    priority: 'high'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listNotices();
      setNotices(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refresh();
  }, []);

  const handleAddNotice = async () => {
    try {
      setError('');
      if (!formData.title || !formData.content) {
        setError('Title and content are required');
        return;
      }
      setSaving(true);
      await createNotice({ ...formData, isActive: true });
      setShowModal(false);
      setFormData({ type: 'general', title: '', content: '', priority: 'high' });
      await refresh();
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e?.message || 'Failed to add notice';
      setError(status ? `${msg} (HTTP ${status})` : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEditNotice = (notice: any) => {
    setEditingNotice(notice);
    setFormData({
      type: 'general',
      title: notice.title,
      content: notice.content,
      // Map backend values to allowed set: normal->low, urgent->high
      priority: notice.priority === 'normal' ? 'low' : (notice.priority === 'urgent' ? 'high' : notice.priority)
    });
    setShowModal(true);
  };

  const handleUpdateNotice = async () => {
    if (!editingNotice) return;
    try {
      setError('');
      if (!formData.title || !formData.content) {
        setError('Title and content are required');
        return;
      }
      setSaving(true);
      await updateNotice(editingNotice.id, formData);
      setShowModal(false);
      setEditingNotice(null);
      setFormData({ type: 'general', title: '', content: '', priority: 'high' });
      await refresh();
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e?.message || 'Failed to update notice';
      setError(status ? `${msg} (HTTP ${status})` : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNotice = async (id: any) => {
    try {
      await removeNotice(id);
      await refresh();
    } catch {}
  };

  const handleToggleActive = async (id: any) => {
    const n = notices.find(n => String(n.id) === String(id));
    if (!n) return;
    try {
      await updateNotice(id, { isActive: !n.isActive });
      await refresh();
    } catch {}
  };

  const getPriorityColor = (priority: string) => {
    const p = priority === 'normal' ? 'low' : (priority === 'urgent' ? 'high' : priority);
    switch (p) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = () => <Bell size={20} />;

  const activeNotices = notices.filter(n => n.isActive).length;
  const phoneNumbers = 0;

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

      {loading && (
        <div className="p-4 bg-white border rounded-lg">Loading notices...</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

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
            <div className="p-3 rounded-full bg-purple-100 hidden">
              {/* phone stats removed */}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contact Numbers</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
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
                <div className={`p-2 rounded-lg bg-blue-100`}>
                  {getTypeIcon()}
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
              <p className="text-gray-700 text-sm leading-relaxed">
                {notice.content}
              </p>
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
                  onClick={() => handleDeleteNotice(notice.id as any)}
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
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  value="General Notice"
                  readOnly
                />
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
                  Content
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter notice content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
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
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingNotice(null);
                  setFormData({ type: 'general', title: '', content: '', priority: 'high' });
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