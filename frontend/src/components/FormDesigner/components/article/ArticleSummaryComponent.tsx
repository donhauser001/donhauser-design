import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

const { TextArea } = Input;

interface ArticleSummaryComponentProps {
    component: FormComponent;
}

const ArticleSummaryComponent: React.FC<ArticleSummaryComponentProps> = ({ component }) => {
    return (
        <TextArea
            placeholder={component.placeholder || '请输入文章摘要'}
            disabled={component.disabled}
            rows={component.rows || 4}
            style={component.style}
            maxLength={component.maxLength || 200}
            showCount={component.showCharCount}
            autoSize={component.autoSize ? { minRows: 3, maxRows: 8 } : false}
        />
    );
};

export default ArticleSummaryComponent; 