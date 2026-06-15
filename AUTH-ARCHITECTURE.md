# Complete Authentication Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         React Application                              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      App.tsx (Updated)                          │  │
│  │                  Routing with ProtectedRoute                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│              ↓                                  ↓                       │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐│
│  │   PublicRoute (Login Page)        │  │ ProtectedRoute (Dashboard)   ││
│  │                                  │  │ + RoleProtectedRoute (Admin) ││
│  │  LoginPage.tsx                   │  │ + PermissionGuard (Features) ││
│  │  ├─ Email/Password form          │  │                              ││
│  │  ├─ Remember me checkbox         │  │ Components using useAuth()  ││
│  │  ├─ Error handling               │  │ ├─ Header (user info)       ││
│  │  └─ Links to forgot/register     │  │ ├─ Sidebar (permission nav) ││
│  │                                  │  │ ├─ Staff management         ││
│  │                                  │  │ ├─ Profile settings         ││
│  │                                  │  │ └─ ... other features       ││
│  └──────────────────────────────────┘  └──────────────────────────────┘│
│              ↓                                  ↓                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │              useAuth() Hook (AuthContext)                        │ │
│  │  State: user, tokens, isAuthenticated, isLoading, error         │ │
│  │  Methods: login, logout, changePassword, verifyOTP, etc.        │ │
│  │  Permissions: hasPermission, hasRole, hasAnyPermission, etc.    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│              ↓                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │           AuthProvider (auth.tsx Context)                       │ │
│  │  Wraps entire app, manages auth state and provides methods      │ │
│  │  Integrates with Zustand store (useAuthStore)                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      API Service Layer                                  │
│                                                                         │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐│
│  │   auth.api.ts                    │  │   apiClient.ts               ││
│  │   ├─ login()                     │  │   ├─ get()                   ││
│  │   ├─ register()                  │  │   ├─ post()                  ││
│  │   ├─ logout()                    │  │   ├─ patch()                 ││
│  │   ├─ refreshToken()              │  │   ├─ delete()                ││
│  │   ├─ forgotPassword()            │  │   └─ Full axios instance     ││
│  │   ├─ resetPassword()             │  │                              ││
│  │   ├─ changePassword()            │  │   (Already exists)           ││
│  │   ├─ verifyOTP()                 │  │                              ││
│  │   ├─ setup2FA()                  │  │                              ││
│  │   └─ ... 10+ methods             │  │                              ││
│  └──────────────────────────────────┘  └──────────────────────────────┘│
│              ↓                                  ↓                       │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │        Axios Interceptors (axiosInterceptors.ts)               │ │
│  │  Request:  Inject Authorization header with JWT token           │ │
│  │  Response: Handle 401 → automatic token refresh → retry          │ │
│  │  Error:    Format error response, handle rate limiting          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│              ↓                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │       Token Storage (tokenStorage.ts)                           │ │
│  │  ├─ TokenStorage (localStorage management)                     │ │
│  │  ├─ SessionStorage (session ID management)                     │ │
│  │  ├─ DeviceStorage (device ID tracking)                         │ │
│  │  └─ TokenRefreshHelper (auto-refresh scheduling)               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    Browser localStorage                                 │
│                                                                         │
│  auth_tokens:                                                          │
│  {                                                                     │
│    "accessToken": "eyJhbGc...",                                       │
│    "refreshToken": "eyJhbGc...",                                      │
│    "expiresAt": 1715510400000                                         │
│  }                                                                     │
│                                                                         │
│  session_id: "sid_123..."                                             │
│  device_id: "device_..."                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      Backend API                                        │
│                                                                         │
│  POST /api/auth/login          → { user, accessToken, refreshToken }  │
│  POST /api/auth/logout         → success                              │
│  POST /api/auth/refresh-token  → { accessToken }                      │
│  POST /api/auth/forgot-password → success                             │
│  POST /api/auth/reset-password → success                              │
│  ... more endpoints                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
frontend/
├── src/
│   ├── main.tsx                           (UPDATE required)
│   │   └─ Add: AuthProvider, setupAxiosInterceptors
│   │
│   ├── App.tsx                            (UPDATE required)
│   │   └─ Replace routes with ProtectedRoute, PublicRoute
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx                ✅ CREATED
│   │       ├─ AuthProvider component
│   │       ├─ useAuth() hook
│   │       └─ All auth methods
│   │
│   ├── services/
│   │   ├── auth.api.ts                    ✅ CREATED
│   │   │   └─ All auth API calls
│   │   ├── apiClient.ts                   (existing)
│   │   ├── axiosInterceptors.ts           ✅ CREATED
│   │   │   ├─ Request interceptor
│   │   │   ├─ Response interceptor (401 handling)
│   │   │   └─ Error formatting
│   │   └── tokenStorage.ts                ✅ CREATED
│   │       ├─ TokenStorage class
│   │       ├─ SessionStorage class
│   │       ├─ DeviceStorage class
│   │       └─ TokenRefreshHelper class
│   │
│   ├── components/
│   │   └── RouteGuards.tsx                ✅ CREATED
│   │       ├─ ProtectedRoute
│   │       ├─ PublicRoute
│   │       ├─ RoleProtectedRoute
│   │       ├─ MultiRoleProtectedRoute
│   │       └─ PermissionGuard
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx                  ✅ CREATED
│   │   ├── RegisterPage.tsx               (TODO)
│   │   ├── ForgotPasswordPage.tsx         (TODO)
│   │   └── ResetPasswordPage.tsx          (TODO)
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx                 (existing)
│   │   └── DashboardLayout.tsx            (existing)
│   │
│   ├── store/
│   │   └── authStore.ts                   (existing - uses Zustand)
│   │
│   ├── types/
│   │   └── api.ts                         (has auth types)
│   │
│   └── ... (other files)
│
├── docs/
│   ├── AUTHENTICATION-INTEGRATION-GUIDE.md    ✅ CREATED
│   │   └─ Complete setup and usage guide
│   ├── AUTH-IMPLEMENTATION-CHECKLIST.md       ✅ CREATED
│   │   └─ Step-by-step checklist
│   └── AUTH-INTEGRATION-SUMMARY.md            ✅ CREATED
│       └─ Overview and summary
│
├── AUTH-USAGE-EXAMPLES.tsx                    ✅ CREATED
│   └─ 8 real-world usage examples
│
├── src/main.updated.tsx                       ✅ CREATED (REFERENCE)
│   └─ How to update main.tsx
│
├── src/App.updated.tsx                        ✅ CREATED (REFERENCE)
│   └─ How to update App.tsx
│
├── .env.local                                 (TODO - CREATE)
│   └─ REACT_APP_API_URL=http://localhost:3000
│
└── ... (other files)
```

---

## Data Flow Diagram

### Login Flow
```
User enters email/password
        ↓
    LoginPage.tsx
        ↓
    useAuth().login(email, password)
        ↓
    authApi.login()
        ↓
    apiClient.post('/auth/login')
        ↓
    Axios request (no token yet)
        ↓
    Backend validates credentials
        ↓
    Returns: { user, accessToken, refreshToken }
        ↓
    AuthContext stores tokens + user
        ↓
    TokenStorage.setTokens() → localStorage
        ↓
    AuthProvider sets: isAuthenticated = true
        ↓
    Component updates with user info
        ↓
    Navigate to /dashboard
