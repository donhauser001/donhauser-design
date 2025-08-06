import React from 'react';
import { Modal, Button, Space, Typography, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, SaveOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface SaveConfirmModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (action: 'order' | 'draft') => void;
    loading: boolean;
    projectData: any;
    selectedServices: any[];
    totalAmount: number;
    originalAmount: number;
    discountAmount: number;
}

const SaveConfirmModal: React.FC<SaveConfirmModalProps> = ({
    visible,
    onCancel,
    onConfirm,
    loading,
    projectData,
    selectedServices,
    totalAmount,
    originalAmount,
    discountAmount
}) => {
    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    <span>确认保存项目</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            centered
        >
            <div style={{ padding: '16px 0' }}>
                {/* 项目信息概览 */}
                <Card
                    size="small"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileTextOutlined style={{ color: '#666' }} />
                            <span>项目信息概览</span>
                        </div>
                    }
                    style={{ marginBottom: '16px' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ marginBottom: '8px' }}>
                                <Text strong>项目名称：</Text>
                                <Text>{projectData?.projectName || '未填写'}</Text>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <Text strong>客户：</Text>
                                <Text>
                                    {projectData?.clientName && projectData?.contactNames
                                        ? `${projectData.clientName}-${projectData.contactNames}`
                                        : projectData?.clientName || '未选择'
                                    }
                                </Text>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <Text strong>承接团队：</Text>
                                <Text>{projectData?.undertakingTeamName || '未选择'}</Text>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ marginBottom: '8px' }}>
                                <Text strong>主创设计师：</Text>
                                <Text>{projectData?.mainDesignerNames || '未选择'}</Text>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <Text strong>服务项目：</Text>
                                <Text>{selectedServices.length} 项</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* 金额统计 */}
                <Card
                    size="small"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingCartOutlined style={{ color: '#666' }} />
                            <span>金额统计</span>
                        </div>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic
                                title="原价总额"
                                value={originalAmount}
                                precision={2}
                                prefix="¥"
                                valueStyle={{ color: '#999', textDecoration: 'line-through' }}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="优惠金额"
                                value={discountAmount}
                                precision={2}
                                prefix="¥"
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="最终金额"
                                value={totalAmount}
                                precision={2}
                                prefix="¥"
                                valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* 操作说明 */}
                <Card
                    size="small"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TeamOutlined style={{ color: '#666' }} />
                            <span>选择保存方式</span>
                        </div>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <Text>请选择您希望如何保存此项目：</Text>
                    </div>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Card
                                size="small"
                                hoverable
                                onClick={() => onConfirm('order')}
                                style={{
                                    border: '2px solid #1890ff',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                            >
                                <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                                <div>
                                    <Title level={5} style={{ margin: '8px 0' }}>直接下单</Title>
                                    <Text type="secondary">项目状态：进行中</Text>
                                    <br />
                                    <Text type="secondary">立即开始项目执行</Text>
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                size="small"
                                hoverable
                                onClick={() => onConfirm('draft')}
                                style={{
                                    border: '2px solid #52c41a',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                            >
                                <SaveOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                                <div>
                                    <Title level={5} style={{ margin: '8px 0' }}>暂存为临时订单</Title>
                                    <Text type="secondary">项目状态：咨询中</Text>
                                    <br />
                                    <Text type="secondary">保存后可以继续编辑</Text>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Card>

                {/* 操作按钮 */}
                <div style={{ textAlign: 'center' }}>
                    <Space>
                        <Button onClick={onCancel} disabled={loading}>
                            取消
                        </Button>
                        <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            loading={loading}
                            onClick={() => onConfirm('order')}
                        >
                            直接下单
                        </Button>
                        <Button
                            type="default"
                            icon={<SaveOutlined />}
                            loading={loading}
                            onClick={() => onConfirm('draft')}
                        >
                            暂存为临时订单
                        </Button>
                    </Space>
                </div>
            </div>
        </Modal>
    );
};

export default SaveConfirmModal; 