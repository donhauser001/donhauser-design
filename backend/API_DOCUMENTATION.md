# 设计业务管理系统 API 文档

## 基础信息

- **基础URL**: `http://localhost:3000`
- **API前缀**: `/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误信息"
}
```

## 用户管理 API

### 1. 获取用户列表
- **URL**: `GET /api/users`
- **参数**:
  - `search` (可选): 搜索关键词（用户名、邮箱、姓名）
  - `role` (可选): 角色过滤（超级管理员、项目经理、设计师、客户、员工）
  - `status` (可选): 状态过滤（active、inactive）
  - `enterpriseId` (可选): 企业ID过滤
  - `departmentId` (可选): 部门ID过滤
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认10

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@company.com",
      "phone": "13800138000",
      "realName": "超级管理员",
      "role": "超级管理员",
      "department": "系统管理",
      "status": "active",
      "createTime": "2024-01-01 10:00:00",
      "lastLogin": "2024-01-15 14:30:00",
      "enterpriseId": "1",
      "enterpriseName": "ABC设计有限公司",
      "departmentId": "dept0",
      "departmentName": "系统管理",
      "position": "超级管理员",
      "permissions": ["*"],
      "permissionGroups": []
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2. 根据ID获取用户
- **URL**: `GET /api/users/:id`
- **参数**: `id` - 用户ID

