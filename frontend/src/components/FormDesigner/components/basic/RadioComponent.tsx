import React from 'react';
import { Radio, Checkbox, Space } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface RadioComponentProps {
    component: FormComponent;
}

const RadioComponent: React.FC<RadioComponentProps> = ({ component }) => {
    // 获取默认选中的值
    const getDefaultValue = () => {
        if (!component.options) return component.allowMultiple ? [] : undefined;

        if (component.allowMultiple) {
            // 多选模式：返回所有默认选中的选项值
            return component.options
                .filter(option => option.defaultSelected)
                .map(option => option.value);
        } else {
            // 单选模式：返回第一个默认选中的选项值
            const defaultOption = component.options.find(option => option.defaultSelected);
            return defaultOption ? defaultOption.value : undefined;
        }
    };



    // 获取布局样式
    const getLayoutStyle = () => {
        const layout = component.optionLayout || 'vertical';
        const columns = component.optionColumns || 0;

        if (layout === 'horizontal') {
            if (columns > 0) {
                // 指定分列数量
                return {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: '8px',
                    width: '100%'
                };
            } else {
                // 自动排列
                return {
                    display: 'flex',
                    flexWrap: 'wrap' as const,
                    gap: '8px 16px',
                    width: '100%'
                };
            }
        } else {
            // 竖排
            return {
                display: 'flex',
                flexDirection: 'column' as const,
                gap: '8px',
                width: '100%'
            };
        }
    };

    const renderOptions = () => {
        const layoutStyle = getLayoutStyle();

        if (component.allowMultiple) {
            // 多选模式
            return (
                <Checkbox.Group
                    value={getDefaultValue()}
                    disabled={true}
                    style={{ width: '100%' }}
                >
                    <div style={layoutStyle}>
                        {component.options?.map((option, index) => (
                            <Checkbox key={index} value={option.value}>
                                {option.label}
                            </Checkbox>
                        ))}
                    </div>
                </Checkbox.Group>
            );
        } else {
            // 单选模式
            return (
                <Radio.Group
                    value={getDefaultValue()}
                    disabled={true}
                    style={{ width: '100%' }}
                >
                    <div style={layoutStyle}>
                        {component.options?.map((option, index) => (
                            <Radio key={index} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </div>
                </Radio.Group>
            );
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {renderOptions()}
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

export default RadioComponent; 