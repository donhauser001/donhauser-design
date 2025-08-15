import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

const { TextArea } = Input;

interface ArticleSummaryComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ArticleSummaryComponent: React.FC<ArticleSummaryComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <TextArea
                    placeholder={component.placeholder || '请输入文章摘要'}
                    value={component.defaultValue || ''}
                    disabled={component.disabled}
                    rows={component.rows || 4}
                    style={component.style}
                    maxLength={component.maxLength || 200}
                    showCount={component.showCharCount}
                    autoSize={component.autoSize ? { minRows: 3, maxRows: 8 } : false}
                    readOnly={isDesignMode}
                />
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ArticleSummaryComponent; 