import React from 'react'
import { Card, Row, Col, Tag, Button, Avatar, Progress } from 'antd'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'

const TaskBoard: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>任务看板</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新建任务
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="待开始" size="small" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <Card size="small" style={{ marginBottom: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>网站首页设计</strong>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color="blue">高优先级</Tag>
                  <Tag color="green">设计</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span style={{ fontSize: 12, color: '#666' }}>2天后到期</span>
                </div>
              </Card>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="进行中" size="small" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <Card size="small" style={{ marginBottom: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>品牌Logo设计</strong>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color="orange">中优先级</Tag>
                  <Tag color="green">设计</Tag>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Progress percent={60} size="small" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span style={{ fontSize: 12, color: '#666' }}>5天后到期</span>
                </div>
              </Card>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="待审核" size="small" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <Card size="small" style={{ marginBottom: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>产品包装设计</strong>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color="purple">审核中</Tag>
                  <Tag color="green">设计</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span style={{ fontSize: 12, color: '#666' }}>已完成</span>
                </div>
              </Card>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="已完成" size="small" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <Card size="small" style={{ marginBottom: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>企业宣传册设计</strong>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color="green">已完成</Tag>
                  <Tag color="green">设计</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span style={{ fontSize: 12, color: '#666' }}>3天前完成</span>
                </div>
              </Card>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default TaskBoard 