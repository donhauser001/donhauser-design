import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';

interface InputComponentProps {
    component: FormComponent;
}

const InputComponent: React.FC<InputComponentProps> = ({ component }) => {
    // 根据输入格式设置类型和验证
    const getInputType = () => {
        switch (component.inputFormat) {
            case 'email':
                return 'email';
            case 'phone':
                return 'tel';
            default:
                return 'text';
        }
    };

    // 根据格式生成占位符
    const getPlaceholder = () => {
        if (component.placeholder) {
            return component.placeholder;
        }

        switch (component.inputFormat) {
            case 'email':
                return '请输入邮箱地址';
            case 'name':
                return '请输入姓名';
            case 'phone':
                return '请输入电话号码';
            default:
                return '请输入内容';
        }
    };

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    return (
        <div style={{ width: '100%' }}>
            <Input
                type={getInputType()}
                placeholder={getPlaceholder()}
                value={component.defaultValue || ''}
                prefix={getPrefix()}
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

export default InputComponent; 