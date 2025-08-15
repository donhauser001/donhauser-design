import React, { useState, useEffect } from 'react';
import { Input, InputNumber } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface NumberComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const NumberComponent: React.FC<NumberComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();
    const [numberValue, setNumberValue] = useState(getInitialValue());

    // 监听外部值变化（比如逻辑规则导致的值变化）
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null && currentValue !== numberValue) {
            console.log(`NumberComponent ${component.id}: 外部值变化 ${numberValue} -> ${currentValue}`);
            setNumberValue(currentValue);
        }
    }, [getValue, numberValue, component.id]);

    // 处理数值变化
    const handleChange = (value: number | null) => {
        setNumberValue(value);
        setValue(value);
    };
    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    // 获取后缀（单位）
    const getSuffix = () => {
        if (component.unit) {
            return (
                <span style={{ color: '#8c8c8c', fontSize: '14px' }}>
                    {component.unit}
                </span>
            );
        }
        return undefined;
    };

    // 格式化显示值
    const getFormattedValue = () => {
        const currentValue = numberValue !== undefined && numberValue !== null ? numberValue : component.defaultValue;

        if (!currentValue && currentValue !== 0) return '';

        const value = Number(currentValue);
        if (isNaN(value)) return '';

        let formattedValue: string;

        // 处理小数点
        const decimalPlaces = component.decimalPlaces;
        if (decimalPlaces === -1) {
            // 不限制小数位数，保持原始精度
            formattedValue = value.toString();
        } else {
            // 限制小数位数
            const places = decimalPlaces || 0;
            formattedValue = value.toFixed(places);
        }

        // 处理千分号
        if (component.showThousandSeparator) {
            const parts = formattedValue.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            formattedValue = parts.join('.');
        }

        return formattedValue;
    };

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <InputNumber
                    placeholder={component.placeholder || '请输入数字'}
                    value={numberValue !== undefined && numberValue !== null ? Number(numberValue) : undefined}
                    prefix={getPrefix()}
                    suffix={getSuffix()}
                    style={{ width: '100%', ...component.style }}
                    readOnly={isDesignMode}
                    onChange={handleChange}
                    precision={component.decimalPlaces === -1 ? undefined : (component.decimalPlaces || 0)}
                    formatter={component.showThousandSeparator ? (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined}
                    parser={component.showThousandSeparator ? (value) => value!.replace(/\$\s?|(,*)/g, '') : undefined}
                />
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default NumberComponent; 