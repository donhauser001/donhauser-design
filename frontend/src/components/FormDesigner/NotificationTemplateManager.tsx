import React, { useState, useEffect } from 'react';
import {
    Button,
    List,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Tag,
    Tooltip,
    Row,
    Col,
    Typography,
    Alert,
    Empty
} from 'antd';
import SimpleRichTextEditor from '../SimpleRichTextEditor';
import PlaceholderSelector from './PlaceholderSelector';
import { NotificationTemplate } from '../../api/forms';
import { useFormDesignerStore } from '../../stores/formDesignerStore';

// 自定义样式
const customStyles = `
.placeholder-tag {
    transition: all 0.2s ease;
}

.placeholder-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
`;
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    EyeOutlined,
    MailOutlined,
    UserOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

interface NotificationTemplateManagerProps {
    form: any;
    formData?: any;
}

// 预定义的占位符


// 默认模板
const DEFAULT_TEMPLATES: NotificationTemplate[] = [
    {
        id: '1',
        name: '管理员通知',
        subject: '新的表单提交 - {form_title}',
        content: `<p>您好管理员，</p>
<p>有用户提交了表单"<strong>{form_title}</strong>"。</p>
<h3>提交详情：</h3>
<ul>
<li>提交时间：{submission_date} {submission_time}</li>
<li>提交者：{submitter_name} ({submitter_email})</li>
<li>提交ID：{submission_id}</li>
</ul>
<h3>表单内容：</h3>
<p>如需获取具体表单字段值，请使用相应的字段占位符，例如：</p>
<ul>
<li>联系人姓名：{field_name}</li>
<li>联系电话：{field_phone}</li>
<li>详细需求：{field_requirements}</li>
</ul>
<p>请及时查看和处理。</p>
<hr>
<p><em>此邮件由系统自动发送，请勿回复。</em></p>`,
        to: 'admin',
        triggers: ['submit'],
        enabled: true,
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: '用户确认邮件',
        subject: '感谢您的提交 - {form_title}',
        content: `<p>亲爱的 <strong>{submitter_name}</strong>，</p>
<p>感谢您提交表单"<strong>{form_title}</strong>"。</p>
<div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
<h4 style="margin: 0 0 10px 0; color: #1890ff;">提交信息</h4>
<p style="margin: 5px 0;"><strong>提交编号：</strong>{submission_id}</p>
<p style="margin: 5px 0;"><strong>提交时间：</strong>{submission_date} {submission_time}</p>
<p style="margin: 5px 0;"><strong>提交人：</strong>{submitter_name} ({submitter_username})</p>
<p style="margin: 5px 0;"><strong>所属单位：</strong>{submitter_company}</p>
<p style="margin: 5px 0;"><strong>联系方式：</strong>{submitter_phone}</p>
</div>
<p>我们会尽快处理您的请求，如有疑问请联系我们。</p>
<p>谢谢！</p>
<hr>
<p style="color: #888; font-size: 14px;">
{site_title}<br>
<a href="{site_url}">{site_url}</a>
</p>`,
        to: 'submitter',
        triggers: ['submit'],
        enabled: false,
        createdAt: new Date().toISOString()
    }
];

