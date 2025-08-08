import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import SortableComponent from '../SortableComponent';

interface ColumnContainerComponentProps {
    component: FormComponent;
}

const ColumnContainerComponent: React.FC<ColumnContainerComponentProps> = ({ component }) => {
    const { getComponentsByParent, addComponent } = useFormDesignerStore();
    const childComponents = getComponentsByParent(component.id);

    return (
        <div
            style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '16px',
                backgroundColor: '#fafafa',
                ...component.style
            }}
        >
            <div style={{ fontWeight: 500, marginBottom: '12px' }}>
                {component.label}
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${component.columns || 2}, 1fr)`,
                gap: '16px'
            }}>
                {childComponents.length > 0 ? (
                    childComponents.map((child, index) => (
                        <SortableComponent key={child.id || index} component={child} />
                    ))
                ) : (
                    <div style={{
                        color: '#999',
                        fontSize: '12px',
                        gridColumn: '1 / -1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '20px'
                    }}>
                        <AppstoreOutlined style={{ fontSize: '14px' }} />
                        拖拽组件到分栏容器中
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColumnContainerComponent; 