```

### API Request Flow (with Auth)
```
Component calls: apiClient.get('/staff')
        ↓
    Axios request interceptor fires
        ↓
    Reads token from TokenStorage.getAccessToken()
        ↓
    Sets header: Authorization: Bearer eyJhbGc...
        ↓
    Backend receives request
        ↓
    Backend validates token + permissions
        ↓
    Returns: { success: true, data: {...} }
        ↓
    Axios response interceptor fires
        ↓
    Unwraps response (data only)
        ↓
    Component receives data
```

### Token Refresh Flow (Auto)
```
Component calls API
        ↓
    Axios interceptor injects expired token
        ↓
    Backend responds: 401 Unauthorized
        ↓
    Axios response interceptor catches 401
        ↓
    Calls: authApi.refreshToken(refreshToken)
        ↓
    Backend validates refresh token
        ↓
    Returns: { accessToken: "new-token" }
        ↓
    TokenStorage.updateAccessToken()
        ↓
    Retries original request with new token
        ↓
    Backend processes with valid token
        ↓
    Component receives data
```

### Logout Flow
```
User clicks logout
        ↓
    useAuth().logout()
        ↓
    authApi.logout() (invalidate server session)
        ↓
    TokenStorage.clearTokens() → localStorage
        ↓
    AuthContext clears: user = null, isAuthenticated = false
        ↓
    All useAuth() hooks update
        ↓
    Components re-render
        ↓
    Navigate('/auth/login')
