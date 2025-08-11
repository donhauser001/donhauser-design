import React from 'react';
import { Input, InputNumber } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';

interface NumberComponentProps {
    component: FormComponent;
}

const NumberComponent: React.FC<NumberComponentProps> = ({ component }) => {
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
        if (!component.defaultValue && component.defaultValue !== 0) return '';

        const value = Number(component.defaultValue);
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
        <div style={{ width: '100%' }}>
            <Input
                placeholder={component.placeholder || '请输入数字'}
                value={getFormattedValue()}
                prefix={getPrefix()}
                suffix={getSuffix()}
                style={component.style}
                readOnly={true}
            />
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

export default NumberComponent; 