import React from 'react';
import { Pagination } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface PaginationComponentProps {
    component: FormComponent;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ component }) => {
    const { updateComponent } = useFormDesignerStore();

    // 处理分页变化（在设计模式下通常不执行真实的分页逻辑）
    const handlePageChange = (page: number) => {
        // 更新组件属性
        updateComponent(component.id, {
            current: page
        });
    };

    // 获取对齐方式
    const getJustifyContent = () => {
        switch (component.align) {
            case 'left': return 'flex-start';
            case 'right': return 'flex-end';
            case 'center':
            default: return 'center';
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: getJustifyContent(),
                alignItems: 'center',
                padding: '16px',
                width: '100%'
            }}
        >
            <Pagination
                current={component.current || 1}
                total={component.total || 100}
                pageSize={component.pageSize || 10}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={component.showTotal !== false ?
                    (total, range) => {
                        const totalPages = Math.ceil(total / (component.pageSize || 10));
                        const currentPage = component.current || 1;
                        return `第 ${currentPage} 页/共 ${totalPages} 页`;
                    } :
                    undefined
                }
                onChange={handlePageChange}
                style={component.style}
            />
        </div>
    );
};

export default PaginationComponent; 