import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

const { TextArea } = Input;

interface TextareaComponentProps {
    component: FormComponent;
}

const TextareaComponent: React.FC<TextareaComponentProps> = ({ component }) => {
    return (
        <div style={{ width: '100%' }}>
            <TextArea
                placeholder={component.placeholder || '请输入内容'}
                value={component.defaultValue || ''}
                rows={3}
                style={component.style}
                readOnly={true}
            />
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    {component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default TextareaComponent; 