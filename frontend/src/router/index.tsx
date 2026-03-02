import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import DashboardLayout from '../components/layout/DashboardLayout'
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

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
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

      <Route path="/dashboard/monitor" element={
        <PrivateRoute>
          <DashboardLayout>
            <AdminOverview />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/dashboard/users" element={
        <PrivateRoute>
          <DashboardLayout>
            <UserManagement />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/dashboard/codes" element={
        <PrivateRoute>
          <DashboardLayout>
            <CodeManagement />
          </DashboardLayout>
        </PrivateRoute>
      } />

      <Route path="/dashboard/config" element={
        <PrivateRoute>
          <DashboardLayout>
            <SystemConfig />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRouter
