import React, { useEffect, useState } from 'react';
import { InputNumber, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { getLinearIcon } from '../../utils/iconUtils';

interface AmountComponentProps {
    component: FormComponent;
}

const AmountComponent: React.FC<AmountComponentProps> = ({ component }) => {
    const { components, getOrderTotal, orderItems, setComponentValue } = useFormDesignerStore();
    const [hasOrderComponent, setHasOrderComponent] = useState(false);
    const [orderComponentId, setOrderComponentId] = useState<string | null>(null);

    // 获取图标前缀（针对InputNumber组件优化垂直对齐）
    const getPrefix = () => {
        if (component.icon) {
            const icon = getLinearIcon(component.icon);
            if (icon) {
                return <span style={{
                    opacity: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    // InputNumber组件的图标不需要额外的垂直调整
                }}>{icon}</span>;
            }
        }
        return <span style={{ opacity: 0, width: '0px' }}></span>;
    };

    // 检查是否存在订单组件
    useEffect(() => {
        const orderComponent = components.find(comp => comp.type === 'order');
        setHasOrderComponent(!!orderComponent);
        setOrderComponentId(orderComponent?.id || null);
    }, [components]);

    // 监听订单数据变化，触发重新渲染（安全获取，避免undefined）
    const orderItemsForThisOrder = (orderComponentId && orderItems && orderItems[orderComponentId]) ? orderItems[orderComponentId] : [];

    // 计算显示的金额值（实时计算，不使用状态存储）
    const getDisplayAmount = (): number => {
        if (!component.linkOrderTotal || !hasOrderComponent || !orderComponentId) {
            return 0;
        }

        const total = getOrderTotal(orderComponentId);
        const percentage = component.orderTotalPercentage || 100;
        const calculatedAmount = (total * percentage) / 100;



        return calculatedAmount;
    };

    // 如果启用了关联订单总计但没有订单组件，显示提示
    if (component.linkOrderTotal && !hasOrderComponent) {
        return (
            <div style={{ width: '100%' }}>
                <Alert
                    message="金额组件已启用关联订单总计，但画布中未找到订单组件，请先添加订单组件"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{
                        fontSize: '12px'
                    }}
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
    }

    // 如果启用了关联订单总计且有订单组件，显示计算后的金额
    // 使用orderItemsForThisOrder作为触发器，确保订单变化时重新计算
    const displayValue = component.linkOrderTotal && hasOrderComponent ?
        (orderItemsForThisOrder && orderItemsForThisOrder.length >= 0 ? getDisplayAmount() : 0) :
        (component.defaultValue ? (() => {
            const parsed = parseFloat(component.defaultValue);
            return isNaN(parsed) ? undefined : parsed;
        })() : undefined);

    return (
        <div style={{ width: '100%' }}>
            <InputNumber
                placeholder={component.placeholder || '请输入金额'}
                disabled={component.disabled || (component.linkOrderTotal && hasOrderComponent)}
                style={{ width: '100%', ...(component.style as React.CSSProperties) }}
                min={component.min}
                max={component.max}
                step={component.step || 1}
                precision={component.precision || 2}
                value={displayValue}
                onChange={(value) => {
                    // 将用户输入的值存储到store中
                    setComponentValue(component.id, value);
                }}
                prefix={getPrefix()}
                formatter={component.formatter !== false ?
                    (value) => {
                        if (value === undefined || value === null ||
                            (typeof value === 'string' && value === '') ||
                            isNaN(Number(value))) return '';

                        const numValue = parseFloat(value.toString());
                        if (isNaN(numValue)) return '';

                        // 保持原始输入的小数位数，不强制格式化
                        const valueStr = value.toString();
                        let formattedValue = valueStr;

                        // 如果包含小数点，分离整数和小数部分
                        if (formattedValue.includes('.')) {
                            const parts = formattedValue.split('.');
                            // 只对整数部分添加千分号
                            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            formattedValue = parts.join('.');
                        } else {
                            // 整数部分添加千分号
                            formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        }

                        return `¥ ${formattedValue}`;
                    } :
                    undefined
                }
                parser={component.formatter !== false ?
                    (value) => {
                        if (!value) return 0;
                        const cleanValue = value.replace(/¥\s?|(,*)/g, '');
                        const parsed = parseFloat(cleanValue);
                        return isNaN(parsed) ? 0 : parsed;
                    } :
                    undefined
                }
                addonAfter="元"
            />
            {/* 字段说明 */}
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

export default AmountComponent; 