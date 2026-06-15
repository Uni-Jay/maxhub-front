/**
 * AUTHENTICATION INTEGRATION GUIDE
 * 
 * This document explains how all the authentication components work together
 * and how to integrate them into your React app.
 */

# Authentication Integration Guide

## Overview

The authentication system consists of several interconnected components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Application                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             AuthProvider (Context)                  │  │
│  │  Wraps entire app and provides auth state/methods   │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           useAuth Hook (Context Consumer)           │  │
│  │  Used in any component to access auth                │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Route Protection Components                  │  │
│  │  ProtectedRoute, RoleProtectedRoute,               │  │
│  │  PermissionGuard, etc.                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│              Auth API Service (auth.api.ts)                │
│  Handles all authentication API calls                      │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│           Axios Interceptors (axiosInterceptors.ts)       │
│  - Token injection                                        │
│  - Token refresh on 401                                  │
│  - Error formatting                                      │
│  - Rate limit handling                                   │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│           Token Storage (tokenStorage.ts)                 │
│  - localStorage management                               │
│  - Token expiration tracking                             │
│  - Auto-refresh scheduling                               │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend API                                    │
│  /api/auth/login, /api/auth/refresh-token, etc.          │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup Steps

### Step 1: Update main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { apiClient } from '@/services/apiClient';
import { setupAxiosInterceptors } from '@/services/axiosInterceptors';
import App from './App';
import './index.css';

// Setup Axios interceptors (do this before rendering app)
setupAxiosInterceptors(apiClient);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
```

### Step 2: Update App.tsx

```typescript
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from '@/components/RouteGuards';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  // Auth is initialized by AuthProvider
  // useAuth can be called in child components
  
  return (
    <>
      <Routes>
        {/* Public auth routes - only accessible when not authenticated */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Protected routes - only accessible when authenticated */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Root redirects to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
```

### Step 3: Use Auth in Components

```typescript
// src/components/Header.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <div>Welcome, {user?.firstName}!</div>
      <Button onClick={logout}>Logout</Button>
    </header>
  );
}
```

### Step 4: Use Permission Guards

```typescript
import { PermissionGuard } from '@/components/RouteGuards';

export function AdminPanel() {
  return (
    <PermissionGuard
      permission="ORG_STAFF_CREATE"
      fallback={<p>You don't have permission to create staff</p>}
    >
      <div>Admin panel content</div>
    </PermissionGuard>
  );
}
```

---

## API Methods

All API methods are available through the `useAuth()` hook:

### Authentication

```typescript
const { login, register, logout } = useAuth();

// Login
await login('user@example.com', 'password');

// Register
await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'secure-password',
});

// Logout
await logout();
```

### Password Management

```typescript
const { changePassword, forgotPassword, resetPassword } = useAuth();

// Change password
await changePassword('current-password', 'new-password');

// Request password reset
await forgotPassword('user@example.com');

// Complete password reset (with token from email)
await resetPassword('reset-token-from-email', 'new-password');
```

### OTP & 2FA

```typescript
const { verifyOTP, setup2FA, verify2FASetup, disable2FA } = useAuth();

// Verify OTP
await verifyOTP('123456');

// Setup 2FA
const { qrCode, secret } = await setup2FA('TOTP');

// Verify 2FA setup
const { backupCodes } = await verify2FASetup('123456');

// Disable 2FA
await disable2FA('your-password');
```

### Profile Management

```typescript
const { updateProfile } = useAuth();

await updateProfile({
  firstName: 'Jane',
  phone: '+1234567890',
});
```

### Token Management

```typescript
const { refreshAccessToken } = useAuth();

// Manually refresh token (usually handled automatically)
await refreshAccessToken();
```

---

## Permission System

### Permission Checking

```typescript
const { hasPermission, hasAllPermissions, hasAnyPermission } = useAuth();

// Check single permission
if (hasPermission('ORG_STAFF_CREATE')) {
  // User can create staff
}

// Check if user has ALL permissions
if (hasAllPermissions(['ORG_STAFF_READ', 'ORG_STAFF_UPDATE'])) {
  // User can read and update staff
}

// Check if user has ANY permission
if (hasAnyPermission(['ORG_STAFF_CREATE', 'ORG_STAFF_ADMIN'])) {
  // User can create staff or is a staff admin
}
```

### Available Permission Codes

```typescript
// Staff Management
'ORG_STAFF_READ'
'ORG_STAFF_CREATE'
'ORG_STAFF_UPDATE'
'ORG_STAFF_DELETE'
'ORG_STAFF_ADMIN'

// Attendance
'ORG_ATTENDANCE_READ'
'ORG_ATTENDANCE_CREATE'
'ORG_ATTENDANCE_UPDATE'
'ORG_ATTENDANCE_DELETE'

// Leave
'ORG_LEAVE_REQUEST'
'ORG_LEAVE_APPROVE'
'ORG_LEAVE_ADMIN'

