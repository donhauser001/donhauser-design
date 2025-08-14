import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface InvoiceTypeComponentProps {
    component: FormComponent;
}

const InvoiceTypeComponent: React.FC<InvoiceTypeComponentProps> = ({ component }) => {
    const getOptions = () => {
        if (component.invoiceOptions && component.invoiceOptions.length > 0) {
            return component.invoiceOptions.map(option => ({
                label: option,
                value: option
            }));
        }

        return component.options?.map(opt => ({
            label: opt.label,
            value: opt.value
        })) || [
                { label: '增值税普通发票', value: '增值税普通发票' },
                { label: '增值税专用发票', value: '增值税专用发票' },
                { label: '电子发票', value: '电子发票' },
                { label: '纸质发票', value: '纸质发票' },
                { label: '收据', value: '收据' }
            ];
    };

    return (
        <Select
            placeholder={component.placeholder || '请选择发票类型'}
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

export default InvoiceTypeComponent; 