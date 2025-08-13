import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import SimpleRichTextEditor from '../../../SimpleRichTextEditor';

const { TextArea } = Input;

interface InstructionComponentProps {
    component: FormComponent;
}

const InstructionComponent: React.FC<InstructionComponentProps> = ({ component }) => {
    const isRichText = component.enableRichText === true;

    return (
        <div style={{
            width: '100%',
            overflow: 'hidden',
            paddingBottom: (!isRichText && component.showCharCount !== false) ? '20px' : '0'
        }}>
            {isRichText ? (
                <SimpleRichTextEditor
                    placeholder={component.placeholder || '请输入嘱托内容'}
                    height={component.richTextHeight || 300}
                    onChange={(html) => {
                        // 在富文本模式下，可以触发变更事件
                        console.log('Rich text content:', html);
                    }}
                />
            ) : (
                <TextArea
                    placeholder={component.placeholder || '请输入嘱托内容'}
                    disabled={component.disabled}
                    rows={4}
                    maxLength={component.maxLength || 500}
                    showCount={component.showCharCount !== false}
                    style={{
                        resize: 'vertical',
                        ...(component.style || {})
                    } as React.CSSProperties}
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

export default InstructionComponent; 