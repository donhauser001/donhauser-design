import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Layout from './components/Layout'

// 页面导入
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import './App.css'

// 项目管理相关页面
import TaskBoard from './pages/Projects/TaskBoard'
import ProposalCenter from './pages/Projects/ProposalCenter'
import ProjectDetail from './pages/Projects/ProjectDetail'

// 客户管理相关页面
import Contacts from './pages/Clients/Contacts'
import ClientList from './pages/Clients/ClientList'
import ClientCategories from './pages/Clients/ClientCategories'

// 财务管理相关页面
import Orders from './pages/Finance/Orders'
import Settlements from './pages/Finance/Settlements'
import Invoices from './pages/Finance/Invoices'
import Income from './pages/Finance/Income'

// 价格管理相关页面
import ServicePricing from './pages/Pricing/ServicePricing'
import ServiceProcess from './pages/Pricing/ServiceProcess'
import AdditionalConfig from './pages/Pricing/AdditionalConfig'
import PricingCategories from './pages/Pricing/PricingCategories'
import Quotations from './pages/Pricing/Quotations'
import PricingPolicy from './pages/Pricing/PricingPolicy'

// 合同管理相关页面
import ContractList from './pages/Contracts/ContractList'
import ContractTemplates from './pages/Contracts/ContractTemplates'
import ContractElements from './pages/Contracts/ContractElements'

// 表单系统相关页面
import Forms from './pages/Forms'
import FormList from './pages/Forms/FormList'
import FormSettings from './pages/Forms/FormSettings'

// 内容中心相关页面
import Pages from './pages/Content/Pages'
import Articles from './pages/Content/Articles'
import Menus from './pages/Content/Menus'
import WebsiteSettings from './pages/Content/WebsiteSettings'

// 其他功能页面
import Messages from './pages/Messages'
import FileCenter from './pages/FileCenter'

// 用户管理相关页面
import UserList from './pages/Users/UserList'
import RoleSettings from './pages/Users/RoleSettings'
import PermissionSettings from './pages/Users/PermissionSettings'

// 组织架构相关页面
import Enterprise from './pages/Organization/Enterprise'
import Department from './pages/Organization/Department'
import Employee from './pages/Organization/Employee'

// 系统设置相关页面
import GeneralSettings from './pages/Settings/GeneralSettings'
import AdvancedSettings from './pages/Settings/AdvancedSettings'
import LoginSettings from './pages/Settings/LoginSettings'
import FileUploadTest from './components/FileUploadTest'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout>
        <Routes>
          {/* 仪表盘 */}
          <Route path="/" element={<Dashboard />} />

          {/* 文件上传测试 */}
          <Route path="/test-upload" element={<FileUploadTest />} />

          {/* 项目管理 */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/task-board" element={<TaskBoard />} />
          <Route path="/projects/proposal-center" element={<ProposalCenter />} />

          {/* 客户管理 */}
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/contacts" element={<Contacts />} />
          <Route path="/clients/client-list" element={<ClientList />} />
          <Route path="/clients/categories" element={<ClientCategories />} />

          {/* 财务管理 */}
          <Route path="/finance/orders" element={<Orders />} />
          <Route path="/finance/settlements" element={<Settlements />} />
          <Route path="/finance/invoices" element={<Invoices />} />
          <Route path="/finance/income" element={<Income />} />

          {/* 价格管理 */}
          <Route path="/pricing/service-pricing" element={<ServicePricing />} />
          <Route path="/pricing/service-process" element={<ServiceProcess />} />
          <Route path="/pricing/additional-config" element={<AdditionalConfig />} />
          <Route path="/pricing/categories" element={<PricingCategories />} />
          <Route path="/pricing/quotations" element={<Quotations />} />
          <Route path="/pricing/policy" element={<PricingPolicy />} />

          {/* 合同管理 */}
          <Route path="/contracts/list" element={<ContractList />} />
          <Route path="/contracts/templates" element={<ContractTemplates />} />
          <Route path="/contracts/elements" element={<ContractElements />} />

          {/* 表单系统 */}
          <Route path="/forms" element={<Forms />} />
          <Route path="/forms/list" element={<FormList />} />
          <Route path="/forms/settings" element={<FormSettings />} />

          {/* 内容中心 */}
          <Route path="/content/pages" element={<Pages />} />
          <Route path="/content/articles" element={<Articles />} />
          <Route path="/content/menus" element={<Menus />} />
          <Route path="/content/website-settings" element={<WebsiteSettings />} />

          {/* 其他功能 */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/file-center" element={<FileCenter />} />

          {/* 用户管理 */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/user-list" element={<UserList />} />
          <Route path="/users/role-settings" element={<RoleSettings />} />
          <Route path="/users/permission-settings" element={<PermissionSettings />} />

          {/* 组织架构 */}
          <Route path="/organization/enterprise" element={<Enterprise />} />
          <Route path="/organization/department" element={<Department />} />
          <Route path="/organization/employee" element={<Employee />} />

          {/* 系统设置 */}
          <Route path="/settings/general" element={<GeneralSettings />} />
          <Route path="/settings/advanced" element={<AdvancedSettings />} />
          <Route path="/settings/login" element={<LoginSettings />} />
        </Routes>
      </Layout>
    </ConfigProvider>
  )
}

export default App 