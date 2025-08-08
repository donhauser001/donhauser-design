import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface TaxRateComponentProps {
    component: FormComponent;
}

const TaxRateComponent: React.FC<TaxRateComponentProps> = ({ component }) => {
    return (
        <Input
            type="number"
            placeholder={component.placeholder}
            disabled={true}
            addonAfter="%"
            style={component.style}
        />
    );
};

export default TaxRateComponent; 