// Settings
'ORG_SETTINGS_SYSTEM_READ'
'ORG_SETTINGS_SYSTEM_UPDATE'
'ORG_SETTINGS_EMAIL_READ'
'ORG_SETTINGS_EMAIL_UPDATE'

// ... and more
```

---

## Token Storage

Tokens are stored in localStorage using the token storage utilities:

```typescript
import { TokenStorage, SessionStorage, DeviceStorage } from '@/services/tokenStorage';

// Get tokens
const tokens = TokenStorage.getTokens();
const accessToken = TokenStorage.getAccessToken();

// Check if token is valid
const isValid = TokenStorage.hasValidAccessToken();

// Get expiration time
const expiresAt = TokenStorage.getTokenExpiration(accessToken);
const timeLeft = TokenStorage.getTimeUntilExpiration();

// Decode token (without verification)
const payload = TokenStorage.decodeToken(accessToken);

// Get current user from token
const user = TokenStorage.getCurrentUserFromToken();
```

---

## Error Handling

Errors from auth operations include detailed information:

```typescript
const { login, error } = useAuth();

try {
  await login('user@example.com', 'wrong-password');
} catch (error: any) {
  console.log(error.statusCode); // 401
  console.log(error.code); // 'AUTH_INVALID_CREDENTIALS'
  console.log(error.message); // 'Invalid email or password'
  console.log(error.details); // Field-level errors
}
```

---

## Rate Limiting

The system automatically handles rate limiting:

```typescript
// 429 responses are automatically handled with retry logic
// The client will retry with exponential backoff

// To check rate limit status:
import { getRateLimitInfo } from '@/services/axiosInterceptors';

try {
  await someApiCall();
} catch (error: any) {
  const rateLimitInfo = getRateLimitInfo(error);
  if (rateLimitInfo) {
    console.log(`Rate limited. Retry after ${rateLimitInfo.retryAfter}s`);
  }
}
```

---

## Logout & Cleanup

Logout automatically:
- Clears tokens from localStorage
- Clears user state
- Calls backend logout endpoint
- Redirects to login page

```typescript
const { logout } = useAuth();

await logout();
// User is now logged out and redirected to /auth/login
```

---

## Session Persistence

Sessions persist across browser closes because tokens are stored in localStorage:

1. User logs in
2. Tokens are stored in localStorage
3. Browser closes
4. Browser reopens
5. App loads
6. AuthProvider reads tokens from localStorage
7. User is still logged in

The auth state is automatically restored on app load.

---

## Debugging

### Enable Debug Logging

Set `NODE_ENV=development` and check browser console for:
- Request logging (URL, method, request ID)
- Response logging (status, request ID)
- Error logging (status, code, message)
- Token refresh attempts
- Rate limit events

### Check Stored Tokens

```javascript
// In browser console
localStorage.getItem('auth_tokens');
localStorage.getItem('session_id');
localStorage.getItem('device_id');
```

### Check Token Payload

```javascript
// In browser console
import { TokenStorage } from '@/services/tokenStorage';
TokenStorage.getCurrentUserFromToken();
```

---

## Common Issues

### Issue: "useAuth must be used within an AuthProvider"

**Solution**: Make sure `<AuthProvider>` wraps your entire app in `main.tsx`

### Issue: Tokens not refreshing automatically

**Solution**: Make sure `setupAxiosInterceptors()` is called in `main.tsx` before rendering

### Issue: User still logged in after logout

**Solution**: Check that logout is being called correctly and localStorage is being cleared:
```typescript
const { logout } = useAuth();
await logout();
```

### Issue: Redirect loop between login and dashboard

**Solution**: Check that `isInitialized` is true in AuthProvider before rendering routes

---

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth context provider
├── services/
│   ├── auth.api.ts              # Auth API calls
│   ├── apiClient.ts             # Axios instance
│   ├── axiosInterceptors.ts     # Interceptor setup
│   └── tokenStorage.ts          # Token management
├── components/
│   └── RouteGuards.tsx          # Route protection components
├── pages/
│   └── LoginPage.tsx            # Login page
└── layouts/
    ├── AuthLayout.tsx           # Auth pages layout
    └── DashboardLayout.tsx      # Protected pages layout
```

---

## Testing

### Test Login Flow

```typescript
// components/__tests__/LoginPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';

test('login with valid credentials', async () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'user@example.com' },
  });

  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'password' },
  });

  fireEvent.click(screen.getByText('Sign In'));

  // Wait for redirect
  // Assert user is logged in
});
```

---

## Next Steps

1. ✅ Setup main.tsx with AuthProvider and interceptors
2. ✅ Import and use useAuth hook in components
3. ✅ Protect routes with ProtectedRoute component
4. ✅ Add permission guards with PermissionGuard component
5. ✅ Test login/logout flow
6. ✅ Configure backend API URL in .env
7. ✅ Deploy to production

---

**Version**: 2.0  
**Last Updated**: 2026-06-12  
**Status**: Complete & Ready for Use
