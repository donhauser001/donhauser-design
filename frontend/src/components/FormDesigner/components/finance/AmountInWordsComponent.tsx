import React from 'react';
import { FormComponent } from '../../../../types/formDesigner';

interface AmountInWordsComponentProps {
    component: FormComponent;
}

const AmountInWordsComponent: React.FC<AmountInWordsComponentProps> = ({ component }) => {
    return (
        <div
            style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                backgroundColor: '#fafafa',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                color: '#262626',
                ...component.style
            }}
        >
            {component.content || '人民币贰万伍仟零伍拾元整'}
        </div>
    );
};

export default AmountInWordsComponent; 