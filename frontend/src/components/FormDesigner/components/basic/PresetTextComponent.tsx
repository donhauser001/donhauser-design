import React from 'react';
import { FormComponent } from '../../../../types/formDesigner';

interface PresetTextComponentProps {
    component: FormComponent;
}

const PresetTextComponent: React.FC<PresetTextComponentProps> = ({ component }) => {
    return (
        <div
            style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                backgroundColor: '#fafafa',
                minHeight: '60px',
                ...component.style
            }}
        >
            {component.content || '这里是预设的文本内容'}
        </div>
    );
};

export default PresetTextComponent; 