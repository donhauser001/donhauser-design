import React from 'react';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface PresetTextComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const PresetTextComponent: React.FC<PresetTextComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();
    const borderColor = theme.borderColor || '#d9d9d9';
    // 默认样式
    const defaultStyle = {
        fontSize: '14px',
        fontWeight: '400',
        color: '#262626',
        lineHeight: '1.5',
        textAlign: 'left' as const,
        padding: '8px',
        margin: '0px',
        backgroundColor: 'transparent',
        borderWidth: '0px',
        borderStyle: 'solid',
        borderColor: borderColor,
        borderRadius: '0px',
        minHeight: 'auto',
        whiteSpace: 'pre-wrap' as const, // 保持换行和空格
        wordBreak: 'break-word' as const, // 长单词换行
        width: '100%'
    };

    return (
        <div
            style={{
                ...defaultStyle,
                ...component.style
            }}
        >
            {component.content || '这里是预设的文本内容，可以自定义样式和格式。'}
        </div>
    );
};

export default PresetTextComponent; 