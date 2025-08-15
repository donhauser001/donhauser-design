import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormComponent } from '../../../../types/formDesigner';
import SortableComponent from '../SortableComponent';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface ColumnDropZoneProps {
    containerComponent: FormComponent;
    columnIndex: number;
    components: FormComponent[];
    isSelected: boolean;
}

const ColumnDropZone: React.FC<ColumnDropZoneProps> = ({
    containerComponent,
    columnIndex,
    components,
    isSelected
}) => {
    const { theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
    // 为每一列配置独立的droppable区域
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${containerComponent.id}-${columnIndex}`,
        data: {
            type: 'column',
            containerComponent,
            columnIndex,
            accepts: ['component-from-library', 'component-in-canvas']
        }
    });

    // 获取当前列的组件ID列表，用于SortableContext
    const columnComponentIds = components.map(comp => comp.id);

    return (
        <div
            ref={setNodeRef}
            style={{
                minHeight: '100px',
                position: 'relative',
                backgroundColor: isOver ? '#f0f8ff' : 'transparent',
                border: isOver ? `2px dashed ${primaryColor}` : '2px dashed transparent',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                padding: isOver ? '8px' : (containerComponent.style?.columnPadding || '4px')
            }}
        >
            {/* 选中状态下的列边框和标签 */}
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: `1px dashed ${primaryColor}`,
                    borderRadius: '4px',
                    backgroundColor: 'rgba(24, 144, 255, 0.05)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '4px',
                        fontSize: '10px',
                        color: primaryColor,
                        fontWeight: 500,
                        background: '#fff',
                        padding: '0 4px',
                        borderRadius: '2px'
                    }}>
                        第{columnIndex + 1}列
                    </div>
                </div>
            )}

            {components.length > 0 ? (
                // 有子组件时，使用SortableContext包装，支持排序和拖拽
                <SortableContext items={columnComponentIds} strategy={verticalListSortingStrategy}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 2 }}>
                        {components.map((child) => (
                            <SortableComponent key={child.id} component={child} />
                        ))}
                    </div>
                </SortableContext>
            ) : (
                // 没有子组件时，显示拖拽提示
                <div style={{
                    minHeight: '80px',
                    color: isOver ? primaryColor : '#999',
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '20px 8px',
                    backgroundColor: isOver ? '#e6f7ff' : '#fafafa',
                    borderRadius: '4px',
                    border: isOver ? `1px dashed ${primaryColor}` : `1px dashed ${theme.borderColor || '#d9d9d9'}`,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <AppstoreOutlined style={{ fontSize: '16px' }} />
                    <span>{isOver ? '放置组件到此列' : `第${columnIndex + 1}列`}</span>
                </div>
            )}
        </div>
    );
};

export default ColumnDropZone;
