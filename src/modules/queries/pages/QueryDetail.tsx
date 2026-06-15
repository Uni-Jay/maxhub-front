import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryService } from '@services/queryService';
import { ArrowLeft, Send, Lock, Unlock, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import type { QueryStatus, QueryPriority } from '@/types';

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

export default function QueryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const { data: query, refetch } = useApiQuery(
    ['query', id],
    () => queryService.getById(id!)
  );

  const replyMutation = useApiMutation(
    (data: { message: string; isInternal: boolean }) => queryService.addReply(id!, data),
    {
      invalidateKeys: [['query', id]],
      onSuccess: () => { setReplyText(''); refetch(); },
    }
  );

  const resolveMutation = useApiMutation(
    () => queryService.resolve(id!),
    { invalidateKeys: [['query', id], ['queries']], onSuccess: () => refetch() }
  );

  const updateStatusMutation = useApiMutation(
    (status: string) => queryService.update(id!, { status: status as QueryStatus }),
    { invalidateKeys: [['query', id], ['queries']], onSuccess: () => refetch() }
  );

  const deleteMutation = useApiMutation(
    () => queryService.delete(id!),
    { invalidateKeys: [['queries']], onSuccess: () => navigate('/queries') }
  );

  if (!query) {
    return <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>;
  }

  const replies = query.replies ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{query.title}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[query.priority]}`}>
                {query.priority}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[query.status]}`}>
                {query.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {query.type} • Created {new Date(query.createdAt).toLocaleDateString()}
              {query.dueDate && ` • Due ${new Date(query.dueDate).toLocaleDateString()}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/queries/${id}/edit`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <Edit2 className="h-4 w-4" />
          </Link>
          {query.status !== 'Resolved' && query.status !== 'Closed' && (
            <button
              onClick={() => resolveMutation.mutate(undefined as never)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              Resolve
            </button>
          )}
          <select
            value={query.status}
            onChange={(e) => updateStatusMutation.mutate(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <button
            onClick={() => { if (confirm('Delete this query?')) deleteMutation.mutate(undefined as never); }}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation thread */}
        <div className="lg:col-span-2 space-y-4">
          {/* Original query */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                O
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Original Query</p>
                <p className="text-xs text-gray-400">{new Date(query.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{query.description}</p>
          </div>

          {/* Replies */}
          {replies.map((reply) => (
            <div
              key={reply.id}
              className={`rounded-xl border p-4 ${
                reply.isInternal
                  ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${reply.isInternal ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {reply.isInternal ? <Lock className="h-3 w-3" /> : 'S'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Staff Reply
                    {reply.isInternal && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Internal Note</span>}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">{reply.message}</p>
            </div>
          ))}

          {/* Reply input */}
          {query.status !== 'Closed' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded"
                  />
                  {isInternal ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  Internal note (only visible to staff)
                </label>
                <button
                  disabled={!replyText.trim() || replyMutation.isPending}
                  onClick={() => replyMutation.mutate({ message: replyText, isInternal })}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
                >
                  <Send className="h-4 w-4" />
                  {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Query Details</h3>
            <dl className="space-y-2 text-sm">
              {[
                { label: 'Type', value: query.type },
                { label: 'Priority', value: query.priority },
                { label: 'Status', value: query.status },
                { label: 'Due Date', value: query.dueDate ? new Date(query.dueDate).toLocaleDateString() : '—' },
                { label: 'Replies', value: String(replies.length) },
                { label: 'Resolved', value: query.resolvedAt ? new Date(query.resolvedAt).toLocaleDateString() : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
