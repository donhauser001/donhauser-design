# FileUpload 文件上传组件

一个功能强大的通用文件上传组件，类似于WordPress的文件上传功能，支持拖拽上传、多种文件类型、预览、批量上传等功能。

## 功能特性

- 🚀 **拖拽上传** - 支持拖拽文件到指定区域上传
- 📁 **多种文件类型** - 支持图片、视频、音频、文档等多种文件类型
- 👀 **文件预览** - 支持图片预览和文件信息展示
- 📊 **上传进度** - 实时显示上传进度
- 🔒 **文件验证** - 支持文件大小、数量、类型验证
- 🎨 **自定义样式** - 支持自定义上传区域样式
- 📱 **响应式设计** - 适配不同屏幕尺寸
- 🔧 **高度可配置** - 丰富的配置选项
- 🏢 **业务类型支持** - 根据业务类型自动选择上传目录和配置
- 💾 **数据完整性** - 保存完整的文件信息（路径、原始文件名、文件大小）
- 🔄 **向后兼容** - 支持多种文件数据格式

## 数据格式支持

组件支持多种文件数据格式，确保向后兼容和数据完整性：

### 1. 字符串格式（旧格式）
```typescript
files: string[] // 仅包含文件路径
// 例如: ['/uploads/clients/123/file.jpg', '/uploads/clients/123/document.pdf']
```

### 2. 对象格式（新格式，推荐）
```typescript
files: Array<{
  path: string;        // 文件路径
  originalName: string; // 原始文件名
  size: number;        // 文件大小（字节）
}>
// 例如: [
//   {
//     path: '/uploads/clients/123/file.jpg',
//     originalName: '产品图片.jpg',
//     size: 1024000
//   }
// ]
```

### 3. UploadFile格式（Ant Design格式）
```typescript
files: UploadFile[] // Ant Design的UploadFile对象数组
```

## 业务类型支持

组件内置支持以下业务类型，每种类型都有对应的默认配置：

| 业务类型 | 目录 | 支持文件类型 | 最大文件大小 | 说明 |
|----------|------|-------------|-------------|------|
| `enterprises` | `/uploads/enterprises/` | JPG、PNG、GIF、PDF、DOC、DOCX | 5MB | 企业管理文件 |
| `clients` | `/uploads/clients/` | JPG、PNG、GIF、PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX、ZIP、RAR | 10MB | 客户管理文件 |
| `contracts` | `/uploads/contracts/` | PDF、DOC、DOCX、JPG、PNG | 20MB | 合同管理文件 |
| `departments` | `/uploads/departments/` | JPG、PNG、PDF、DOC、DOCX | 5MB | 部门管理文件 |
| `projects` | `/uploads/projects/` | JPG、PNG、GIF、PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX、ZIP、RAR、MP4、AVI | 50MB | 项目管理文件 |
| `users` | `/uploads/users/` | JPG、PNG、PDF、DOC、DOCX | 5MB | 用户管理文件 |
| `avatars` | `/uploads/avatars/` | JPG、PNG、GIF | 2MB | 头像上传 |

## 基础用法

### 简单上传

```tsx
import FileUpload from '@/components/FileUpload'

const MyComponent = () => {
  const [fileList, setFileList] = useState([])

  return (
    <FileUpload
      value={fileList}
      onChange={setFileList}
      placeholder="点击或拖拽文件上传"
    />
  )
}
```

### 指定业务类型

```tsx
<FileUpload
  businessType="clients"
  placeholder="上传客户相关文件"
/>
```

### 使用子目录

```tsx
<FileUpload
  businessType="clients"
  subDirectory="client-123"
  placeholder="上传客户相关文件"
/>
```

### 自定义业务类型配置

```tsx
<FileUpload
  businessType="projects"
  accept=".jpg,.png,.pdf,.doc,.docx,.zip"
  maxSize={30}
  helpText="支持项目文档和设计稿，单个文件不超过 30MB"
/>
```

### 限制文件类型和大小

```tsx
<FileUpload
  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
  maxSize={5} // 5MB
  maxCount={3}
  helpText="支持 JPG、PNG、GIF、PDF、DOC 格式，单个文件不超过 5MB"
/>
```

### 自定义上传接口

```tsx
<FileUpload
  action="/api/upload/files"
  headers={{
    'Authorization': 'Bearer your-token'
  }}
  data={{
    category: 'documents',
    userId: '123'
  }}
/>
```

## API 参数

### 基础配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `(UploadFile \| string \| { path: string; originalName: string; size: number })[]` | `[]` | 文件列表，支持多种格式 |
| onChange | `(fileList: UploadFile[]) => void` | - | 文件列表变化回调 |
| multiple | `boolean` | `false` | 是否支持多文件上传 |
| maxCount | `number` | `10` | 最大文件数量 |
| maxSize | `number` | 根据业务类型 | 单个文件最大大小（MB） |
| accept | `string` | 根据业务类型 | 接受的文件类型 |
| directory | `boolean` | `false` | 是否支持文件夹上传 |
| businessType | `'enterprises' \| 'clients' \| 'contracts' \| 'departments' \| 'projects' \| 'users' \| 'avatars'` | `'clients'` | 业务类型，决定上传目录和默认配置 |
| subDirectory | `string` | - | 子目录名称，如客户ID、项目ID等，用于创建子目录结构 |

