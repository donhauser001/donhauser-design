import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface ArticleTitleComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ArticleTitleComponent: React.FC<ArticleTitleComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <Input
                    placeholder={component.placeholder || '请输入文章标题'}
                    value={component.defaultValue || ''}
                    disabled={component.disabled}
                    style={component.style}
                    maxLength={component.maxLength || 100}
                    showCount={component.showCharCount}
                    prefix={getPrefix()}
                    readOnly={isDesignMode}
                />
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ArticleTitleComponent;
