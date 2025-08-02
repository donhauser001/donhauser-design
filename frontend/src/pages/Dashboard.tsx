import React from 'react'
import { Card, Row, Col, Statistic, Progress } from 'antd'
import { ProjectOutlined, UserOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons'

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总项目数"
              value={12}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="启用客户"
              value={8}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月收入"
              value={45600}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完成率"
              value={75}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="项目进度" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>网站设计项目</span>
                <span>80%</span>
              </div>
              <Progress percent={80} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>品牌设计项目</span>
                <span>60%</span>
              </div>
              <Progress percent={60} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>UI/UX 设计</span>
                <span>45%</span>
              </div>
              <Progress percent={45} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近活动" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14 }}>
              <p>• 新项目"企业官网设计"已创建</p>
              <p>• 客户"张三"提交了反馈</p>
              <p>• 项目"品牌设计"已完成</p>
              <p>• 新客户"李四"已注册</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard 