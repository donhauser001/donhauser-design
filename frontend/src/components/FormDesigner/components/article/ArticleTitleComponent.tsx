import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';

interface ArticleTitleComponentProps {
    component: FormComponent;
}

const ArticleTitleComponent: React.FC<ArticleTitleComponentProps> = ({ component }) => {
    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    return (
        <Input
            placeholder={component.placeholder || '请输入文章标题'}
            disabled={component.disabled}
            style={component.style}
            maxLength={component.maxLength || 100}
            showCount={component.showCharCount}
            prefix={getPrefix()}
        />
    );
};

export default ArticleTitleComponent;
