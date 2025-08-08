import React from 'react';
import { Card, Empty } from 'antd';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import SortableComponent from './components/SortableComponent';

const DesignCanvas: React.FC = () => {
    const {
        components,
        selectComponent,
        addComponent,
        moveComponent,
        previewTarget,
        setPreviewTarget,
        clearPreviewTarget,
    } = useFormDesignerStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCanvasClick = (e: React.MouseEvent) => {
        // 点击画布空白区域取消选择
        if (e.target === e.currentTarget) {
            selectComponent(null);
        }
    };

    // 记录插入位置的参考线索
    const getInsertIndex = (clientY: number, siblings: typeof components) => {
        // 找到与鼠标最近的组件，决定插入到其前或后
        let closestIndex = siblings.length;
        let minDistance = Number.MAX_VALUE;
        siblings.forEach((comp, index) => {
            const el = document.querySelector(`[data-component-id="${comp.id}"]`) as HTMLElement | null;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const mid = rect.top + rect.height / 2;
            const dist = Math.abs(clientY - mid);
            if (dist < minDistance) {
                minDistance = dist;
                // 若鼠标在该组件上半区，则插入到其前；否则插到其后
                closestIndex = clientY < mid ? index : index + 1;
            }
        });
        return Math.min(Math.max(closestIndex, 0), siblings.length);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        // 检查是否拖拽到了分组组件上
        const target = e.target as HTMLElement;
        if (target.closest('[data-component-type="group"]')) {
            return; // 让分组组件自己处理
        }

        const componentType = e.dataTransfer.getData('componentType');
        if (componentType) {
            const rootComponents = components.filter(comp => !comp.parentId).sort((a, b) => a.order - b.order);
            const insertIndex = getInsertIndex(e.clientY, rootComponents);
            addComponent(componentType, insertIndex);
            clearPreviewTarget();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        const rootComponents = components.filter(comp => !comp.parentId).sort((a, b) => a.order - b.order);
        const insertIndex = getInsertIndex(e.clientY, rootComponents);
        setPreviewTarget(null, insertIndex);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            // 获取组件信息
            const activeComponent = components.find(comp => comp.id === active.id);
            const overComponent = components.find(comp => comp.id === over?.id);

            if (!activeComponent || !overComponent) return;

            // 找到活动组件的父分组
            const parentGroup = components.find(comp =>
                comp.type === 'group' &&
                comp.id === activeComponent.parentId
            );

            // 找到目标组件的父分组
            const targetGroup = components.find(comp =>
                comp.type === 'group' &&
                comp.id === overComponent.parentId
            );

            // 检查是否拖拽到分组组件本身
            const isOverGroup = overComponent.type === 'group';

            // 情况1: 分组子组件拖拽到画布外部
            if (parentGroup && !targetGroup && !isOverGroup) {
                const rootComponents = components.filter(comp => !comp.parentId).sort((a, b) => a.order - b.order);
                const insertIndex = getInsertIndex(event.delta.y + (event.activatorEvent as any)?.clientY || 0, rootComponents);
                moveComponent(active.id as string, insertIndex);
            }
            // 情况2: 分组子组件拖拽到另一个分组组件本身
            else if (parentGroup && isOverGroup && parentGroup.id !== overComponent.id) {
                moveComponent(active.id as string, 0, overComponent.id);
            }
            // 情况3: 画布组件拖拽到分组中（无论是子组件还是分组本身）
            else if (!parentGroup && (targetGroup || isOverGroup)) {
                const targetGroupId = targetGroup?.id || overComponent.id;
                moveComponent(active.id as string, 0, targetGroupId);
            }
            // 情况4: 分组子组件拖拽到另一个分组（拖拽到该分组的子组件上）
            else if (parentGroup && targetGroup && parentGroup.id !== targetGroup.id) {
                moveComponent(active.id as string, 0, targetGroup.id);
            }
            // 情况5: 分组内子组件排序（同一分组内）
            else if (parentGroup && targetGroup && parentGroup.id === targetGroup.id) {
                const siblings = components.filter(comp => comp.parentId === parentGroup.id);
                const oldIndex = siblings.findIndex(child => child.id === active.id);
                const newIndex = siblings.findIndex(child => child.id === over?.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    moveComponent(active.id as string, newIndex, parentGroup.id);
                }
            }
            // 情况6: 画布组件排序
            else if (!parentGroup && !targetGroup) {
                const rootComponents = components.filter(comp => !comp.parentId);
                // 使用几何中线算法确定更自然的停驻位置
                const newIndex = getInsertIndex((event.activatorEvent as any)?.clientY || 0, rootComponents);
                moveComponent(active.id as string, newIndex);
            }
        }
    };

    // 获取根级组件（没有父组件的组件）
    const rootComponents = components.filter(comp => !comp.parentId).sort((a, b) => a.order - b.order);

    return (
        <Card
            title="设计画布"
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{
                body: {
                    padding: '16px',
                    height: 'calc(100% - 57px)',
                    overflow: 'auto',
                    backgroundColor: '#fafafa'
                }
            }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div
                    style={{
                        minHeight: '100%',
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '2px dashed #d9d9d9',
                        position: 'relative'
                    }}
                    onClick={handleCanvasClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {rootComponents.length === 0 ? (
                        <Empty
                            description="拖拽组件到此处开始设计表单"
                            style={{ margin: '60px 0' }}
                        />
                    ) : (
                        <SortableContext
                            items={rootComponents.map(comp => comp.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div style={{ position: 'relative' }}>
                                {rootComponents.map((component) => (
                                    <SortableComponent
                                        key={component.id}
                                        component={component}
                                    />
                                ))}
                                {typeof previewTarget?.index === 'number' && previewTarget?.parentId == null && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            height: '0',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: (() => {
                                                    const beforeId = rootComponents[previewTarget.index - 1]?.id;
                                                    const el = beforeId ? (document.querySelector(`[data-component-id="${beforeId}"]`) as HTMLElement | null) : null;
                                                    if (!el) return 0;
                                                    return el.offsetTop + el.offsetHeight + 8;
                                                })(),
                                                left: 0,
                                                right: 0,
                                                height: '2px',
                                                background: '#1890ff',
                                                borderRadius: 1,
                                                boxShadow: '0 0 0 2px rgba(24,144,255,0.15)'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    )}
                </div>
            </DndContext>
        </Card>
    );
};

export default DesignCanvas; 