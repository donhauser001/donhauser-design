import React, { useState, useEffect } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface UploadComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
    const borderColor = theme.borderColor || '#d9d9d9';
    const [fileList, setFileList] = useState(getInitialValue() || []);

    // 监听外部值变化
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null && JSON.stringify(currentValue) !== JSON.stringify(fileList)) {
            setFileList(currentValue || []);
        }
    }, [getValue, fileList]);

    // 处理文件列表变化
    const handleFileListChange = (info: any) => {
        const newFileList = info.fileList;
        setFileList(newFileList);
        setValue(newFileList);
    };
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
                disabled={isDesignMode}
                showUploadList={component.showFileList !== false}
                fileList={fileList}
                onChange={handleFileListChange}
                style={{ width: '100%' }}
            >
                <Button
                    icon={<UploadOutlined />}
                    disabled={isDesignMode}
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
                disabled={isDesignMode}
                showUploadList={component.showFileList !== false}
                fileList={fileList}
                onChange={handleFileListChange}
                style={{ width: '100%' }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: '48px', color: primaryColor }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', color: primaryColor }}>
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

    // 渲染字段说明（响应主题设置）
    const renderFieldDescription = () => {
        const description = getFieldDescription();
        if (!description) return null;

        const position = theme.descriptionPosition || 'bottom';
        const fontSize = theme.descriptionFontSize || '12px';
        const color = theme.descriptionColor || '#8c8c8c';

        const baseStyle: React.CSSProperties = {
            fontSize,
            color,
            lineHeight: '1.4',
            whiteSpace: 'pre-line'
        };

        // 根据位置设置不同的样式
        switch (position) {
            case 'top':
                return (
                    <div style={{ ...baseStyle, marginBottom: '4px' }}>
                        提示：{description}
                    </div>
                );
            case 'right':
                return (
                    <div style={{
                        ...baseStyle,
                        marginLeft: '8px',
                        alignSelf: 'flex-start',
                        paddingTop: '6px'
                    }}>
                        提示：{description}
                    </div>
                );
            case 'bottom':
            default:
                return (
                    <div style={{ ...baseStyle, marginTop: '4px' }}>
                        提示：{description}
                    </div>
                );
        }
    };

    // 获取容器样式（根据说明文字位置调整）
    const getContainerStyle = (): React.CSSProperties => {
        const position = theme.descriptionPosition || 'bottom';

        if (position === 'right') {
            return {
                display: 'flex',
                alignItems: 'flex-start',
                width: '100%'
            };
        }

        return { width: '100%' };
    };

    // 获取组件内容样式（当说明文字在右侧时需要调整）
    const getContentStyle = (): React.CSSProperties => {
        const position = theme.descriptionPosition || 'bottom';

        if (position === 'right') {
            return { flex: 1, minWidth: 0 };
        }

        return {};
    };

    const uploadContainerId = `upload-container-${component.id}`;

    return (
        <div id={uploadContainerId} style={getContainerStyle()}>
            <style>
                {`
                /* 上传按钮主题色 - 默认按钮样式 */
                #${uploadContainerId} .ant-btn {
                    border-color: ${primaryColor} !important;
                    color: ${primaryColor} !important;
                }
                
                #${uploadContainerId} .ant-btn:hover,
                #${uploadContainerId} .ant-btn:focus {
                    border-color: ${primaryColor} !important;
                    color: ${primaryColor} !important;
                    background-color: ${primaryColor}08 !important;
                }
                
                /* 主要按钮样式 */
                #${uploadContainerId} .ant-btn-primary {
                    background-color: ${primaryColor} !important;
                    border-color: ${primaryColor} !important;
                    color: #fff !important;
                }
                
                #${uploadContainerId} .ant-btn-primary:hover,
                #${uploadContainerId} .ant-btn-primary:focus {
                    background-color: ${primaryColor}d9 !important;
                    border-color: ${primaryColor}d9 !important;
                    color: #fff !important;
                }
                
                #${uploadContainerId} .ant-btn-primary:active {
                    background-color: ${primaryColor}b3 !important;
                    border-color: ${primaryColor}b3 !important;
                    color: #fff !important;
                }
                
                /* 拖拽区域边框颜色 */
                #${uploadContainerId} .ant-upload-drag {
                    border-color: ${borderColor} !important;
                }
                
                #${uploadContainerId} .ant-upload-drag:hover {
                    border-color: ${primaryColor} !important;
                }
                
                #${uploadContainerId} .ant-upload-drag.ant-upload-drag-hover {
                    border-color: ${primaryColor} !important;
                    background-color: ${primaryColor}08 !important;
                }
                
                /* 上传列表中的链接颜色 */
                #${uploadContainerId} .ant-upload-list-item-name {
                    color: ${primaryColor} !important;
                }
                
                /* 上传进度条颜色 */
                #${uploadContainerId} .ant-progress-bg {
                    background-color: ${primaryColor} !important;
                }
                
                /* 上传成功图标颜色 */
                #${uploadContainerId} .ant-upload-list-item-done .ant-upload-list-item-name {
                    color: ${primaryColor} !important;
                }
                
                /* 删除按钮悬停效果 */
                #${uploadContainerId} .ant-upload-list-item-card-actions .anticon:hover {
                    color: ${primaryColor} !important;
                }
                `}
            </style>

            {theme.descriptionPosition === 'top' && renderFieldDescription()}

            <div style={{ ...getContentStyle(), ...component.style }}>
                {component.uploadType === 'dragger' ? renderDraggerUpload() : renderButtonUpload()}
            </div>

            {theme.descriptionPosition === 'bottom' && renderFieldDescription()}
            {theme.descriptionPosition === 'right' && renderFieldDescription()}
        </div>
    );
};

export default UploadComponent; 