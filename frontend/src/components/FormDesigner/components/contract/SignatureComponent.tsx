import React from 'react';
import { FormComponent } from '../../../../types/formDesigner';

interface SignatureComponentProps {
    component: FormComponent;
}

const SignatureComponent: React.FC<SignatureComponentProps> = ({ component }) => {
    return (
        <div
            style={{
                padding: '20px',
                border: '2px dashed #d9d9d9',
                borderRadius: '6px',
                backgroundColor: '#fafafa',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...component.style
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1890ff';
                e.currentTarget.style.backgroundColor = '#f0f8ff';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.backgroundColor = '#fafafa';
            }}
        >
            {component.content || '请在此处签章'}
        </div>
    );
};

export default SignatureComponent; 