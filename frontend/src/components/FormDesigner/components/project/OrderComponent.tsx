import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface OrderComponentProps {
    component: FormComponent;
}

const OrderComponent: React.FC<OrderComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default OrderComponent; 