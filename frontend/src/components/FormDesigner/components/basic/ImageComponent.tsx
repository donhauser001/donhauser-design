import React, { useState, useEffect } from 'react';
import { Carousel, Button, Space } from 'antd';
import { LeftOutlined, RightOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';

interface ImageComponentProps {
    component: FormComponent;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ component }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(component.slideshowAutoplay || false);

    // 获取图片列表
    const getImageList = () => {
        if (component.imageMode === 'single') {
            return component.imageUrl ? [{ url: component.imageUrl, name: component.imageAlt || '图片', id: '1' }] : [];
        }
        return component.imageList || [];
    };

    const imageList = getImageList();

    // 幻灯片自动播放
    useEffect(() => {
        if (component.imageMode === 'slideshow' && isPlaying && imageList.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % imageList.length);
            }, (component.slideshowInterval || 3) * 1000);

            return () => clearInterval(interval);
        }
    }, [isPlaying, imageList.length, component.slideshowInterval, component.imageMode]);

    const containerStyle = {
        width: '100%',
        backgroundColor: component.style?.backgroundColor || 'transparent',
        padding: component.style?.padding || '0',
        margin: component.style?.margin || '0',
        borderRadius: component.style?.borderRadius || '4px',
        border: component.style?.borderWidth ?
            `${component.style.borderWidth} ${component.style.borderStyle || 'solid'} ${component.style.borderColor || '#d9d9d9'}` :
            'none'
    };

    const imageStyle = {
        width: component.imageWidth || 'auto',
        height: component.imageHeight || 'auto',
        maxWidth: '100%',
        display: 'block'
    };

    const placeholderStyle = {
        width: component.imageWidth || '200px',
        height: component.imageHeight || '150px',
        backgroundColor: '#f5f5f5',
        border: '2px dashed #d9d9d9',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8c8c8c',
        fontSize: '14px',
        flexDirection: 'column' as const,
        gap: '8px'
    };

    // 渲染单张图片
    const renderSingleImage = (image: { url: string; name: string; id: string }, index?: number) => {
        return (
            <div key={image.id || index} style={{ textAlign: 'center' }}>
                <img
                    src={image.url}
                    alt={image.name}
                    style={imageStyle}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzhjOGM4YyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD48L3N2Zz4=';
                    }}
                />
                {component.showImageName && (
                    <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        {image.name}
                    </div>
                )}
            </div>
        );
    };

    // 渲染多图网格
    const renderMultipleImages = () => {
        const columns = component.imageColumns || 3;
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '12px',
                width: '100%'
            }}>
                {imageList.map((image, index) => renderSingleImage(image, index))}
            </div>
        );
    };

    // 渲染幻灯片
    const renderSlideshow = () => {
        if (imageList.length === 0) return null;

        return (
            <div style={{ position: 'relative' }}>
                <Carousel
                    dots={true}
                    autoplay={false}
                    infinite={true}
                    afterChange={setCurrentIndex}
                >
                    {imageList.map((image, index) => renderSingleImage(image, index))}
                </Carousel>

                {/* 控制按钮 */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 10
                }}>
                    <Space size="small">
                        <Button
                            type="text"
                            size="small"
                            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none'
                            }}
                        />
                    </Space>
                </div>

                {/* 图片信息 */}
                {component.showImageName && imageList[currentIndex] && (
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        zIndex: 10
                    }}>
                        {imageList[currentIndex].name}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={containerStyle}>
            {imageList.length === 0 ? (
                <div style={placeholderStyle}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                    </div>
                    <span>请设置图片或上传图片</span>
                    <span style={{ fontSize: '12px', color: '#bbb' }}>
                        支持单图、多图和幻灯片模式
                    </span>
                </div>
            ) : (
                <>
                    {component.imageMode === 'single' && renderSingleImage(imageList[0])}
                    {component.imageMode === 'multiple' && renderMultipleImages()}
                    {component.imageMode === 'slideshow' && renderSlideshow()}
                </>
            )}

            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    {component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ImageComponent;
