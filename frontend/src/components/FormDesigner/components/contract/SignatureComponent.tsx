import React from 'react';
import { Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface SignatureComponentProps {
    component: FormComponent;
}

const SignatureComponent: React.FC<SignatureComponentProps> = ({ component }) => {
    const { components } = useFormDesignerStore();

    // 检查画布上是否存在合同方组件
    const hasContractPartyComponent = components.some((comp: FormComponent) => comp.type === 'contractParty');

    // 如果没有合同方组件，显示提示信息
    if (!hasContractPartyComponent) {
        return (
            <div style={{ width: '100%' }}>
                <Alert
                    message="签章组件需要配合合同方组件使用，请先在画布中添加合同方组件"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{ fontSize: '12px' }}
                />
                {component.fieldDescription && (
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '8px',
                        lineHeight: '1.4'
                    }}>
                        {component.fieldDescription}
                    </div>
                )}
            </div>
        );
    }

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