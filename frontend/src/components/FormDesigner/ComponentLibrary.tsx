import React from 'react';
import { Card, Collapse } from 'antd';
import {
    FormOutlined,
    FileTextOutlined,
    NumberOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DownOutlined,
    CheckCircleOutlined,
    CheckSquareOutlined,
    AppstoreOutlined,
    MinusOutlined,
    UploadOutlined,
    PictureOutlined,
    SlidersOutlined,
    CodeOutlined
} from '@ant-design/icons';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import ComponentRegistry from './ComponentRegistry';

// 使用 items API，避免 Panel 直接使用

// 图标映射
const iconMap: { [key: string]: React.ReactElement } = {
    FormOutlined: <FormOutlined />,
    FileTextOutlined: <FileTextOutlined />,
    NumberOutlined: <NumberOutlined />,
    CalendarOutlined: <CalendarOutlined />,
    ClockCircleOutlined: <ClockCircleOutlined />,
    DownOutlined: <DownOutlined />,
    CheckCircleOutlined: <CheckCircleOutlined />,
    CheckSquareOutlined: <CheckSquareOutlined />,
    AppstoreOutlined: <AppstoreOutlined />,
    MinusOutlined: <MinusOutlined />,
    UploadOutlined: <UploadOutlined />,
    PictureOutlined: <PictureOutlined />,
    SlidersOutlined: <SlidersOutlined />,
    CodeOutlined: <CodeOutlined />
};

// 可拖拽的组件项
interface DraggableComponentItemProps {
    component: any;
}

const DraggableComponentItem: React.FC<DraggableComponentItemProps> = ({ component }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `component-${component.type}`,
        data: {
            type: 'component-from-library',
            componentType: component.type,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            <div
                style={{
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    minHeight: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'grab',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid #1890ff';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid #f0f0f0';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '16px', marginRight: '8px' }}>
                        {iconMap[component.icon] || component.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '13px' }}>
                            {component.name}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ComponentLibrary: React.FC = () => {
    const categories = [
        { key: 'basic', name: '基础组件' },
        { key: 'project', name: '项目组件' },
        { key: 'contract', name: '合同组件' },
        { key: 'article', name: '文章组件' },
        { key: 'finance', name: '财务组件' },
        { key: 'layout', name: '布局组件' }
    ];

    const renderComponentList = (category: string) => {
        const components = ComponentRegistry.getComponentsByCategory(category);

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {components.map((component) => (
                    <DraggableComponentItem
                        key={component.type}
                        component={component}
                    />
                ))}
            </div>
        );
    };

    return (
        <Card
            title="组件库"
            size="small"
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { padding: '12px', height: 'calc(100% - 57px)', overflow: 'auto' } }}
        >
            <Collapse
                defaultActiveKey={['basic']}
                ghost
                style={{ border: 'none' }}
                items={categories.map(category => ({
                    key: category.key,
                    label: category.name,
                    children: (
                        <div style={{ padding: '8px 0' }}>
                            {renderComponentList(category.key)}
                        </div>
                    ),
                    style: {
                        border: '1px solid #f0f0f0',
                        marginBottom: '8px',
                        borderRadius: '4px'
                    }
                }))}
            />

            <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#666'
            }}>
                <div style={{ marginBottom: '8px', fontWeight: 500 }}>使用说明：</div>
                <div>• 拖拽组件到画布中添加</div>
                <div>• 在画布中拖拽组件重新排序</div>
                <div>• 点击画布中组件进行选择和编辑</div>
                <div>• 支持复制、删除操作</div>
            </div>
        </Card>
    );
};

export default ComponentLibrary; 