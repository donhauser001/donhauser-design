import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

const { TextArea } = Input;

interface TextareaComponentProps {
    component: FormComponent;
}

const TextareaComponent: React.FC<TextareaComponentProps> = ({ component }) => {
    return (
        <TextArea
            placeholder={component.placeholder}
            disabled={true}
            rows={3}
            style={component.style}
        />
    );
};

export default TextareaComponent; 