import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import SortableComponent from '../SortableComponent';

interface GroupComponentProps {
    component: FormComponent;
}

const GroupComponent: React.FC<GroupComponentProps> = ({ component }) => {
    const { getComponentsByParent, addComponent, moveComponent, previewTarget, setPreviewTarget, clearPreviewTarget } = useFormDesignerStore();
    const childComponents = getComponentsByParent(component.id);

    return (
        <div
            data-component-type="group"
            style={{
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#ffffff',
                marginBottom: '16px',
                ...component.style
            }}
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.style.borderColor = '#1890ff';
                e.currentTarget.style.backgroundColor = '#f0f8ff';
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.backgroundColor = '#ffffff';
                clearPreviewTarget();
            }}
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.backgroundColor = '#ffffff';

                const componentType = e.dataTransfer.getData('componentType');
                console.log('Group drop event:', componentType, component.id);
                if (componentType) {
                    // 在组容器顶部插入
                    addComponent(componentType, previewTarget?.index ?? 0, component.id);
                    clearPreviewTarget();
                }
            }}
        >
            <div style={{
                fontWeight: 600,
                fontSize: '16px',
                marginBottom: '16px',
                color: '#262626',
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: '8px',
                paddingLeft: '8px'
            }}>
                {component.label}
            </div>

            {childComponents.length > 0 ? (
                // 有子组件时，显示子组件，同时保留拖拽接收功能
                <div
                    style={{
                        minHeight: '60px',
                        transition: 'all 0.2s',
                        position: 'relative',
                        zIndex: 1
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                        e.currentTarget.style.border = '2px dashed #1890ff';
                        // 计算预览插入位置
                        const clientY = e.clientY;
                        let insertIndex = childComponents.length;
                        let minDistance = Number.MAX_VALUE;
                        childComponents.forEach((comp, index) => {
                            const el = document.querySelector(`[data-component-id="${comp.id}"]`) as HTMLElement | null;
                            if (!el) return;
                            const mid = el.getBoundingClientRect().top + el.offsetHeight / 2;
                            const dist = Math.abs(clientY - mid);
                            if (dist < minDistance) {
                                minDistance = dist;
                                insertIndex = clientY < mid ? index : index + 1;
                            }
                        });
                        setPreviewTarget(component.id, insertIndex);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.border = 'none';
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.border = 'none';

                        const componentType = e.dataTransfer.getData('componentType');
                        console.log('Group inner drop event:', componentType, component.id);
                        if (componentType) {
                            const insertIndex = previewTarget?.parentId === component.id ? previewTarget.index : childComponents.length;
                            addComponent(componentType, insertIndex, component.id);
                            clearPreviewTarget();
                        }
                    }}
                >
                    <SortableContext items={childComponents.map(child => child.id)} strategy={verticalListSortingStrategy}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {childComponents.map((child, index) => (
                                <SortableComponent
                                    key={child.id || index}
                                    component={child}
                                />
                            ))}
                            {previewTarget?.parentId === component.id && (
                                <div style={{ position: 'relative' }}>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            height: 0,
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'relative',
                                                top: (() => {
                                                    const beforeId = childComponents[previewTarget.index - 1]?.id;
                                                    const el = beforeId ? (document.querySelector(`[data-component-id="${beforeId}"]`) as HTMLElement | null) : null;
                                                    if (!el) return 0;
                                                    return el.offsetTop + el.offsetHeight + 8;
                                                })(),
                                                height: '2px',
                                                background: '#1890ff',
                                                borderRadius: 1,
                                                boxShadow: '0 0 0 2px rgba(24,144,255,0.15)'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </div>
            ) : (
                // 没有子组件时，显示拖拽提示区域
                <div
                    style={{
                        minHeight: '60px',
                        padding: '12px',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        border: '2px dashed #d9d9d9',
                        transition: 'all 0.2s'
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.style.borderColor = '#1890ff';
                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.style.borderColor = '#d9d9d9';
                        e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.style.borderColor = '#d9d9d9';
                        e.currentTarget.style.backgroundColor = '#fafafa';

                        const componentType = e.dataTransfer.getData('componentType');
                        if (componentType) {
                            addComponent(componentType, undefined, component.id);
                        }
                    }}
                >
                    <div style={{
                        color: '#999',
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
                        拖拽组件到分组中
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupComponent; 