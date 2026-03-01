import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import DashboardLayout from '../components/layout/DashboardLayout'
import AdminLayout from '../components/layout/AdminLayout'
import Overview from '../pages/dashboard/Overview'
import Tunnels from '../pages/dashboard/Tunnels'
import Activate from '../pages/dashboard/Activate'
import Profile from '../pages/dashboard/Profile'
import AdminOverview from '../pages/admin/AdminOverview'
import UserManagement from '../pages/admin/UserManagement'
import CodeManagement from '../pages/admin/CodeManagement'
import SystemConfig from '../pages/admin/SystemConfig'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(state => state.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(state => state.token)
  return token ? <>{children}</> : <Navigate to="/admin/login" replace />
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<Login />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout>
            <Overview />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/dashboard/tunnels" element={
        <PrivateRoute>
          <DashboardLayout>
            <Tunnels />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/dashboard/activate" element={
        <PrivateRoute>
          <DashboardLayout>
            <Activate />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/dashboard/profile" element={
        <PrivateRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout>
            <AdminOverview />
          </AdminLayout>
        </AdminRoute>
      } />

      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        </AdminRoute>
      } />

      <Route path="/admin/codes" element={
        <AdminRoute>
          <AdminLayout>
            <CodeManagement />
          </AdminLayout>
        </AdminRoute>
      } />

      <Route path="/admin/config" element={
        <AdminRoute>
          <AdminLayout>
            <SystemConfig />
          </AdminLayout>
        </AdminRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRouter
