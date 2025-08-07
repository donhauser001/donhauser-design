import React, { useState, useEffect } from 'react'
import { Layout as AntLayout, Menu, theme } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  ProjectOutlined,
  UserOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  MessageOutlined,
  FolderOutlined,
  TagsOutlined,
  FileProtectOutlined,
  ReadOutlined,
  BankOutlined,
  FormOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },

    {
      key: 'clients',
      icon: <UserOutlined />,
      label: '客户管理 [已完成]',
      children: [
        {
          key: '/clients/contacts',
          label: '联系人',
        },
        {
          key: '/clients/client-list',
          label: '客户列表',
        },
        {
          key: '/clients/categories',
          label: '客户分类',
        },
      ],
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目管理 [新]',
      children: [
        {
          key: '/projects',
          label: '项目列表',
        },
        {
          key: '/projects/create',
          label: '新建项目',
        },
      ],
    },
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: '财务管理',
      children: [

        {
          key: '/finance/settlements',
          label: '结算单',
        },
        {
          key: '/finance/invoices',
          label: '发票',
        },
        {
          key: '/finance/income',
          label: '收入',
        },
      ],
    },
    {
      key: 'pricing',
      icon: <TagsOutlined />,
      label: '价格管理 [已完成]',
      children: [
        {
          key: '/pricing/service-pricing',
          label: '服务定价',
        },
        {
          key: '/pricing/service-process',
          label: '服务流程',
        },
        {
          key: '/pricing/additional-config',
          label: '附加配置',
        },
        {
          key: '/pricing/categories',
          label: '定价分类',
        },
        {
          key: '/pricing/quotations',
          label: '报价单',
        },
        {
          key: '/pricing/policy',
          label: '价格政策',
        },
      ],
    },
    {
      key: 'contracts',
      icon: <FileProtectOutlined />,
      label: '合同管理',
      children: [
        {
          key: '/contracts/list',
          label: '合同列表',
        },
        {
          key: '/contracts/templates',
          label: '合同模板',
        },
        {
          key: '/contracts/elements',
          label: '合同元素',
        },
      ],
    },
    {
      key: 'forms',
      icon: <FormOutlined />,
      label: '表单系统',
      children: [
        {
          key: '/forms',
          label: '表单概览',
        },
        {
          key: '/forms/list',
          label: '表单列表',
        },
        {
          key: '/forms/settings',
          label: '表单设置',
        },
      ],
    },
    {
      key: 'content',
      icon: <ReadOutlined />,
      label: '内容中心',
      children: [
        {
          key: '/content/pages',
          label: '页面',
        },
        {
          key: '/content/articles',
          label: '文章',
        },
        {
          key: '/content/categories',
          label: '文章分类',
        },
        {
          key: '/content/tags',
          label: '文章标签',
        },
        {
          key: '/content/menus',
          label: '菜单',
        },
        {
          key: '/content/website-settings',
          label: '网站设置',
        },
      ],
    },
    {
      key: '/messages',
      icon: <MessageOutlined />,
      label: '消息列表',
    },
    {
      key: '/file-center',
      icon: <FolderOutlined />,
      label: '文件中心',
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '用户管理 [已完成]',
      children: [
        {
          key: '/users/user-list',
          label: '用户列表',
        },
        {
          key: '/users/role-settings',
          label: '角色设置',
        },
        {
          key: '/users/permission-settings',
          label: '权限设置',
        },
      ],
    },
    {
      key: 'organization',
      icon: <BankOutlined />,
      label: '组织架构 [已完成]',
      children: [
        {
          key: '/organization/enterprise',
          label: '企业管理',
        },
        {
          key: '/organization/department',
          label: '部门管理',
        },
        {
          key: '/organization/employee',
          label: '员工列表',
        },
      ],
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        {
          key: '/settings/general',
          label: '常规设置',
        },
        {
          key: '/settings/advanced',
          label: '高级设置',
        },
        {
          key: '/settings/login',
          label: '登录设置',
        },
      ],
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 处理子菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const pathname = location.pathname
    return [pathname]
  }

  // 根据当前路径设置展开的子菜单
  useEffect(() => {
    const pathname = location.pathname
    const newOpenKeys: string[] = []


    if (pathname.startsWith('/clients')) newOpenKeys.push('clients')
    if (pathname.startsWith('/finance')) newOpenKeys.push('finance')
    if (pathname.startsWith('/pricing')) newOpenKeys.push('pricing')
    if (pathname.startsWith('/contracts')) newOpenKeys.push('contracts')
    if (pathname.startsWith('/content')) newOpenKeys.push('content')
    if (pathname.startsWith('/users')) newOpenKeys.push('users')
    if (pathname.startsWith('/organization')) newOpenKeys.push('organization')
    if (pathname.startsWith('/settings')) newOpenKeys.push('settings')

    setOpenKeys(newOpenKeys)
  }, [location.pathname])

  return (
    <AntLayout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        style={{
          background: 'transparent',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            height: '100vh',
            margin: '16px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              height: 64,
              margin: '16px 16px 0 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            设计业务管理系统
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={getSelectedKeys()}
            openKeys={collapsed ? [] : openKeys}
            onOpenChange={handleOpenChange}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '8px'
            }}
          />
        </div>
      </Sider>
      <AntLayout style={{ marginLeft: collapsed ? 80 : 312 }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            borderRadius: '12px',
            margin: '16px 16px 0 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
            设计业务管理系统
          </div>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
            style: {
              fontSize: '18px',
              cursor: 'pointer',
              color: '#6b7280'
            },
          })}
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout 