import React, { useState, useEffect } from 'react';
import { Radio, Checkbox, Space } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderDescription, getDescriptionContainerStyle, getComponentContentStyle } from '../../utils/descriptionUtils';

interface RadioComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const RadioComponent: React.FC<RadioComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();

    // 确保初始值的类型正确
    const getCorrectInitialValue = () => {
        const initialValue = getInitialValue();
        if (component.allowMultiple) {
            // 多选模式确保返回数组
            return Array.isArray(initialValue) ? initialValue : (initialValue ? [initialValue] : []);
        } else {
            // 单选模式返回单个值
            return Array.isArray(initialValue) ? initialValue[0] : initialValue;
        }
    };

    const [radioValue, setRadioValue] = useState(getCorrectInitialValue());

    // 监听外部值变化
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null) {
            // 确保值类型正确
            let correctedValue;
            if (component.allowMultiple) {
                correctedValue = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : []);
            } else {
                correctedValue = Array.isArray(currentValue) ? currentValue[0] : currentValue;
            }

            // 比较值是否真的发生了变化
            const valuesEqual = component.allowMultiple
                ? JSON.stringify(correctedValue) === JSON.stringify(radioValue)
                : correctedValue === radioValue;

            if (!valuesEqual) {
                console.log('RadioComponent: 外部值变化', {
                    componentId: component.id,
                    oldValue: radioValue,
                    newValue: correctedValue,
                    allowMultiple: component.allowMultiple
                });
                setRadioValue(correctedValue);
            }
        }
    }, [getValue, radioValue, component.allowMultiple, component.id]);

    // 处理单选变化
    const handleRadioChange = (e: any) => {
        const value = e.target.value;
        console.log('RadioComponent: 单选变化', {
            componentId: component.id,
            newValue: value,
            currentRadioValue: radioValue,
            isDesignMode
        });
        setRadioValue(value);
        setValue(value);
    };

    // 处理多选变化
    const handleCheckboxChange = (checkedValues: any[]) => {
        console.log('RadioComponent: 多选变化', {
            componentId: component.id,
            newValues: checkedValues,
            currentRadioValue: radioValue,
            isDesignMode
        });
        setRadioValue(checkedValues);
        setValue(checkedValues);
    };

    // 获取当前显示值
    const getCurrentValue = () => {
        const currentValue = radioValue !== undefined && radioValue !== null ? radioValue : getDefaultValue();

        // 确保多选模式下返回数组，单选模式下返回单个值
        if (component.allowMultiple) {
            const arrayValue = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : []);
            console.log('RadioComponent: 多选当前显示值', {
                componentId: component.id,
                radioValue,
                defaultValue: getDefaultValue(),
                currentValue,
                arrayValue,
                allowMultiple: component.allowMultiple
            });
            return arrayValue;
        } else {
            console.log('RadioComponent: 单选当前显示值', {
                componentId: component.id,
                radioValue,
                defaultValue: getDefaultValue(),
                currentValue,
                allowMultiple: component.allowMultiple
            });
            return currentValue;
        }
    };
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
                    value={getCurrentValue()}
                    disabled={isDesignMode}
                    onChange={handleCheckboxChange}
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
                    value={getCurrentValue()}
                    disabled={isDesignMode}
                    onChange={handleRadioChange}
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
        <div style={getDescriptionContainerStyle(theme)}>
            {theme.descriptionPosition === 'top' && renderDescription({ component, theme })}

            <div style={{
                ...getComponentContentStyle(theme),
                ...component.style
            }}>
                {renderOptions()}
            </div>

            {theme.descriptionPosition === 'bottom' && renderDescription({ component, theme })}
            {theme.descriptionPosition === 'right' && renderDescription({ component, theme })}
        </div>
    );
};

export default RadioComponent; 