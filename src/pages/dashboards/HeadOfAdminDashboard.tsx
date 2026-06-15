/**
 * Head of Admin Dashboard
 * Staff overview, approvals, KPIs, and reports
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import {
  StatCard,
  MultiBarChart,
} from '@components/charts/ChartComponents';
import { Loader } from '@components/ui/loader';

// Mock data
const departmentKPIs = [
  { department: 'Engineering', target: 95, actual: 92, variance: -3 },
  { department: 'Sales', target: 90, actual: 88, variance: -2 },
  { department: 'HR', target: 98, actual: 97, variance: -1 },
  { department: 'Finance', target: 96, actual: 95, variance: -1 },
  { department: 'Operations', target: 92, actual: 91, variance: -1 },
];

const leaveData = [
  { name: 'Pending', value: 12, color: 'bg-yellow-100' },
  { name: 'Approved', value: 45, color: 'bg-green-100' },
  { name: 'Rejected', value: 3, color: 'bg-red-100' },
];

const attendanceByDept = [
  { name: 'Engineering', present: 48, absent: 2, late: 3 },
  { name: 'Sales', present: 35, absent: 1, late: 2 },
  { name: 'HR', present: 12, absent: 0, late: 1 },
  { name: 'Finance', present: 22, absent: 1, late: 1 },
  { name: 'Operations', present: 25, absent: 2, late: 2 },
];

const projectProgress = [
  { project: 'Website Redesign', status: 'In Progress', progress: 75 },
  { project: 'Mobile App', status: 'In Progress', progress: 60 },
  { project: 'CRM System', status: 'In Progress', progress: 85 },
  { project: 'Analytics Platform', status: 'In Progress', progress: 50 },
];

const staffList = [
  { id: 1, name: 'John Anderson', dept: 'Engineering', status: 'Active', joining: '2023-01-15' },
  { id: 2, name: 'Sarah Williams', dept: 'Sales', status: 'Active', joining: '2023-03-20' },
  { id: 3, name: 'Mike Johnson', dept: 'HR', status: 'On Leave', joining: '2022-11-10' },
  { id: 4, name: 'Emily Brown', dept: 'Finance', status: 'Active', joining: '2023-02-01' },
  { id: 5, name: 'David Lee', dept: 'Operations', status: 'Active', joining: '2023-04-15' },
];

const internalComms = [
  { title: 'New HR Policy', author: 'HR Team', date: '2 hours ago', unread: true },
  { title: 'Q2 Results Overview', author: 'Management', date: '5 hours ago', unread: true },
  { title: 'Team Outing Scheduled', author: 'Events', date: '1 day ago', unread: false },
  { title: 'Updated Expense Policy', author: 'Finance', date: '2 days ago', unread: false },
];

interface LeaveApproval {
  id: number;
  employee: string;
  type: string;
  startDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
}

const pendingApprovals: LeaveApproval[] = [
  { id: 1, employee: 'Priya Sharma', type: 'Annual Leave', startDate: '2024-06-20', days: 5, status: 'pending' },
  { id: 2, employee: 'Raj Kumar', type: 'Sick Leave', startDate: '2024-06-18', days: 2, status: 'pending' },
  { id: 3, employee: 'Anita Singh', type: 'Maternity Leave', startDate: '2024-07-01', days: 90, status: 'pending' },
];

export function HeadOfAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [approvals, setApprovals] = useState<LeaveApproval[]>(pendingApprovals);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleApproveLeave = (id: number) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === id ? { ...approval, status: 'approved' } : approval
      )
    );
  };

  const handleRejectLeave = (id: number) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === id ? { ...approval, status: 'rejected' } : approval
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Head of Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Staff oversight and operational management</p>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Staff"
          value="142"
          icon={<Users className="w-8 h-8" />}
          trend={{ value: 8, positive: true }}
          color="blue"
        />
        <StatCard
          label="Pending Approvals"
          value={pendingCount}
          icon={<AlertCircle className="w-8 h-8" />}
          color="yellow"
        />
        <StatCard
          label="Avg Attendance"
          value="97.1%"
          icon={<CheckCircle2 className="w-8 h-8" />}
          trend={{ value: 3, positive: true }}
          color="green"
        />
        <StatCard
          label="Active Projects"
          value="8"
          icon={<TrendingUp className="w-8 h-8" />}
          color="purple"
        />
      </motion.div>

      {/* Leave Approvals Section */}
      <motion.div variants={itemVariants} className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          Leave Approvals ({pendingCount} Pending)
        </h2>
        <div className="space-y-3">
          {approvals.map((approval) => (
            <motion.div
              key={approval.id}
              layout
              className={`flex items-center justify-between p-4 rounded-lg border ${
                approval.status === 'pending'
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
                  : approval.status === 'approved'
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
              }`}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{approval.employee}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {approval.type} • {approval.days} days • Starting {approval.startDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {approval.status === 'pending' ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApproveLeave(approval.id)}
                      className="px-3 py-1 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRejectLeave(approval.id)}
                      className="px-3 py-1 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </motion.button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      approval.status === 'approved'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {approval.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Attendance & Department KPIs */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance by Department */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Attendance by Department</h2>
          <MultiBarChart
            data={attendanceByDept}
            dataKeys={['present', 'absent', 'late']}
            height={280}
            colors={['#10b981', '#ef4444', '#f59e0b']}
          />
        </motion.div>

        {/* Department KPIs */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Department Performance</h2>
          <div className="space-y-4">
            {departmentKPIs.map((dept) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <span className={`text-xs font-semibold ${dept.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dept.actual}% (Target: {dept.target}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.actual / dept.target) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Project Status & Staff Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Project Status</h2>
          <div className="space-y-4">
            {projectProgress.map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{project.project}</span>
                  <span className="text-xs font-medium text-primary">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: 0.1 * i }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Staff Overview */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Staff Overview</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {staffList.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.dept}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      staff.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Leave Summary & Communications */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Leave Summary</h2>
          <div className="space-y-4">
            {leaveData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-2xl font-bold">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-xs text-muted-foreground">Monthly Quota Utilization</p>
            <p className="text-lg font-bold mt-1">45/100 leaves</p>
          </div>
        </motion.div>

        {/* Internal Communications */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Internal Communications
          </h2>
          <div className="space-y-3">
            {internalComms.map((comm, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  comm.unread
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                    : 'bg-muted/50 border-border/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm font-medium ${comm.unread ? 'font-bold' : ''}`}>{comm.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{comm.author}</p>
                  </div>
                  {comm.unread && <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{comm.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default HeadOfAdminDashboard;
