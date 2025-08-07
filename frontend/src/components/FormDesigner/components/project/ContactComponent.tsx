import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface ContactComponentProps {
    component: FormComponent;
}

const ContactComponent: React.FC<ContactComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default ContactComponent; 