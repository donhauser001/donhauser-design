import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

const { TextArea } = Input;

interface InvoiceInfoComponentProps {
    component: FormComponent;
}

const InvoiceInfoComponent: React.FC<InvoiceInfoComponentProps> = ({ component }) => {
    return (
        <TextArea
            placeholder={component.placeholder}
            disabled={true}
            rows={3}
            style={component.style}
        />
    );
};

export default InvoiceInfoComponent; 