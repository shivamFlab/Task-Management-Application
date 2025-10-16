import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TasksPage from './pages/TasksPage'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { useAppSelector } from './store/hooks'
import type { RootState } from './store/store'

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const token = useAppSelector((s: RootState) => s.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
