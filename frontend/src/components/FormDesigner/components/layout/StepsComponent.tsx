import React from 'react';
import { Steps } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface StepsComponentProps {
    component: FormComponent;
}

const StepsComponent: React.FC<StepsComponentProps> = ({ component }) => {
    return (
        <div style={{ padding: '16px', width: '100%' }}>
            <style>
                {`
                .steps-custom .ant-steps-item-title {
                    font-weight: 600 !important;
                }
                .steps-custom .ant-steps-item-description {
                    font-size: 12px !important;
                }
                `}
            </style>
            <Steps
                className="steps-custom"
                current={component.current || 0}
                direction={component.direction || 'horizontal'}
                size={component.size || 'default'}
                status={component.status || 'process'}
                items={component.steps?.map((step, index) => ({
                    title: step.title,
                    description: step.description
                })) || [
                        { title: '第一步', description: '开始' },
                        { title: '第二步', description: '进行中' },
                        { title: '第三步', description: '完成' }
                    ]}
                style={component.style}
            />
        </div>
    );
};

export default StepsComponent; 