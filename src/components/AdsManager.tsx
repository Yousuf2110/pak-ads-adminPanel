import React, { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, Monitor, Smartphone, Globe } from 'lucide-react';
import { listAds, approveAd, rejectAd, createAd, updateAd, deleteAd, type Ad } from '../services/ads';
import { listCategories, type Category } from '../services/categories';
import { listLocations, type Location } from '../services/locations';

const LoadTaxonomies: React.FC<{ onLoaded: (cats: Category[], locs: Location[]) => void }> = ({ onLoaded }) => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (done) return;
    Promise.allSettled([listCategories(), listLocations()])
      .then(([cats, locs]) => {
        const c = cats.status === 'fulfilled' ? (cats.value as Category[]) : [];
        const l = locs.status === 'fulfilled' ? (locs.value as Location[]) : [];
        if (!cancelled) {
          onLoaded(c, l);
          setDone(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [done, onLoaded]);
  return null;
};

const AdsManager: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAds();
      setAds(data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    link: '',
    price: 0,
    category_id: '',
    location_id: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [saving, setSaving] = useState(false);

  const handleAddAd = async () => {
    try {
      setError('');
      setSaving(true);
      let payload = { ...newAd } as any;
      // Basic required-field validation aligned with backend model
      if (!payload.title || !payload.description) {
        throw new Error('Title and description are required');
      }
      if (!payload.category_id || !payload.location_id) {
        throw new Error('Category and Location are required');
      }
      if (payload.price == null || isNaN(Number(payload.price))) {
        throw new Error('Price is required');
      }
      // Image is optional and not sent in payload per backend contract
      if (editingAd) {
        await updateAd(editingAd.id, payload);
      } else {
        await createAd(payload);
      }
      await refresh();
      setShowAddModal(false);
      setEditingAd(null);
      setNewAd({ title: '', description: '', link: '', price: 0, category_id: '', location_id: '' });
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e?.message || 'Failed to save ad';
      setError(status ? `${msg} (HTTP ${status})` : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEditAd = (ad: any) => {
    setEditingAd(ad);
    setNewAd({
      title: ad.title,
      description: ad.description,
      link: ad.link,
      price: ad.price || 0,
      category_id: ad.category_id || '',
      location_id: ad.location_id || '',
    });
    setShowAddModal(true);
  };

  const handleToggleStatus = async (id: any, status?: string) => {
    try {
      if (status === 'active') {
        await rejectAd(id);
      } else {
        await approveAd(id);
      }
      await refresh();
    } catch (e) {}
  };

  const handleDeleteAd = async (id: any) => {
    try {
      await deleteAd(id);
      await refresh();
    } catch (e) {}
  };

  const getPlacementIcon = (placement: string) => {
    switch (placement) {
      case 'banner': return <Monitor size={16} />;
      case 'sidebar': return <Smartphone size={16} />;
      case 'popup': return <Globe size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  const activeAds = ads.filter(ad => ad.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ads Manager</h1>
          <p className="text-gray-600 mt-1">Create and manage promotional advertisements</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create New Ad
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Monitor className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ads</p>
              <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Eye className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Ads</p>
              <p className="text-2xl font-bold text-gray-900">{activeAds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Eye className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Globe className="text-orange-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-4 bg-white border rounded-lg">Loading ads...</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Ads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ads.map((ad: any) => (
          <div key={ad.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={ad.imageUrl} 
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{ad.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  ad.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ad.status}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  {getPlacementIcon(ad.placement)}
                  <span className="capitalize">{ad.placement}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye size={16} />
                  <span>{ad.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe size={16} />
                  <span>{ad.clicks} clicks</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created: {ad.createdAt || ''}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(ad.id, ad.status)}
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors ${
                      ad.status === 'active'
                        ? 'text-red-700 bg-red-100 hover:bg-red-200'
                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                    }`}
                  >
                    {ad.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => handleEditAd(ad)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad.id)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Load taxonomy on modal open */}
              {!categories.length || !locations.length ? (
                <LoadTaxonomies onLoaded={(cats, locs) => { setCategories(cats); setLocations(locs); }} />
              ) : null}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter ad title"
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter ad description"
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter link URL"
                  value={newAd.link}
                  onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                  value={newAd.price}
                  onChange={(e) => setNewAd({ ...newAd, price: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={newAd.category_id}
                  onChange={(e) => setNewAd({ ...newAd, category_id: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={newAd.location_id}
                  onChange={(e) => setNewAd({ ...newAd, location_id: e.target.value })}
                >
                  <option value="">Select location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAd(null);
                  setNewAd({ title: '', description: '', link: '', price: 0, category_id: '', location_id: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAd}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                {saving ? (editingAd ? 'Updating...' : 'Creating...') : (editingAd ? 'Update Ad' : 'Create Ad')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsManager;