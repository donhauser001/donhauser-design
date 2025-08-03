import React, { useState } from 'react'
import { Card, Typography, Space } from 'antd'
import FileUpload from './FileUpload'
import type { UploadFile } from 'antd/es/upload/interface'

const { Title } = Typography

const FileUploadTest: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleFilesChange = (files: UploadFile[]) => {
    console.log('文件列表变化:', files)
    setFileList(files)
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>文件上传测试</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="客户文件上传测试" style={{ width: '100%' }}>
          <FileUpload
            businessType="clients"
            subDirectory="test-client-123"
            multiple={true}
            maxCount={5}
            value={fileList}
            onChange={handleFilesChange}
            placeholder="上传测试文件"
            helpText="支持图片、文档等格式，单个文件不超过 10MB"
          />
        </Card>

        <Card title="当前文件列表" style={{ width: '100%' }}>
          <pre>{JSON.stringify(fileList, null, 2)}</pre>
        </Card>
      </Space>
    </div>
  )
}

export default FileUploadTest 