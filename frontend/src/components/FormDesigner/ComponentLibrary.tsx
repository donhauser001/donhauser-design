import React, { useState } from 'react';
import { Card, Collapse, Button, Tooltip } from 'antd';
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
    UploadOutlined
} from '@ant-design/icons';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import ComponentRegistry from './ComponentRegistry';

const { Panel } = Collapse;

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
    UploadOutlined: <UploadOutlined />
};

const ComponentLibrary: React.FC = () => {
    const { addComponent } = useFormDesignerStore();

    const categories = [
        { key: 'basic', name: '基础组件' },
        { key: 'project', name: '项目组件' },
        { key: 'contract', name: '合同组件' },
        { key: 'article', name: '文章组件' },
        { key: 'finance', name: '财务组件' },
        { key: 'layout', name: '布局组件' }
    ];

    const handleDragStart = (e: React.DragEvent, componentType: string) => {
        console.log('Drag start:', componentType);
        e.dataTransfer.setData('componentType', componentType);
    };

    const handleComponentClick = (componentType: string) => {
        addComponent(componentType);
    };

    const renderComponentList = (category: string) => {
        const components = ComponentRegistry.getComponentsByCategory(category);

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {components.map((component) => (
                    <div
                        key={component.type}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            border: '1px solid #f0f0f0',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            transition: 'all 0.2s',
                            minHeight: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#1890ff';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#f0f0f0';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component.type)}
                        onClick={() => handleComponentClick(component.type)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <span style={{ fontSize: '16px', marginRight: '8px' }}>
                                {iconMap[component.icon] || component.icon}
                            </span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, fontSize: '13px' }}>
                                    {component.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                    {component.description}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Card
            title="组件库"
            size="small"
            style={{ height: '100%', overflow: 'hidden' }}
            bodyStyle={{ padding: '12px', height: 'calc(100% - 57px)', overflow: 'auto' }}
        >
            <Collapse
                defaultActiveKey={['basic']}
                ghost
                style={{ border: 'none' }}
            >
                {categories.map(category => (
                    <Panel
                        header={category.name}
                        key={category.key}
                        style={{
                            border: '1px solid #f0f0f0',
                            marginBottom: '8px',
                            borderRadius: '4px'
                        }}
                    >
                        <div style={{ padding: '8px 0' }}>
                            {renderComponentList(category.key)}
                        </div>
                    </Panel>
                ))}
            </Collapse>

            <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#666'
            }}>
                <div style={{ marginBottom: '8px', fontWeight: 500 }}>使用说明：</div>
                <div>• 点击组件直接添加到表单</div>
                <div>• 或拖拽组件到设计区域</div>
                <div>• 支持复制、粘贴、删除操作</div>
            </div>
        </Card>
    );
};

export default ComponentLibrary; 