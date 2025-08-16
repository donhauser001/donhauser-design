import React from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Select,
    Switch,
    InputNumber
} from 'antd';
import { FormSettingsTabProps } from './types';

const { Option } = Select;
const { TextArea } = Input;

const ProjectSettingsTab: React.FC<FormSettingsTabProps> = ({
    form,
    formData
}) => {
    return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
            <Card size="small" title="项目关联" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="linkedProject" label="关联项目">
                            <Select placeholder="选择关联项目">
                                <Option value="project1">项目A - 品牌设计</Option>
                                <Option value="project2">项目B - 网站开发</Option>
                                <Option value="project3">项目C - APP设计</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="projectPhase" label="项目阶段">
                            <Select placeholder="选择项目阶段">
                                <Option value="requirement">需求收集</Option>
                                <Option value="design">设计阶段</Option>
                                <Option value="development">开发阶段</Option>
                                <Option value="testing">测试阶段</Option>
                                <Option value="delivery">交付阶段</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="projectDescription" label="项目说明">
                    <TextArea
                        rows={2}
                        placeholder="描述该表单在项目中的作用"
                        maxLength={200}
                    />
                </Form.Item>
            </Card>

            <Card size="small" title="团队设置" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="projectManager" label="项目经理">
                            <Select placeholder="选择项目经理">
                                <Option value="user1">张三</Option>
                                <Option value="user2">李四</Option>
                                <Option value="user3">王五</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="designer" label="设计师">
                            <Select placeholder="选择设计师">
                                <Option value="designer1">赵六</Option>
                                <Option value="designer2">钱七</Option>
                                <Option value="designer3">孙八</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card size="small" title="项目配置">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="requireApproval" label="需要审批" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="trackProgress" label="跟踪进度" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="autoAssign" label="自动分配" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="projectPriority" label="项目优先级">
                            <Select>
                                <Option value="low">低</Option>
                                <Option value="medium">中</Option>
                                <Option value="high">高</Option>
                                <Option value="urgent">紧急</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ProjectSettingsTab;
