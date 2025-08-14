import React, { useState } from 'react';
import { Upload, Image, Button, message } from 'antd';
import { PlusOutlined, UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';

interface ArticleCoverImageComponentProps {
    component: FormComponent;
}

const ArticleCoverImageComponent: React.FC<ArticleCoverImageComponentProps> = ({ component }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<any[]>([]);

    const uploadType = component.uploadType || 'drag'; // 'button' | 'drag' | 'card'

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
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG/WebP 格式的图片!');
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
        return (
            <div style={component.style}>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    disabled={component.disabled}
                    maxCount={1}
                    accept="image/*"
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
        );
    }

    // 拖拽上传
    if (uploadType === 'drag') {
        const { Dragger } = Upload;
        return (
            <div style={component.style}>
                <Dragger
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    disabled={component.disabled}
                    maxCount={1}
                    accept="image/*"
                    style={{ padding: '20px' }}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">
                        {component.uploadButtonText || '点击或拖拽文件到此区域上传'}
                    </p>
                    <p className="ant-upload-hint">
                        {component.uploadTip || '支持 JPG、PNG、WebP 格式，文件大小不超过 5MB'}
                    </p>
                </Dragger>

                {fileList.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                        {fileList.map((file, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px',
                                border: '1px solid #d9d9d9',
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
        );
    }

    // 按钮上传（默认）
    return (
        <div style={component.style}>
            <Upload
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                disabled={component.disabled}
                maxCount={1}
                accept="image/*"
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
            {component.uploadTip && (
                <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                    {component.uploadTip}
                </div>
            )}
        </div>
    );
};

export default ArticleCoverImageComponent;
