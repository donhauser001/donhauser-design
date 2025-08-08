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
            placeholder={component.placeholder}
            disabled={true}
            rows={4}
            style={component.style}
        />
    );
};

export default ArticleSummaryComponent; 