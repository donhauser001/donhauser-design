import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isInitializing } = useAuth()
  const location = useLocation()

  // 如果正在初始化认证状态，显示加载中
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <Spin size="large" />
        <div style={{ fontSize: '16px', color: '#666' }}>
          正在验证登录状态...
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    // 将用户重定向到登录页面，并保存他们试图访问的路径
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
