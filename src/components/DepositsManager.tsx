import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Check, X, Image as ImageIcon, DollarSign } from 'lucide-react';
import { listPaginated as listDepositsPaginated, getOne as getDeposit, approve as approveDeposit, reject as rejectDeposit, getStats as getDepositStats, type Deposit, type DepositStats } from '../services/deposits';

const DepositsManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [selected, setSelected] = useState<Deposit | null>(null);
  const [stats, setStats] = useState<DepositStats | null>(null);
  const [approvingId, setApprovingId] = useState<string | number | null>(null);
  const [rejectingId, setRejectingId] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      // Load all pages from server (batch fetch), then paginate client-side at 10/page
      const first = await listDepositsPaginated(1, 100).catch(() => ({ items: [], page: 1, pages: 1, total: 0 }));
      let allItems: Deposit[] = Array.isArray(first.items) ? first.items : [];
      const totalPagesFromServer = Number(first.pages) || 1;
      if (totalPagesFromServer > 1) {
        for (let p = 2; p <= totalPagesFromServer; p++) {
          const next = await listDepositsPaginated(p, 100).catch(() => ({ items: [] }));
          if (Array.isArray(next.items) && next.items.length > 0) {
            allItems = allItems.concat(next.items as any);
          }
        }
      }
      const s = await getDepositStats().catch(() => null);
      setDeposits(allItems);
      const totalCount = allItems.length;
      setTotal(totalCount);
      setPages(Math.max(1, Math.ceil(totalCount / pageSize)));
      setStats(s as any);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const openDetails = async (idOrDeposit: string | number | Deposit) => {
    const id = typeof idOrDeposit === 'object' ? (idOrDeposit.id as any) : idOrDeposit;
    setSelectedId(id);
    if (typeof idOrDeposit === 'object') {
      setSelected(idOrDeposit);
    }
    try {
      const d = await getDeposit(id);
      setSelected((prev) => {
        if (!prev) return d || null;
        return {
          ...prev,
          ...d,
          user: { ...(prev.user || {}), ...(d?.user || {}) },
        } as any;
      });
    } catch {
      // Keep whatever we have so the modal stays open
    }
  };

  const handleApprove = async (id: string | number) => {
    setError('');
    setApprovingId(id);
    try {
      await approveDeposit(id);
      await refresh();
      if (selectedId === id) await openDetails(id);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Approve failed');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string | number) => {
    setError('');
    setRejectingId(id);
    try {
      await rejectDeposit(id);
      await refresh();
      if (selectedId === id) await openDetails(id);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Reject failed');
    } finally {
      setRejectingId(null);
    }
  };

  const filtered = deposits.filter((d) => {
    const matchesSearch = (d.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (d.status as any) === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const safePage = Math.min(Math.max(page, 1), pages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
  }, [searchTerm, filterStatus]);

  const pendingCount = (stats?.byStatus?.pending?.count as number | undefined) ?? deposits.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deposits</h1>
        <p className="text-gray-600 mt-1">Review deposit proofs and approve or reject</p>
        <p className="text-xs text-gray-500 mt-1">Showing deposits for the current account. Admin-wide listing is not available from the backend.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900">{typeof stats?.totalDeposits === 'number' ? stats.totalDeposits : deposits.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ImageIcon className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="p-4 bg-white border rounded-lg">Loading deposits...</div>}
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.map((d) => (
                <tr key={String(d.id)} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{d.user?.name || d.user?.email || `#${String(d.id)}`}</div>
                    {d.user?.email && (
                      <div className="text-sm text-gray-500">{d.user.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-green-600">{typeof d.amount === 'number' ? `$${d.amount.toFixed(2)}` : '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openDetails(d)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      <Eye size={12} className="mr-1" />
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      d.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {d.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(d.id)}
                          disabled={approvingId === d.id}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${approvingId === d.id ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          <Check size={14} className="mr-1" />
                          {approvingId === d.id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(d.id)}
                          disabled={rejectingId === d.id}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${rejectingId === d.id ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          <X size={14} className="mr-1" />
                          {rejectingId === d.id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No deposits found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">Page {safePage} of {pages} • Total {total}</div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded border ${safePage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                className={`min-w-[36px] px-2 py-1.5 rounded border text-sm ${safePage === i + 1 ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className={`px-3 py-1.5 rounded border ${safePage === pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
            disabled={safePage === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Deposit Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">User</p>
                  <p className="font-medium">{selected.user?.name || selected.user?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium break-all">{selected.user?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{(selected.user as any)?.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Referral Code</p>
                  <p className="font-medium">{(selected.user as any)?.referralCode || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">{typeof selected.amount === 'number' ? `$${selected.amount.toFixed(2)}` : '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize">{selected.status || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium">{(selected as any).paymentMethod || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-medium break-all">{(selected as any).transactionId || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Description</p>
                  <p className="font-medium whitespace-pre-wrap">{(selected as any).description || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Updated</p>
                  <p className="font-medium">{(selected as any).updatedAt ? new Date((selected as any).updatedAt).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Approved By</p>
                  <p className="font-medium">{(selected as any).approvedBy ?? '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rejected By</p>
                  <p className="font-medium">{(selected as any).rejectedBy ?? '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Approved At</p>
                  <p className="font-medium">{(selected as any).approvedAt ? new Date((selected as any).approvedAt).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rejected At</p>
                  <p className="font-medium">{(selected as any).rejectedAt ? new Date((selected as any).rejectedAt).toLocaleString() : '—'}</p>
                </div>
              </div>
              {selected.proofUrl && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Proof</p>
                  <img src={selected.proofUrl} alt="Deposit Proof" className="w-full rounded border" />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
              {selected.status === 'pending' && (
                <>
                  <button
                    onClick={() => selected && handleApprove(selected.id as any)}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => selected && handleReject(selected.id as any)}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositsManager;
