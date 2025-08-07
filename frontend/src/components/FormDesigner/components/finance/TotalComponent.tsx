import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface TotalComponentProps {
    component: FormComponent;
}

const TotalComponent: React.FC<TotalComponentProps> = ({ component }) => {
    return (
        <Input
            type="number"
            placeholder={component.placeholder}
            disabled={true}
            addonAfter="元"
            style={{
                fontWeight: 'bold',
                fontSize: '16px',
                ...component.style
            }}
        />
    );
};

export default TotalComponent; 