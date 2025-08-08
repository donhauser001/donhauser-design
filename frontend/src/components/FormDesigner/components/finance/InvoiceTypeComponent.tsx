import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface InvoiceTypeComponentProps {
    component: FormComponent;
}

const InvoiceTypeComponent: React.FC<InvoiceTypeComponentProps> = ({ component }) => {
    return (
        <Select
            placeholder="请选择发票类型"
            disabled={true}
            style={component.style}
            options={component.options?.map(opt => ({
                label: opt.label,
                value: opt.value
            })) || [
                    { label: '增值税普通发票', value: 'normal' },
                    { label: '增值税专用发票', value: 'special' },
                    { label: '电子发票', value: 'electronic' }
                ]}
        />
    );
};

export default InvoiceTypeComponent; 