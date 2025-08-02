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

  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    // 确保传入的文件列表中每个文件都有唯一的uid
    return value.map((item, index) => {
      if (typeof item === 'string') {
        const filePath = item
        const urlFileName = filePath.split('/').pop() || 'file'
        let fileName = urlFileName

        // 如果是生成的文件名格式，提取原始文件名
        if (urlFileName.includes('-')) {
          const parts = urlFileName.split('-')
          if (parts.length >= 3) {
            const lastPart = parts[parts.length - 1]
            const extension = lastPart.split('.').pop()
            const originalName = parts[0]
            fileName = `${originalName}.${extension}`
          }
        }

        return {
          uid: `initial-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          name: fileName,
          size: 1024, // 设置一个合理的默认大小，避免显示0B
          status: 'done' as const,
          url: filePath,
          response: { data: { url: filePath } }
        }
      } else if (typeof item === 'object' && 'path' in item && 'originalName' in item && 'size' in item) {
        // 新的文件格式：{ path, originalName, size }
        return {
          uid: `initial-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.originalName,
          size: item.size,
          status: 'done' as const,
          url: item.path,
          response: { data: { url: item.path } }
        }
      } else {
        return {
          ...item,
          uid: item.uid || `initial-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
        }
      }
    })
  })

  // 监听value变化，更新文件列表
  useEffect(() => {
    // 只有当value真正变化时才更新fileList
    const currentValue = JSON.stringify(value.map(f => {
      if (typeof f === 'string') return f
      if (typeof f === 'object' && 'path' in f) return f.path
      return f.url
    }))
    const prevValue = JSON.stringify(prevValueRef.current.map(f => {
      if (typeof f === 'string') return f
      if (typeof f === 'object' && 'path' in f) return f.path
      return f.url
    }))

    if (currentValue !== prevValue) {
      // 处理value，可能是字符串数组或对象数组
      const processedValue = value.map((item, index) => {
        // 如果是字符串，转换为对象
        if (typeof item === 'string') {
          const filePath = item
          const urlFileName = filePath.split('/').pop() || 'file'
          let fileName = urlFileName

          // 如果是生成的文件名格式，提供更友好的显示
          if (urlFileName.includes('-')) {
            const parts = urlFileName.split('-')
            if (parts.length >= 3) {
              const lastPart = parts[parts.length - 1]
              const extension = lastPart.split('.').pop()
              // 使用更有意义的文件名，比如"图片1.png"
              fileName = `图片${index + 1}.${extension}`
            } else {
              fileName = urlFileName
            }
          } else {
            fileName = urlFileName
          }

          return {
            uid: `string-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            name: fileName,
            size: 1024, // 设置一个合理的默认大小，避免显示0B
            status: 'done' as const,
            url: filePath,
            response: { data: { url: filePath } }
          }
        } else if (typeof item === 'object' && 'path' in item && 'originalName' in item && 'size' in item) {
          // 新的文件格式：{ path, originalName, size }
          return {
            uid: `object-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            name: item.originalName,
            size: item.size,
            status: 'done' as const,
            url: item.path,
            response: { data: { url: item.path } }
          }
        } else {
          // UploadFile格式
          let fileName = item.name
          let fileSize = item.size

          // 如果没有文件名，尝试从URL中提取
          if (!fileName && item.url) {
            const urlFileName = item.url.split('/').pop() || 'file'

            // 如果是生成的文件名格式，提供更友好的显示
            if (urlFileName.includes('-')) {
              const parts = urlFileName.split('-')
              if (parts.length >= 3) {
                const lastPart = parts[parts.length - 1]
                const extension = lastPart.split('.').pop()
                // 使用更有意义的文件名，比如"图片1.png"
                fileName = `图片${index + 1}.${extension}`
              } else {
                fileName = urlFileName
              }
            } else {
              fileName = urlFileName
            }
          }

          return {
            ...item,
            uid: item.uid || `object-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            name: fileName,
            size: fileSize || 0
          }
        }
      })

      setFileList(processedValue)
      prevValueRef.current = value
    }
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

    if (file.type?.startsWith('image/')) return <PictureOutlined />
    if (file.type?.startsWith('video/')) return <VideoCameraOutlined />
    if (file.type?.startsWith('audio/')) return <AudioOutlined />
    if (file.type?.includes('pdf') || extension === 'pdf') return <FileTextOutlined />
    if (file.type?.includes('word') || extension === 'doc' || extension === 'docx') return <FileTextOutlined />
    if (file.type?.includes('excel') || extension === 'xls' || extension === 'xlsx') return <FileTextOutlined />
    if (file.type?.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return <FileTextOutlined />

    return <FileOutlined />
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
    const fileName = file.name || ''
    const extension = fileName.split('.').pop()?.toLowerCase()

    if (file.type?.startsWith('image/')) return 'green'
    if (file.type?.startsWith('video/')) return 'blue'
    if (file.type?.startsWith('audio/')) return 'purple'
    if (file.type?.includes('pdf') || extension === 'pdf') return 'red'
    if (file.type?.includes('word') || extension === 'doc' || extension === 'docx') return 'blue'
    if (file.type?.includes('excel') || extension === 'xls' || extension === 'xlsx') return 'green'
    if (file.type?.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return 'orange'

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

      // 确保文件名和大小信息正确设置
      if (!file.name && file.originFileObj) {
        file.name = file.originFileObj.name
      }
      if (!file.size && file.originFileObj) {
        file.size = file.originFileObj.size
      }

      if (file.response) {
        file.url = file.response.url
      }
      return file
    })

    setFileList(newFileList)
    onChange?.(newFileList)

    // 注意：自动上传逻辑已移除，因为customUploadRequest已经处理了上传
    // 这里只处理文件列表的更新，避免重复上传
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
        file.response = response.data
        file.status = 'done'
        file.url = response.data.url
        // 确保文件名和大小信息正确设置
        if (!file.name && file.originFileObj) {
          file.name = file.originFileObj.name
        }
        if (!file.size && file.originFileObj) {
          file.size = file.originFileObj.size
        }
      }
      onSuccess?.(response?.data)
    }).catch((error) => {
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
    showUploadList: {
      showPreviewIcon,
      showRemoveIcon,
      showDownloadIcon
    },
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
          bodyStyle={{ padding: 8 }}
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