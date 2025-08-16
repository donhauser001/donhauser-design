import React from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Select,
    Switch,
    InputNumber,
    Button,
    Space,
    Alert
} from 'antd';
import {
    ExportOutlined,
    ImportOutlined
} from '@ant-design/icons';
import { FormSettingsTabProps } from './types';

const { Option } = Select;
const { TextArea } = Input;

interface ContractSettingsTabProps extends FormSettingsTabProps {
    onExportConfig: () => void;
}

const ContractSettingsTab: React.FC<ContractSettingsTabProps> = ({
    form,
    formData,
    onExportConfig
}) => {
    return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
            <Card size="small" title="合同信息" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="contractType" label="合同类型">
                            <Select placeholder="选择合同类型">
                                <Option value="service">服务合同</Option>
                                <Option value="sales">销售合同</Option>
                                <Option value="lease">租赁合同</Option>
                                <Option value="employment">雇佣合同</Option>
                                <Option value="partnership">合作协议</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="contractTemplate" label="合同模板">
                            <Select placeholder="选择合同模板">
                                <Option value="standard">标准模板</Option>
                                <Option value="simplified">简化模板</Option>
                                <Option value="detailed">详细模板</Option>
                                <Option value="custom">自定义模板</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="contractClause" label="特殊条款">
                    <TextArea
                        rows={3}
                        placeholder="输入特殊条款和约定"
                        maxLength={500}
                        showCount
                    />
                </Form.Item>
            </Card>

            <Card size="small" title="签署设置" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="requireSignature" label="需要签名" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="requireSeal" label="需要盖章" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="multiPartySign" label="多方签署" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="electronicSign" label="电子签名" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card size="small" title="合同管理" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="contractPeriod" label="合同期限(月)">
                            <InputNumber min={1} max={120} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="autoRenewal" label="自动续约" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="reminderDays" label="到期提醒(提前天数)">
                            <InputNumber min={1} max={365} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="archiveAfterExpiry" label="到期自动归档" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card size="small" title="高级操作">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        icon={<ExportOutlined />}
                        onClick={onExportConfig}
                        block
                    >
                        导出合同模板
                    </Button>
                    <Button
                        icon={<ImportOutlined />}
                        block
                        disabled
                    >
                        导入合同模板 (开发中)
                    </Button>
                    <Alert
                        message="注意"
                        description="合同相关操作涉及法律效力，请谨慎操作并确保合规。"
                        type="warning"
                        showIcon
                        style={{ marginTop: '12px' }}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default ContractSettingsTab;
