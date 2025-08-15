import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import SimpleRichTextEditor from '../../../SimpleRichTextEditor';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

const { TextArea } = Input;

interface TextareaComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const TextareaComponent: React.FC<TextareaComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();
    const [textValue, setTextValue] = useState(getInitialValue());

    // 监听外部值变化
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null && currentValue !== textValue) {
            setTextValue(currentValue);
        }
    }, [getValue, textValue]);

    // 处理文本变化
    const handleChange = (value: string) => {
        setTextValue(value);
        setValue(value);
    };
    const isRichText = component.enableRichText === true;

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={{
                ...getComponentContentStyle(theme),
                overflow: 'hidden',
                paddingBottom: (!isRichText && component.showCharCount !== false) ? '20px' : '0'
            }}>
                {isRichText ? (
                    <SimpleRichTextEditor
                        placeholder={component.placeholder || '请输入内容'}
                        height={component.richTextHeight || 300}
                        value={textValue}
                        onChange={handleChange}
                        readOnly={isDesignMode}
                    />
                ) : (
                    <TextArea
                        placeholder={component.placeholder || '请输入内容'}
                        rows={3}
                        maxLength={component.maxLength || 500}
                        showCount={component.showCharCount !== false}
                        value={textValue || ''}
                        style={{
                            resize: 'vertical',
                            ...(component.style || {})
                        } as React.CSSProperties}
                        readOnly={isDesignMode}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                )}
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default TextareaComponent; 