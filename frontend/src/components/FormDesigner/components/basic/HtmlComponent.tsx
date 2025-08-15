import React from 'react';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface HtmlComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const HtmlComponent: React.FC<HtmlComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();
    const borderColor = theme.borderColor || '#d9d9d9';
    const containerStyle = {
        width: '100%',
        padding: component.style?.padding || '8px',
        margin: component.style?.margin || '0',
        backgroundColor: component.style?.backgroundColor || 'transparent',
        borderRadius: component.style?.borderRadius || '4px',
        border: component.style?.borderWidth ?
            `${component.style.borderWidth} ${component.style.borderStyle || 'solid'} ${component.style.borderColor || borderColor}` :
            'none',
        fontSize: component.style?.fontSize || '14px',
        color: component.style?.color || '#333',
        lineHeight: component.style?.lineHeight || '1.6'
    };

    const placeholderStyle = {
        padding: '16px',
        backgroundColor: '#f5f5f5',
        border: `2px dashed ${borderColor}`,
        borderRadius: '4px',
        textAlign: 'center' as const,
        color: '#8c8c8c',
        fontSize: '14px'
    };

    return (
        <div style={{ width: '100%' }}>
            {component.htmlContent ? (
                <div
                    style={containerStyle}
                    dangerouslySetInnerHTML={{ __html: component.htmlContent }}
                />
            ) : (
                <div style={placeholderStyle}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16,18 22,12 16,6"></polyline>
                            <polyline points="8,6 2,12 8,18"></polyline>
                        </svg>
                    </div>
                    <div>请设置HTML内容</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#999' }}>
                        支持HTML标签和内联样式
                    </div>
                </div>
            )}

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

export default HtmlComponent;
