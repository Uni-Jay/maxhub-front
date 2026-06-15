/**
 * Super Admin Dashboard
 * Complete organization overview with 10 key widgets
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Calendar,
  Bell,
  RefreshCw,
  Briefcase,
} from 'lucide-react';
import {
  StatCard,
  SimpleBarChart,
  MultiBarChart,
  SimplePieChart,
} from '@components/charts/ChartComponents';
import { Loader } from '@components/ui/loader';

// Mock data for demonstration
const attendanceData = [
  { name: 'Mon', value: 245, present: 240, absent: 5 },
  { name: 'Tue', value: 248, present: 243, absent: 5 },
  { name: 'Wed', value: 242, present: 238, absent: 4 },
  { name: 'Thu', value: 250, present: 248, absent: 2 },
  { name: 'Fri', value: 240, present: 235, absent: 5 },
];

const revenueData = [
  { name: 'Jan', value: 45000, target: 50000 },
  { name: 'Feb', value: 52000, target: 50000 },
  { name: 'Mar', value: 48000, target: 50000 },
  { name: 'Apr', value: 61000, target: 55000 },
  { name: 'May', value: 55000, target: 55000 },
  { name: 'Jun', value: 67000, target: 60000 },
];

const payrollData = [
  { name: 'Salaries', value: 180000 },
  { name: 'Bonus', value: 35000 },
  { name: 'Benefits', value: 28000 },
  { name: 'Deductions', value: 12000 },
];

const departmentDistribution = [
  { name: 'Engineering', value: 65 },
  { name: 'Sales', value: 42 },
  { name: 'HR', value: 15 },
  { name: 'Finance', value: 28 },
  { name: 'Operations', value: 35 },
];

const studentAnalytics = [
  { name: 'Enrolled', value: 1250 },
  { name: 'Active', value: 1100 },
  { name: 'Completed', value: 450 },
  { name: 'Dropped', value: 50 },
];

const projectStatus = [
  { name: 'Active Projects', value: 18 },
  { name: 'Completed', value: 45 },
  { name: 'On Hold', value: 3 },
  { name: 'Delayed', value: 2 },
];

const crmMetrics = [
  { name: 'Leads', value: 324 },
  { name: 'Opportunities', value: 87 },
  { name: 'Converted', value: 23 },
  { name: 'Lost', value: 12 },
];

export function SuperAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
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

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Complete organization overview</p>
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
          label="Total Employees"
          value="185"
          icon={<Users className="w-8 h-8" />}
          trend={{ value: 12, positive: true }}
          color="blue"
        />
        <StatCard
          label="Total Departments"
          value="12"
          icon={<Building2 className="w-8 h-8" />}
          trend={{ value: 2, positive: false }}
          color="green"
        />
        <StatCard
          label="Attendance Rate"
          value="97.2%"
          icon={<Calendar className="w-8 h-8" />}
          trend={{ value: 5, positive: true }}
          color="purple"
        />
        <StatCard
          label="Active Projects"
          value="18"
          icon={<Briefcase className="w-8 h-8" />}
          trend={{ value: 8, positive: true }}
          color="yellow"
        />
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Revenue Analytics</h2>
          <SimpleBarChart
            data={revenueData}
            dataKey="value"
            height={250}
            color="#3b82f6"
          />
        </motion.div>

        {/* Payroll Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Payroll Summary (June)</h2>
          <SimplePieChart
            data={payrollData}
            dataKey="value"
            height={250}
          />
        </motion.div>
      </motion.div>

      {/* Attendance & Department Distribution */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Weekly Attendance</h2>
          <MultiBarChart
            data={attendanceData}
            dataKeys={['present', 'absent']}
            height={250}
            colors={['#10b981', '#ef4444']}
          />
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Staff by Department</h2>
          <SimplePieChart
            data={departmentDistribution}
            dataKey="value"
            height={250}
          />
        </motion.div>
      </motion.div>

      {/* Student Analytics & Project Status */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Analytics */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Student Analytics</h2>
          <MultiBarChart
            data={studentAnalytics}
            dataKeys={['value']}
            height={250}
            colors={['#8b5cf6']}
          />
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">1.2K</p>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">1.1K</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">450</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">50</p>
              <p className="text-xs text-muted-foreground">Dropped</p>
            </div>
          </div>
        </motion.div>

        {/* Project Status */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Project Status</h2>
          <MultiBarChart
            data={projectStatus}
            dataKeys={['value']}
            height={250}
            colors={['#ef4444']}
          />
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active (18)</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">On Hold (3)</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Delayed (2)</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* CRM Overview & Recent Activity */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CRM Overview */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">CRM Overview</h2>
          <div className="space-y-4">
            {crmMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.name}</span>
                <span className="text-2xl font-bold text-primary">{metric.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">Conversion Rate</p>
            <p className="text-3xl font-bold mt-2">26.4%</p>
          </div>
        </motion.div>

        {/* Notifications & Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-lg p-6 border border-border"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Notifications
          </h2>
          <div className="space-y-3">
            {[
              { title: 'Payroll Processing', desc: 'Monthly payroll ready for approval', time: '2 hours ago' },
              { title: 'Leave Request', desc: '5 new leave requests pending approval', time: '4 hours ago' },
              { title: 'Project Milestone', desc: 'Website Redesign reached 80% completion', time: '6 hours ago' },
              { title: 'Attendance Alert', desc: '3 employees marked absent today', time: '8 hours ago' },
            ].map((notif, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.desc}</p>
                <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Calendar Widget */}
      <motion.div
        variants={itemVariants}
        className="bg-card rounded-lg p-6 border border-border"
      >
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {[
            { event: 'Board Meeting', date: 'Jun 15, 2024', time: '2:00 PM' },
            { event: 'Project Kickoff', date: 'Jun 17, 2024', time: '10:00 AM' },
            { event: 'Team Building', date: 'Jun 22, 2024', time: '4:00 PM' },
            { event: 'Quarterly Review', date: 'Jun 28, 2024', time: '9:00 AM' },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
              <div>
                <p className="text-sm font-medium">{item.event}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
              </div>
              <span className="text-xs font-medium text-primary">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SuperAdminDashboard;
