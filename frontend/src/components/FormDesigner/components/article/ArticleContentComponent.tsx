import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import SimpleRichTextEditor from '../../../SimpleRichTextEditor';

const { TextArea } = Input;

interface ArticleContentComponentProps {
    component: FormComponent;
}

const ArticleContentComponent: React.FC<ArticleContentComponentProps> = ({ component }) => {
    const isRichText = component.enableRichText === true;

    return (
        <div style={{
            width: '100%',
            overflow: 'hidden',
            paddingBottom: (!isRichText && component.showCharCount !== false) ? '20px' : '0'
        }}>
            {isRichText ? (
                <SimpleRichTextEditor
                    placeholder={component.placeholder || '请输入文章内容'}
                    height={component.richTextHeight || 400}
                    onChange={(html) => {
                        // 在富文本模式下，可以触发变更事件
                        console.log('Article content:', html);
                    }}
                />
            ) : (
                <TextArea
                    placeholder={component.placeholder || '请输入文章内容'}
                    disabled={component.disabled}
                    rows={component.rows || 8}
                    maxLength={component.maxLength}
                    showCount={component.showCharCount !== false}
                    autoSize={component.autoSize ? { minRows: 4, maxRows: 20 } : false}
                    style={{
                        resize: 'vertical'
                    }}
                />
            )}

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

export default ArticleContentComponent;
