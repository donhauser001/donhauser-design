import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface ContractPartyComponentProps {
    component: FormComponent;
}

const ContractPartyComponent: React.FC<ContractPartyComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default ContractPartyComponent; 