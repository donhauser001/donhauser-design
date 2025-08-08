import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface InstructionComponentProps {
    component: FormComponent;
}

const InstructionComponent: React.FC<InstructionComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default InstructionComponent; 