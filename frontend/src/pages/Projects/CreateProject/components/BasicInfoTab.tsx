import React from 'react';
import { Form, Input, Select, Row, Col, Card } from 'antd';
import { Client, Contact, Enterprise, Designer } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface BasicInfoTabProps {
    clients: Client[];
    contacts: Contact[];
    enterprises: Enterprise[];
    designers: Designer[];
    selectedClient: Client | null;
    filteredContacts: Contact[];
    handleClientChange: (clientId: string) => void;
    handleContactChange: (contactIds: string[]) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    clients,
    contacts,
    enterprises,
    designers,
    selectedClient,
    filteredContacts,
    handleClientChange,
    handleContactChange
}) => {
    return (
        <div>
            {/* 基本信息 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#1890ff' }}>📋</span>
                        <span>基本信息</span>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name="projectName"
                            label="项目名称"
                            rules={[{ required: true, message: '请输入项目名称' }]}
                        >
                            <Input placeholder="请输入项目名称" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 客户信息 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#52c41a' }}>👥</span>
                        <span>客户信息</span>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="clientId"
                            label="客户"
                            rules={[{ required: true, message: '请选择客户' }]}
                        >
                            <Select
                                placeholder="请选择客户"
                                onChange={handleClientChange}
                                showSearch
                                filterOption={(input, option) => {
                                    const label = option?.label || option?.children;
                                    return String(label).toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {clients.map(client => (
                                    <Option key={client._id} value={client._id}>
                                        {client.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="contactIds"
                            label="联系人"
                            rules={[{ required: true, message: '请选择联系人' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder={selectedClient ? `请选择 ${selectedClient.name} 的联系人` : '请先选择客户'}
                                onChange={handleContactChange}
                                showSearch
                                disabled={!selectedClient}
                                filterOption={(input, option) => {
                                    const label = option?.label || option?.children;
                                    return String(label).toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {filteredContacts.map(contact => (
                                    <Option key={contact._id} value={contact._id}>
                                        {contact.realName} {contact.position ? `(${contact.position})` : ''}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="clientRequirements" label="客户嘱托">
                            <TextArea rows={6} placeholder="请输入客户嘱托" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 团队信息 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#fa8c16' }}>👨‍🎨</span>
                        <span>团队信息</span>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="undertakingTeam"
                            label="承接团队"
                            rules={[{ required: true, message: '请选择承接团队' }]}
                        >
                            <Select
                                placeholder="请选择承接团队"
                                showSearch
                                filterOption={(input, option) => {
                                    const label = option?.label || option?.children;
                                    return String(label).toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {enterprises.map(enterprise => (
                                    <Option key={enterprise._id} value={enterprise._id}>
                                        {enterprise.enterpriseAlias || enterprise.enterpriseName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="mainDesigners"
                            label="主创设计师"
                            rules={[{ required: true, message: '请选择主创设计师' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="请选择主创设计师"
                                showSearch
                                filterOption={(input, option) => {
                                    const label = option?.label || option?.children;
                                    return String(label).toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {designers.map(designer => (
                                    <Option key={designer._id} value={designer._id}>
                                        {designer.realName} {designer.position ? `(${designer.position})` : ''}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="assistantDesigners"
                            label="助理设计师"
                        >
                            <Select
                                mode="multiple"
                                placeholder="请选择助理设计师"
                                showSearch
                                filterOption={(input, option) => {
                                    const label = option?.label || option?.children;
                                    return String(label).toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {designers.map(designer => (
                                    <Option key={designer._id} value={designer._id}>
                                        {designer.realName} {designer.position ? `(${designer.position})` : ''}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 备注 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#722ed1' }}>📝</span>
                        <span>备注信息</span>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Form.Item name="remark" label="项目备注">
                    <TextArea rows={3} placeholder="请输入项目备注信息" />
                </Form.Item>
            </Card>
        </div>
    );
};

export default BasicInfoTab; 