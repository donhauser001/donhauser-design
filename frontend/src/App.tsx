import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Layout from './components/Layout'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

// 页面导入
import Dashboard from './pages/Dashboard'
import './App.css'

// 客户管理相关页面
import Contacts from './pages/Clients/Contacts'
import ClientList from './pages/Clients/ClientList'
import ClientCategories from './pages/Clients/ClientCategories'

// 财务管理相关页面
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
import FormEditor from './pages/Forms/FormEditor'
import FormSettings from './pages/Forms/FormSettings'
import FormCategories from './pages/Forms/FormCategories'

// 内容中心相关页面
import Pages from './pages/Content/Pages'
import Articles from './pages/Content/Articles'
import ArticleEditor from './pages/Content/ArticleEditor'
import ArticlePreview from './pages/Content/ArticlePreview'
import ArticleCategories from './pages/Content/ArticleCategories'
import ArticleTags from './pages/Content/ArticleTags'
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
import RichTextEditorTest from './components/RichTextEditorTest'
import BasicEditorTest from './components/BasicEditorTest'
import ImageCropperTest from './components/ImageCropperTest'

// 项目管理相关页面
import Projects from './pages/Projects'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Routes>
          {/* 网站主页 */}
          <Route path="/" element={<HomePage />} />

          {/* 登录页面 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 后台首页 - 仪表盘 */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 文件上传测试 */}
          <Route path="/test-upload" element={
            <ProtectedRoute>
              <Layout>
                <FileUploadTest />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 富文本编辑器测试 */}
          <Route path="/test-editor" element={
            <ProtectedRoute>
              <Layout>
                <RichTextEditorTest />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/test-basic-editor" element={
            <ProtectedRoute>
              <Layout>
                <BasicEditorTest />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/test-cropper" element={
            <ProtectedRoute>
              <Layout>
                <ImageCropperTest />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 项目管理 */}
          <Route path="/projects/*" element={
            <ProtectedRoute>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 客户管理 */}
          <Route path="/clients" element={
            <ProtectedRoute>
              <Layout>
                <ClientList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/clients/contacts" element={
            <ProtectedRoute>
              <Layout>
                <Contacts />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/clients/client-list" element={
            <ProtectedRoute>
              <Layout>
                <ClientList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/clients/categories" element={
            <ProtectedRoute>
              <Layout>
                <ClientCategories />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 财务管理 */}
          <Route path="/finance/settlements" element={
            <ProtectedRoute>
              <Layout>
                <Settlements />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/finance/invoices" element={
            <ProtectedRoute>
              <Layout>
                <Invoices />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/finance/income" element={
            <ProtectedRoute>
              <Layout>
                <Income />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 价格管理 */}
          <Route path="/pricing/service-pricing" element={
            <ProtectedRoute>
              <Layout>
                <ServicePricing />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pricing/service-process" element={
            <ProtectedRoute>
              <Layout>
                <ServiceProcess />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pricing/additional-config" element={
            <ProtectedRoute>
              <Layout>
                <AdditionalConfig />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pricing/categories" element={
            <ProtectedRoute>
              <Layout>
                <PricingCategories />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pricing/quotations" element={
            <ProtectedRoute>
              <Layout>
                <Quotations />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pricing/policy" element={
            <ProtectedRoute>
              <Layout>
                <PricingPolicy />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 合同管理 */}
          <Route path="/contracts/list" element={
            <ProtectedRoute>
              <Layout>
                <ContractList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/contracts/templates" element={
            <ProtectedRoute>
              <Layout>
                <ContractTemplates />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/contracts/elements" element={
            <ProtectedRoute>
              <Layout>
                <ContractElements />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 表单系统 */}
          <Route path="/forms" element={
            <ProtectedRoute>
              <Layout>
                <Forms />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/forms/list" element={
            <ProtectedRoute>
              <Layout>
                <FormList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/forms/new" element={
            <ProtectedRoute>
              <Layout>
                <FormEditor />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/forms/edit/:id" element={
            <ProtectedRoute>
              <Layout>
                <FormEditor />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/forms/categories" element={
            <ProtectedRoute>
              <Layout>
                <FormCategories />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/forms/settings" element={
            <ProtectedRoute>
              <Layout>
                <FormSettings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 内容中心 */}
          <Route path="/content/pages" element={
            <ProtectedRoute>
              <Layout>
                <Pages />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/articles" element={
            <ProtectedRoute>
              <Layout>
                <Articles />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/articles/new" element={
            <ProtectedRoute>
              <Layout>
                <ArticleEditor />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/articles/edit/:id" element={
            <ProtectedRoute>
              <Layout>
                <ArticleEditor />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/articles/preview/:id" element={
            <ProtectedRoute>
              <Layout>
                <ArticlePreview />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/categories" element={
            <ProtectedRoute>
              <Layout>
                <ArticleCategories />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/tags" element={
            <ProtectedRoute>
              <Layout>
                <ArticleTags />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/menus" element={
            <ProtectedRoute>
              <Layout>
                <Menus />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/content/website-settings" element={
            <ProtectedRoute>
              <Layout>
                <WebsiteSettings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 其他功能 */}
          <Route path="/messages" element={
            <ProtectedRoute>
              <Layout>
                <Messages />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/file-center" element={
            <ProtectedRoute>
              <Layout>
                <FileCenter />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 用户管理 */}
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <UserList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users/user-list" element={
            <ProtectedRoute>
              <Layout>
                <UserList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users/role-settings" element={
            <ProtectedRoute>
              <Layout>
                <RoleSettings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users/permission-settings" element={
            <ProtectedRoute>
              <Layout>
                <PermissionSettings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 组织架构 */}
          <Route path="/organization/enterprise" element={
            <ProtectedRoute>
              <Layout>
                <Enterprise />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/organization/department" element={
            <ProtectedRoute>
              <Layout>
                <Department />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/organization/employee" element={
            <ProtectedRoute>
              <Layout>
                <Employee />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 系统设置 */}
          <Route path="/settings/general" element={
            <ProtectedRoute>
              <Layout>
                <GeneralSettings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings/advanced" element={
            <ProtectedRoute>
              <Layout>
                <AdvancedSettings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings/login" element={
            <ProtectedRoute>
              <Layout>
                <LoginSettings />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App 