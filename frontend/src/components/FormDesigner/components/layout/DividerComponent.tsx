import React from 'react';
import { Divider } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface DividerComponentProps {
    component: FormComponent;
}

const DividerComponent: React.FC<DividerComponentProps> = ({ component }) => {
    return (
        <Divider style={component.style}>
            {component.label}
        </Divider>
    );
};

export default DividerComponent; 