### 上传配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| action | `string` | `'/api/upload'` | 上传接口地址 |
| headers | `Record<string, string>` | `{}` | 请求头 |
| data | `Record<string, any>` | `{}` | 额外的表单数据 |
| name | `string` | `'file'` | 文件字段名 |
| withCredentials | `boolean` | `false` | 是否携带 cookie |

### 显示配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| listType | `'text' \| 'picture' \| 'picture-card'` | `'picture'` | 文件列表显示类型 |
| showUploadList | `boolean \| UploadProps['showUploadList']` | `true` | 是否显示文件列表 |
| showPreviewIcon | `boolean` | `true` | 是否显示预览图标 |
| showRemoveIcon | `boolean` | `true` | 是否显示删除图标 |
| showDownloadIcon | `boolean` | `true` | 是否显示下载图标 |

### 自定义配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| customRequest | `(options: any) => void` | - | 自定义上传请求 |
| beforeUpload | `(file: File, fileList: File[]) => boolean \| Promise<boolean>` | - | 上传前验证 |
| onPreview | `(file: UploadFile) => void` | - | 预览回调 |
| onRemove | `(file: UploadFile) => boolean \| Promise<boolean>` | - | 删除回调 |

### 样式配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| style | `React.CSSProperties` | - | 自定义样式 |
| className | `string` | - | 自定义类名 |
| disabled | `boolean` | `false` | 是否禁用 |

### 提示配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| placeholder | `string` | `'点击或拖拽文件到此区域上传'` | 占位符文本 |
| helpText | `string` | - | 帮助文本 |
| errorText | `string` | - | 错误文本 |

### 特殊功能

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| dragUpload | `boolean` | `true` | 是否启用拖拽上传 |
| showProgress | `boolean` | `true` | 是否显示上传进度 |
| autoUpload | `boolean` | `true` | 是否自动上传 |
| chunkUpload | `boolean` | `false` | 是否启用分片上传 |
| chunkSize | `number` | `1024` | 分片大小（KB） |

## 使用示例

### 企业管理文件上传

```tsx
<FileUpload
  businessType="enterprises"
  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
  maxSize={5}
  maxCount={3}
  placeholder="上传企业营业执照和资质证书"
  helpText="支持营业执照、资质证书等文件，单个文件不超过 5MB"
  data={{
    category: 'enterprise-documents',
    type: 'certificate'
  }}
/>
```

### 客户管理文件上传

```tsx
<FileUpload
  businessType="clients"
  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
  maxSize={10}
  maxCount={5}
  placeholder="上传客户相关文件"
  helpText="支持图片、文档、压缩包等格式，单个文件不超过 10MB，最多 5 个文件"
  data={{
    category: 'client-files',
    type: 'document'
  }}
/>
```

### 合同管理文件上传

```tsx
<FileUpload
  businessType="contracts"
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  maxSize={20}
  maxCount={10}
  placeholder="上传合同文档和扫描件"
  helpText="支持合同文档、扫描件等，单个文件不超过 20MB"
  data={{
    category: 'contract-documents',
    type: 'contract'
  }}
/>
```

### 项目管理文件上传

```tsx
<FileUpload
  businessType="projects"
  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.mp4,.avi"
  maxSize={50}
  maxCount={20}
  placeholder="上传项目文档和设计稿"
  helpText="支持项目文档、设计稿、视频等，单个文件不超过 50MB"
  data={{
    category: 'project-files',
    type: 'project'
  }}
/>
```

### 头像上传

```tsx
<FileUpload
  businessType="avatars"
  accept=".jpg,.jpeg,.png,.gif"
  maxSize={2}
  maxCount={1}
  multiple={false}
  placeholder="上传头像"
  helpText="支持头像图片，单个文件不超过 2MB"
  data={{
    category: 'user-avatars',
    type: 'avatar'
  }}
/>
```

### 自定义验证

```tsx
<FileUpload
  beforeUpload={(file, fileList) => {
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      message.error('只支持 JPG、PNG、GIF 格式的图片')
      return false
    }
    
    // 检查文件大小
    if (file.size > 5 * 1024 * 1024) {
      message.error('文件大小不能超过 5MB')
      return false
    }
    
    // 检查文件数量
    if (fileList.length > 3) {
      message.error('最多只能上传 3 个文件')
      return false
    }
    
    return true
  }}
/>
```

### 自定义上传请求

```tsx
<FileUpload
  customRequest={({ file, onSuccess, onError, onProgress }) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', 'documents')
    
    axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress({ percent })
        }
      }
    }).then(response => {
      onSuccess(response.data)
    }).catch(error => {
      onError(error)
    })
  }}
/>
```

