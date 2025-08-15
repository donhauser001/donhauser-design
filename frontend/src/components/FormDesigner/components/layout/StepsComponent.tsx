import React from 'react';
import { Steps } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface StepsComponentProps {
    component: FormComponent;
}

const StepsComponent: React.FC<StepsComponentProps> = ({ component }) => {
    const { theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
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
                
                /* 当前步骤和已完成步骤的数字背景色使用主题色 */
                .steps-custom .ant-steps-item-process .ant-steps-item-icon,
                .steps-custom .ant-steps-item-finish .ant-steps-item-icon {
                    background-color: ${primaryColor} !important;
                    border-color: ${primaryColor} !important;
                }
                
                /* 当前步骤和已完成步骤的数字文字颜色 */
                .steps-custom .ant-steps-item-process .ant-steps-item-icon .ant-steps-icon,
                .steps-custom .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
                    color: #fff !important;
                }
                
                /* 步骤之间的连接线高亮使用主题色 */
                .steps-custom .ant-steps-item-finish .ant-steps-item-tail::after {
                    background-color: ${primaryColor} !important;
                }
                
                /* 当前步骤的标题颜色使用主题色 */
                .steps-custom .ant-steps-item-process .ant-steps-item-title {
                    color: ${primaryColor} !important;
                }
                
                /* 已完成步骤的标题颜色使用主题色 */
                .steps-custom .ant-steps-item-finish .ant-steps-item-title {
                    color: ${primaryColor} !important;
                }
                
                /* 悬停效果 */
                .steps-custom .ant-steps-item:hover .ant-steps-item-icon {
                    border-color: ${primaryColor} !important;
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