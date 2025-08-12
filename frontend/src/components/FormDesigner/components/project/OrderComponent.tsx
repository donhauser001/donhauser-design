import React from 'react';
import { Input, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface OrderComponentProps {
    component: FormComponent;
}

const OrderComponent: React.FC<OrderComponentProps> = ({ component }) => {
    const { components } = useFormDesignerStore();

    // 检查画布上是否存在报价单组件
    const hasQuotationComponent = components.some((comp: FormComponent) => comp.type === 'quotation');

    // 处理样式，排除textAlign属性
    const { textAlign, ...inputStyle } = component.style || {};

    // 如果没有报价单组件，显示提示信息
    if (!hasQuotationComponent) {
        return (
            <div style={{ width: '100%' }}>
                <Input
                    placeholder={component.placeholder}
                    disabled={true}
                    style={inputStyle}
                />
                <Alert
                    message="订单组件无法独立使用，请先在画布中添加报价单组件"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{
                        marginTop: '8px',
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

    // 如果有报价单组件，正常显示订单组件
    return (
        <div style={{ width: '100%' }}>
            <Input
                placeholder={component.placeholder}
                disabled={true}
                style={inputStyle}
                value="订单将根据报价单内容自动生成"
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

export default OrderComponent; 