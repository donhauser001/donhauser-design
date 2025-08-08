import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface PaymentMethodComponentProps {
    component: FormComponent;
}

const PaymentMethodComponent: React.FC<PaymentMethodComponentProps> = ({ component }) => {
    return (
        <Select
            placeholder="请选择付款方式"
            disabled={true}
            style={component.style}
            options={component.options?.map(opt => ({
                label: opt.label,
                value: opt.value
            })) || [
                { label: '银行转账', value: 'bank' },
                { label: '现金', value: 'cash' },
                { label: '支票', value: 'check' },
                { label: '支付宝', value: 'alipay' },
                { label: '微信支付', value: 'wechat' }
            ]}
        />
    );
};

export default PaymentMethodComponent; 