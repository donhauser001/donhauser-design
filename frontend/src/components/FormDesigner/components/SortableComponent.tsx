import React, { useState } from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../types/formDesigner';
import { useFormDesignerStore } from '../../../stores/formDesignerStore';
import FormComponentRenderer from '../FormComponentRenderer';

interface SortableComponentProps {
    component: FormComponent;
}

const SortableComponent: React.FC<SortableComponentProps> = ({ component }) => {
    const [isHovered, setIsHovered] = useState(false);

    const { selectedComponent, selectComponent, deleteComponent, duplicateComponent } = useFormDesignerStore();

    return (
        <div
            style={{
                position: 'relative',
                marginBottom: '16px',
                padding: '8px',
                border: selectedComponent === component.id
                    ? '2px solid #1890ff'
                    : isHovered
                        ? '2px solid #d9d9d9'
                        : '2px solid transparent',
                borderRadius: '6px',
                backgroundColor: selectedComponent === component.id
                    ? '#f0f8ff'
                    : isHovered
                        ? '#fafafa'
                        : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
                boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            }}
            onClick={(e) => {
                e.stopPropagation();
                selectComponent(component.id);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-component-id={component.id}
            data-parent-id={component.parentId || ''}
        >
            <FormComponentRenderer component={component} />

            {/* 组件操作按钮 */}
            <div
                style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    padding: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    opacity: selectedComponent === component.id || isHovered ? 1 : 0,
                    transition: 'opacity 0.2s'
                }}
            >
                <Space size="small">
                    {selectedComponent === component.id && (
                        <>
                            <Button
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateComponent(component.id);
                                }}
                                title="复制"
                            />
                            <Popconfirm
                                title="确定要删除这个组件吗？"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    deleteComponent(component.id);
                                }}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    title="删除"
                                    danger
                                />
                            </Popconfirm>
                        </>
                    )}
                </Space>
            </div>
        </div>
    );
};

export default SortableComponent;