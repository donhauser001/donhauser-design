import React from 'react';
import { FormComponent, ThemeConfig } from '../../../types/formDesigner';

interface RenderDescriptionOptions {
    component: FormComponent;
    theme: ThemeConfig;
    customStyle?: React.CSSProperties;
}

/**
 * 渲染组件说明文字的通用函数
 */
export const renderDescription = ({ component, theme, customStyle = {} }: RenderDescriptionOptions) => {
    if (!component.fieldDescription) {
        return null;
    }

    const position = theme.descriptionPosition || 'bottom';
    const fontSize = theme.descriptionFontSize || '12px';
    const color = theme.descriptionColor || '#8c8c8c';

    const baseStyle: React.CSSProperties = {
        fontSize,
        color,
        lineHeight: '1.4',
        ...customStyle
    };

    // 根据位置设置不同的样式
    switch (position) {
        case 'top':
            return (
                <div style={{
                    ...baseStyle,
                    marginBottom: '4px'
                }}>
                    提示：{component.fieldDescription}
                </div>
            );

        case 'right':
            return (
                <div style={{
                    ...baseStyle,
                    marginLeft: '8px',
                    alignSelf: 'flex-start',
                    paddingTop: '6px' // 与输入框对齐
                }}>
                    提示：{component.fieldDescription}
                </div>
            );

        case 'bottom':
        default:
            return (
                <div style={{
                    ...baseStyle,
                    marginTop: '4px'
                }}>
                    提示：{component.fieldDescription}
                </div>
            );
    }
};

/**
 * 获取包含说明文字的容器样式
 */
export const getDescriptionContainerStyle = (theme: ThemeConfig): React.CSSProperties => {
    const position = theme.descriptionPosition || 'bottom';

    if (position === 'right') {
        return {
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%'
        };
    }

    return {
        width: '100%'
    };
};

/**
 * 获取组件内容的样式（当说明文字在右侧时需要调整）
 */
export const getComponentContentStyle = (theme: ThemeConfig): React.CSSProperties => {
    const position = theme.descriptionPosition || 'bottom';

    if (position === 'right') {
        return {
            flex: 1,
            minWidth: 0
        };
    }

    return {};
};

/**
 * 渲染顶部说明文字
 */
export const renderTopDescription = ({ component, theme }: { component: FormComponent; theme: ThemeConfig }) => {
    const position = theme.descriptionPosition || 'bottom';
    if (position === 'top') {
        return renderDescription({ component, theme });
    }
    return null;
};

/**
 * 渲染底部说明文字
 */
export const renderBottomDescription = ({ component, theme }: { component: FormComponent; theme: ThemeConfig }) => {
    const position = theme.descriptionPosition || 'bottom';
    if (position === 'bottom') {
        return renderDescription({ component, theme });
    }
    return null;
};

/**
 * 渲染右侧说明文字
 */
export const renderRightDescription = ({ component, theme }: { component: FormComponent; theme: ThemeConfig }) => {
    const position = theme.descriptionPosition || 'bottom';
    if (position === 'right') {
        return renderDescription({ component, theme });
    }
    return null;
};