const NotificationTemplateManager: React.FC<NotificationTemplateManagerProps> = ({
    form,
    formData
}) => {
    const { components } = useFormDesignerStore();
    const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);
    const [templateForm] = Form.useForm();
    const [contentEditor, setContentEditor] = useState<any>(null);

    // 初始化模板数据
    useEffect(() => {
        const existingTemplates = formData?.settings?.notification?.templates || [];
        if (existingTemplates.length > 0) {
            setTemplates(existingTemplates);
        } else {
            // 如果没有已有模板，使用默认模板
            setTemplates(DEFAULT_TEMPLATES);
        }
    }, [formData]);

    // 保存模板到表单数据中
    const saveTemplatesToForm = (updatedTemplates: NotificationTemplate[]) => {
        const currentNotificationSettings = form.getFieldValue('notification') || {};
        const newNotificationSettings = {
            ...currentNotificationSettings,
            templates: updatedTemplates
        };

        // 更新表单字段
        form.setFieldsValue({
            notification: newNotificationSettings
        });
    };



    const handleCreateTemplate = () => {
        setEditingTemplate(null);
        templateForm.resetFields();
        setModalVisible(true);
    };

    const handleEditTemplate = (template: NotificationTemplate) => {
        setEditingTemplate(template);
        setModalVisible(true);
        // 延迟设置表单值，确保 Modal 已经渲染
        setTimeout(() => {
            templateForm.setFieldsValue({
                name: template.name,
                subject: template.subject,
                content: template.content,
                to: template.to,
                customEmails: template.customEmails,
                triggers: template.triggers,
                enabled: template.enabled
            });
        }, 0);
    };

    const handleSaveTemplate = async () => {
        try {
            const values = await templateForm.validateFields();
            const newTemplate: NotificationTemplate = {
                id: editingTemplate?.id || Date.now().toString(),
                name: values.name,
                subject: values.subject,
                content: values.content,
                to: values.to,
                customEmails: values.customEmails,
                triggers: values.triggers || [],
                enabled: values.enabled !== false,
                createdAt: editingTemplate?.createdAt || new Date().toISOString()
            };

            let updatedTemplates: NotificationTemplate[];
            if (editingTemplate) {
                updatedTemplates = templates.map(t => t.id === editingTemplate.id ? newTemplate : t);
            } else {
                updatedTemplates = [...templates, newTemplate];
            }

            setTemplates(updatedTemplates);
            saveTemplatesToForm(updatedTemplates);
            setModalVisible(false);
            templateForm.resetFields();
        } catch (error) {
            console.error('保存模板失败:', error);
        }
    };

    const handleDeleteTemplate = (templateId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个通知模板吗？此操作不可恢复。',
            onOk: () => {
                const updatedTemplates = templates.filter(t => t.id !== templateId);
                setTemplates(updatedTemplates);
                saveTemplatesToForm(updatedTemplates);
            }
        });
    };

    const handleDuplicateTemplate = (template: NotificationTemplate) => {
        const newTemplate: NotificationTemplate = {
            ...template,
            id: Date.now().toString(),
            name: `${template.name} (副本)`,
            createdAt: new Date().toISOString()
        };
        const updatedTemplates = [...templates, newTemplate];
        setTemplates(updatedTemplates);
        saveTemplatesToForm(updatedTemplates);
    };

    const handlePreviewTemplate = (template: NotificationTemplate) => {
        setPreviewTemplate(template);
        setPreviewVisible(true);
    };

    const insertPlaceholder = (placeholder: string) => {
        if (contentEditor) {
            // 使用 wangEditor 的 API 在光标位置插入文本
            contentEditor.insertText(placeholder);
            contentEditor.focus();
        } else {
            // 兜底方案：直接追加到内容末尾
            const currentValue = templateForm.getFieldValue('content') || '';
            const newValue = currentValue + placeholder;
            templateForm.setFieldsValue({ content: newValue });
        }
    };

    // 将标签名称转换为简洁的占位符格式（与 PlaceholderSelector 保持一致）
    const labelToPlaceholder = (label: string): string => {
        return label
            .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')  // 只保留中文、英文、数字
            .toLowerCase();  // 转换为小写
    };

    const renderPreviewContent = (content: string) => {
        // 基础占位符替换示例
        const sampleData: Record<string, string> = {
            '{form_title}': formData?.name || '示例表单',
            '{form_description}': formData?.description || '这是一个示例表单',
            '{submission_id}': 'SUB-20241201-001',
            '{submission_date}': '2024-12-01',
            '{submission_time}': '14:30:25',
            '{submitter_name}': '张三',
            '{submitter_email}': 'zhangsan@example.com',
            '{submitter_ip}': '192.168.1.100',
            '{submitter_username}': 'zhangsan',
            '{submitter_company}': '唐豪瑟科技有限公司',
            '{submitter_enterprise}': '唐豪瑟集团',
            '{submitter_department}': '技术部',
            '{submitter_position}': '项目经理',
            '{submitter_phone}': '13800138000',
            '{submitter_role}': '客户',
            '{admin_email}': 'admin@example.com',
            '{site_title}': '唐豪瑟表单系统',
            '{site_url}': 'https://your-site.com'
        };

        // 为表单字段生成示例数据（使用新的占位符格式）
        if (components && components.length > 0) {
            const usedPlaceholders = new Set<string>();

            components
                .filter((component: any) => {
                    const excludeTypes = ['divider', 'html', 'steps', 'group', 'columnContainer'];
                    return !excludeTypes.includes(component.type);
                })
                .forEach((component: any) => {
                    // 获取标签名称
                    let label = component.label || component.placeholder;
                    if (!label) {
                        const typeLabels: Record<string, string> = {
                            'input': '输入框', 'textarea': '多行文本', 'number': '数字',
                            'select': '下拉选择', 'radio': '单选', 'checkbox': '复选框',
                            'date': '日期', 'upload': '文件上传', 'slider': '滑块',
                            'client': '客户', 'contact': '联系人', 'project': '项目',
                            'quotation': '报价', 'amount': '金额', 'amountInWords': '金额大写',
                            'contractName': '合同名称', 'contractParty': '合同方',
                            'signature': '签名', 'article': '文章'
                        };
                        label = typeLabels[component.type] || `${component.type}字段`;
                    }

                    // 生成占位符（与 PlaceholderSelector 逻辑一致）
                    let placeholder = labelToPlaceholder(label);
                    let finalPlaceholder = placeholder;
                    let counter = 1;
                    while (usedPlaceholders.has(finalPlaceholder)) {
                        finalPlaceholder = `${placeholder}${counter}`;
                        counter++;
                    }
                    usedPlaceholders.add(finalPlaceholder);

                    const fieldKey = `{${finalPlaceholder}}`;

                    // 根据组件类型生成示例值
                    const getSampleValue = (type: string, label: string) => {
                        switch (type) {
                            case 'input':
                            case 'textarea':
                                if (label?.includes('姓名') || label?.includes('名称')) return '张三';
                                if (label?.includes('电话') || label?.includes('手机')) return '13800138000';
                                if (label?.includes('邮箱') || label?.includes('邮件')) return 'zhangsan@example.com';
                                if (label?.includes('地址')) return '北京市朝阳区';
                                if (label?.includes('公司')) return '唐豪瑟科技有限公司';
                                return '示例文本内容';
                            case 'number':
                                return '100';
                            case 'amount':
                                return '¥ 50,000.00';
                            case 'date':
                                return '2024-12-01';
                            case 'select':
                            case 'radio':
                                return '选项一';
                            case 'checkbox':
                                return '选项一, 选项二';
                            case 'client':
                                return '客户：唐豪瑟科技有限公司';
                            case 'contact':
                                return '联系人：张三 (13800138000)';
                            case 'project':
                                return '项目：网站建设项目';
                            case 'quotation':
                                return '报价：QT-20241201-001';
                            case 'signature':
                                return '[签名]';
                            case 'article':
                                return '文章内容示例...';
                            default:
                                return '示例值';
                        }
                    };

                    sampleData[fieldKey] = getSampleValue(component.type, label);
                });
        }

        // 替换所有占位符
        let result = content;
        Object.entries(sampleData).forEach(([placeholder, value]) => {
            result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
        });

        return result;
    };

    const getTriggerTags = (triggers: string[]) => {
        const triggerMap = {
            'submit': { color: 'green', text: '提交时' },
            'update': { color: 'blue', text: '更新时' },
            'delete': { color: 'red', text: '删除时' }
        };

        return triggers.map(trigger => {
            const config = triggerMap[trigger as keyof typeof triggerMap];
            return (
                <Tag key={trigger} color={config?.color}>
                    {config?.text}
                </Tag>
            );
        });
    };

    const getRecipientText = (template: NotificationTemplate) => {
        switch (template.to) {
            case 'admin':
                return '管理员';
            case 'submitter':
                return '提交者';
            case 'custom':
                return template.customEmails || '自定义邮箱';
            default:
                return '未设置';
        }
    };

    return (
        <>
            <style>{customStyles}</style>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Text strong style={{ fontSize: '16px' }}>通知模板管理</Text>
                        <Text type="secondary" style={{ marginLeft: '8px' }}>
                            ({templates.length} 个模板)
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateTemplate}
                    >
                        新建模板
                    </Button>
                </div>

                {templates.length === 0 ? (
                    <Empty
                        description="暂无通知模板"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <List
                        dataSource={templates}
                        renderItem={(template) => (
                            <List.Item
                                actions={[
                                    <Tooltip title="预览">
                                        <Button
                                            type="text"
                                            icon={<EyeOutlined />}
                                            onClick={() => handlePreviewTemplate(template)}
                                        />
                                    </Tooltip>,
                                    <Tooltip title="编辑">
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEditTemplate(template)}
                                        />
                                    </Tooltip>,
                                    <Tooltip title="复制">
                                        <Button
                                            type="text"
                                            icon={<CopyOutlined />}
                                            onClick={() => handleDuplicateTemplate(template)}
                                        />
                                    </Tooltip>,
                                    <Tooltip title="删除">
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDeleteTemplate(template.id)}
                                        />
                                    </Tooltip>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: template.enabled ? '#52c41a' : '#d9d9d9',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white'
                                        }}>
                                            <MailOutlined />
                                        </div>
                                    }
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Text strong>{template.name}</Text>
                                            {!template.enabled && <Tag color="default">已禁用</Tag>}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div style={{ marginBottom: '4px' }}>
                                                <UserOutlined style={{ marginRight: '4px' }} />
                                                <Text type="secondary">发送给: {getRecipientText(template)}</Text>
                                            </div>
                                            <div style={{ marginBottom: '4px' }}>
                                                <FieldTimeOutlined style={{ marginRight: '4px' }} />
                                                <Text type="secondary">触发时机: </Text>
                                                {getTriggerTags(template.triggers)}
                                            </div>
                                            <div>
                                                <Text type="secondary" ellipsis>主题: {template.subject}</Text>
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}

                {/* 编辑模板弹窗 */}
                <Modal
                    title={editingTemplate ? '编辑通知模板' : '新建通知模板'}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={handleSaveTemplate}
                    width={1200}
                    style={{ minHeight: '700px' }}
                    destroyOnClose
                >
                    <Form
                        form={templateForm}
                        layout="vertical"
                        initialValues={{
                            enabled: true,
                            triggers: ['submit'],
                            to: 'admin'
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="模板名称"
                                    rules={[{ required: true, message: '请输入模板名称' }]}
                                >
                                    <Input placeholder="输入模板名称" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="enabled" label="启用状态" valuePropName="checked">
                                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="to"
                                    label="发送对象"
                                    rules={[{ required: true, message: '请选择发送对象' }]}
                                >
                                    <Select placeholder="选择发送对象">
                                        <Option value="admin">管理员</Option>
                                        <Option value="submitter">提交者</Option>
                                        <Option value="custom">自定义邮箱</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="triggers"
                                    label="触发时机"
                                    rules={[{ required: true, message: '请选择触发时机' }]}
                                >
                                    <Select mode="multiple" placeholder="选择触发时机">
                                        <Option value="submit">提交时</Option>
                                        <Option value="update">更新时</Option>
                                        <Option value="delete">删除时</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.to !== currentValues.to}
                        >
                            {({ getFieldValue }) =>
                                getFieldValue('to') === 'custom' ? (
                                    <Form.Item
                                        name="customEmails"
                                        label="自定义邮箱"
                                        rules={[{ required: true, message: '请输入邮箱地址' }]}
                                    >
                                        <Input placeholder="多个邮箱请用逗号分隔" />
                                    </Form.Item>
                                ) : null
                            }
                        </Form.Item>

                        <Form.Item
                            name="subject"
                            label="邮件主题"
                            rules={[{ required: true, message: '请输入邮件主题' }]}
                        >
                            <Input placeholder="输入邮件主题，可使用占位符" />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col span={16}>
                                <Form.Item
                                    name="content"
                                    label="邮件内容"
                                    rules={[{ required: true, message: '请输入邮件内容' }]}
                                >
                                    <SimpleRichTextEditor
                                        placeholder="输入邮件内容，可使用占位符..."
                                        height={400}
                                        onEditorCreated={setContentEditor}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <PlaceholderSelector
                                    components={components}
                                    onPlaceholderInsert={insertPlaceholder}
                                    style={{
                                        height: '100%'
                                    }}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal>

                {/* 预览弹窗 */}
                <Modal
                    title="模板预览"
                    open={previewVisible}
                    onCancel={() => setPreviewVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setPreviewVisible(false)}>
                            关闭
                        </Button>
                    ]}
                    width={800}
                >
                    {previewTemplate && (
                        <div>
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>邮件主题：</Text>
                                <div style={{
                                    marginTop: '4px',
                                    padding: '8px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px'
                                }}>
                                    {renderPreviewContent(previewTemplate.subject)}
                                </div>
                            </div>
                            <div>
                                <Text strong>邮件内容：</Text>
                                <div
                                    style={{
                                        marginTop: '4px',
                                        padding: '16px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '6px',
                                        lineHeight: '1.6',
                                        minHeight: '200px'
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: renderPreviewContent(previewTemplate.content)
                                    }}
                                />
                            </div>
                            <Alert
                                message="预览说明"
                                description="以上预览使用了示例数据替换占位符，实际发送时会使用真实的表单数据。"
                                type="info"
                                showIcon
                                style={{ marginTop: '16px' }}
                            />
                        </div>
                    )}
                </Modal>

                <Alert
                    message="通知模板说明"
                    description="通知模板支持使用占位符动态替换表单数据。您可以创建多个模板用于不同的通知场景，每个模板可以设置不同的触发时机和发送对象。"
                    type="info"
                    showIcon
                    style={{ marginTop: '16px' }}
                />
            </div>
        </>
    );
};

export default NotificationTemplateManager;
