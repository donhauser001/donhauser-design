import React, { useState } from 'react'
import { Card, Space, Typography, Divider, message, Button } from 'antd'
import FileUpload from './FileUpload'
import type { UploadFile } from 'antd/es/upload/interface'

const { Title, Paragraph, Text } = Typography

// 定义新的文件信息接口
interface FileInfo {
  path: string
  originalName: string
  size: number
}

const FileUploadExample: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
  const [documentFiles, setDocumentFiles] = useState<UploadFile[]>([])
  const [videoFiles, setVideoFiles] = useState<UploadFile[]>([])
  const [mixedFiles, setMixedFiles] = useState<UploadFile[]>([])

  // 模拟从数据库加载的文件数据（新格式）
  const [loadedFiles, setLoadedFiles] = useState<FileInfo[]>([
    {
      path: '/uploads/clients/123/document.pdf',
      originalName: '合同文档.pdf',
      size: 2048000
    },
    {
      path: '/uploads/clients/123/image.jpg',
      originalName: '产品图片.jpg',
      size: 1024000
    }
  ])

  const handleImageChange = (fileList: UploadFile[]) => {
    setImageFiles(fileList)
    console.log('图片文件列表:', fileList)
  }

  const handleDocumentChange = (fileList: UploadFile[]) => {
    setDocumentFiles(fileList)
    console.log('文档文件列表:', fileList)
  }

  const handleVideoChange = (fileList: UploadFile[]) => {
    setVideoFiles(fileList)
    console.log('视频文件列表:', fileList)
  }

  const handleMixedChange = (fileList: UploadFile[]) => {
    setMixedFiles(fileList)
    console.log('混合文件列表:', fileList)
  }

  const handleLoadedFilesChange = (fileList: UploadFile[]) => {
    // 将UploadFile格式转换为FileInfo格式
    const fileInfos: FileInfo[] = fileList.map(file => ({
      path: file.url || file.response?.data?.url || '',
      originalName: file.name || '未知文件',
      size: file.size || 0
    }))
    setLoadedFiles(fileInfos)
    console.log('加载的文件信息:', fileInfos)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>FileUpload 组件示例</Title>
      <Paragraph>
        这是一个通用的文件上传组件，支持拖拽上传、多种文件类型、预览、批量上传等功能。
        现在支持完整的文件信息保存，包括原始文件名和文件大小。
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 图片上传示例 */}
        <Card title="图片上传" size="small">
          <Paragraph>
            支持 JPG、PNG、GIF、WebP 格式，单个文件不超过 2MB，最多上传 5 张图片
          </Paragraph>
          <FileUpload
            value={imageFiles}
            onChange={handleImageChange}
            accept=".jpg,.jpeg,.png,.gif,.webp"
            maxSize={2}
            maxCount={5}
            multiple={true}
            placeholder="上传产品图片"
            helpText="支持 JPG、PNG、GIF、WebP 格式，单个文件不超过 2MB"
            data={{
              category: 'product-images',
              type: 'image'
            }}
          />
        </Card>

        {/* 文档上传示例 */}
        <Card title="文档上传" size="small">
          <Paragraph>
            支持 PDF、Word、Excel、PowerPoint 格式，单个文件不超过 10MB
          </Paragraph>
          <FileUpload
            value={documentFiles}
            onChange={handleDocumentChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            maxSize={10}
            maxCount={10}
            multiple={true}
            placeholder="上传项目文档"
            helpText="支持 PDF、Word、Excel、PowerPoint 格式，单个文件不超过 10MB"
            data={{
              category: 'documents',
              type: 'document'
            }}
          />
        </Card>

        {/* 视频上传示例 */}
        <Card title="视频上传" size="small">
          <Paragraph>
            支持 MP4、AVI、MOV、WMV、FLV 格式，单个文件不超过 100MB
          </Paragraph>
          <FileUpload
            value={videoFiles}
            onChange={handleVideoChange}
            accept=".mp4,.avi,.mov,.wmv,.flv"
            maxSize={100}
            maxCount={1}
            multiple={false}
            placeholder="上传视频文件"
            helpText="支持 MP4、AVI、MOV、WMV、FLV 格式，单个文件不超过 100MB"
            data={{
              category: 'videos',
              type: 'video'
            }}
          />
        </Card>

        {/* 混合文件上传示例 */}
        <Card title="混合文件上传" size="small">
          <Paragraph>
            支持多种文件类型混合上传，展示完整文件信息
          </Paragraph>
          <FileUpload
            value={mixedFiles}
            onChange={handleMixedChange}
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
            maxSize={20}
            maxCount={10}
            multiple={true}
            placeholder="上传混合类型文件"
            helpText="支持图片、文档、压缩包等多种格式，单个文件不超过 20MB"
            data={{
              category: 'mixed-files',
              type: 'mixed'
            }}
          />
        </Card>

        {/* 从数据库加载文件示例 */}
        <Card title="从数据库加载文件（新格式）" size="small">
          <Paragraph>
            演示从数据库加载文件信息，支持完整的文件名和大小显示
          </Paragraph>
          <div style={{ marginBottom: 16 }}>
            <Text strong>当前加载的文件信息：</Text>
            <ul>
              {loadedFiles.map((file, index) => (
                <li key={index}>
                  <Text>文件名: {file.originalName}</Text>
                  <br />
                  <Text type="secondary">路径: {file.path}</Text>
                  <br />
                  <Text type="secondary">大小: {formatFileSize(file.size)}</Text>
                </li>
              ))}
            </ul>
          </div>
          <FileUpload
            value={loadedFiles}
            onChange={handleLoadedFilesChange}
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
            maxSize={10}
            maxCount={5}
            multiple={true}
            placeholder="编辑已加载的文件"
            helpText="可以编辑从数据库加载的文件列表"
            data={{
              category: 'loaded-files',
              type: 'database'
            }}
          />
        </Card>

        {/* 自定义验证示例 */}
        <Card title="自定义验证" size="small">
          <Paragraph>
            演示自定义文件验证功能，包括文件类型、大小、数量验证
          </Paragraph>
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

              message.success(`${file.name} 验证通过`)
              return true
            }}
            placeholder="自定义验证示例"
            helpText="只支持 JPG、PNG、GIF 格式，单个文件不超过 5MB，最多 3 个文件"
          />
        </Card>

        {/* 禁用拖拽上传示例 */}
        <Card title="禁用拖拽上传" size="small">
          <Paragraph>
            演示禁用拖拽上传功能，只能通过点击选择文件
          </Paragraph>
          <FileUpload
            dragUpload={false}
            placeholder="点击选择文件"
            helpText="仅支持点击选择文件上传"
            accept=".jpg,.jpeg,.png,.gif"
            maxSize={1}
          />
        </Card>

        {/* 自定义样式示例 */}
        <Card title="自定义样式" size="small">
          <Paragraph>
            演示自定义上传区域样式
          </Paragraph>
          <FileUpload
            style={{
              border: '2px dashed #1890ff',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f0f8ff'
            }}
            className="custom-upload"
            placeholder="自定义样式的上传区域"
            helpText="这是一个自定义样式的上传区域"
            accept=".jpg,.jpeg,.png,.gif"
          />
        </Card>

        {/* 数据格式说明 */}
        <Card title="数据格式说明" size="small">
          <Paragraph>
            组件支持多种文件数据格式，确保向后兼容和数据完整性：
          </Paragraph>

          <Divider orientation="left">1. 字符串格式（旧格式）</Divider>
          <pre style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {`files: string[] // 仅包含文件路径
// 例如: ['/uploads/clients/123/file.jpg', '/uploads/clients/123/document.pdf']`}
          </pre>

          <Divider orientation="left">2. 对象格式（新格式，推荐）</Divider>
          <pre style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {`files: Array<{
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
// ]`}
          </pre>

          <Divider orientation="left">3. UploadFile格式（Ant Design格式）</Divider>
          <pre style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {`files: UploadFile[] // Ant Design的UploadFile对象数组`}
          </pre>

          <Paragraph style={{ marginTop: 16 }}>
            <Text strong>优势：</Text>
          </Paragraph>
          <ul>
            <li>✅ 保存完整的文件信息（原始文件名、文件大小）</li>
            <li>✅ 向后兼容旧的数据格式</li>
            <li>✅ 支持多种业务场景</li>
            <li>✅ 数据完整性保证</li>
          </ul>
        </Card>
      </Space>
    </div>
  )
}

export default FileUploadExample 