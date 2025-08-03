import React from 'react'
import { Card, Button, Tooltip, Tag } from 'antd'
import { FileOutlined, DownloadOutlined } from '@ant-design/icons'

import FileUpload from '../../../components/FileUpload'
import { FileManagementProps } from './types'
import { formatFileSize, getFileTypeColor, getFileIconColor } from './utils'

export const FileManagement: React.FC<FileManagementProps> = ({
    projectFiles,
    clientFiles,
    projectId,
    onProjectFilesChange
}) => {
    // 判断是显示项目文件还是客户文件
    const showProjectFiles = projectFiles.length > 0 || (projectFiles.length === 0 && clientFiles.length === 0 && onProjectFilesChange !== (() => { }))
    const showClientFiles = clientFiles.length > 0 || (clientFiles.length === 0 && projectFiles.length === 0)

    return (
        <div>
            {/* 项目文件 */}
            {showProjectFiles && (
                <div>
                    <FileUpload
                        value={projectFiles}
                        onChange={onProjectFilesChange}
                        businessType="projects"
                        subDirectory={projectId}
                        maxCount={20}
                        multiple={true}
                        placeholder="上传项目相关文件"
                        helpText="支持文档、设计稿、视频等，单个文件不超过50MB"
                        style={{ marginBottom: 8 }}
                    />
                </div>
            )}

            {/* 客户文件 */}
            {showClientFiles && (
                <div>
                    {clientFiles.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gap: 12,
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            maxWidth: '100%',
                            overflow: 'hidden'
                        }}>
                            {clientFiles.map((file) => (
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
                                        overflow: 'hidden',
                                        minHeight: '80px'
                                    }}
                                    styles={{
                                        body: {
                                            padding: 12,
                                            position: 'relative'
                                        }
                                    }}
                                    hoverable
                                    onClick={() => window.open(file.url, '_blank')}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        {/* 文件图标 */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 44,
                                            height: 44,
                                            borderRadius: '6px',
                                            background: '#ffffff',
                                            border: '1px solid #e8e8e8',
                                            flexShrink: 0
                                        }}>
                                            <div style={{ fontSize: 20, color: getFileIconColor(file) }}>
                                                <FileOutlined />
                                            </div>
                                        </div>

                                        {/* 文件信息 */}
                                        <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
                                            <div style={{ marginBottom: 6 }}>
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: '#262626',
                                                        fontWeight: 600,
                                                        wordBreak: 'break-word',
                                                        lineHeight: '1.4',
                                                        display: 'block',
                                                        marginBottom: 6,
                                                        whiteSpace: 'normal',
                                                        overflow: 'visible',
                                                        textOverflow: 'unset'
                                                    }}
                                                >
                                                    {file.name}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    flexWrap: 'wrap',
                                                    maxWidth: '100%'
                                                }}>
                                                    <Tag
                                                        color={getFileTypeColor(file)}
                                                        style={{
                                                            borderRadius: '10px',
                                                            fontSize: '10px',
                                                            fontWeight: 500,
                                                            border: 'none',
                                                            padding: '2px 6px',
                                                            lineHeight: '1.2'
                                                        }}
                                                    >
                                                        {formatFileSize(file.size || 0)}
                                                    </Tag>
                                                    {file.url && (
                                                        <Tooltip title="下载">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<DownloadOutlined />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    window.open(file.url, '_blank')
                                                                }}
                                                                style={{
                                                                    width: 22,
                                                                    height: 22,
                                                                    borderRadius: '4px',
                                                                    color: '#666',
                                                                    padding: 0,
                                                                    minWidth: 22
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#8c8c8c',
                            fontSize: 14
                        }}>
                            暂无客户文件
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 