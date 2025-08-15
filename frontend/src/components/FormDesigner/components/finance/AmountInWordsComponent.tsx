import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { convertToRMB } from '../../../../utils/rmbConverter';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface AmountInWordsComponentProps {
    component: FormComponent;
}

const AmountInWordsComponent: React.FC<AmountInWordsComponentProps> = ({ component }) => {
    const { components, getOrderTotal, orderItems, getComponentValue, componentValues, theme } = useFormDesignerStore();
    const borderColor = theme.borderColor || '#d9d9d9';
    const [hasAmountComponent, setHasAmountComponent] = useState(false);
    const [amountComponentId, setAmountComponentId] = useState<string | null>(null);
    const [linkedAmount, setLinkedAmount] = useState<number>(0);

    // 检查是否存在金额组件
    useEffect(() => {
        if (component.linkedAmountComponentId) {
            // 如果指定了关联的金额组件ID，使用指定的组件
            const amountComponent = components.find(comp => comp.id === component.linkedAmountComponentId);
            if (amountComponent) {
                // 找到指定的组件
                setHasAmountComponent(true);
                setAmountComponentId(amountComponent.id);
            } else {
                // 指定的组件不存在，尝试自动关联到其他金额组件
                const fallbackComponent = components.find(comp => ['amount', 'total'].includes(comp.type));
                setHasAmountComponent(!!fallbackComponent);
                setAmountComponentId(fallbackComponent?.id || null);
            }
        } else {
            // 如果没有指定，自动选择第一个金额组件
            const amountComponent = components.find(comp => ['amount', 'total'].includes(comp.type));
            setHasAmountComponent(!!amountComponent);
            setAmountComponentId(amountComponent?.id || null);
        }
    }, [components, component.linkedAmountComponentId]);

    // 监听金额组件的值变化
    useEffect(() => {
        if (hasAmountComponent && amountComponentId) {
            const amountComponent = components.find(comp => comp.id === amountComponentId);
            if (amountComponent) {
                let amount = 0;

                // 优先获取组件的实际输入值
                const actualValue = getComponentValue(amountComponent.id);

                if (actualValue && !isNaN(parseFloat(actualValue))) {
                    amount = parseFloat(actualValue);
                } else if (amountComponent.type === 'total') {
                    // 如果关联的是总计组件，处理总计组件的特殊逻辑
                    if (amountComponent.totalMode === 'order') {
                        // 总计组件的订单总计模式：自动关联订单总计
                        const orderComponent = components.find(comp => comp.type === 'order');
                        if (orderComponent && orderItems[orderComponent.id]) {
                            const total = getOrderTotal(orderComponent.id);
                            const percentage = amountComponent.orderTotalPercentage || 100;
                            amount = (total * percentage) / 100;
                        }
                    } else if (amountComponent.totalMode === 'amounts' && amountComponent.selectedAmountIds) {
                        // 总计组件的金额求和模式
                        let totalSum = 0;
                        amountComponent.selectedAmountIds.forEach(amountId => {
                            const linkedAmountComponent = components.find(comp => comp.id === amountId);
                            if (linkedAmountComponent) {
                                const linkedValue = getComponentValue(amountId);
                                if (linkedValue && !isNaN(parseFloat(linkedValue))) {
                                    totalSum += parseFloat(linkedValue);
                                }
                            }
                        });
                        amount = totalSum;
                    } else if (amountComponent.defaultValue) {
                        // 总计组件的默认值
                        amount = parseFloat(amountComponent.defaultValue) || 0;
                    }
                } else if (amountComponent.linkOrderTotal) {
                    // 如果金额组件关联订单总计，计算订单总计
                    const orderComponent = components.find(comp => comp.type === 'order');
                    if (orderComponent && orderItems[orderComponent.id]) {
                        const total = getOrderTotal(orderComponent.id);
                        const percentage = amountComponent.orderTotalPercentage || 100;
                        amount = (total * percentage) / 100;
                    }
                } else if (amountComponent.defaultValue) {
                    // 使用金额组件的默认值
                    amount = parseFloat(amountComponent.defaultValue) || 0;
                }
                setLinkedAmount(amount);
            }
        }
    }, [hasAmountComponent, amountComponentId, components, orderItems, getOrderTotal, componentValues]);
    const getBackgroundColor = () => {
        switch (component.backgroundColor) {
            case 'transparent':
                return 'transparent';
            case 'white':
                return '#ffffff';
            default:
                return '#fafafa';
        }
    };

    const getFontStyle = () => {
        const baseStyle: React.CSSProperties = {
            fontSize: `${component.fontSize || 14}px`,
        };

        switch (component.amountStyle) {
            case 'bold':
                baseStyle.fontWeight = 'bold';
                break;
            case 'italic':
                baseStyle.fontStyle = 'italic';
                break;
            default:
                baseStyle.fontWeight = '500';
        }

        return baseStyle;
    };

    // 如果没有金额组件，显示提示
    if (!hasAmountComponent) {
        return (
            <div style={getDescriptionContainerStyle(theme)}>
                {renderTopDescription({ component, theme })}

                <div style={getComponentContentStyle(theme)}>
                    <Alert
                        message="金额大写组件需要关联金额，但画布中未找到金额组件，请先添加金额或总计组件"
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        style={{
                            fontSize: '12px'
                        }}
                    />
                </div>

                {renderBottomDescription({ component, theme })}
                {renderRightDescription({ component, theme })}
            </div>
        );
    }

    // 计算显示内容：将数字转换为大写
    const displayContent = convertToRMB(linkedAmount, component.includePrefix !== false);

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <div
                    style={{
                        padding: '8px 12px',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        backgroundColor: getBackgroundColor(),
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#262626',
                        ...getFontStyle(),
                        ...(component.style as React.CSSProperties)
                    }}
                >
                    {displayContent}
                </div>
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default AmountInWordsComponent; 