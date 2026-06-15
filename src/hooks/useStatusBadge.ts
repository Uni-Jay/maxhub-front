const STATUS_COLORS: Record<string, string> = {
  // generic
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  withdrawn: 'bg-gray-100 text-gray-800',
  // projects
  planning: 'bg-blue-100 text-blue-800',
  onhold: 'bg-yellow-100 text-yellow-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-200 text-gray-700',
  // tasks
  todo: 'bg-gray-100 text-gray-800',
  inprogress: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  inreview: 'bg-purple-100 text-purple-800',
  blocked: 'bg-red-100 text-red-800',
  done: 'bg-green-100 text-green-800',
  // attendance
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  halfday: 'bg-blue-100 text-blue-800',
  'half-day': 'bg-blue-100 text-blue-800',
  wfh: 'bg-cyan-100 text-cyan-800',
  holiday: 'bg-purple-100 text-purple-800',
  onleave: 'bg-orange-100 text-orange-800',
  // staff
  suspended: 'bg-red-100 text-red-800',
  resigned: 'bg-gray-200 text-gray-700',
  retired: 'bg-gray-100 text-gray-600',
  // priority
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export function useStatusBadge() {
  const getBadgeClass = (status: string) =>
    STATUS_COLORS[status.toLowerCase()] ?? 'bg-gray-100 text-gray-800';

  const formatLabel = (status: string) =>
    status.replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').trim();

  return { getBadgeClass, formatLabel };
}
