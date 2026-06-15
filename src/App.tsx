import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@layouts/AuthLayout';
import DashboardLayout from '@layouts/DashboardLayout';
import { PrivateRoute, PublicRoute } from '@routes/PrivateRoute';
import { Toaster } from '@components/ui/toaster';

// ─── Auth Pages ───
const LoginPage = React.lazy(() => import('@modules/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@modules/auth/pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@modules/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('@modules/auth/pages/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('@modules/auth/pages/VerifyEmailPage'));
const Setup2FAPage = React.lazy(() => import('@modules/auth/pages/Setup2FAPage'));

// ─── Dashboard ───
const Dashboard = React.lazy(() => import('@pages/Dashboard'));

// ─── Staff ───
const StaffList = React.lazy(() => import('@modules/staff/pages/StaffList'));
const StaffForm = React.lazy(() => import('@modules/staff/pages/StaffForm'));
const StaffDetail = React.lazy(() => import('@modules/staff/pages/StaffDetail'));

// ─── Attendance ───
const AttendanceList = React.lazy(() => import('@modules/attendance/pages/AttendanceList'));
const CheckIn = React.lazy(() => import('@modules/attendance/pages/CheckIn'));

// ─── Projects ───
const ProjectList = React.lazy(() => import('@modules/projects/pages/ProjectList'));
const ProjectForm = React.lazy(() => import('@modules/projects/pages/ProjectForm'));
const ProjectDetail = React.lazy(() => import('@modules/projects/pages/ProjectDetail'));

// ─── Tasks ───
const TaskList = React.lazy(() => import('@modules/tasks/pages/TaskList'));
const TaskForm = React.lazy(() => import('@modules/tasks/pages/TaskForm'));
const TaskDetail = React.lazy(() => import('@modules/tasks/pages/TaskDetail'));

// ─── Leave ───
const LeaveForm = React.lazy(() => import('@modules/leave/pages/LeaveForm'));
const LeaveRequests = React.lazy(() => import('@modules/leave/pages/LeaveRequests'));
const LeaveBalance = React.lazy(() => import('@modules/leave/pages/LeaveBalance'));

// ─── Queries ───
const QueryList = React.lazy(() => import('@modules/queries/pages/QueryList'));
const QueryForm = React.lazy(() => import('@modules/queries/pages/QueryForm'));
const QueryDetail = React.lazy(() => import('@modules/queries/pages/QueryDetail'));

// ─── Clients ───
const ClientList = React.lazy(() => import('@modules/clients/pages/ClientList'));
const ClientForm = React.lazy(() => import('@modules/clients/pages/ClientForm'));
const ClientProfile = React.lazy(() => import('@modules/clients/pages/ClientProfile'));

// ─── Communication ───
const SendMessage = React.lazy(() => import('@modules/communication/pages/SendMessage'));
const MessageTemplates = React.lazy(() => import('@modules/communication/pages/MessageTemplates'));
const CommunicationHistory = React.lazy(() => import('@modules/communication/pages/CommunicationHistory'));

// ─── LMS ───
const CourseList = React.lazy(() => import('@modules/lms/pages/CourseList'));
const CourseDetail = React.lazy(() => import('@modules/lms/pages/CourseDetail'));
const MyEnrollments = React.lazy(() => import('@modules/lms/pages/MyEnrollments'));
const ExamList = React.lazy(() => import('@modules/lms/pages/ExamList'));
const CertificateList = React.lazy(() => import('@modules/lms/pages/CertificateList'));

// ─── Settings ───
const ProfileSettings = React.lazy(() => import('@pages/Settings/ProfileSettings'));
const SecuritySettings = React.lazy(() => import('@pages/Settings/SecuritySettings'));
const NotificationSettings = React.lazy(() => import('@pages/Settings/NotificationSettings'));

// ─── Not Found ───
const NotFound = React.lazy(() => import('@pages/NotFound'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            {/* LoginPage is full-page, no AuthLayout wrapper */}
            <Route path="/auth/login" element={<LoginPage />} />
            {/* Other auth pages use the centered AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
              <Route path="/auth/setup-2fa" element={<Setup2FAPage />} />
            </Route>
          </Route>

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Staff Management */}
              <Route path="/staff" element={<StaffList />} />
              <Route path="/staff/create" element={<StaffForm />} />
              <Route path="/staff/:id/edit" element={<StaffForm />} />
              <Route path="/staff/:id" element={<StaffDetail />} />

              {/* Attendance */}
              <Route path="/attendance" element={<AttendanceList />} />
              <Route path="/attendance/check-in" element={<CheckIn />} />

              {/* Projects */}
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/create" element={<ProjectForm />} />
              <Route path="/projects/:id/edit" element={<ProjectForm />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />

              {/* Tasks */}
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/create" element={<TaskForm />} />
              <Route path="/tasks/:id/edit" element={<TaskForm />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />

              {/* Leave */}
              <Route path="/leave/apply" element={<LeaveForm />} />
              <Route path="/leave/requests" element={<LeaveRequests />} />
              <Route path="/leave/balance" element={<LeaveBalance />} />

              {/* Queries */}
              <Route path="/queries" element={<QueryList />} />
              <Route path="/queries/create" element={<QueryForm />} />
              <Route path="/queries/:id/edit" element={<QueryForm />} />
              <Route path="/queries/:id" element={<QueryDetail />} />

              {/* Clients */}
              <Route path="/clients" element={<ClientList />} />
              <Route path="/clients/create" element={<ClientForm />} />
              <Route path="/clients/:id/edit" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientProfile />} />

              {/* Communication */}
              <Route path="/communication/send" element={<SendMessage />} />
              <Route path="/communication/templates" element={<MessageTemplates />} />
              <Route path="/communication/history" element={<CommunicationHistory />} />

              {/* LMS */}
              <Route path="/lms/courses" element={<CourseList />} />
              <Route path="/lms/courses/:id" element={<CourseDetail />} />
              <Route path="/lms/my-enrollments" element={<MyEnrollments />} />
              <Route path="/lms/exams" element={<ExamList />} />
              <Route path="/lms/certificates" element={<CertificateList />} />

              {/* Settings */}
              <Route path="/settings/profile" element={<ProfileSettings />} />
              <Route path="/settings/security" element={<SecuritySettings />} />
              <Route path="/settings/notifications" element={<NotificationSettings />} />
            </Route>
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster />
    </>
  );
}

export default App;
