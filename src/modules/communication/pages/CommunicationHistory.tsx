import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { communicationService } from '@services/communicationService';
import type { CommStatus, CommChannel } from '@/types';
import { Mail, MessageSquare, Activity } from 'lucide-react';

const STATUS_COLORS: Record<CommStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Sending: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
  Partial: 'bg-orange-100 text-orange-800',
};

const CHANNEL_ICONS: Record<CommChannel, React.ElementType> = {
  Email: Mail,
  SMS: MessageSquare,
  WhatsApp: MessageSquare,
};

export default function CommunicationHistory() {
  const [channel, setChannel] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: '20' };
  if (channel) params.channel = channel;
  if (status) params.status = status;

  const { data: listData, isLoading } = useQuery({
    queryKey: ['comm-logs', params],
    queryFn: () => communicationService.getLogs(params),
    staleTime: 30_000,
  });

  const { data: stats } = useQuery({
    queryKey: ['comm-stats'],
    queryFn: () => communicationService.getStats(),
    staleTime: 60_000,
  });

  const logs = listData?.data ?? [];
  const pagination = listData?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communication History</h1>
        <p className="text-gray-500 text-sm mt-1">Track all outgoing messages and delivery reports</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Sent', value: stats.total, color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700' },
            { label: 'Failed', value: stats.failed, color: 'bg-red-50 text-red-700' },
            { label: 'Success Rate', value: `${stats.successRate ?? 0}%`, color: 'bg-blue-50 text-blue-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color} border border-current/10`}>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-3 flex-wrap">
          <select
            value={channel}
            onChange={(e) => { setChannel(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none"
          >
            <option value="">All Channels</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Partial">Partial</option>
            <option value="Failed">Failed</option>
            <option value="Sending">Sending</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Logs table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <Mail className="h-8 w-8" />
            <p>No communication logs found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Channel', 'Subject', 'Recipients', 'Status', 'Sent At'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {logs.map((log) => {
                const ChannelIcon = CHANNEL_ICONS[log.channel] ?? Mail;
                return (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ChannelIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{log.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{log.subject}</p>
                      <p className="text-xs text-gray-400">{log.recipientType}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-600 font-medium">{log.successCount}</span>
                      {' / '}
                      <span className="text-gray-400">{log.totalRecipients}</span>
                      {log.failureCount > 0 && (
                        <span className="ml-1 text-red-500">({log.failureCount} failed)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[log.status]}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : log.scheduledAt ? `Scheduled: ${new Date(log.scheduledAt).toLocaleString()}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
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
