import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Books from './pages/Books';
import MyIssues from './pages/MyIssues';

// Redirect based on user role
function RoleBasedRedirect() {
  const { role } = useAuth();
  
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
}

// App shell with navbar
function AppShell({ children }) {
  return (
    <div className="bg-gradient-mesh" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes - redirect if authenticated */}
      <Route
        path="/login"
        element={isAuthenticated ? <RoleBasedRedirect /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <RoleBasedRedirect /> : <Signup />}
      />
      
      {/* Student Dashboard - student only */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={['student']}>
            <AppShell>
              <StudentDashboard />
            </AppShell>
          </RoleRoute>
        }
      />
      
      {/* Admin Dashboard - admin only */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AppShell>
              <AdminDashboard />
            </AppShell>
          </RoleRoute>
        }
      />
      
      {/* Books - all authenticated users */}
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <AppShell>
              <Books />
            </AppShell>
          </ProtectedRoute>
        }
      />
      
      {/* My Issues - all authenticated users (admin sees all, student sees their own) */}
      <Route
        path="/my-issues"
        element={
          <ProtectedRoute>
            <AppShell>
              <MyIssues />
            </AppShell>
          </ProtectedRoute>
        }
      />
      
      {/* Default route */}
      <Route 
        path="*" 
        element={isAuthenticated ? <RoleBasedRedirect /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

export default App;
