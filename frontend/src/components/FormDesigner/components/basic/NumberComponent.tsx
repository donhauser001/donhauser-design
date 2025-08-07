import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface NumberComponentProps {
    component: FormComponent;
}

const NumberComponent: React.FC<NumberComponentProps> = ({ component }) => {
    return (
        <Input
            type="number"
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default NumberComponent; 