import React from 'react';
import { Form, Input, Select, Row, Col, Card, DatePicker } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const OrderTab: React.FC = () => {
    return (
        <div>
            {/* 订单信息 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#13c2c2' }}>💰</span>
                        <span>订单信息</span>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="orderNumber" label="订单编号">
                            <Input placeholder="系统自动生成" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="orderDate" label="订单日期">
                            <DatePicker 
                                style={{ width: '100%' }} 
                                placeholder="请选择订单日期"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="paymentTerms" label="付款条件">
                            <Select placeholder="请选择付款条件">
                                <Option value="advance">预付款</Option>
                                <Option value="installment">分期付款</Option>
                                <Option value="completion">完工付款</Option>
                                <Option value="monthly">月结</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="deliveryDate" label="交付日期">
                            <DatePicker 
                                style={{ width: '100%' }} 
                                placeholder="请选择交付日期"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item name="orderRemarks" label="订单备注">
                            <TextArea rows={4} placeholder="请输入订单备注信息" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default OrderTab; 