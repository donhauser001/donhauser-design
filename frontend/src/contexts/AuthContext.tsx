import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, UserInfo } from '../api/auth'

interface AuthContextType {
  isLoggedIn: boolean
  userInfo: UserInfo | null
  token: string | null
  isInitializing: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  verifyToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // 页面加载时检查本地存储的登录状态
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUserInfo = localStorage.getItem('userInfo')

      if (storedToken && storedUserInfo) {
        try {
          const user = JSON.parse(storedUserInfo)
          setToken(storedToken)
          setUserInfo(user)
          setIsLoggedIn(true)

          // 验证token是否有效
          try {
            const response = await authService.verifyToken()
            if (response.success && response.data) {
              // token有效，更新用户信息
              setUserInfo(response.data)
              localStorage.setItem('userInfo', JSON.stringify(response.data))
            } else {
              // token无效，清除认证状态
              clearAuthData()
            }
          } catch (error) {
            // token验证失败，清除认证状态
            clearAuthData()
          }
        } catch (error) {
          // 如果解析失败，清除无效的登录状态
          clearAuthData()
        }
      }

      // 设置初始化完成
      setIsInitializing(false)
    }

    initializeAuth()
  }, [])

  const clearAuthData = () => {
    setIsLoggedIn(false)
    setUserInfo(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('isLoggedIn')
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password })

      if (response.success) {
        const { user, token: newToken } = response.data

        // 保存认证信息
        setToken(newToken)
        setUserInfo(user)
        setIsLoggedIn(true)

        // 保存到本地存储
        localStorage.setItem('token', newToken)
        localStorage.setItem('userInfo', JSON.stringify(user))
        localStorage.setItem('isLoggedIn', 'true')
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      // 调用后端退出登录接口
      if (token) {
        await authService.logout()
      }
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      // 无论后端是否成功，都清除本地状态
      clearAuthData()
    }
  }

  const verifyToken = async () => {
    try {
      if (!token) {
        clearAuthData()
        return
      }

      const response = await authService.verifyToken()

      if (response.success && response.data) {
        // token有效，更新用户信息
        setUserInfo(response.data)
        setIsLoggedIn(true)
        localStorage.setItem('userInfo', JSON.stringify(response.data))
      } else {
        // token无效，清除认证状态
        clearAuthData()
      }
    } catch (error) {
      // token验证失败，清除认证状态
      clearAuthData()
    }
  }

  const value: AuthContextType = {
    isLoggedIn,
    userInfo,
    token,
    isInitializing,
    login,
    logout,
    verifyToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
