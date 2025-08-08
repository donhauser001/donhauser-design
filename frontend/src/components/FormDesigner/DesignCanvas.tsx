import React from 'react';
import { Card, Empty } from 'antd';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import SortableComponent from './components/SortableComponent';

const DesignCanvas: React.FC = () => {
    const {
        components,
        selectComponent,
    } = useFormDesignerStore();

    const handleCanvasClick = (e: React.MouseEvent) => {
        // 点击画布空白区域取消选择
        if (e.target === e.currentTarget) {
            selectComponent(null);
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
            >
                {rootComponents.length === 0 ? (
                    <Empty
                        description="静态画布 - 暂无表单组件"
                        style={{ margin: '60px 0' }}
                    />
                ) : (
                    <div style={{ position: 'relative' }}>
                        {rootComponents.map((component) => (
                            <SortableComponent key={component.id} component={component} />
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default DesignCanvas;