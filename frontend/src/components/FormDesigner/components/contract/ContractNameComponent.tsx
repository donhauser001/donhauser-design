import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface ContractNameComponentProps {
    component: FormComponent;
}

const ContractNameComponent: React.FC<ContractNameComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default ContractNameComponent; 