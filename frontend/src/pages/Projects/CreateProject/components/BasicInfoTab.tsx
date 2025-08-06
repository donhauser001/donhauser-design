import React from 'react';
import { Form, Input, Select, Row, Col, Card } from 'antd';
import { FileTextOutlined, TeamOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
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
    form: any; // 传递表单实例
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    clients,
    contacts,
    enterprises,
    designers,
    selectedClient,
    filteredContacts,
    handleClientChange,
    handleContactChange,
    form
}) => {
    // 从表单中获取客户ID，确保在恢复时也能正确显示
    const clientId = form ? Form.useWatch('clientId', form) : undefined;
    const hasClient = selectedClient || clientId;
    
    return (
        <div>
            {/* 基本信息 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileTextOutlined style={{ color: '#666' }} />
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
                        <TeamOutlined style={{ color: '#666' }} />
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
                                disabled={!hasClient}
                                filterOption={(input, option) => {
                                    const label = option?.label || option?.children;
                                    return String(label).toLowerCase().includes(input.toLowerCase());
                                }}
                                optionLabelProp="label"
                                labelInValue={false}
                            >
                                {filteredContacts.map(contact => (
                                    <Option
                                        key={contact._id}
                                        value={contact._id}
                                        label={`${contact.realName} ${contact.position ? `(${contact.position})` : ''}`}
                                    >
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
                        <UserOutlined style={{ color: '#666' }} />
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
                                        {designer.realName}({designer.role})
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
                                        {designer.realName}({designer.role})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 备注信息 */}
            <Card
                size="small"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <EditOutlined style={{ color: '#666' }} />
                        <span>备注信息</span>
                    </div>
                }
                style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item name="remark" label="项目备注">
                            <TextArea rows={4} placeholder="请输入项目备注" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default BasicInfoTab; 