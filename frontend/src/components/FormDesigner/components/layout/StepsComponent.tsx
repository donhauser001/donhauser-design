import React from 'react';
import { Steps } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface StepsComponentProps {
    component: FormComponent;
}

const StepsComponent: React.FC<StepsComponentProps> = ({ component }) => {
    return (
        <div style={{ padding: '16px' }}>
            <Steps
                current={component.current || 1}
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