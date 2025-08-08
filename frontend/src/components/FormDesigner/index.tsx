import React from 'react';
import { Row, Col } from 'antd';
import ComponentLibrary from './ComponentLibrary';
import DesignCanvas from './DesignCanvas';
import PropertyPanel from './PropertyPanel';

const FormDesigner: React.FC = () => {
    return (
        <div style={{ height: '100vh', padding: '16px', backgroundColor: '#f0f2f5' }}>
            <Row gutter={16} style={{ height: '100%' }}>
                {/* 组件库 */}
                <Col span={6} style={{ height: '100%' }}>
                    <ComponentLibrary />
                </Col>

                {/* 设计画布 */}
                <Col span={12} style={{ height: '100%' }}>
                    <DesignCanvas />
                </Col>

                {/* 属性面板 */}
                <Col span={6} style={{ height: '100%' }}>
                    <PropertyPanel />
                </Col>
            </Row>
        </div>
    );
};

export default FormDesigner; 