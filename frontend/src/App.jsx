import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/layout/ProtectedRoute'
import { useAuth} from "./context/AuthContext"
import ProjectsPage from './pages/ProjectPage'
import AppLayout from './components/layout/AppLayout'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import RequireAdmin from './components/auth/RequireAdmin'


const App = () => {

  const {user} = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login"/>}></Route>
      <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} 
        />
        <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout/>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            </Route>   
        </Route>
        <Route element={<RequireAdmin/>}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFoundPage/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App