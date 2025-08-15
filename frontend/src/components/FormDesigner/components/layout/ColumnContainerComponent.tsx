import React from 'react';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import ColumnDropZone from './ColumnDropZone';

interface ColumnContainerComponentProps {
    component: FormComponent;
}

const ColumnContainerComponent: React.FC<ColumnContainerComponentProps> = ({ component }) => {
    const { getComponentsByParent, selectedComponent } = useFormDesignerStore();
    const childComponents = getComponentsByParent(component.id);
    const isSelected = selectedComponent === component.id;

    // 为每一列获取子组件
    const getColumnComponents = (columnIndex: number) => {
        return childComponents.filter(child =>
            (child.columnIndex !== undefined ? child.columnIndex : 0) === columnIndex
        );
    };

    // 构建边框样式
    const borderStyle = component.style?.borderStyle || 'solid';
    const borderWidth = component.style?.borderWidth || '1px';
    const { theme } = useFormDesignerStore();
    const themeBorderColor = theme.borderColor || '#d9d9d9';
    const borderColor = component.style?.borderColor || themeBorderColor;
    const border = borderStyle === 'none' ? 'none' : `${borderWidth} ${borderStyle} ${borderColor}`;

    return (
        <div
            style={{
                border: border,
                borderRadius: component.style?.borderRadius || '6px',
                padding: component.style?.padding || '16px',
                backgroundColor: component.style?.backgroundColor || '#fafafa',
                // 只展开需要的样式属性，避免类型冲突
                width: component.style?.width,
                height: component.style?.height,
                margin: component.style?.margin,
                fontSize: component.style?.fontSize,
                fontWeight: component.style?.fontWeight,
                color: component.style?.color,
                lineHeight: component.style?.lineHeight
            }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${component.columns || 2}, 1fr)`,
                    gap: component.style?.gap || '16px',
                    minHeight: '100px'
                }}
            >
                {/* 为每一列创建独立的拖放区域 */}
                {Array.from({ length: component.columns || 2 }).map((_, columnIndex) => (
                    <ColumnDropZone
                        key={columnIndex}
                        containerComponent={component}
                        columnIndex={columnIndex}
                        components={getColumnComponents(columnIndex)}
                        isSelected={isSelected}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColumnContainerComponent; 