```

---

## Type System

### Key TypeScript Interfaces

```typescript
// Auth Context
interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  changePassword: (current: string, new: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// Token Storage
interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

interface TokenPayload {
  sub: string;          // Staff ID
  email: string;
  role: string;
  organizationId: number;
  permissions: string[];
  exp: number;
  iat: number;
}
```

---

## Component Hierarchy

```
App (Router)
├── PublicRoute
│   ├── AuthLayout
│   │   ├── LoginPage
│   │   │   └─ useAuth() for login
│   │   ├── RegisterPage
│   │   ├── ForgotPasswordPage
│   │   └── ResetPasswordPage
│   │
│   └── (Redirects logged-in users to /dashboard)
│
└── ProtectedRoute (requires authentication)
    ├── DashboardLayout
    │   ├── Header
    │   │   └─ useAuth() for user info, logout
    │   ├── Sidebar
    │   │   └─ useAuth() for permission-based menu
    │   └── Page content
    │
    ├── RoleProtectedRoute (requires specific role)
    │   └─ Admin page
    │
    └── Pages with PermissionGuard
        ├── Staff management
        ├── Settings
        └── ... feature pages
```

---

## State Management

```
AuthContext (React Context)
    ↓
useAuth() hook
    ↓
Zustand store (useAuthStore)
    ↓
Persistent state: localStorage
    ↓
Browser storage
```

### State Flow
1. **App loads** → AuthProvider initializes
2. **AuthProvider reads localStorage** → restores tokens/user
3. **Components call useAuth()** → get state and methods
4. **User logs in** → state updated → stored in localStorage
5. **Page refreshes** → AuthProvider reads localStorage → state restored
6. **User logs out** → localStorage cleared → state cleared

---

## Security Considerations

### Token Storage
```
✅ Tokens in localStorage (not ideal but practical)
⚠️  Consider httpOnly cookies for refresh token (backend)
✅ Clear tokens on logout
✅ Check token expiration before using
✅ Automatic refresh 5 min before expiration
```

### Interceptors
```
✅ Inject token in every request
✅ Refresh on 401 automatically
✅ Retry failed requests
✅ Format errors securely
❌ Never log tokens to console (in production)
```

### Route Protection
```
✅ ProtectedRoute prevents unauth access
✅ PublicRoute prevents auth access
✅ PermissionGuard enforces fine-grained access
✅ RoleProtectedRoute for role-based access
```

---

## Error Handling

### Error Response Format
```typescript
{
  success: false,
  error: {
    code: "AUTH_INVALID_CREDENTIALS",
    message: "Invalid email or password",
    statusCode: 401,
    details?: { field: "error message" }
  }
}
```

### HTTP Status Codes
```
200 OK              - Success
201 Created         - Resource created
204 No Content      - Success, no body
400 Bad Request     - Invalid input
401 Unauthorized    - Token expired/invalid
403 Forbidden       - Permission denied
404 Not Found       - Resource doesn't exist
409 Conflict        - Duplicate resource
422 Validation Error - Field validation failed
429 Too Many        - Rate limited
500 Server Error    - Server error (retry)
503 Unavailable     - Service down (retry)
```

---

## Environment Configuration

### Development (.env.local)
```
REACT_APP_API_URL=http://localhost:3000/api
```

### Production (.env.production)
```
REACT_APP_API_URL=https://api.example.com
```

### Build
```bash
npm run build  # Uses appropriate .env
```

---

## Integration Checklist

- [x] Created auth.api.ts
- [x] Created AuthContext.tsx
- [x] Created RouteGuards.tsx
- [x] Created axiosInterceptors.ts
- [x] Created tokenStorage.ts
- [x] Created LoginPage.tsx
- [x] Created documentation (3 guides)
- [x] Created usage examples (8 examples)
- [ ] Update main.tsx
- [ ] Update App.tsx
- [ ] Create remaining auth pages
- [ ] Add permission guards to features
- [ ] Test entire flow
- [ ] Deploy

---

**Architecture Version**: 2.0  
**Last Updated**: 2026-06-12  
**Status**: Complete & Ready for Implementation
