import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Loading spinner component
function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <svg
          style={{ width: '2rem', height: '2rem', color: '#6366f1', animation: 'spin 1s linear infinite' }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Checking session…</p>
      </div>
    </div>
  );
}

// ProtectedRoute: blocks unauthenticated users
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// RoleRoute: allows only specific role(s)
export function RoleRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
