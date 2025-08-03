import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  Upload,
  Button,
  message,
  Progress,
  Modal,
  Image,
  Space,
  Tag,
  Tooltip,
  Typography,
  Divider,
  Row,
  Col,
  Card,
  Spin
} from 'antd'
import {
  UploadOutlined,
  FileOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  InboxOutlined,
  CloudUploadOutlined
} from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import axios from 'axios'

const { Text, Paragraph } = Typography
const { Dragger } = Upload

// 业务类型配置映射
const businessTypeConfig = {
  enterprises: {
    name: '企业管理',
    accept: '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx',
    maxSize: 5,
    helpText: '支持营业执照、资质证书等文件，单个文件不超过 5MB'
  },
  clients: {
    name: '客户管理',
    accept: '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar',
    maxSize: 10,
    helpText: '支持客户相关文档、图片等，单个文件不超过 10MB'
  },
  contracts: {
    name: '合同管理',
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    maxSize: 20,
    helpText: '支持合同文档、扫描件等，单个文件不超过 20MB'
  },
  departments: {
    name: '部门管理',
    accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
    maxSize: 5,
    helpText: '支持部门相关文档，单个文件不超过 5MB'
  },
  projects: {
    name: '项目管理',
    accept: '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.mp4,.avi',
    maxSize: 50,
    helpText: '支持项目文档、设计稿、视频等，单个文件不超过 50MB'
  },
  users: {
    name: '用户管理',
    accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
    maxSize: 5,
    helpText: '支持用户相关文档，单个文件不超过 5MB'
  },
  avatars: {
    name: '头像上传',
    accept: '.jpg,.jpeg,.png,.gif',
    maxSize: 2,
    helpText: '支持头像图片，单个文件不超过 2MB'
  }
}

export interface FileUploadProps {
  // 基础配置
  value?: (UploadFile | string | { path: string; originalName: string; size: number })[]
  onChange?: (fileList: UploadFile[]) => void
  multiple?: boolean
  maxCount?: number
  maxSize?: number // MB
  accept?: string
  directory?: boolean

  // 业务类型配置
  businessType?: 'enterprises' | 'clients' | 'contracts' | 'departments' | 'projects' | 'users' | 'avatars'

  // 子目录配置
  subDirectory?: string // 子目录名称，如客户ID、项目ID等

  // 上传配置
  action?: string
  headers?: Record<string, string>
  data?: Record<string, any>
  name?: string
  withCredentials?: boolean

  // 显示配置
  listType?: 'text' | 'picture' | 'picture-card'
  showUploadList?: boolean | UploadProps['showUploadList']
  showPreviewIcon?: boolean
  showRemoveIcon?: boolean
  showDownloadIcon?: boolean

  // 自定义配置
  customRequest?: (options: any) => void
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>
  onPreview?: (file: UploadFile) => void
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>

  // 样式配置
  style?: React.CSSProperties
  className?: string
  disabled?: boolean

  // 提示配置
  placeholder?: string
  helpText?: string
  errorText?: string

  // 特殊功能
  dragUpload?: boolean
  showProgress?: boolean
  autoUpload?: boolean
  chunkUpload?: boolean
  chunkSize?: number // KB
}

