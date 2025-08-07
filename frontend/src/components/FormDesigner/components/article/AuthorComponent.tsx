import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface AuthorComponentProps {
    component: FormComponent;
}

const AuthorComponent: React.FC<AuthorComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default AuthorComponent; 