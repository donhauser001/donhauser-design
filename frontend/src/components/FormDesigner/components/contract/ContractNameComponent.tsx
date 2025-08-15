import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';

interface ContractNameComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ContractNameComponent: React.FC<ContractNameComponentProps> = ({ component, isDesignMode = false }) => {
    // 获取占位符文本
    const getPlaceholder = () => {
        return component.placeholder || '请输入合同名称';
    };

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    return (
        <div style={{ width: '100%' }}>
            <Input
                type="text"
                placeholder={getPlaceholder()}
                value={component.defaultValue || ''}
                prefix={getPrefix()}
                style={component.style}
                readOnly={isDesignMode}
                required={component.required}
            />
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    提示：{component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ContractNameComponent; 