const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  onChange,
  multiple = false,
  maxCount = 10,
  maxSize,
  accept,
  directory = false,
  businessType = 'clients',
  subDirectory,
  action = '/api/upload',
  headers = {},
  data = {},
  name = 'file',
  withCredentials = false,
  listType = 'picture',
  showUploadList = true,
  showPreviewIcon = true,
  showRemoveIcon = true,
  showDownloadIcon = true,
  customRequest,
  beforeUpload,
  onPreview,
  onRemove,
  style,
  className,
  disabled = false,
  placeholder,
  helpText,
  errorText,
  dragUpload = true,
  showProgress = true,
  autoUpload = true,
  chunkUpload = false,
  chunkSize = 1024
}) => {
  // 根据业务类型获取默认配置
  const defaultConfig = businessTypeConfig[businessType] || businessTypeConfig.clients

  // 使用传入的配置或默认配置
  const finalAccept = accept || defaultConfig.accept
  const finalMaxSize = maxSize || defaultConfig.maxSize
  const finalPlaceholder = placeholder || `上传${defaultConfig.name}相关文件`
  const finalHelpText = helpText || defaultConfig.helpText

  const prevValueRef = useRef<(UploadFile | string | { path: string; originalName: string; size: number })[]>([])

  const [fileList, setFileList] = useState<UploadFile[]>([])

  // 监听value变化，更新文件列表
  useEffect(() => {
    if (!value || value.length === 0) {
      setFileList([])
      return
    }

    // 处理不同格式的文件数据
    const processedFiles = value.map((file: any, index: number) => {
      if (typeof file === 'string') {
        // 处理字符串格式
        return {
          uid: `file-${Date.now()}-${index}`,
          name: file.split('/').pop() || '未知文件',
          status: 'done' as const,
          url: file,
          size: 0
        }
      } else if (file.path) {
        // 处理对象格式 { path, originalName, size }
        return {
          uid: `file-${Date.now()}-${index}`,
          name: file.originalName || file.path.split('/').pop() || '未知文件',
          status: 'done' as const,
          url: file.path,
          size: file.size || 0,
          response: {
            data: {
              url: file.path,
              originalname: file.originalName
            }
          }
        }
      } else {
        // 已经是 UploadFile 格式
        return {
          ...file,
          uid: file.uid || `file-${Date.now()}-${index}`,
          status: file.status || 'done'
        }
      }
    })

    setFileList(processedFiles)
  }, [value])

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  // 文件类型图标映射
  const getFileIcon = (file: UploadFile) => {
    const fileName = file.name || ''
    const extension = fileName.split('.').pop()?.toLowerCase()

    // 图片类型
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
    if (imageExtensions.includes(extension || '') || file.type?.startsWith('image/')) {
      return <FileOutlined style={{ color: '#8c8c8c' }} />
    }

    // 视频类型
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv']
    if (videoExtensions.includes(extension || '') || file.type?.startsWith('video/')) {
      return <FileOutlined style={{ color: '#8c8c8c' }} />
    }

    // 音频类型
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac']
    if (audioExtensions.includes(extension || '') || file.type?.startsWith('audio/')) {
      return <FileOutlined style={{ color: '#8c8c8c' }} />
    }

    // 文档类型
    if (extension === 'pdf' || file.type?.includes('pdf')) {
      return <FileOutlined style={{ color: '#8c8c8c' }} />
    }
    if (['doc', 'docx'].includes(extension || '') || file.type?.includes('word')) {
      return <FileOutlined style={{ color: '#8c8c8c' }} />
    }
    if (['xls', 'xlsx'].includes(extension || '') || file.type?.includes('excel')) {
      return <FileOutlined style={{ color: '#8c8c8c' }} />
    }
    if (['ppt', 'pptx'].includes(extension || '') || file.type?.includes('powerpoint')) {
      return <FileOutlined style={{ color: '#8c8c8c' }} />
    }

    // 默认图标
    return <FileOutlined style={{ color: '#8c8c8c' }} />
  }

  // 文件大小格式化
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 文件类型标签颜色
  const getFileTypeColor = (file: UploadFile) => {
    return 'default'
  }

  // 生成唯一文件名
  const generateUniqueFileName = (originalName: string) => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'))

    return `${nameWithoutExt}_${timestamp}_${random}.${extension}`
  }

  // 处理文件上传
  const handleUpload = useCallback(async (file: File) => {
    if (!autoUpload) return

    const formData = new FormData()

    // 生成唯一文件名避免重名
    const uniqueFileName = generateUniqueFileName(file.name)
    const uniqueFile = new File([file], uniqueFileName, { type: file.type })

    formData.append(name, uniqueFile)

    // 添加业务类型信息
    formData.append('businessType', businessType)

    // 添加子目录信息
    if (subDirectory) {
      formData.append('subDirectory', subDirectory)
    }

    // 添加原始文件名信息（用于显示）
    formData.append('originalName', file.name)

    // 添加额外的数据
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })

    const fileId = `${file.name}-${Date.now()}`
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

    try {
      // 根据业务类型和子目录构建上传URL
      let uploadUrl = action

      // 如果是客户文件且有子目录，使用特殊的客户上传路由
      if (businessType === 'clients' && subDirectory) {
        uploadUrl = `${action}/clients/${subDirectory}`
      } else {
        uploadUrl = `${action}/${businessType}`
        if (subDirectory) {
          uploadUrl += `/${subDirectory}`
        }
      }

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(prev => ({ ...prev, [fileId]: percent }))
          }
        }
      })

      if (response.data.success) {
        message.success(`${file.name} 上传成功`)
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })
        return response
      } else {
        message.error(`${file.name} 上传失败: ${response.data.message}`)
        throw new Error(response.data.message)
      }
    } catch (error) {
      message.error(`${file.name} 上传失败`)
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[fileId]
        return newProgress
      })
      throw error
    }
  }, [action, headers, data, name, withCredentials, autoUpload, businessType, subDirectory])

  // 上传前验证
  const handleBeforeUpload = useCallback((file: File, fileList: File[]) => {
    // 文件大小检查
    if (finalMaxSize && file.size > finalMaxSize * 1024 * 1024) {
      message.error(`${file.name} 文件大小超过 ${finalMaxSize}MB 限制`)
      return false
    }

    // 文件数量检查
    if (maxCount && fileList.length > maxCount) {
      message.error(`最多只能上传 ${maxCount} 个文件`)
      return false
    }

    // 自定义验证
    if (beforeUpload) {
      return beforeUpload(file, fileList)
    }

    return true
  }, [finalMaxSize, maxCount, beforeUpload])

  // 处理文件变化
  const handleChange: UploadProps['onChange'] = useCallback((info: any) => {
    let newFileList = [...info.fileList]

    // 限制文件数量
    if (maxCount) {
      newFileList = newFileList.slice(-maxCount)
    }

    // 更新文件状态并确保每个文件都有唯一的uid
    newFileList = newFileList.map((file, index) => {
      // 确保每个文件都有唯一的uid
      if (!file.uid || file.uid === 'undefined') {
        file.uid = `file-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
      }

      // 优先使用后端返回的原始文件名，如果没有则使用本地文件名
      if (file.response?.data?.originalname) {
        file.name = file.response.data.originalname
      } else if (file.originFileObj) {
        file.name = file.originFileObj.name
      }

      // 设置文件大小
      if (!file.size && file.originFileObj) {
        file.size = file.originFileObj.size
      }

      // 设置文件URL
      if (file.response?.data?.url) {
        file.url = file.response.data.url
      }

      // 设置文件状态
      if (file.response) {
        file.status = 'done'
      }

      return file
    })

    console.log('文件列表更新:', newFileList)
    setFileList(newFileList)
    onChange?.(newFileList)
  }, [maxCount, onChange])

  // 处理预览
  const handlePreview = useCallback((file: UploadFile) => {
    if (onPreview) {
      onPreview(file)
      return
    }

    if (file.url || file.preview) {
      setPreviewImage(file.url || file.preview || '')
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
    }
  }, [onPreview])

  // 处理删除
  const handleRemove = useCallback(async (file: UploadFile) => {
    if (onRemove) {
      const result = await onRemove(file)
      if (result === false) return false
    }

    const newFileList = fileList.filter(item => item.uid !== file.uid)
    setFileList(newFileList)
    onChange?.(newFileList)
    return true
  }, [fileList, onChange, onRemove])

  // 自定义上传请求
  const customUploadRequest = useCallback((options: any) => {
    if (customRequest) {
      customRequest(options)
      return
    }

    const { file, onSuccess, onError, onProgress } = options
    handleUpload(file).then((response) => {
      // 设置文件的上传响应
      if (response && response.data) {
        const responseData = {
          success: true,
          data: {
            url: response.data.data?.url || response.data.url,
            originalname: file.name,
            size: file.size
          }
        }

        // 创建新的文件对象而不是修改原始文件
        const newFile = {
          ...file,
          response: responseData,
          status: 'done',
          url: responseData.data.url,
          name: file.name
        }

        console.log('文件上传成功:', responseData)
        onSuccess?.(responseData)
      }
    }).catch((error) => {
      console.error('文件上传失败:', error)
      file.status = 'error'
      onError?.(error)
    })
  }, [customRequest, handleUpload])

  // 上传组件配置
  const uploadProps: UploadProps = {
    name,
    multiple,
    accept: finalAccept,
    directory,
    action: autoUpload ? action : undefined,
    headers,
    data,
    withCredentials,
    listType,
    fileList,
    showUploadList: false,
    beforeUpload: handleBeforeUpload,
    onChange: handleChange,
    onPreview: handlePreview,
    onRemove: handleRemove,
    customRequest: customUploadRequest,
    disabled,
    itemRender: (originNode, file, fileList, actions) => {
      return (
        <Card
          size="small"
          style={{ marginBottom: 8 }}
          styles={{ body: { padding: 8 } }}
        >
          <Row gutter={8} align="middle">
            <Col flex="none">
              {getFileIcon(file)}
            </Col>
            <Col flex="auto">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text ellipsis style={{ flex: 1 }}>
                  {file.name}
                </Text>
                <Tag color={getFileTypeColor(file)}>
                  {formatFileSize(file.size || 0)}
                </Tag>
              </div>
              {showProgress && uploadProgress[file.uid || ''] !== undefined && (
                <Progress
                  percent={uploadProgress[file.uid || '']}
                  size="small"
                  style={{ marginTop: 4 }}
                />
              )}
            </Col>
            <Col flex="none">
              <Space size="small">
                {showPreviewIcon && (file.type?.startsWith('image/') || file.url) && (
                  <Tooltip title="预览">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(file)}
                    />
                  </Tooltip>
                )}
                {showDownloadIcon && file.url && (
                  <Tooltip title="下载">
                    <Button
                      type="text"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(file.url, '_blank')}
                    />
                  </Tooltip>
                )}
                {showRemoveIcon && (
                  <Tooltip title="删除">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(file)}
                    />
                  </Tooltip>
                )}
              </Space>
            </Col>
          </Row>
        </Card>
      )
    }
  }

  // 渲染上传区域
  const renderUploadArea = () => {
    if (dragUpload) {
      return (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{finalPlaceholder}</p>
          {finalHelpText && (
            <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              {finalHelpText}
            </Paragraph>
          )}
        </Dragger>
      )
    }

    return (
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} disabled={disabled}>
          选择文件
        </Button>
      </Upload>
    )
  }

  return (
    <div style={style} className={className}>
      {renderUploadArea()}

      {/* 空状态显示 */}
      {fileList.length === 0 && (
        <div style={{
          marginTop: 20,
          padding: '40px 20px',
          textAlign: 'center',
          background: '#fafafa',
          borderRadius: '12px',
          border: '2px dashed #d9d9d9'
        }}>
          <FileOutlined style={{
            fontSize: 48,
            color: '#d9d9d9',
            marginBottom: 16
          }} />
          <div style={{ color: '#8c8c8c', fontSize: 14 }}>
            暂无文件，请上传文件
          </div>
        </div>
      )}

      {/* 自定义文件列表显示 */}
      {fileList.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 16,
            padding: '12px 16px',
            background: '#f5f5f5',
            borderRadius: '6px',
            color: '#333',
            border: '1px solid #e8e8e8'
          }}>
            <FileOutlined style={{ marginRight: 8, fontSize: 16, color: '#666' }} />
            <Text style={{ color: '#333', fontWeight: 500, fontSize: 14 }}>
              已上传文件 ({fileList.length})
            </Text>
          </div>

          <div style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {fileList.map((file) => (
              <Card
                key={file.uid}
                size="small"
                style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                styles={{
                  body: {
                    padding: 16,
                    position: 'relative'
                  }
                }}
                hoverable
              >


                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {/* 文件图标 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '6px',
                    background: '#f5f5f5',
                    border: '1px solid #e8e8e8',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: 24, color: '#666' }}>
                      {getFileIcon(file)}
                    </div>
                  </div>

                  {/* 文件信息 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      marginBottom: 6
                    }}>
                      <Text
                        strong
                        style={{
                          fontSize: 12,
                          color: '#262626',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                          marginBottom: 6
                        }}
                      >
                        {file.name}
                      </Text>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        <Tag
                          color={getFileTypeColor(file)}
                          style={{
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 500,
                            border: 'none'
                          }}
                        >
                          {formatFileSize(file.size || 0)}
                        </Tag>
                        {showPreviewIcon && (file.type?.startsWith('image/') || file.url) && (
                          <Tooltip title="预览">
                            <Button
                              type="text"
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => handlePreview(file)}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '4px',
                                color: '#666',
                                padding: 0
                              }}
                            />
                          </Tooltip>
                        )}
                        {showDownloadIcon && file.url && (
                          <Tooltip title="下载">
                            <Button
                              type="text"
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => window.open(file.url, '_blank')}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '4px',
                                color: '#666',
                                padding: 0
                              }}
                            />
                          </Tooltip>
                        )}
                        {showRemoveIcon && (
                          <Tooltip title="删除">
                            <Button
                              type="text"
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemove(file)}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '4px',
                                color: '#666',
                                padding: 0
                              }}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    {/* 上传进度 */}
                    {showProgress && uploadProgress[file.uid || ''] !== undefined && (
                      <Progress
                        percent={uploadProgress[file.uid || '']}
                        size="small"
                        strokeColor="#1890ff"
                        style={{ marginTop: 4 }}
                        showInfo={false}
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {errorText && (
        <Text type="danger" style={{ fontSize: 12, marginTop: 8 }}>
          {errorText}
        </Text>
      )}

      {/* 文件预览模态窗 */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default FileUpload 