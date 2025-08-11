import React from 'react';
import { Slider, Rate } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface SliderComponentProps {
    component: FormComponent;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ component }) => {
    const getDefaultValue = () => {
        if (component.defaultValue !== undefined) {
            return Number(component.defaultValue);
        }
        return component.min || 0;
    };

    const renderSlider = () => {
        if (component.sliderMode === 'rate') {
            // 星星评级模式
            return (
                <Rate
                    value={getDefaultValue()}
                    count={component.max || 5}
                    allowHalf={component.step === 0.5}
                    disabled={true}
                    style={{ fontSize: '20px', color: '#faad14' }}
                />
            );
        } else {
            // 滑动条模式
            return (
                <Slider
                    value={getDefaultValue()}
                    min={component.min || 0}
                    max={component.max || 100}
                    step={component.step || 1}
                    marks={component.marks}
                    disabled={true}
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

    return (
        <div style={{ width: '100%' }}>
            <div style={{
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

            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4',
                    textAlign: component.sliderAlign || 'left'
                }}>
                    {component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default SliderComponent;
