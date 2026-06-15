import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryService } from '@services/queryService';
import type { QueryStatus, QueryPriority } from '@/types';
import { Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const PRIORITY_COLORS: Record<QueryPriority, string> = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Urgent: 'bg-red-100 text-red-800',
};

const STATUS_COLORS: Record<QueryStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  InProgress: 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-700',
};

export default function QueryList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: '20' };
  if (search) params.search = search;
  if (status) params.status = status;
  if (priority) params.priority = priority;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['queries', params],
    queryFn: () => queryService.getAll(params),
    staleTime: 30_000,
  });

  const queries = data?.data ?? [];
  const stats = data?.stats ?? { total: 0, pending: 0, inProgress: 0, resolved: 0, overdue: 0 };
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Query Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all staff queries, complaints, and requests</p>
        </div>
        <Link
          to="/queries/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          New Query
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Filter, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'bg-blue-50 text-blue-700' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'bg-green-50 text-green-700' },
          { label: 'Overdue', value: stats.overdue, icon: XCircle, color: 'bg-red-50 text-red-700' },
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
              placeholder="Search queries..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Priority</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
        ) : isError ? (
          <div className="flex items-center justify-center h-48 text-red-500">Failed to load queries</div>
        ) : queries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <Filter className="h-8 w-8" />
            <p>No queries found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Title', 'Type', 'Priority', 'Status', 'Due Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {queries.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-4 py-3">
                    <Link to={`/queries/${q.id}`} className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1">
                      {q.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{q.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{q.type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[q.priority]}`}>
                      {q.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {q.dueDate ? new Date(q.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/queries/${q.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
