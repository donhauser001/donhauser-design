import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface ContractNameComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ContractNameComponent: React.FC<ContractNameComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();

    // 获取占位符文本
    const getPlaceholder = () => {
        return component.placeholder || '请输入合同名称';
    };

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <Input
                    type="text"
                    placeholder={getPlaceholder()}
                    value={component.defaultValue || ''}
                    prefix={getPrefix()}
                    style={component.style}
                    readOnly={isDesignMode}
                    required={component.required}
                />
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ContractNameComponent; 