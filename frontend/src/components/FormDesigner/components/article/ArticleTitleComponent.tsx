import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';

interface ArticleTitleComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ArticleTitleComponent: React.FC<ArticleTitleComponentProps> = ({ component, isDesignMode = false }) => {
    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    return (
        <div style={{ width: '100%' }}>
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
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    提示：{component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ArticleTitleComponent;
