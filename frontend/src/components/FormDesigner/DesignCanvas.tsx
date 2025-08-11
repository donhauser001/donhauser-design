import React from 'react';
import { Card, Empty } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import SortableComponent from './components/SortableComponent';

const DesignCanvas: React.FC = () => {
    const {
        components,
        selectComponent,
    } = useFormDesignerStore();

    // 配置画布为可放置区域
    const { setNodeRef, isOver } = useDroppable({
        id: 'design-canvas',
        data: {
            type: 'canvas',
            accepts: ['component-from-library', 'component-in-canvas']
        }
    });

    const handleCanvasClick = (e: React.MouseEvent) => {
        // 点击画布空白区域取消选择
        if (e.target === e.currentTarget) {
            selectComponent(null);
        }
    };

    // 获取根级组件（没有父组件的组件）
    const rootComponents = components.filter(comp => !comp.parentId).sort((a, b) => a.order - b.order);
    const rootComponentIds = rootComponents.map(comp => comp.id);

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
            <div
                ref={setNodeRef}
                style={{
                    minHeight: '100%',
                    padding: '20px',
                    backgroundColor: isOver ? '#f0f8ff' : '#fff',
                    borderRadius: '8px',
                    border: isOver ? '2px dashed #1890ff' : '2px dashed #d9d9d9',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                }}
                onClick={handleCanvasClick}
            >
                {rootComponents.length === 0 ? (
                    <Empty
                        description="拖拽组件到此处开始设计表单"
                        style={{ margin: '60px 0' }}
                    />
                ) : (
                    <SortableContext items={rootComponentIds} strategy={verticalListSortingStrategy}>
                        <div style={{ position: 'relative' }}>
                            {rootComponents.map((component) => (
                                <SortableComponent key={component.id} component={component} />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </Card>
    );
};

export default DesignCanvas;