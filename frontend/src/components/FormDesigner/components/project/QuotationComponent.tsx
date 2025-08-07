import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface QuotationComponentProps {
    component: FormComponent;
}

const QuotationComponent: React.FC<QuotationComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default QuotationComponent; 