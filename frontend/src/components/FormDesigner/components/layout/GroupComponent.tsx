import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import SortableComponent from '../SortableComponent';

interface GroupComponentProps {
    component: FormComponent;
}

const GroupComponent: React.FC<GroupComponentProps> = ({ component }) => {
    const { getComponentsByParent } = useFormDesignerStore();
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
                // 有子组件时，静态显示子组件
                <div
                    style={{
                        minHeight: '60px',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                        {childComponents.map((child) => (
                            <SortableComponent key={child.id} component={child} />
                        ))}
                    </div>
                </div>
            ) : (
                // 没有子组件时，显示静态提示
                <div
                    style={{
                        minHeight: '60px',
                        padding: '12px',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        border: '2px dashed #d9d9d9',
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
                        空白分组
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupComponent;