import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

const { TextArea } = Input;

interface ArticleSummaryComponentProps {
    component: FormComponent;
}

const ArticleSummaryComponent: React.FC<ArticleSummaryComponentProps> = ({ component }) => {
    return (
        <div style={{ width: '100%' }}>
            <TextArea
                placeholder={component.placeholder || '请输入文章摘要'}
                value={component.defaultValue || ''}
                disabled={component.disabled}
                rows={component.rows || 4}
                style={component.style}
                maxLength={component.maxLength || 200}
                showCount={component.showCharCount}
                autoSize={component.autoSize ? { minRows: 3, maxRows: 8 } : false}
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

export default ArticleSummaryComponent; 