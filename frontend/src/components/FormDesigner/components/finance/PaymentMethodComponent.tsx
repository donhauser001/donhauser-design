import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface PaymentMethodComponentProps {
    component: FormComponent;
}

const PaymentMethodComponent: React.FC<PaymentMethodComponentProps> = ({ component }) => {
    const getOptions = () => {
        if (component.paymentOptions && component.paymentOptions.length > 0) {
            return component.paymentOptions.map(option => ({
                label: option,
                value: option
            }));
        }

        return component.options?.map(opt => ({
            label: opt.label,
            value: opt.value
        })) || [
                { label: '银行转账', value: '银行转账' },
                { label: '现金', value: '现金' },
                { label: '支票', value: '支票' },
                { label: '支付宝', value: '支付宝' },
                { label: '微信支付', value: '微信支付' },
                { label: '信用卡', value: '信用卡' }
            ];
    };

    return (
        <Select
            placeholder={component.placeholder || '请选择付款方式'}
            disabled={component.disabled}
            style={{ width: '100%', ...component.style }}
            allowClear={component.allowClear}
            showSearch={component.allowSearch}
            options={getOptions()}
            filterOption={(input, option) =>
                option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
            }
        />
    );
};

export default PaymentMethodComponent; 