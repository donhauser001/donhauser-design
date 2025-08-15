import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import SimpleRichTextEditor from '../../../SimpleRichTextEditor';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

const { TextArea } = Input;

interface ArticleContentComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ArticleContentComponent: React.FC<ArticleContentComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();
    const isRichText = component.enableRichText === true;

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={{
                ...getComponentContentStyle(theme),
                width: '100%',
                overflow: 'hidden',
                paddingBottom: (!isRichText && component.showCharCount !== false) ? '20px' : '0',
                ...component.style
            }}>
                {isRichText ? (
                    <SimpleRichTextEditor
                        placeholder={component.placeholder || '请输入文章内容'}
                        height={component.richTextHeight || 400}
                        onChange={(html) => {
                            // 在富文本模式下，可以触发变更事件
                            console.log('Article content:', html);
                        }}
                        readOnly={isDesignMode}
                    />
                ) : (
                    <TextArea
                        placeholder={component.placeholder || '请输入文章内容'}
                        disabled={component.disabled}
                        readOnly={isDesignMode}
                        rows={component.rows || 8}
                        maxLength={component.maxLength}
                        showCount={component.showCharCount !== false}
                        autoSize={component.autoSize ? { minRows: 4, maxRows: 20 } : false}
                        style={{
                            resize: 'vertical'
                        }}
                    />
                )}
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ArticleContentComponent;
