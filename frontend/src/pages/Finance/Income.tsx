import React from 'react'
import { Card, Row, Col, Statistic, Table, Button, Space, Input, Select, DatePicker } from 'antd'
import { SearchOutlined, DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons'

const { Option } = Select
const { RangePicker } = DatePicker

const Income: React.FC = () => {
    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>收入统计</h1>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="本月收入"
                            value={45600}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="上月收入"
                            value={38900}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="同比增长"
                            value={17.2}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="年度收入"
                            value={289600}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                            suffix="元"
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="收入明细">
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索客户名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <RangePicker style={{ width: 240 }} />
                        <Select placeholder="收入类型" style={{ width: 120 }}>
                            <Option value="all">全部类型</Option>
                            <Option value="design">设计服务</Option>
                            <Option value="consulting">咨询服务</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={[
                        { title: '收入日期', dataIndex: 'date', key: 'date' },
                        { title: '客户名称', dataIndex: 'clientName', key: 'clientName' },
                        { title: '收入类型', dataIndex: 'type', key: 'type' },
                        { title: '收入金额', dataIndex: 'amount', key: 'amount' },
                        { title: '备注', dataIndex: 'remark', key: 'remark' }
                    ]}
                    dataSource={[]}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    )
}

export default Income 