import React, { Suspense } from 'react';
import { useAuthStore } from '@store/authStore';
import { Loader } from '@components/ui/loader';

const SuperAdminDashboard = React.lazy(() => import('./dashboards/SuperAdminDashboard'));
const HeadOfAdminDashboard = React.lazy(() => import('./dashboards/HeadOfAdminDashboard'));
const ManagerDashboard = React.lazy(() => import('./dashboards/ManagerDashboard'));
const TeacherDashboard = React.lazy(() => import('./dashboards/TeacherDashboard'));
const StudentDashboard = React.lazy(() => import('./dashboards/StudentDashboard'));
const StaffDashboard = React.lazy(() => import('./dashboards/StaffDashboard'));

const ROLE_PRIORITY = [
  'SUPER_ADMIN',
  'ADMIN',
  'DEPARTMENT_HEAD',
  'HR_MANAGER',
  'FINANCE_MANAGER',
  'WAREHOUSE_MANAGER',
  'TEACHER',
  'STUDENT',
  'STAFF',
] as const;

function resolveDashboard(roles: string[]): React.ComponentType {
  const roleSet = new Set(roles);

  if (roleSet.has('SUPER_ADMIN')) return SuperAdminDashboard;
  if (roleSet.has('ADMIN')) return HeadOfAdminDashboard;
  if (roleSet.has('DEPARTMENT_HEAD')) return HeadOfAdminDashboard;
  if (roleSet.has('HR_MANAGER') || roleSet.has('FINANCE_MANAGER') || roleSet.has('WAREHOUSE_MANAGER')) {
    return ManagerDashboard;
  }
  if (roleSet.has('TEACHER')) return TeacherDashboard;
  if (roleSet.has('STUDENT')) return StudentDashboard;
  return StaffDashboard;
}

export function Dashboard() {
  const { user } = useAuthStore();
  const DashboardComponent = resolveDashboard(user?.roles ?? []);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    }>
      <DashboardComponent />
    </Suspense>
  );
}

export default Dashboard;
