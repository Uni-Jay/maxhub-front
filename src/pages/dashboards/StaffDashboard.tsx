import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, Calendar, CheckSquare, FileText, ArrowUpRight,
  MapPin, CheckCircle2, TrendingUp, Send,
} from 'lucide-react';
import { Loader } from '@components/ui/loader';
import { useAuthStore } from '@store/authStore';

const myTasks = [
  { id: 1, title: 'Prepare monthly report', project: 'Admin', due: '2026-06-18', status: 'InProgress' },
  { id: 2, title: 'Review client proposals', project: 'Sales', due: '2026-06-20', status: 'Todo' },
  { id: 3, title: 'Update staff database', project: 'HR', due: '2026-06-22', status: 'InProgress' },
  { id: 4, title: 'Team coordination call', project: 'Operations', due: '2026-06-17', status: 'Done' },
];

const leaveBalance = [
  { type: 'Annual Leave', total: 20, used: 8, color: 'bg-indigo-500' },
  { type: 'Sick Leave', total: 10, used: 2, color: 'bg-emerald-500' },
  { type: 'Emergency Leave', total: 3, used: 0, color: 'bg-amber-500' },
];

const TASK_STATUS: Record<string, string> = {
  Todo: 'bg-gray-100 text-gray-600',
  InProgress: 'bg-indigo-100 text-indigo-700',
  Done: 'bg-emerald-100 text-emerald-700',
  Blocked: 'bg-red-100 text-red-700',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function StaffDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size="lg" />
    </div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const pendingTasks = myTasks.filter((t) => t.status !== 'Done').length;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{greeting},</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            {user?.firstName ?? 'Team member'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Today</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </motion.div>

      {/* Check-in card */}
      <motion.div variants={item}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white"
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -right-4 top-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-200">Attendance</p>
            <p className="text-2xl font-bold mt-1">
              {checkedIn ? (checkInTime ? `Checked in at ${checkInTime}` : 'Checked In') : 'Not yet checked in'}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-indigo-200">
              <MapPin className="w-3.5 h-3.5" />
              Main Office, Lagos
            </div>
          </div>
          <Link to="/attendance/check-in">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!checkedIn) {
                  setCheckedIn(true);
                  setCheckInTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                }
              }}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition ${
                checkedIn
                  ? 'bg-white/20 text-white cursor-default'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {checkedIn ? <CheckCircle2 className="w-5 h-5" /> : 'Check In'}
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Tasks', value: myTasks.length.toString(), icon: CheckSquare, color: 'text-indigo-600 bg-indigo-50', href: '/tasks' },
          { label: 'Pending', value: pendingTasks.toString(), icon: Clock, color: 'text-amber-600 bg-amber-50', href: '/tasks' },
          { label: 'Leave Balance', value: '12d', icon: Calendar, color: 'text-emerald-600 bg-emerald-50', href: '/leave/balance' },
          { label: 'Performance', value: '94%', icon: TrendingUp, color: 'text-violet-600 bg-violet-50', href: '/reports/attendance' },
        ].map((s) => (
          <Link key={s.label} to={s.href}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              My Tasks
            </h2>
            <Link to="/tasks" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {myTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.project} • Due {t.due}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${TASK_STATUS[t.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leave Balance */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-500" />
              Leave Balance
            </h2>
            <Link to="/leave/apply" className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
              Apply
            </Link>
          </div>
          <div className="space-y-4">
            {leaveBalance.map((l) => {
              const remaining = l.total - l.used;
              const pct = Math.round((remaining / l.total) * 100);
              return (
                <div key={l.type}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400">{l.type}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{remaining}/{l.total} days</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-2 rounded-full ${l.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/leave/balance" className="mt-5 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700">
            Full balance details <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Check In', href: '/attendance/check-in', icon: Clock, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Apply Leave', href: '/leave/apply', icon: Calendar, color: 'text-violet-600 bg-violet-50' },
          { label: 'My Tasks', href: '/tasks', icon: CheckSquare, color: 'text-amber-600 bg-amber-50' },
          { label: 'Queries', href: '/queries', icon: Send, color: 'text-emerald-600 bg-emerald-50' },
        ].map((q) => (
          <Link key={q.href} to={q.href} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${q.color}`}>
              <q.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{q.label}</span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default StaffDashboard;
