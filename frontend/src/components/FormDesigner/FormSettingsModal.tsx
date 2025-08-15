import React, { useState, useEffect } from 'react';
import {
    Modal,
    Tabs,
    Form,
    Input,
    Select,
    Switch,
    InputNumber,
    Button,
    Space,
    Card,
    Row,
    Col,
    Tag,
    Alert
} from 'antd';
import {
    InfoCircleOutlined,
    SettingOutlined,
    BellOutlined,
    ProjectOutlined,
    FileTextOutlined,
    FileProtectOutlined,
    ExportOutlined,
    ImportOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { useFormDesignerStore } from '../../stores/formDesignerStore';

const { Option } = Select;
const { TextArea } = Input;

interface FormSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    formData?: any;
    onSave?: (settings: any) => void;
}

const FormSettingsModal: React.FC<FormSettingsModalProps> = ({
    visible,
    onClose,
    formData,
    onSave
}) => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);

    const { layout, theme, updateLayout, updateTheme, exportFormConfig } = useFormDesignerStore();

    // 初始化表单数据
    useEffect(() => {
        if (visible && formData) {
            form.setFieldsValue({
                // 基本设置
                name: formData.name || '',
                description: formData.description || '',
                status: formData.status || 'draft',

                // 布局设置
                labelPosition: layout.labelPosition || 'top',
                labelWidth: layout.labelWidth || '100px',
                componentSpacing: layout.componentSpacing || '16px',
                maxWidth: layout.maxWidth || '100%',
                alignment: layout.alignment || 'left',
                padding: layout.padding || '24px',

                // 主题设置
                primaryColor: theme.primaryColor || '#1890ff',
                backgroundColor: theme.backgroundColor || '#ffffff',
                borderColor: theme.borderColor || '#d9d9d9',
                borderRadius: theme.borderRadius || '6px',
                fontSize: theme.fontSize || '14px',
                textColor: theme.textColor || '#000000',

                // 高级设置
                enableValidation: true,
                enableLogic: true,
                enableExport: true,
                maxComponents: 50,
                autoSave: true,
                autoSaveInterval: 30
            });
        }
    }, [visible, formData, layout, theme, form]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // 更新布局配置
            updateLayout({
                labelPosition: values.labelPosition,
                labelWidth: values.labelWidth,
                componentSpacing: values.componentSpacing,
                maxWidth: values.maxWidth,
                alignment: values.alignment,
                padding: values.padding
            });

            // 更新主题配置
            updateTheme({
                primaryColor: values.primaryColor,
                backgroundColor: values.backgroundColor,
                borderColor: values.borderColor,
                borderRadius: values.borderRadius,
                fontSize: values.fontSize,
                textColor: values.textColor
            });

            // 调用外部保存回调
            if (onSave) {
                await onSave({
                    name: values.name,
                    description: values.description,
                    status: values.status,
                    settings: {
                        layout: {
                            labelPosition: values.labelPosition,
                            labelWidth: values.labelWidth,
                            componentSpacing: values.componentSpacing,
                            maxWidth: values.maxWidth,
                            alignment: values.alignment,
                            padding: values.padding
                        },
                        theme: {
                            primaryColor: values.primaryColor,
                            backgroundColor: values.backgroundColor,
                            borderColor: values.borderColor,
                            borderRadius: values.borderRadius,
                            fontSize: values.fontSize,
                            textColor: values.textColor
                        },
                        advanced: {
                            enableValidation: values.enableValidation,
                            enableLogic: values.enableLogic,
                            enableExport: values.enableExport,
                            maxComponents: values.maxComponents,
                            autoSave: values.autoSave,
                            autoSaveInterval: values.autoSaveInterval
                        }
                    }
                });
            }

            onClose();
        } catch (error) {
            console.error('保存设置失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportConfig = () => {
        const config = exportFormConfig();
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formData?.name || 'form'}_config.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const tabItems = [
        {
            key: 'basic',
            label: (
                <span>
                    <InfoCircleOutlined />
                    基础设置
                </span>
            ),
            children: (
                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                    <Card size="small" title="表单信息" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="表单名称"
                                    rules={[{ required: true, message: '请输入表单名称' }]}
                                >
                                    <Input placeholder="请输入表单名称" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="status" label="表单状态">
                                    <Select>
                                        <Option value="draft">草稿</Option>
                                        <Option value="published">已发布</Option>
                                        <Option value="disabled">已停用</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="description" label="表单描述">
                            <TextArea
                                rows={3}
                                placeholder="请输入表单描述"
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>
                    </Card>

                    <Card size="small" title="基础配置" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="enableValidation" label="启用验证" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="enableLogic" label="启用逻辑规则" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="enableExport" label="允许导出" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="maxComponents" label="最大组件数">
                                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="安全设置" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="enableCaptcha" label="启用验证码" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="autoSave" label="自动保存" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="autoSaveInterval" label="保存间隔(秒)">
                                    <InputNumber min={10} max={300} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="maxSubmissions" label="最大提交次数">
                                    <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="提交设置">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="submitButtonText" label="提交按钮文本">
                                    <Input placeholder="提交" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="submitButtonPosition" label="按钮位置">
                                    <Select>
                                        <Option value="left">左对齐</Option>
                                        <Option value="center">居中</Option>
                                        <Option value="right">右对齐</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="enableDraft" label="启用草稿保存" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="requireConfirmation" label="提交前确认" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="redirectAfterSubmit" label="提交后跳转" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="redirectUrl" label="跳转地址">
                                    <Input placeholder="https://..." />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="successMessage" label="提交成功提示">
                            <TextArea
                                rows={2}
                                placeholder="表单提交成功！感谢您的填写。"
                                maxLength={200}
                                showCount
                            />
                        </Form.Item>
                    </Card>
                </div>
            )
        },
        {
            key: 'notification',
            label: (
                <span>
                    <BellOutlined />
                    通知设置
                </span>
            ),
            children: (
                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                    <Card size="small" title="邮件通知" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="emailNotification" label="启用邮件通知" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="adminEmail" label="管理员邮箱">
                                    <Input placeholder="admin@example.com" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="emailTemplate" label="邮件模板">
                            <Select>
                                <Option value="default">默认模板</Option>
                                <Option value="business">商务模板</Option>
                                <Option value="simple">简洁模板</Option>
                            </Select>
                        </Form.Item>
                    </Card>

                    <Card size="small" title="微信通知" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="wechatNotification" label="启用微信通知" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="wechatWebhook" label="Webhook地址">
                                    <Input placeholder="https://..." />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="系统通知" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="systemNotification" label="系统内通知" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="notificationRetention" label="通知保留天数">
                                    <InputNumber min={1} max={365} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Alert
                        message="通知说明"
                        description="配置表单提交后的通知方式，支持邮件、微信和系统内通知。"
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                    />
                </div>
            )
        },
        {
            key: 'project',
            label: (
                <span>
                    <ProjectOutlined />
                    项目设置
                </span>
            ),
            children: (
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
            )
        },
        {
            key: 'article',
            label: (
                <span>
                    <FileTextOutlined />
                    文章设置
                </span>
            ),
            children: (
                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                    <Card size="small" title="文章关联" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="articleCategory" label="文章分类">
                                    <Select placeholder="选择文章分类">
                                        <Option value="news">新闻资讯</Option>
                                        <Option value="tutorial">教程指南</Option>
                                        <Option value="case">案例分析</Option>
                                        <Option value="blog">博客文章</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="articleTags" label="文章标签">
                                    <Select mode="multiple" placeholder="选择或输入标签">
                                        <Option value="design">设计</Option>
                                        <Option value="development">开发</Option>
                                        <Option value="ui">UI</Option>
                                        <Option value="ux">UX</Option>
                                        <Option value="business">商务</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="articleSummary" label="文章摘要">
                            <TextArea
                                rows={3}
                                placeholder="输入文章摘要，将用于SEO和预览"
                                maxLength={300}
                                showCount
                            />
                        </Form.Item>
                    </Card>

                    <Card size="small" title="发布设置" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="autoPublish" label="自动发布" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="allowComments" label="允许评论" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="seoOptimized" label="SEO优化" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="featured" label="推荐文章" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="内容管理">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="contentTemplate" label="内容模板">
                                    <Select>
                                        <Option value="standard">标准模板</Option>
                                        <Option value="rich">富文本模板</Option>
                                        <Option value="minimal">简约模板</Option>
                                        <Option value="gallery">图册模板</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="readingTime" label="预计阅读时长(分钟)">
                                    <InputNumber min={1} max={60} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Alert
                        message="文章说明"
                        description="配置与该表单相关的文章设置，包括分类、标签、发布选项等。"
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                    />
                </div>
            )
        },
        {
            key: 'contract',
            label: (
                <span>
                    <FileProtectOutlined />
                    合同设置
                </span>
            ),
            children: (
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
                                onClick={handleExportConfig}
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
            )
        }
    ];

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SettingOutlined />
                    表单设置
                    {formData?.name && (
                        <Tag color="blue">{formData.name}</Tag>
                    )}
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={800}
            footer={
                <Space>
                    <Button onClick={onClose}>
                        取消
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={handleSave}
                    >
                        保存设置
                    </Button>
                </Space>
            }
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                size="small"
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    size="small"
                />
            </Form>
        </Modal>
    );
};

export default FormSettingsModal;