### 3. 创建用户
- **URL**: `POST /api/users`
- **请求体**:
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "phone": "13800138000",
  "realName": "新用户",
  "role": "员工",
  "department": "技术部",
  "status": "active",
  "enterpriseId": "1",
  "enterpriseName": "ABC设计有限公司",
  "departmentId": "dept2",
  "departmentName": "技术部",
  "position": "前端工程师",
  "description": "新入职员工"
}
```

### 4. 更新用户
- **URL**: `PUT /api/users/:id`
- **参数**: `id` - 用户ID
- **请求体**: 同创建用户（密码字段可选）

### 5. 删除用户
- **URL**: `DELETE /api/users/:id`
- **参数**: `id` - 用户ID

### 6. 修改密码
- **URL**: `PUT /api/users/:id/password`
- **参数**: `id` - 用户ID
- **请求体**:
```json
{
  "newPassword": "newpassword123"
}
```

### 7. 重置密码
- **URL**: `POST /api/users/:id/reset-password`
- **参数**: `id` - 用户ID
- **响应**: 返回新生成的随机密码

### 8. 切换用户状态
- **URL**: `PUT /api/users/:id/toggle-status`
- **参数**: `id` - 用户ID

### 9. 更新用户权限
- **URL**: `PUT /api/users/:id/permissions`
- **参数**: `id` - 用户ID
- **请求体**:
```json
{
  "permissions": ["dashboard:view", "projects:view"],
  "permissionGroups": ["1", "2"]
}
```

## 企业管理 API

### 1. 获取企业列表
- **URL**: `GET /api/enterprises`
- **参数**:
  - `search` (可选): 搜索关键词（企业名称、统一社会信用代码、法人代表、联系人）
  - `status` (可选): 状态过滤（active、inactive）
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认10

### 2. 根据ID获取企业
- **URL**: `GET /api/enterprises/:id`
- **参数**: `id` - 企业ID

### 3. 创建企业
- **URL**: `POST /api/enterprises`
- **请求体**:
```json
{
  "enterpriseName": "新企业有限公司",
  "creditCode": "91110000123456789X",
  "businessLicense": "license.jpg",
  "legalRepresentative": "张三",
  "legalRepresentativeId": "110101199001011234",
  "companyAddress": "北京市朝阳区建国路88号",
  "shippingAddress": "北京市朝阳区建国路88号大厦15层",
  "contactPerson": "李四",
  "contactPhone": "13800138000",
  "invoiceInfo": "公司名称：新企业有限公司\n税号：91110000123456789X\n地址：北京市朝阳区建国路88号\n开户行：中国银行北京分行\n账号：1234567890123456789",
  "status": "active"
}
```

### 4. 更新企业
- **URL**: `PUT /api/enterprises/:id`
- **参数**: `id` - 企业ID
- **请求体**: 同创建企业（所有字段可选）

### 5. 删除企业
- **URL**: `DELETE /api/enterprises/:id`
- **参数**: `id` - 企业ID

### 6. 切换企业状态
- **URL**: `PUT /api/enterprises/:id/toggle-status`
- **参数**: `id` - 企业ID

## 部门管理 API

### 1. 获取部门列表
- **URL**: `GET /api/departments`
- **参数**:
  - `enterpriseId` (可选): 企业ID过滤
  - `parentId` (可选): 上级部门ID过滤（空字符串表示顶级部门）
  - `status` (可选): 状态过滤（active、inactive）
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认10

### 2. 根据ID获取部门
- **URL**: `GET /api/departments/:id`
- **参数**: `id` - 部门ID

### 3. 创建部门
- **URL**: `POST /api/departments`
- **请求体**:
```json
{
  "name": "新部门",
  "parentId": "dept1",
  "enterpriseId": "1",
  "status": "active"
}
```

### 4. 更新部门
- **URL**: `PUT /api/departments/:id`
- **参数**: `id` - 部门ID
- **请求体**: 同创建部门（所有字段可选）

### 5. 删除部门
- **URL**: `DELETE /api/departments/:id`
- **参数**: `id` - 部门ID

### 6. 获取上级部门选项
- **URL**: `GET /api/departments/parent-options/:enterpriseId`
- **参数**: `enterpriseId` - 企业ID

### 7. 切换部门状态
- **URL**: `PUT /api/departments/:id/toggle-status`
- **参数**: `id` - 部门ID

## 权限管理 API

### 1. 获取权限树数据
- **URL**: `GET /api/permissions/tree`
- **响应**: 返回完整的权限树结构

### 2. 获取所有权限列表
- **URL**: `GET /api/permissions/all`
- **响应**: 返回扁平化的权限列表

### 3. 验证权限
- **URL**: `POST /api/permissions/validate`
- **请求体**:
```json
{
  "permissions": ["dashboard:view", "projects:create", "invalid:permission"]
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "valid": ["dashboard:view", "projects:create"],
    "invalid": ["invalid:permission"]
  }
}
```

### 4. 获取权限组列表
- **URL**: `GET /api/permissions/groups`
- **参数**:
  - `search` (可选): 搜索关键词（权限组名称、描述）
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认10

### 5. 根据ID获取权限组
- **URL**: `GET /api/permissions/groups/:id`
- **参数**: `id` - 权限组ID

### 6. 创建权限组
- **URL**: `POST /api/permissions/groups`
- **请求体**:
```json
{
  "name": "新权限组",
  "description": "权限组描述",
  "permissions": ["dashboard:view", "projects:view"]
}
```

### 7. 更新权限组
- **URL**: `PUT /api/permissions/groups/:id`
- **参数**: `id` - 权限组ID
- **请求体**: 同创建权限组（所有字段可选）

### 8. 删除权限组
- **URL**: `DELETE /api/permissions/groups/:id`
- **参数**: `id` - 权限组ID

## 文章管理 API

### 1. 获取文章列表
- **URL**: `GET /api/articles`
- **参数**:
  - `search` (可选): 搜索关键词（文章标题、内容）
  - `category` (可选): 分类过滤（news、blog、case、tutorial、company）
  - `status` (可选): 状态过滤（draft、published、archived）
  - `authorId` (可选): 作者ID过滤
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认10

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "1",
      "title": "示例文章标题",
      "content": "文章内容...",
      "summary": "文章摘要",
      "category": "blog",
      "tags": ["标签1", "标签2"],
      "author": "作者姓名",
      "authorId": "author-id",
      "status": "published",
      "publishTime": "2024-01-15T10:30:00.000Z",
      "viewCount": 100,
      "isTop": false,
      "isRecommend": true,
      "createTime": "2024-01-15T10:00:00.000Z",
      "updateTime": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2. 根据ID获取文章
- **URL**: `GET /api/articles/:id`
- **参数**: `id` - 文章ID

### 3. 创建文章
- **URL**: `POST /api/articles`
- **请求体**:
```json
{
  "title": "新文章标题",
  "content": "文章内容",
  "summary": "文章摘要",
  "category": "blog",
  "tags": ["标签1", "标签2"],
  "author": "作者姓名",
  "authorId": "author-id",
  "seoTitle": "SEO标题",
  "seoKeywords": "SEO关键词",
  "seoDescription": "SEO描述"
}
```

### 4. 更新文章
- **URL**: `PUT /api/articles/:id`
- **参数**: `id` - 文章ID
- **请求体**: 同创建文章（所有字段可选）

### 5. 删除文章
- **URL**: `DELETE /api/articles/:id`
- **参数**: `id` - 文章ID

### 6. 切换文章状态
- **URL**: `PUT /api/articles/:id/toggle-status`
- **参数**: `id` - 文章ID
- **说明**: 草稿 → 已发布 → 已归档 → 草稿

### 7. 设置置顶状态
- **URL**: `PUT /api/articles/:id/toggle-top`
- **参数**: `id` - 文章ID

### 8. 设置推荐状态
- **URL**: `PUT /api/articles/:id/toggle-recommend`
- **参数**: `id` - 文章ID

### 9. 增加浏览量
- **URL**: `PUT /api/articles/:id/increment-view`
- **参数**: `id` - 文章ID

### 10. 获取分类统计
- **URL**: `GET /api/articles/stats/categories`
- **响应**:
```json
{
  "success": true,
  "data": [
    { "category": "blog", "count": 10 },
    { "category": "news", "count": 5 },
    { "category": "case", "count": 3 }
  ]
}
```

### 11. 获取热门文章
- **URL**: `GET /api/articles/popular/list`
- **参数**:
  - `limit` (可选): 返回数量，默认10

### 12. 获取推荐文章
- **URL**: `GET /api/articles/recommended/list`
- **参数**:
  - `limit` (可选): 返回数量，默认10

## 错误码说明

- `200`: 请求成功
- `201`: 创建成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器内部错误

## 使用示例

### 创建用户示例
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com",
    "phone": "13800138000",
    "realName": "测试用户",
    "role": "员工",
    "department": "技术部",
    "status": "active",
    "enterpriseId": "1",
    "position": "前端工程师"
  }'
```

### 获取用户列表示例
```bash
curl "http://localhost:3000/api/users?role=员工&status=active&page=1&limit=10"
```

### 更新用户权限示例
```bash
curl -X PUT http://localhost:3000/api/users/1/permissions \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["dashboard:view", "projects:view", "clients:view"],
    "permissionGroups": ["2"]
  }'
``` 