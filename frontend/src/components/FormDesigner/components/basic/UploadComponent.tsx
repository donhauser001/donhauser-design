import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';

interface UploadComponentProps {
    component: FormComponent;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ component }) => {
    // 获取accept属性
    const getAcceptTypes = () => {
        if (!component.allowedFileTypes || component.allowedFileTypes.length === 0) {
            return undefined;
        }
        return component.allowedFileTypes.join(',');
    };

    // 获取允许的文件类型显示文本
    const getFileTypesDisplay = () => {
        if (!component.allowedFileTypes || component.allowedFileTypes.length === 0) {
            return '支持所有类型的文件';
        }

        const typeMap: { [key: string]: string } = {
            'image/*': '图片',
            '.pdf': 'PDF',
            '.doc,.docx': 'Word',
            '.xls,.xlsx': 'Excel',
            '.ppt,.pptx': 'PPT',
            '.txt': '文本',
            '.zip,.rar': '压缩包',
            'video/*': '视频',
            'audio/*': '音频',
            '.psd': 'PSD',
            '.ai': 'AI',
            '.indd': 'INDD',
            '.idml': 'IDML',
            '.eps': 'EPS'
        };

        const displayTypes = component.allowedFileTypes.map(type => typeMap[type] || type.replace(/[.*]/g, '')).join('、');
        return `支持：${displayTypes}类型的文件`;
    };

    // 渲染按钮上传
    const renderButtonUpload = () => {
        return (
            <Upload
                multiple={component.maxFileCount !== 1}
                maxCount={component.maxFileCount || 1}
                accept={getAcceptTypes()}
                disabled={true}
                showUploadList={component.showFileList !== false}
                style={{ width: '100%' }}
            >
                <Button
                    icon={<UploadOutlined />}
                    disabled={true}
                    style={{ width: '100%' }}
                >
                    {component.uploadButtonText || '点击上传'}
                </Button>
            </Upload>
        );
    };

    // 渲染拖拽上传
    const renderDraggerUpload = () => {
        const { Dragger } = Upload;

        return (
            <Dragger
                multiple={component.maxFileCount !== 1}
                maxCount={component.maxFileCount || 1}
                accept={getAcceptTypes()}
                disabled={true}
                showUploadList={component.showFileList !== false}
                style={{ width: '100%' }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', color: '#666' }}>
                    {component.uploadButtonText || '点击或拖拽文件到此区域上传'}
                </p>
                <p className="ant-upload-hint" style={{ fontSize: '14px', color: '#999' }}>
                    {getFileTypesDisplay()}
                </p>
            </Dragger>
        );
    };

    // 获取完整的自动说明文本（包含文件类型、数量、大小限制）
    const getAutoDescription = () => {
        const parts: string[] = [];

        // 文件类型信息
        parts.push(getFileTypesDisplay());

        // 文件数量和大小信息
        const maxCount = component.maxFileCount || 1;
        let limitInfo = `支持上传${maxCount === 1 ? '单个' : '最多' + maxCount + '个'}文件`;
        if (component.maxFileSize) {
            limitInfo += `，单个文件不超过${component.maxFileSize}MB`;
        }
        parts.push(limitInfo);

        return parts.join('，');
    };

    // 获取字段说明文本
    const getFieldDescription = () => {
        if (component.uploadType === 'button') {
            // 按钮上传模式：生成自动说明
            const autoDescription = getAutoDescription();

            if (component.fieldDescription) {
                // 用户有自定义说明，附加在自动说明后面
                return `${autoDescription}\n${component.fieldDescription}`;
            }

            return autoDescription;
        } else {
            // 拖拽上传模式：只显示用户自定义说明
            return component.fieldDescription;
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {component.uploadType === 'dragger' ? renderDraggerUpload() : renderButtonUpload()}
            {getFieldDescription() && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-line'
                }}>
                    {getFieldDescription()}
                </div>
            )}
        </div>
    );
};

export default UploadComponent; 