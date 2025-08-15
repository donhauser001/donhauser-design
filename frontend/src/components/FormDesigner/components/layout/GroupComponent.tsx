import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import SortableComponent from '../SortableComponent';

interface GroupComponentProps {
    component: FormComponent;
}

const GroupComponent: React.FC<GroupComponentProps> = ({ component }) => {
    const { getComponentsByParent, theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
    const childComponents = getComponentsByParent(component.id);

    // 配置分组为可放置区域
    const { setNodeRef, isOver } = useDroppable({
        id: `group-${component.id}`,
        data: {
            type: 'group',
            componentId: component.id,
            accepts: ['component-from-library', 'component-in-canvas']
        }
    });

    // 获取子组件的ID列表，用于SortableContext（已经按order排序）
    const childComponentIds = childComponents.map(child => child.id);

    return (
        <div
            data-component-type="group"
            style={{
                border: `1px solid ${theme.borderColor || '#d9d9d9'}`,
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#ffffff',
                marginBottom: '16px',
                ...component.style
            }}
        >
            <div style={{
                fontWeight: 600,
                fontSize: '16px',
                marginBottom: '16px',
                color: '#262626',
                borderBottom: `1px solid ${theme.borderColor || '#d9d9d9'}`,
                paddingBottom: '8px',
                paddingLeft: '8px'
            }}>
                {component.label}
            </div>

            {/* 分组内容区域 - 可拖拽放置 */}
            <div
                ref={setNodeRef}
                style={{
                    minHeight: '60px',
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: isOver ? '#f0f8ff' : 'transparent',
                    border: isOver ? `2px dashed ${primaryColor}` : '2px dashed transparent',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    padding: isOver ? '8px' : '0px'
                }}
            >
                {childComponents.length > 0 ? (
                    // 有子组件时，使用SortableContext包装，支持排序和拖拽
                    <SortableContext items={childComponentIds} strategy={verticalListSortingStrategy}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {childComponents.map((child) => (
                                <SortableComponent key={child.id} component={child} />
                            ))}
                        </div>
                    </SortableContext>
                ) : (
                    // 没有子组件时，显示拖拽提示
                    <div
                        style={{
                            minHeight: '60px',
                            padding: '12px',
                            backgroundColor: isOver ? '#e6f7ff' : '#fafafa',
                            borderRadius: '4px',
                            border: isOver ? `2px dashed ${primaryColor}` : `2px dashed ${theme.borderColor || '#d9d9d9'}`,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{
                            color: isOver ? primaryColor : '#999',
                            fontSize: '14px',
                            textAlign: 'center',
                            padding: '20px 0',
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <AppstoreOutlined style={{ fontSize: '16px' }} />
                            {isOver ? '放置组件到此处' : '拖拽组件到此处'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupComponent;