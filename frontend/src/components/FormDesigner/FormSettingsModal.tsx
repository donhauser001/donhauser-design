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
    Alert,
    Radio,
    ColorPicker
} from 'antd';
import {
    InfoCircleOutlined,
    SettingOutlined,
    ThunderboltOutlined,
    BgColorsOutlined,
    ExportOutlined,
    ImportOutlined,
    DeleteOutlined,
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
                    基本设置
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

                    <Card size="small" title="表单配置">
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
                </div>
            )
        },
        {
            key: 'layout',
            label: (
                <span>
                    <SettingOutlined />
                    布局设置
                </span>
            ),
            children: (
                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                    <Card size="small" title="标签设置" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="labelPosition" label="标签位置">
                                    <Radio.Group>
                                        <Radio value="top">顶部</Radio>
                                        <Radio value="left">左侧</Radio>
                                        <Radio value="right">右侧</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="labelWidth" label="标签宽度">
                                    <Select>
                                        <Option value="80px">80px</Option>
                                        <Option value="100px">100px</Option>
                                        <Option value="120px">120px</Option>
                                        <Option value="150px">150px</Option>
                                        <Option value="auto">自动</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="间距设置" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="componentSpacing" label="组件间距">
                                    <Select>
                                        <Option value="8px">紧凑 (8px)</Option>
                                        <Option value="16px">标准 (16px)</Option>
                                        <Option value="24px">宽松 (24px)</Option>
                                        <Option value="32px">超宽松 (32px)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="padding" label="内边距">
                                    <Select>
                                        <Option value="16px">16px</Option>
                                        <Option value="24px">24px</Option>
                                        <Option value="32px">32px</Option>
                                        <Option value="48px">48px</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="容器设置">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="maxWidth" label="最大宽度">
                                    <Select>
                                        <Option value="100%">100%</Option>
                                        <Option value="1200px">1200px</Option>
                                        <Option value="1000px">1000px</Option>
                                        <Option value="800px">800px</Option>
                                        <Option value="600px">600px</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="alignment" label="对齐方式">
                                    <Radio.Group>
                                        <Radio value="left">左对齐</Radio>
                                        <Radio value="center">居中</Radio>
                                        <Radio value="right">右对齐</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )
        },
        {
            key: 'theme',
            label: (
                <span>
                    <BgColorsOutlined />
                    主题样式
                </span>
            ),
            children: (
                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                    <Card size="small" title="颜色设置" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="primaryColor" label="主色调">
                                    <ColorPicker showText />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="backgroundColor" label="背景色">
                                    <ColorPicker showText />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="borderColor" label="边框色">
                                    <ColorPicker showText />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="textColor" label="文本色">
                                    <ColorPicker showText />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="尺寸设置" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="fontSize" label="字体大小">
                                    <Select>
                                        <Option value="12px">小号 (12px)</Option>
                                        <Option value="14px">标准 (14px)</Option>
                                        <Option value="16px">大号 (16px)</Option>
                                        <Option value="18px">超大 (18px)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="borderRadius" label="圆角大小">
                                    <Select>
                                        <Option value="0px">无圆角</Option>
                                        <Option value="4px">小圆角 (4px)</Option>
                                        <Option value="6px">标准 (6px)</Option>
                                        <Option value="8px">大圆角 (8px)</Option>
                                        <Option value="12px">超大 (12px)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Alert
                        message="主题预览"
                        description="主题设置会实时应用到表单设计器中，您可以随时调整以获得最佳视觉效果。"
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                    />
                </div>
            )
        },
        {
            key: 'advanced',
            label: (
                <span>
                    <ThunderboltOutlined />
                    高级设置
                </span>
            ),
            children: (
                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                    <Card size="small" title="自动保存" style={{ marginBottom: '16px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="autoSave" label="启用自动保存" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="autoSaveInterval" label="保存间隔(秒)">
                                    <InputNumber min={10} max={300} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card size="small" title="导入导出" style={{ marginBottom: '16px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                icon={<ExportOutlined />}
                                onClick={handleExportConfig}
                                block
                            >
                                导出表单配置
                            </Button>
                            <Button
                                icon={<ImportOutlined />}
                                block
                                disabled
                            >
                                导入表单配置 (开发中)
                            </Button>
                        </Space>
                    </Card>

                    <Card size="small" title="危险操作">
                        <Alert
                            message="警告"
                            description="以下操作不可撤销，请谨慎使用。"
                            type="warning"
                            showIcon
                            style={{ marginBottom: '12px' }}
                        />
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            block
                            onClick={() => {
                                Modal.confirm({
                                    title: '确认重置',
                                    content: '此操作将清空所有表单设计内容，是否继续？',
                                    onOk: () => {
                                        // 实现重置逻辑
                                        console.log('重置表单');
                                    }
                                });
                            }}
                        >
                            重置表单设计
                        </Button>
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
