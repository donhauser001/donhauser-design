import React from 'react'
import { Card, Row, Col, Statistic, Button, Space } from 'antd'
import { FormOutlined, SettingOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const Forms: React.FC = () => {
    const navigate = useNavigate()

    const handleNavigate = (path: string) => {
        navigate(path)
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    <FormOutlined style={{ marginRight: '8px' }} />
                    表单系统
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    创建和管理各种表单，支持合同模板、客户表单、问卷调查等多种应用场景
                </p>
            </div>

            <Row gutter={[24, 24]}>
                {/* 统计卡片 */}
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="总表单数"
                            value={12}
                            prefix={<FormOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="已发布"
                            value={8}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="草稿中"
                            value={3}
                            prefix={<FormOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="已停用"
                            value={1}
                            prefix={<FormOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                {/* 快速操作 */}
                <Col xs={24} lg={12}>
                    <Card
                        title="快速操作"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => handleNavigate('/forms/list')}
                            >
                                创建表单
                            </Button>
                        }
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                block
                                size="large"
                                icon={<FormOutlined />}
                                onClick={() => handleNavigate('/forms/list')}
                                style={{ textAlign: 'left', height: '48px' }}
                            >
                                表单列表
                            </Button>
                            <Button
                                block
                                size="large"
                                icon={<SettingOutlined />}
                                onClick={() => handleNavigate('/forms/settings')}
                                style={{ textAlign: 'left', height: '48px' }}
                            >
                                表单设置
                            </Button>
                        </Space>
                    </Card>
                </Col>

                {/* 最近表单 */}
                <Col xs={24} lg={12}>
                    <Card title="最近表单">
                        <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                            暂无最近表单
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 功能说明 */}
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card title="功能说明">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <Card size="small" title="合同模板">
                                    <p>创建合同模板，支持动态数据绑定和自动生成合同文档</p>
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card size="small" title="客户表单">
                                    <p>设计客户在线提交的表单，收集客户需求和反馈</p>
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card size="small" title="问卷调查">
                                    <p>创建各种类型的问卷调查，支持多种题型和统计分析</p>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Forms 