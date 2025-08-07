import React from 'react';
import { Pagination } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface PaginationComponentProps {
    component: FormComponent;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ component }) => {
    return (
        <div style={{ textAlign: 'center', padding: '16px' }}>
            <Pagination
                current={component.current || 1}
                total={component.total || 100}
                pageSize={component.pageSize || 10}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
                style={component.style}
            />
        </div>
    );
};

export default PaginationComponent; 