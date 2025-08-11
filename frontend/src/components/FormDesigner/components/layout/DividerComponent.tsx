import React from 'react';
import { Divider } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface DividerComponentProps {
    component: FormComponent;
}

const DividerComponent: React.FC<DividerComponentProps> = ({ component }) => {
    // 构建线条样式
    const lineStyle = {
        borderTopStyle: component.dividerStyle || 'solid',
        borderTopWidth: `${component.thickness || 1}px`,
        borderTopColor: component.lineColor || '#d9d9d9',
        ...component.style
    };

    // 如果有标题或描述，使用自定义布局
    if (component.title || component.description) {
        const descriptionPosition = component.descriptionPosition || 'below';

        return (
            <div style={{
                margin: '16px 0',
                textAlign: component.textAlign || 'left',
                width: '100%'
            }}>
                {/* 标题 */}
                {component.title && (
                    <div style={{
                        fontSize: component.titleStyle?.fontSize || '16px',
                        fontWeight: component.titleStyle?.fontWeight || '600',
                        color: component.titleStyle?.color || '#262626',
                        marginBottom: '8px'
                    }}>
                        {component.title}
                    </div>
                )}

                {/* 说明文本 - 线上 */}
                {component.description && descriptionPosition === 'above' && (
                    <div style={{
                        fontSize: component.descriptionStyle?.fontSize || '14px',
                        fontWeight: component.descriptionStyle?.fontWeight || '400',
                        color: component.descriptionStyle?.color || '#8c8c8c',
                        marginBottom: '8px'
                    }}>
                        {component.description}
                    </div>
                )}

                {/* 分割线 */}
                <div style={{
                    width: '100%',
                    height: '0',
                    ...lineStyle
                }} />

                {/* 说明文本 - 线下 */}
                {component.description && descriptionPosition === 'below' && (
                    <div style={{
                        fontSize: component.descriptionStyle?.fontSize || '14px',
                        fontWeight: component.descriptionStyle?.fontWeight || '400',
                        color: component.descriptionStyle?.color || '#8c8c8c',
                        marginTop: '8px'
                    }}>
                        {component.description}
                    </div>
                )}
            </div>
        );
    }

    // 如果只有content，使用原有的Ant Design Divider
    return (
        <Divider style={lineStyle}>
            {component.content || ''}
        </Divider>
    );
};

export default DividerComponent; 