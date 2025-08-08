import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImageCropper from './ImageCropper';

const ImageCropperTest: React.FC = () => {
    const [cropperVisible, setCropperVisible] = useState(false);
    const [testImageUrl, setTestImageUrl] = useState('https://picsum.photos/800/600');

    const handleCrop = (croppedImageUrl: string) => {
        message.success('裁切成功！');
        console.log('裁切后的图片URL:', croppedImageUrl);
        setCropperVisible(false);
    };

    const handleCancel = () => {
        setCropperVisible(false);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card title="图片裁切测试" style={{ maxWidth: 600, margin: '0 auto' }}>
                <div style={{ textAlign: 'center' }}>
                    <h3>测试图片</h3>
                    <img 
                        src={testImageUrl} 
                        alt="测试图片" 
                        style={{ 
                            maxWidth: '100%', 
                            height: 'auto',
                            border: '1px solid #d9d9d9',
                            borderRadius: 8
                        }} 
                    />
                    
                    <div style={{ marginTop: 24 }}>
                        <Button 
                            type="primary" 
                            icon={<UploadOutlined />}
                            onClick={() => setCropperVisible(true)}
                            size="large"
                        >
                            测试裁切功能
                        </Button>
                    </div>
                    
                    <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
                        点击按钮打开裁切器，测试4:3比例裁切功能
                    </div>
                </div>
            </Card>

            <ImageCropper
                visible={cropperVisible}
                imageUrl={testImageUrl}
                onCancel={handleCancel}
                onConfirm={handleCrop}
                aspectRatio={4/3}
            />
        </div>
    );
};

export default ImageCropperTest; 