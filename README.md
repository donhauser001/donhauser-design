# 设计业务管理系统

一个现代化的设计业务管理系统，采用前后端分离架构。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Ant Design
- Tailwind CSS

### 后端
- Node.js
- Express
- TypeScript
- bcryptjs (密码加密)
- PostgreSQL (待配置)

## 项目结构

```
donhauser/
├── frontend/        # React 前端应用
├── backend/         # Node.js 后端 API
│   ├── src/
│   │   ├── models/      # 数据模型
│   │   ├── services/    # 业务逻辑层
│   │   ├── controllers/ # 控制器层
│   │   ├── routes/      # 路由层
│   │   └── app.ts       # 主应用文件
│   ├── API_DOCUMENTATION.md  # API 文档
│   └── test-api.js      # API 测试脚本
└── README.md        # 项目说明
```

## 快速开始

### 启动后端
```bash
cd backend
npm install
npm run dev
```

### 启动前端
```bash
cd frontend
npm install
npm run dev
```

## 后端功能模块

### 1. 用户管理模块
- **功能**: 用户的增删改查、密码管理、权限分配、状态管理
- **主要接口**:
  - `GET /api/users` - 获取用户列表（支持搜索、过滤、分页）
  - `POST /api/users` - 创建用户
  - `PUT /api/users/:id` - 更新用户信息
  - `DELETE /api/users/:id` - 删除用户
  - `PUT /api/users/:id/password` - 修改密码
  - `POST /api/users/:id/reset-password` - 重置密码
  - `PUT /api/users/:id/toggle-status` - 切换用户状态
  - `PUT /api/users/:id/permissions` - 更新用户权限

### 2. 企业管理模块
- **功能**: 企业的增删改查、状态管理、开票信息管理
- **主要接口**:
  - `GET /api/enterprises` - 获取企业列表
  - `POST /api/enterprises` - 创建企业
  - `PUT /api/enterprises/:id` - 更新企业信息
  - `DELETE /api/enterprises/:id` - 删除企业
  - `PUT /api/enterprises/:id/toggle-status` - 切换企业状态

### 3. 部门管理模块
- **功能**: 部门的增删改查、层级关系管理、员工数量统计
- **主要接口**:
  - `GET /api/departments` - 获取部门列表
  - `POST /api/departments` - 创建部门
  - `PUT /api/departments/:id` - 更新部门信息
  - `DELETE /api/departments/:id` - 删除部门
  - `GET /api/departments/parent-options/:enterpriseId` - 获取上级部门选项
  - `PUT /api/departments/:id/toggle-status` - 切换部门状态

### 4. 权限管理模块
- **功能**: 权限树管理、权限组管理、权限验证
- **主要接口**:
  - `GET /api/permissions/tree` - 获取权限树数据
  - `GET /api/permissions/all` - 获取所有权限列表
  - `POST /api/permissions/validate` - 验证权限
  - `GET /api/permissions/groups` - 获取权限组列表
  - `POST /api/permissions/groups` - 创建权限组
  - `PUT /api/permissions/groups/:id` - 更新权限组
  - `DELETE /api/permissions/groups/:id` - 删除权限组

## 数据模型

### 用户模型 (User)
```typescript
interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  realName: string;
  role: '超级管理员' | '项目经理' | '设计师' | '客户' | '员工';
  department: string;
  status: 'active' | 'inactive';
  createTime: string;
  lastLogin?: string;
  
  // 企业信息
  enterpriseId?: string;
  enterpriseName?: string;
  departmentId?: string;
  departmentName?: string;
  position?: string;
  
  // 客户信息
  company?: string;
  contactPerson?: string;
  address?: string;
  shippingMethod?: string;
  
  // 用户描述
  description?: string;
  
  // 用户权限
  permissions?: string[];
  permissionGroups?: string[];
}
```

### 企业模型 (Enterprise)
```typescript
interface Enterprise {
  id: string;
  enterpriseName: string;
  creditCode: string;
  businessLicense: string;
  legalRepresentative: string;
  legalRepresentativeId: string;
  companyAddress: string;
  shippingAddress: string;
  contactPerson: string;
  contactPhone: string;
  invoiceInfo: string;
  status: 'active' | 'inactive';
  createTime: string;
}
```

### 部门模型 (Department)
```typescript
interface Department {
  id: string;
  name: string;
  parentId?: string;
  enterpriseId: string;
  enterpriseName: string;
  level: number;
  employeeCount: number;
  status: 'active' | 'inactive';
  createTime: string;
}
```

## API 文档

详细的API文档请参考：[API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

## 测试

### 运行API测试
```bash
cd backend
node test-api.js
```

测试脚本会验证以下功能：
- ✅ 用户管理：CRUD 操作、权限管理、状态切换
- ✅ 企业管理：CRUD 操作、状态切换
- ✅ 部门管理：CRUD 操作、层级关系、状态切换
- ✅ 权限管理：权限树、权限组、权限验证
- ✅ 搜索过滤：多条件查询、分页
- ✅ 数据关联：用户-企业-部门关联

## 开发说明

- 后端 API 默认运行在 `http://localhost:3000`
- 前端开发服务器默认运行在 `http://localhost:5173`
- 数据库配置待后续添加
- 当前使用内存数据存储，生产环境需要配置数据库

## 安全特性

- 密码使用 bcryptjs 加密存储
- 统一的错误处理和响应格式
- 输入验证和数据清理
- CORS 配置
- Helmet 安全头设置

## 下一步计划

1. 集成数据库（PostgreSQL）
2. 添加用户认证和JWT令牌
3. 实现文件上传功能
4. 添加日志记录
5. 实现数据导入导出功能
6. 添加单元测试和集成测试 