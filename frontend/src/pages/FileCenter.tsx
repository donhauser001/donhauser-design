import React from 'react'
import { Card, Table, Button, Space, Input, Select, Upload, Tag } from 'antd'
import { SearchOutlined, PlusOutlined, UploadOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons'

const { Option } = Select

const FileCenter: React.FC = () => {
    const columns = [
        {
            title: '文件名',
            dataIndex: 'fileName',
            key: 'fileName',
            render: (fileName: string, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {record.type === 'folder' ? (
                        <FolderOutlined style={{ marginRight: 8, color: '#faad14' }} />
                    ) : (
                        <FileOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    )}
                    {fileName}
                </div>
            )
        },
        {
            title: '文件大小',
            dataIndex: 'fileSize',
            key: 'fileSize',
        },
        {
            title: '文件类型',
            dataIndex: 'fileType',
            key: 'fileType',
        },
        {
            title: '上传者',
            dataIndex: 'uploader',
            key: 'uploader',
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <Button type="link" size="small">下载</Button>
                    <Button type="link" size="small">预览</Button>
                    <Button type="link" size="small" danger>删除</Button>
                </Space>
            ),
        },
    ]

    const data = [
        {
            key: '1',
            fileName: '项目设计稿',
            type: 'folder',
            fileSize: '-',
            fileType: '文件夹',
            uploader: '设计师A',
            uploadTime: '2024-01-20 10:30',
        },
        {
            key: '2',
            fileName: 'logo设计.ai',
            type: 'file',
            fileSize: '2.5MB',
            fileType: 'AI文件',
            uploader: '设计师B',
            uploadTime: '2024-01-19 15:20',
        },
        {
            key: '3',
            fileName: '项目合同.pdf',
            type: 'file',
            fileSize: '1.2MB',
            fileType: 'PDF文件',
            uploader: '管理员',
            uploadTime: '2024-01-18 09:15',
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>文件中心</h1>
                <Space>
                    <Upload>
                        <Button icon={<UploadOutlined />}>上传文件</Button>
                    </Upload>
                    <Button type="primary" icon={<PlusOutlined />}>
                        新建文件夹
                    </Button>
                </Space>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索文件名"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="文件类型" style={{ width: 120 }}>
                            <Option value="all">全部类型</Option>
                            <Option value="image">图片</Option>
                            <Option value="document">文档</Option>
                            <Option value="video">视频</Option>
                        </Select>
                        <Select placeholder="上传者" style={{ width: 120 }}>
                            <Option value="all">全部用户</Option>
                            <Option value="designer-a">设计师A</Option>
                            <Option value="designer-b">设计师B</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    )
}

export default FileCenter 