### 禁用拖拽上传

```tsx
<FileUpload
  dragUpload={false}
  placeholder="点击选择文件"
  helpText="仅支持点击选择文件上传"
/>
```

### 自定义样式

```tsx
<FileUpload
  style={{
    border: '2px dashed #d9d9d9',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center'
  }}
  className="custom-upload"
  placeholder="自定义样式的上传区域"
/>
```

## 事件回调

### onChange

文件列表变化时的回调函数：

```tsx
const handleFileChange = (fileList: UploadFile[]) => {
  console.log('文件列表变化:', fileList)
  // 处理文件列表变化
}

<FileUpload onChange={handleFileChange} />
```

### onPreview

文件预览时的回调函数：

```tsx
const handlePreview = (file: UploadFile) => {
  console.log('预览文件:', file)
  // 自定义预览逻辑
}

<FileUpload onPreview={handlePreview} />
```

### onRemove

文件删除时的回调函数：

```tsx
const handleRemove = async (file: UploadFile) => {
  console.log('删除文件:', file)
  
  // 可以在这里执行额外的删除逻辑
  try {
    await deleteFileFromServer(file.uid)
    return true // 允许删除
  } catch (error) {
    message.error('删除失败')
    return false // 阻止删除
  }
}

<FileUpload onRemove={handleRemove} />
```

## 文件类型支持

组件内置支持以下文件类型的图标和颜色：

- **图片文件**: JPG、PNG、GIF、WebP、BMP 等
- **视频文件**: MP4、AVI、MOV、WMV、FLV 等
- **音频文件**: MP3、WAV、AAC、OGG 等
- **文档文件**: PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX 等
- **其他文件**: 显示通用文件图标

## 数据完整性

### 文件信息保存

组件现在支持保存完整的文件信息：

```typescript
// 新格式：保存完整信息
interface FileInfo {
  path: string;        // 文件路径
  originalName: string; // 原始文件名
  size: number;        // 文件大小（字节）
}

// 使用示例
const files: FileInfo[] = [
  {
    path: '/uploads/clients/123/document.pdf',
    originalName: '合同文档.pdf',
    size: 2048000
  }
]
```

### 向后兼容

组件支持多种数据格式，确保向后兼容：

```typescript
// 支持旧格式
value: string[] // 仅文件路径

// 支持新格式
value: FileInfo[] // 完整文件信息

// 支持Ant Design格式
value: UploadFile[] // Ant Design格式
```

## 注意事项

1. **文件大小限制**: 建议根据实际需求设置合理的文件大小限制
2. **文件类型验证**: 建议在 `beforeUpload` 中进行严格的文件类型验证
3. **上传接口**: 确保上传接口返回正确的响应格式
4. **错误处理**: 建议实现完善的错误处理机制
5. **安全性**: 注意文件上传的安全性问题，如文件类型白名单、文件内容检查等
6. **数据格式**: 推荐使用新的文件信息格式，保存完整的文件信息

## 响应格式

上传接口应返回以下格式的响应：

```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/file.jpg",
    "filename": "file.jpg",
    "size": 1024,
    "type": "image/jpeg"
  },
  "message": "上传成功"
}
```

## 样式定制

可以通过 CSS 自定义组件样式：

```css
.custom-upload .ant-upload-drag {
  border: 2px dashed #1890ff;
  border-radius: 8px;
}

.custom-upload .ant-upload-drag:hover {
  border-color: #40a9ff;
}

.custom-upload .ant-upload-drag-icon {
  color: #1890ff;
  font-size: 48px;
}
``` 

## 文件重名处理

组件内置了文件重名处理机制，确保上传的文件不会因为重名而被覆盖：

### 重名处理策略

1. **自动重命名**: 上传时自动为文件生成唯一文件名
2. **保留原始名**: 在表单数据中保留原始文件名用于显示
3. **时间戳+随机数**: 使用时间戳和随机字符串确保唯一性

### 文件名格式

```
原始文件名: document.pdf
生成文件名: document_1703123456789_abc123.pdf
```

### 目录结构示例

```
uploads/
├── clients/
│   ├── client-123/
│   │   ├── document_1703123456789_abc123.pdf
│   │   └── image_1703123456790_def456.jpg
│   └── client-456/
│       └── contract_1703123456791_ghi789.docx
├── projects/
│   └── project-001/
│       └── design_1703123456792_jkl012.psd
└── enterprises/
    └── enterprise-001/
        └── license_1703123456793_mno345.png
```

## 更新日志

### v2.0.0 (最新)
- ✨ **新增**: 支持完整的文件信息保存（路径、原始文件名、文件大小）
- 🔄 **改进**: 向后兼容多种文件数据格式
- 🐛 **修复**: 解决文件名和文件大小显示问题
- 📝 **文档**: 更新API文档和使用示例

### v1.0.0
- 🚀 **初始版本**: 基础文件上传功能
- 📁 **支持**: 多种文件类型和业务场景
- 🎨 **特性**: 拖拽上传、预览、验证等功能 