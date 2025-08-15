import React, { useEffect, useState } from 'react';
import { InputNumber, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { getLinearIcon } from '../../utils/iconUtils';

interface TotalComponentProps {
    component: FormComponent;
}

const TotalComponent: React.FC<TotalComponentProps> = ({ component }) => {
    const { components, getOrderTotal, orderItems, setComponentValue, getComponentValue, updateComponent, theme } = useFormDesignerStore();
    const borderColor = theme.borderColor || '#d9d9d9';
    const [hasOrderComponent, setHasOrderComponent] = useState(false);
    const [orderComponentId, setOrderComponentId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

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

    // 智能初始化：检测画布环境并自动配置总计组件
    useEffect(() => {
        const orderComponent = components.find(comp => comp.type === 'order');
        const amountComponents = components.filter(comp => comp.type === 'amount' && comp.id !== component.id);

        console.log('总计组件初始化检测:', {
            componentsCount: components.length,
            hasOrder: !!orderComponent,
            amountCount: amountComponents.length,
            currentMode: component.totalMode,
            isInitialized
        });

        // 更新订单组件状态
        setHasOrderComponent(!!orderComponent);
        setOrderComponentId(orderComponent?.id || null);

        // 智能初始化逻辑（只在组件首次加载时执行）
        if (!isInitialized) {
            let shouldUpdateMode = false;
            let newMode = component.totalMode;
            let selectedAmountIds = component.selectedAmountIds || [];

            if (orderComponent && amountComponents.length > 0) {
                // 同时有订单和金额组件：优先使用订单模式
                console.log('检测到订单和金额组件，使用订单总计模式');
                newMode = 'order';
                shouldUpdateMode = component.totalMode !== 'order';
            } else if (orderComponent) {
                // 只有订单组件：使用订单模式
                console.log('检测到订单组件，使用订单总计模式');
                newMode = 'order';
                shouldUpdateMode = component.totalMode !== 'order';
            } else if (amountComponents.length > 0) {
                // 只有金额组件：切换到求和模式
                console.log('检测到金额组件，切换到求和模式');
                newMode = 'amounts';
                shouldUpdateMode = component.totalMode !== 'amounts';
                // 如果没有选择任何金额组件，保持当前状态让用户手动选择
            } else {
                // 既没有订单也没有金额组件：保持当前模式，但会显示警告
                console.log('未检测到订单或金额组件，总计组件无法独立使用');
            }

            // 如果需要更新模式，同时更新组件配置
            if (shouldUpdateMode) {
                updateComponent(component.id, {
                    ...component,
                    totalMode: newMode,
                    selectedAmountIds: newMode === 'amounts' ? selectedAmountIds : []
                });
            }

            setIsInitialized(true);
        }
    }, [components, component.totalMode, component.id, isInitialized, updateComponent]);

    // 金额组件求和模式下，监听相关金额组件的值变化
    // 这样可以确保当选中的金额组件值变化时，总计组件能实时更新
    // 通过添加 componentValues 到依赖数组来触发重新渲染

    // 监听订单数据变化，触发重新渲染（安全获取，避免undefined）
    const orderItemsForThisOrder = (orderComponentId && orderItems && orderItems[orderComponentId]) ? orderItems[orderComponentId] : [];

    // 计算订单总计模式的金额值
    const getOrderDisplayAmount = (): number => {
        if (!hasOrderComponent || !orderComponentId) {
            return 0;
        }

        const total = getOrderTotal(orderComponentId);
        const percentage = component.orderTotalPercentage || 100;
        const calculatedAmount = (total * percentage) / 100;

        console.log('总计组件计算订单总计:', {
            hasOrderComponent,
            orderComponentId,
            total,
            percentage,
            calculatedAmount
        });

        return calculatedAmount;
    };

    // 计算金额组件求和模式的金额值
    const getAmountsSum = (): number => {
        if (!component.selectedAmountIds || component.selectedAmountIds.length === 0) {
            return 0;
        }

        let total = 0;
        component.selectedAmountIds.forEach(amountId => {
            const amountComponent = components.find(comp => comp.id === amountId);
            if (amountComponent) {
                // 优先获取组件的实际输入值
                const actualValue = getComponentValue(amountId);
                if (actualValue && !isNaN(parseFloat(actualValue))) {
                    total += parseFloat(actualValue);
                } else if (amountComponent.linkOrderTotal) {
                    // 如果金额组件关联订单总计，计算订单总计
                    const orderComponent = components.find(comp => comp.type === 'order');
                    if (orderComponent && orderItems[orderComponent.id]) {
                        const orderTotal = getOrderTotal(orderComponent.id);
                        const percentage = amountComponent.orderTotalPercentage || 100;
                        total += (orderTotal * percentage) / 100;
                    }
                } else if (amountComponent.defaultValue) {
                    // 使用默认值
                    const defaultValue = parseFloat(amountComponent.defaultValue);
                    if (!isNaN(defaultValue)) {
                        total += defaultValue;
                    }
                }
            }
        });

        return total;
    };

    // 根据总计模式显示不同的提示和警告
    const renderAlert = () => {
        // 如果还在初始化阶段，不显示警告
        if (!isInitialized) {
            return null;
        }

        if (component.totalMode === 'order') {
            // 订单总计模式：检查订单组件
            if (!hasOrderComponent) {
                return (
                    <Alert
                        message="总计组件不能独立使用。在订单总计模式下，画布中未找到订单组件，请先添加订单组件"
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        style={{
                            fontSize: '12px'
                        }}
                    />
                );
            }
        } else if (component.totalMode === 'amounts') {
            // 金额组件求和模式：检查是否选择了金额组件
            const amountComponents = components.filter(comp => comp.type === 'amount' && comp.id !== component.id);
            if (amountComponents.length === 0) {
                return (
                    <Alert
                        message="总计组件不能独立使用。在金额组件求和模式下，画布中未找到金额组件，请先添加金额组件"
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        style={{
                            fontSize: '12px'
                        }}
                    />
                );
            } else if (!component.selectedAmountIds || component.selectedAmountIds.length === 0) {
                return (
                    <Alert
                        message="总计组件不能独立使用。请在属性面板中选择要求和的金额组件"
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        style={{
                            fontSize: '12px'
                        }}
                    />
                );
            }
        }

        // 检查是否完全没有依赖组件
        const orderComponent = components.find(comp => comp.type === 'order');
        const amountComponents = components.filter(comp => comp.type === 'amount' && comp.id !== component.id);

        if (!orderComponent && amountComponents.length === 0) {
            return (
                <Alert
                    message="总计组件不能独立使用"
                    description="请在画布中添加订单组件（用于计算订单总计）或金额组件（用于金额求和），然后总计组件将自动工作。"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{
                        fontSize: '12px'
                    }}
                />
            );
        }
        return null;
    };

    // 计算显示值
    const getDisplayValue = (): number | undefined => {
        console.log('总计组件计算显示值:', {
            totalMode: component.totalMode,
            hasOrderComponent,
            orderComponentId,
            selectedAmountIds: component.selectedAmountIds,
            defaultValue: component.defaultValue
        });

        // 1. 优先使用用户输入值（除非是自动计算模式）
        const userValue = getComponentValue(component.id);
        const hasAutoCalculation = (component.totalMode === 'order' && hasOrderComponent && orderComponentId) ||
            (component.totalMode === 'amounts' && component.selectedAmountIds && component.selectedAmountIds.length > 0);

        if (userValue !== undefined && !hasAutoCalculation) {
            return userValue;
        }

        // 2. 自动计算模式
        if (component.totalMode === 'order') {
            // 订单总计模式：自动关联订单总计
            if (hasOrderComponent && orderComponentId) {
                const result = getOrderDisplayAmount();
                console.log('订单模式计算结果:', result);
                return result;
            }
        } else if (component.totalMode === 'amounts') {
            // 金额组件求和模式
            if (component.selectedAmountIds && component.selectedAmountIds.length > 0) {
                const result = getAmountsSum();
                console.log('求和模式计算结果:', result);
                return result;
            }
        }

        // 3. 如果有用户输入值且没有自动计算，使用用户输入值
        if (userValue !== undefined) {
            return userValue;
        }

        // 4. 最后使用默认值
        if (component.defaultValue) {
            const parsed = parseFloat(component.defaultValue);
            return isNaN(parsed) ? undefined : parsed;
        }

        return undefined;
    };

    const displayValue = getDisplayValue();
    const alertElement = renderAlert();

    // 将计算得到的值存储到store中，供其他组件（如金额大写）使用
    useEffect(() => {
        if (displayValue !== undefined && displayValue !== null) {
            // 检查当前存储的值是否与计算值不同，避免无限循环
            const currentStoredValue = getComponentValue(component.id);
            if (currentStoredValue !== displayValue) {
                setComponentValue(component.id, displayValue);
            }
        }
    }, [displayValue, component.id, setComponentValue, orderItemsForThisOrder, getComponentValue]);

    // 如果有警告提示，先显示警告
    if (alertElement) {
        return (
            <div style={{ width: '100%' }}>
                {alertElement}
                {component.fieldDescription && (
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px',
                        lineHeight: '1.4'
                    }}>
                        提示：{component.fieldDescription}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ width: '100%' }}>
            <InputNumber
                placeholder={component.placeholder || '请输入总计金额'}
                disabled={component.disabled ||
                    (component.totalMode === 'order' && hasOrderComponent) ||
                    (component.totalMode === 'amounts' && component.selectedAmountIds && component.selectedAmountIds.length > 0)
                }
                style={{
                    width: '100%',
                    fontWeight: component.fontWeight || 'bold',
                    fontSize: `${component.fontSize || 16}px`,
                    ...(component.style as React.CSSProperties)
                } as React.CSSProperties}
                precision={component.precision !== undefined ? component.precision : 2}
                value={displayValue}
                onChange={(value) => {
                    // 将用户输入的值存储到store中
                    setComponentValue(component.id, value);
                }}
                prefix={getPrefix()}
                formatter={component.formatter !== false ?
                    (value: any) => {
                        if (value === undefined || value === null) return '';

                        // 转换为字符串进行处理
                        const valueStr = String(value);

                        // 如果是空字符串，返回空字符串
                        if (valueStr.trim() === '') return '';

                        // 如果不是有效数字，返回原值（允许用户继续输入）
                        if (isNaN(Number(valueStr)) && valueStr !== '') return valueStr;

                        // 如果是空字符串或只有小数点，允许继续输入
                        if (valueStr === '' || valueStr === '.') return valueStr;

                        const numValue = parseFloat(valueStr);
                        if (isNaN(numValue)) return valueStr;

                        // 保持原始输入的小数位数，不强制格式化
                        let formattedValue = valueStr;

                        // 如果包含小数点，分离整数和小数部分
                        if (formattedValue.includes('.')) {
                            const parts = formattedValue.split('.');
                            // 只对整数部分添加千分号（如果整数部分长度大于3）
                            if (parts[0].length > 3) {
                                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            }
                            formattedValue = parts.join('.');
                        } else {
                            // 整数部分添加千分号（如果长度大于3）
                            if (formattedValue.length > 3) {
                                formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            }
                        }

                        return `¥ ${formattedValue}`;
                    } :
                    undefined
                }
                parser={component.formatter !== false ?
                    (value: string | undefined) => {
                        if (!value || value.trim() === '' || value === '¥' || value === '¥ ') {
                            return null as any;
                        }
                        const cleanValue = value.replace(/¥\s?|(,*)/g, '');
                        const parsed = parseFloat(cleanValue);
                        return isNaN(parsed) ? null as any : parsed;
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
                    提示：{component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default TotalComponent; 