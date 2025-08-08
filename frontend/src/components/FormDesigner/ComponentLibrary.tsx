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
    UploadOutlined
} from '@ant-design/icons';

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
    UploadOutlined: <UploadOutlined />
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
                    <div
                        key={component.type}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #f0f0f0',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            minHeight: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
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
                <div>• 组件库仅供展示和参考</div>
                <div>• 点击画布中已有组件进行选择</div>
                <div>• 支持复制、删除操作</div>
            </div>
        </Card>
    );
};

export default ComponentLibrary; 