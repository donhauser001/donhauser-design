import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface AmountComponentProps {
    component: FormComponent;
}

const AmountComponent: React.FC<AmountComponentProps> = ({ component }) => {
    return (
        <Input
            type="number"
            placeholder={component.placeholder}
            disabled={true}
            addonAfter="元"
            style={component.style}
        />
    );
};

export default AmountComponent; 