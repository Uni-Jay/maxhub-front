import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@services/clientService';
import type { ClientStatus } from '@/types';
import { Plus, Search, Users, UserCheck, UserX, Clock } from 'lucide-react';

const STATUS_COLORS: Record<ClientStatus, string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-700',
  Pending: 'bg-yellow-100 text-yellow-800',
  Suspended: 'bg-red-100 text-red-800',
};

export default function ClientList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [country, setCountry] = useState('');
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: '20' };
  if (search) params.search = search;
  if (status) params.status = status;
  if (country) params.country = country;

  const { data: listData, isLoading } = useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getAll(params),
    staleTime: 30_000,
  });

  const { data: stats } = useQuery({
    queryKey: ['clients', 'stats'],
    queryFn: () => clientService.getStats(),
    staleTime: 30_000,
  });

  const clients = listData?.data ?? [];
  const pagination = listData?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all client profiles, documents, and notes</p>
        </div>
        <Link
          to="/clients/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: stats?.total ?? 0, icon: Users, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Active', value: stats?.active ?? 0, icon: UserCheck, color: 'bg-green-50 text-green-700' },
          { label: 'Inactive', value: stats?.inactive ?? 0, icon: UserX, color: 'bg-gray-50 text-gray-700' },
          { label: 'Pending', value: stats?.pending ?? 0, icon: Clock, color: 'bg-yellow-50 text-yellow-700' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color} border border-current/10`}>
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or client ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <input
            type="text"
            placeholder="Country..."
            value={country}
            onChange={(e) => { setCountry(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <Users className="h-8 w-8" />
            <p>No clients found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Client', 'Client ID', 'Contact', 'Country', 'Status', 'Registered', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                        {client.fullName.charAt(0)}
                      </div>
                      <div>
                        <Link
                          to={`/clients/${client.id}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          {client.fullName}
                        </Link>
                        <p className="text-xs text-gray-400">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-300">{client.clientId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{client.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{client.country || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(client.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">Previous</button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
