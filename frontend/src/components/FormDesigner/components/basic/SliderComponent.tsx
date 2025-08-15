import React, { useState, useEffect } from 'react';
import { Slider, Rate } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface SliderComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
    const [sliderValue, setSliderValue] = useState(getInitialValue());

    // 监听外部值变化
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null && currentValue !== sliderValue) {
            setSliderValue(currentValue);
        }
    }, [getValue, sliderValue]);

    // 处理滑块值变化
    const handleChange = (value: number) => {
        setSliderValue(value);
        setValue(value);
    };
    const getCurrentValue = () => {
        const currentValue = sliderValue !== undefined && sliderValue !== null ? sliderValue : component.defaultValue;
        if (currentValue !== undefined) {
            return Number(currentValue);
        }
        return component.min || 0;
    };

    const renderSlider = () => {
        if (component.sliderMode === 'rate') {
            // 星星评级模式
            return (
                <Rate
                    value={getCurrentValue()}
                    count={component.max || 5}
                    allowHalf={component.step === 0.5}
                    disabled={isDesignMode}
                    onChange={handleChange}
                    style={{ fontSize: '20px' }}
                />
            );
        } else {
            // 滑动条模式
            return (
                <Slider
                    value={getCurrentValue()}
                    min={component.min || 0}
                    max={component.max || 100}
                    step={component.step || 1}
                    marks={component.marks}
                    disabled={isDesignMode}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                />
            );
        }
    };

    const getAlignmentStyle = () => {
        const align = component.sliderAlign || 'left';
        return {
            display: 'flex',
            justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
            width: '100%'
        };
    };

    const sliderContainerId = `slider-container-${component.id}`;

    return (
        <div
            id={sliderContainerId}
            style={{
                ...getDescriptionContainerStyle(theme),
                '--slider-primary-color': primaryColor,
                ...component.style
            } as React.CSSProperties & { '--slider-primary-color': string }}
        >
            <style>
                {`
                /* 使用ID选择器提高优先级 */
                #${sliderContainerId} .ant-slider .ant-slider-track {
                    background-color: ${primaryColor} !important;
                }
                
                /* 滑块手柄 - 保持圆形，只改变颜色 */
                #${sliderContainerId} .ant-slider .ant-slider-handle,
                #${sliderContainerId} .ant-slider .ant-slider-handle::before,
                #${sliderContainerId} .ant-slider .ant-slider-handle::after,
                #${sliderContainerId} .ant-slider .ant-slider-handle[role="slider"] {
                    border-color: ${primaryColor} !important;
                    background-color: ${primaryColor} !important;
                    background: ${primaryColor} !important;
                    background-image: none !important;
                }
                
                /* 悬停状态 - 最高优先级 */
                #${sliderContainerId} .ant-slider:hover .ant-slider-handle,
                #${sliderContainerId} .ant-slider .ant-slider-handle:hover,
                #${sliderContainerId} .ant-slider .ant-slider-handle:hover::before,
                #${sliderContainerId} .ant-slider .ant-slider-handle:hover::after {
                    border-color: ${primaryColor} !important;
                    background-color: ${primaryColor} !important;
                    background: ${primaryColor} !important;
                    background-image: none !important;
                    box-shadow: 0 0 0 5px ${primaryColor}1a !important;
                }
                
                /* 聚焦状态 - 最高优先级 */
                #${sliderContainerId} .ant-slider .ant-slider-handle:focus,
                #${sliderContainerId} .ant-slider .ant-slider-handle:focus-visible,
                #${sliderContainerId} .ant-slider .ant-slider-handle.ant-slider-handle-click-focused,
                #${sliderContainerId} .ant-slider .ant-slider-handle:focus::before,
                #${sliderContainerId} .ant-slider .ant-slider-handle:focus::after {
                    border-color: ${primaryColor} !important;
                    background-color: ${primaryColor} !important;
                    background: ${primaryColor} !important;
                    background-image: none !important;
                    box-shadow: 0 0 0 5px ${primaryColor}1a !important;
                    outline: none !important;
                }
                
                /* 拖拽状态 - 最高优先级 */
                #${sliderContainerId} .ant-slider .ant-slider-handle-dragging,
                #${sliderContainerId} .ant-slider .ant-slider-handle.ant-slider-handle-moving,
                #${sliderContainerId} .ant-slider .ant-slider-handle-dragging::before,
                #${sliderContainerId} .ant-slider .ant-slider-handle-dragging::after {
                    border-color: ${primaryColor} !important;
                    background-color: ${primaryColor} !important;
                    background: ${primaryColor} !important;
                    background-image: none !important;
                    box-shadow: 0 0 0 5px ${primaryColor}1a !important;
                }
                
                /* 激活状态 - 最高优先级 */
                #${sliderContainerId} .ant-slider .ant-slider-handle:active,
                #${sliderContainerId} .ant-slider .ant-slider-handle:active::before,
                #${sliderContainerId} .ant-slider .ant-slider-handle:active::after {
                    border-color: ${primaryColor} !important;
                    background-color: ${primaryColor} !important;
                    background: ${primaryColor} !important;
                    background-image: none !important;
                }
                
                /* 刻度点激活状态 */
                #${sliderContainerId} .ant-slider .ant-slider-dot-active {
                    border-color: ${primaryColor} !important;
                }
                
                /* 标记文字激活状态 */
                #${sliderContainerId} .ant-slider .ant-slider-mark .ant-slider-mark-text-active {
                    color: ${primaryColor} !important;
                }
                
                /* 评级星星颜色 */
                #${sliderContainerId} .ant-rate .ant-rate-star.ant-rate-star-full .ant-rate-star-first,
                #${sliderContainerId} .ant-rate .ant-rate-star.ant-rate-star-half .ant-rate-star-first {
                    color: ${primaryColor} !important;
                }
                
                /* 评级星星悬停效果 */
                #${sliderContainerId} .ant-rate .ant-rate-star:hover .ant-rate-star-first {
                    color: ${primaryColor} !important;
                }
                
                /* 强制覆盖所有可能的滑块变体 */
                #${sliderContainerId} .ant-slider-with-marks .ant-slider-handle,
                #${sliderContainerId} .ant-slider-vertical .ant-slider-handle,
                #${sliderContainerId} .ant-slider-horizontal .ant-slider-handle {
                    border-color: ${primaryColor} !important;
                    background-color: ${primaryColor} !important;
                    background: ${primaryColor} !important;
                    background-image: none !important;
                }
                
                /* 确保手柄保持圆形，不改变原有定位 */
                #${sliderContainerId} .ant-slider .ant-slider-handle {
                    border-radius: 50% !important;
                    border-width: 2px !important;
                    border-style: solid !important;
                }
                
                /* 移除可能存在的伪元素边框 */
                #${sliderContainerId} .ant-slider .ant-slider-handle::before,
                #${sliderContainerId} .ant-slider .ant-slider-handle::after {
                    display: none !important;
                }
                `}
            </style>
            {renderTopDescription({ component, theme })}

            <div style={{
                ...getComponentContentStyle(theme),
                ...getAlignmentStyle(),
                padding: '8px 0',
                minHeight: component.sliderMode === 'rate' ? '32px' : '20px'
            }}>
                <div style={{
                    width: component.sliderMode === 'rate' ? 'auto' :
                        component.sliderAlign === 'center' ? '60%' :
                            component.sliderAlign === 'right' ? '60%' : '100%'
                }}>
                    {renderSlider()}
                </div>
            </div>

            {theme.descriptionPosition === 'bottom' && renderDescription({
                component,
                theme,
                customStyle: { textAlign: component.sliderAlign || 'left' }
            })}

            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default SliderComponent;
