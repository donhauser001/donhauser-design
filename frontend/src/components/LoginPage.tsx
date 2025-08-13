import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Typography } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const { Title, Text } = Typography

interface LoginForm {
  username: string
  password: string
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const onFinish = async (values: LoginForm) => {
    setLoading(true)
    try {
      // 调用真实的登录API
      await login(values.username, values.password)

      message.success('登录成功！')

      // 登录成功后跳转到后台首页或之前试图访问的页面
      const from = location.state?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    } catch (error: any) {
      message.error(error.message || '登录失败，请重试！')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <Title level={2} className="text-gray-800 mb-2">
            设计业务管理系统
          </Title>
          <Text type="secondary" className="text-base">
            请登录以继续访问系统
          </Text>
        </div>

        {/* 登录表单 */}
        <Card className="shadow-lg border-0">
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用户名"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="密码"
                className="h-12"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                className="w-full h-12 text-base font-medium"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          {/* 提示信息 */}
          <div className="mt-6 text-center">
            <Text type="secondary" className="text-sm">
              请输入您的用户名和密码
            </Text>
          </div>
        </Card>

        {/* 页脚信息 */}
        <div className="text-center mt-8">
          <Text type="secondary" className="text-sm">
            © 2024 设计业务管理系统. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
