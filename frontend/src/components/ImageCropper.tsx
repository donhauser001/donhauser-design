import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Button, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

interface ImageCropperProps {
    visible: boolean;
    imageUrl: string;
    onCancel: () => void;
    onConfirm: (croppedImageUrl: string) => void;
    aspectRatio?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
    visible,
    imageUrl,
    onCancel,
    onConfirm,
    aspectRatio = 4 / 3
}) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isProcessing, setIsProcessing] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // 初始化裁切区域
    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspectRatio,
                width,
                height,
            ),
            width,
            height,
        );
        setCrop(crop);
    }, [aspectRatio]);

    // 获取裁切后的图片
    const getCroppedImg = useCallback(async (): Promise<string> => {
        if (!imgRef.current || !completedCrop) {
            throw new Error('No image or crop data');
        }

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height,
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    // 直接转换为 base64，避免使用 blob URL
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(blob);
                }
            }, 'image/jpeg', 0.9);
        });
    }, [completedCrop]);

    // 确认裁切
    const handleConfirm = async () => {
        if (!completedCrop) {
            message.warning('请先选择裁切区域');
            return;
        }

        setIsProcessing(true);
        try {
            const croppedImageUrl = await getCroppedImg();
            onConfirm(croppedImageUrl);
            message.success('图片裁切成功');
        } catch (error) {
            message.error('图片裁切失败');
            console.error('Crop error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // 取消裁切
    const handleCancel = () => {
        setCrop(undefined);
        setCompletedCrop(undefined);
        onCancel();
    };

    return (
        <Modal
            title="图片裁切"
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
                    取消
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    loading={isProcessing}
                    onClick={handleConfirm}
                    icon={<CheckOutlined />}
                    disabled={!completedCrop}
                >
                    确认裁切
                </Button>,
            ]}
            width={800}
            destroyOnHidden
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
                    请选择要裁切的区域（建议比例：4:3）
                </div>
                <div style={{
                    maxHeight: '60vh',
                    overflow: 'auto',
                    border: '1px solid #d9d9d9',
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: '#fafafa'
                }}>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspectRatio}
                        minWidth={100}
                        minHeight={75}
                        keepSelection
                    >
                        <img
                            ref={imgRef}
                            alt="裁切图片"
                            src={imageUrl}
                            onLoad={onImageLoad}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '50vh',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        />
                    </ReactCrop>
                </div>
                <div style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
                    提示：拖拽调整裁切区域，双击可重置位置
                </div>
            </div>
        </Modal>
    );
};

export default ImageCropper; 