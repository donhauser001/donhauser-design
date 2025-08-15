import React, { useState } from 'react';
import { Upload, Image, Button, message } from 'antd';
import { PlusOutlined, UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface ArticleCoverImageComponentProps {
    component: FormComponent;
}

const ArticleCoverImageComponent: React.FC<ArticleCoverImageComponentProps> = ({ component }) => {
    const { theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
    const borderColor = theme.borderColor || '#d9d9d9';
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<any[]>([]);

    const uploadType = component.uploadType || 'drag'; // 'button' | 'drag' | 'card'

    // 生成accept属性
    const getAcceptAttribute = () => {
        const acceptedFormats = component.acceptedFormats || ['jpeg', 'jpg', 'png', 'webp'];
        const mimeTypes = acceptedFormats.map(format => {
            switch (format.toLowerCase()) {
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
                case 'png':
                    return 'image/png';
                case 'webp':
                    return 'image/webp';
                case 'gif':
                    return 'image/gif';
                case 'bmp':
                    return 'image/bmp';
                case 'svg':
                    return 'image/svg+xml';
                default:
                    return `image/${format}`;
            }
        });
        return mimeTypes.join(',');
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
    };

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: File) => {
        const acceptedFormats = component.acceptedFormats || ['jpeg', 'jpg', 'png', 'webp'];
        const allowedMimeTypes = acceptedFormats.map(format => {
            switch (format.toLowerCase()) {
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
                case 'png':
                    return 'image/png';
                case 'webp':
                    return 'image/webp';
                case 'gif':
                    return 'image/gif';
                case 'bmp':
                    return 'image/bmp';
                case 'svg':
                    return 'image/svg+xml';
                default:
                    return `image/${format}`;
            }
        });

        const isValidFormat = allowedMimeTypes.includes(file.type);
        if (!isValidFormat) {
            const formatNames = acceptedFormats.map(f => f.toUpperCase()).join('、');
            message.error(`只能上传 ${formatNames} 格式的图片!`);
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < (component.maxFileSize || 5);
        if (!isLt5M) {
            message.error(`图片大小不能超过 ${component.maxFileSize || 5}MB!`);
            return false;
        }
        return true;
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传封面</div>
        </div>
    );

    // 卡片式上传
    if (uploadType === 'card') {
        const cardContainerId = `cover-card-${component.id}`;
        return (
            <div style={getDescriptionContainerStyle(theme)}>
                {renderTopDescription({ component, theme })}

                <div style={getComponentContentStyle(theme)}>
                    <div id={cardContainerId} style={component.style}>
                        <style>
                            {`
                        /* 卡片上传区域边框和悬停效果 */
                        #${cardContainerId} .ant-upload-select {
                            border-color: ${borderColor} !important;
                        }
                        
                        #${cardContainerId} .ant-upload-select:hover {
                            border-color: ${primaryColor} !important;
                        }
                        
                        #${cardContainerId} .ant-upload-select .ant-upload {
                            background-color: transparent !important;
                        }
                        
                        #${cardContainerId} .ant-upload-select:hover .ant-upload {
                            background-color: ${primaryColor}08 !important;
                        }
                        
                        /* 上传图标颜色 */
                        #${cardContainerId} .ant-upload-select .anticon {
                            color: ${primaryColor} !important;
                        }
                        
                        /* 上传文字颜色 */
                        #${cardContainerId} .ant-upload-select .ant-upload-text {
                            color: ${primaryColor} !important;
                        }
                        `}
                        </style>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            disabled={component.disabled}
                            maxCount={1}
                            accept={getAcceptAttribute()}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </div>
                </div>

                {renderBottomDescription({ component, theme })}
                {renderRightDescription({ component, theme })}
            </div>
        );
    }

    // 拖拽上传
    if (uploadType === 'drag') {
        const { Dragger } = Upload;
        const dragContainerId = `cover-drag-${component.id}`;
        return (
            <div style={getDescriptionContainerStyle(theme)}>
                {renderTopDescription({ component, theme })}

                <div style={getComponentContentStyle(theme)}>
                    <div id={dragContainerId} style={component.style}>
                        <style>
                            {`
                        /* 拖拽区域边框和悬停效果 */
                        #${dragContainerId} .ant-upload-drag {
                            border-color: ${borderColor} !important;
                        }
                        
                        #${dragContainerId} .ant-upload-drag:hover,
                        #${dragContainerId} .ant-upload-drag.ant-upload-drag-hover {
                            border-color: ${primaryColor} !important;
                            background-color: ${primaryColor}08 !important;
                        }
                        
                        /* 文件列表边框颜色 */
                        #${dragContainerId} .ant-upload-list-item {
                            border-color: ${borderColor} !important;
                        }
                        
                        #${dragContainerId} .ant-upload-list-item:hover {
                            border-color: ${primaryColor} !important;
                        }
                        `}
                        </style>
                        <Dragger
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            disabled={component.disabled}
                            maxCount={1}
                            accept={getAcceptAttribute()}
                            style={{ padding: '20px' }}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined style={{ fontSize: '48px', color: primaryColor }} />
                            </p>
                            <p className="ant-upload-text">
                                {component.uploadButtonText || '点击或拖拽文件到此区域上传'}
                            </p>
                            <p className="ant-upload-hint">
                                {component.fieldDescription || (() => {
                                    const acceptedFormats = component.acceptedFormats || ['jpeg', 'jpg', 'png', 'webp'];
                                    const formatNames = acceptedFormats.map(f => f.toUpperCase()).join('、');
                                    return `支持 ${formatNames} 格式，文件大小不超过 ${component.maxFileSize || 5}MB`;
                                })()}
                            </p>
                        </Dragger>

                        {fileList.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                {fileList.map((file, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px',
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: '4px',
                                        marginBottom: '8px'
                                    }}>
                                        <Image
                                            width={60}
                                            height={60}
                                            src={file.url || file.thumbUrl}
                                            style={{ marginRight: '12px', objectFit: 'cover' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500 }}>{file.name}</div>
                                            <div style={{ color: '#666', fontSize: '12px' }}>
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={() => handlePreview(file)}
                                                style={{ marginRight: '8px' }}
                                            />
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => {
                                                    const newFileList = fileList.filter((_, i) => i !== index);
                                                    setFileList(newFileList);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {renderBottomDescription({ component, theme })}
                {renderRightDescription({ component, theme })}
            </div>
        );
    }

    // 按钮上传（默认）
    const buttonContainerId = `cover-button-${component.id}`;
    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <div id={buttonContainerId} style={component.style}>
                    <style>
                        {`
                    /* 按钮上传样式 */
                    #${buttonContainerId} .ant-btn {
                        border-color: ${primaryColor} !important;
                        color: ${primaryColor} !important;
                    }
                    
                    #${buttonContainerId} .ant-btn:hover,
                    #${buttonContainerId} .ant-btn:focus {
                        border-color: ${primaryColor} !important;
                        color: ${primaryColor} !important;
                        background-color: ${primaryColor}08 !important;
                    }
                    
                    /* 上传列表项悬停效果 */
                    #${buttonContainerId} .ant-upload-list-item:hover {
                        border-color: ${primaryColor} !important;
                    }
                    
                    /* 上传列表中的文件名链接 */
                    #${buttonContainerId} .ant-upload-list-item-name {
                        color: ${primaryColor} !important;
                    }
                    `}
                    </style>
                    <Upload
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                        disabled={component.disabled}
                        maxCount={1}
                        accept={getAcceptAttribute()}
                        showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                        }}
                        onPreview={handlePreview}
                    >
                        <Button icon={<UploadOutlined />} disabled={component.disabled || fileList.length >= 1}>
                            {component.uploadButtonText || '上传封面图'}
                        </Button>
                    </Upload>
                </div>
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ArticleCoverImageComponent;
