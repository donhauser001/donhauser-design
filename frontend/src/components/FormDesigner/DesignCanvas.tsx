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

    // 计算原生拖拽（来自组件库）在根层的插入索引
    const getInsertIndexNative = (clientY: number, siblings: typeof components) => {
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
            const insertIndex = typeof previewTarget?.index === 'number' && previewTarget?.parentId == null
                ? previewTarget.index
                : getInsertIndexNative(e.clientY, rootComponents);
            addComponent(componentType, insertIndex);
            clearPreviewTarget();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        const rootComponents = components.filter(comp => !comp.parentId).sort((a, b) => a.order - b.order);
        const insertIndex = getInsertIndexNative(e.clientY, rootComponents);
        setPreviewTarget(null, insertIndex);
    };

    // dnd-kit 内部拖动的实时预览
    const handleKitDragOver = (event: any) => {
        const { active, over } = event;
        if (!active || !over) return;
        const activeComponent = components.find(c => c.id === active.id);
        const overComponent = components.find(c => c.id === over.id);
        if (!activeComponent || !overComponent) return;

        const newParentId = overComponent.type === 'group' ? overComponent.id : overComponent.parentId || null;
        const siblings = components
            .filter(c => c.parentId === newParentId)
            .sort((a, b) => a.order - b.order);

        // 基于鼠标位置（与 over 元素中线比较）判断插入前/后
        let baseIndex = siblings.findIndex(s => s.id === overComponent.id);
        if (overComponent.type === 'group') {
            baseIndex = siblings.length - 1; // 组内没有子项时为 -1，后面 +1 变 0
        }
        let insertIndex = baseIndex + 1; // 默认在 over 后面
        const overEl = document.querySelector(`[data-component-id="${overComponent.id}"]`) as HTMLElement | null;
        const pointerY = (event?.delta?.y || 0) + (event?.activatorEvent?.clientY || 0);
        if (overEl) {
            const rect = overEl.getBoundingClientRect();
            const mid = rect.top + rect.height / 2;
            insertIndex = (event?.over?.rect?.top ? (event.over.rect.top + event.over.rect.height / 2) : mid) && ((event?.active?.rect?.current?.top ?? pointerY) < mid)
                ? baseIndex
                : baseIndex + 1;
        }

        // 同父级内移动时修正因移除导致的索引偏移
        const activeIndex = siblings.findIndex(s => s.id === active.id);
        if (activeIndex !== -1 && activeIndex < insertIndex) insertIndex -= 1;

        setPreviewTarget(newParentId, Math.max(0, Math.min(insertIndex, siblings.length)));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            // 获取组件信息
            const activeComponent = components.find(comp => comp.id === active.id);
            const overComponent = components.find(comp => comp.id === over?.id);

            if (!activeComponent || !overComponent) return;
            // 若有实时预览目标，直接使用
            if (previewTarget) {
                moveComponent(active.id as string, previewTarget.index, previewTarget.parentId || undefined);
                clearPreviewTarget();
                return;
            }

            // 退化逻辑：基于 over 目标计算
            const newParentId = overComponent.type === 'group' ? overComponent.id : overComponent.parentId || undefined;
            const siblings = components.filter(c => c.parentId === newParentId).sort((a, b) => a.order - b.order);
            const overIndex = overComponent.type === 'group' ? siblings.length : siblings.findIndex(s => s.id === overComponent.id);
            const activeIndex = siblings.findIndex(s => s.id === active.id);
            const insertIndex = activeIndex !== -1 && activeIndex < overIndex ? overIndex + 1 : overIndex;
            moveComponent(active.id as string, Math.max(0, insertIndex), newParentId);
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
                onDragOver={handleKitDragOver}
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
                                {rootComponents.map((component, i) => (
                                    <React.Fragment key={component.id}>
                                        {previewTarget?.parentId == null && previewTarget?.index === i && (
                                            <div key={`preview-${i}`} style={{ height: 0 }}>
                                                <div
                                                    style={{
                                                        height: 2,
                                                        background: '#1890ff',
                                                        borderRadius: 1,
                                                        margin: '8px 0',
                                                        boxShadow: '0 0 0 2px rgba(24,144,255,0.12)',
                                                        transition: 'all 120ms ease'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <SortableComponent component={component} />
                                    </React.Fragment>
                                ))}
                                {previewTarget?.parentId == null && previewTarget?.index === rootComponents.length && (
                                    <div key={`preview-end`} style={{ height: 0 }}>
                                        <div
                                            style={{
                                                height: 2,
                                                background: '#1890ff',
                                                borderRadius: 1,
                                                margin: '8px 0',
                                                boxShadow: '0 0 0 2px rgba(24,144,255,0.12)',
                                                transition: 'all 120ms ease'
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