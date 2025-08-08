import React from 'react';
import { FormComponent } from '../../../../types/formDesigner';

interface ContractTermsComponentProps {
    component: FormComponent;
}

const ContractTermsComponent: React.FC<ContractTermsComponentProps> = ({ component }) => {
    return (
        <div
            style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                backgroundColor: '#fafafa',
                minHeight: '80px',
                whiteSpace: 'pre-line',
                ...component.style
            }}
        >
            {component.content || '1. 甲方责任：\n2. 乙方责任：\n3. 付款方式：\n4. 违约责任：'}
        </div>
    );
};

export default ContractTermsComponent; 