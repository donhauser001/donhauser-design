import React, { useState, useEffect } from 'react';
import {
    Modal,
    Tabs,
    Form,
    Button,
    Space,
    Tag,
    message
} from 'antd';
import {
    InfoCircleOutlined,
    SettingOutlined,
    BellOutlined,
    ProjectOutlined,
    FileTextOutlined,
    FileProtectOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import { getActiveFormCategories, FormCategory } from '../../api/formCategories';
import dayjs from 'dayjs';
import NotificationTemplateManager from './NotificationTemplateManager';
import {
    BasicSettingsTab,
    ProjectSettingsTab,
    ArticleSettingsTab,
    ContractSettingsTab
} from './FormSettingsTabs';

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
    const [formCategories, setFormCategories] = useState<FormCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [expiryType, setExpiryType] = useState<string>('date');
    const [expiryEnabled, setExpiryEnabled] = useState<boolean>(false);
    const [submissionLimitEnabled, setSubmissionLimitEnabled] = useState<boolean>(false);
    const [selectedIcon, setSelectedIcon] = useState<string>('');

    const { layout, theme, updateLayout, updateTheme, exportFormConfig } = useFormDesignerStore();

    const loadFormCategories = async () => {
        setCategoriesLoading(true);
        try {
            const categories = await getActiveFormCategories();
            setFormCategories(categories);
            return categories;
        } catch (error) {
            console.error('加载表单分类失败:', error);
            message.error('加载表单分类失败');
            return [];
        } finally {
            setCategoriesLoading(false);
        }
    };

    // 加载表单分类和初始化表单数据
    useEffect(() => {
        if (visible) {
            const initializeForm = async () => {
                // 先加载分类数据
                await loadFormCategories();

                // 然后初始化表单数据
                if (formData) {
                    form.setFieldsValue({
                        // 基本设置
                        name: formData.name || '',
                        description: formData.description || '',
                        status: formData.status || 'draft',
                        categoryId: (typeof formData.categoryId === 'object' && formData.categoryId?._id)
                            ? formData.categoryId._id
                            : formData.categoryId || '',
                        allowGuestView: formData.allowGuestView ?? false,
                        allowGuestSubmit: formData.allowGuestSubmit ?? false,
                        showFormTitle: formData.showFormTitle ?? true,
                        showFormDescription: formData.showFormDescription ?? true,

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

                        // 编辑器自动保存设置
                        autoSave: formData?.settings?.security?.autoSave ?? true,
                        autoSaveInterval: formData?.settings?.security?.autoSaveInterval ?? 30,

                        // 表单填写自动保存设置
                        enableFormAutoSave: formData?.settings?.security?.enableFormAutoSave ?? true,
                        formAutoSaveInterval: formData?.settings?.security?.formAutoSaveInterval ?? 30,
                        saveTrigger: formData?.settings?.security?.saveTrigger ?? 'both',
                        saveLocation: formData?.settings?.security?.saveLocation ?? 'localStorage',
                        autoSaveNotification: formData?.settings?.security?.autoSaveNotification ?? true,

                        // 提交限制
                        enableSubmissionLimit: formData?.settings?.submission?.enableSubmissionLimit ?? false,
                        maxSubmissions: formData?.settings?.submission?.maxSubmissions ?? 0,
                        limitType: formData?.settings?.submission?.limitType ?? 'ip',
                        resetPeriod: formData?.settings?.submission?.resetPeriod ?? 'never',
                        limitMessage: formData?.settings?.submission?.limitMessage ?? '您已达到提交次数限制，请稍后再试',

                        // 有效期设置
                        enableExpiry: formData?.settings?.expiry?.enableExpiry ?? false,
                        expiryType: formData?.settings?.expiry?.expiryType ?? 'date',
                        expiryDate: formData?.settings?.expiry?.expiryDate ? dayjs(formData.settings.expiry.expiryDate) : '',
                        expiryDuration: formData?.settings?.expiry?.expiryDuration ?? 30,
                        expirySubmissions: formData?.settings?.expiry?.expirySubmissions ?? 1000,
                        expiryMessage: formData?.settings?.expiry?.expiryMessage ?? '表单已过期，无法提交',

                        // 提交设置
                        submitButtonText: formData?.submitButtonText ?? '提交',
                        submitButtonPosition: formData?.submitButtonPosition ?? 'center',
                        submitButtonIcon: formData?.submitButtonIcon ?? '',
                        enableDraft: formData?.enableDraft ?? false,
                        requireConfirmation: formData?.requireConfirmation ?? false,
                        redirectAfterSubmit: formData?.redirectAfterSubmit ?? false,
                        redirectUrl: formData?.redirectUrl ?? '',

                        // 通知设置
                        notification: formData?.settings?.notification || { templates: [] }
                    });

                    // 设置初始的有效期类型和启用状态
                    setExpiryType(formData?.settings?.expiry?.expiryType || 'date');
                    setExpiryEnabled(formData?.settings?.expiry?.enableExpiry || false);

                    // 设置初始的提交限制启用状态
                    setSubmissionLimitEnabled(formData?.settings?.submission?.enableSubmissionLimit || false);

                    // 设置初始的选中图标
                    setSelectedIcon(formData?.submitButtonIcon || '');
                }
            };

            initializeForm();
        }
    }, [visible, formData, layout, theme, form]);

    // 监听表单值变化，同步各种状态
    const handleFormValuesChange = (changedValues: any) => {
        if (changedValues.expiryType) {
            setExpiryType(changedValues.expiryType);
        }
        if (changedValues.enableExpiry !== undefined) {
            setExpiryEnabled(changedValues.enableExpiry);
        }
        if (changedValues.enableSubmissionLimit !== undefined) {
            setSubmissionLimitEnabled(changedValues.enableSubmissionLimit);
        }
        if (changedValues.submitButtonIcon !== undefined) {
            setSelectedIcon(changedValues.submitButtonIcon);
        }
    };

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
                    categoryId: values.categoryId,
                    allowGuestView: values.allowGuestView,
                    allowGuestSubmit: values.allowGuestSubmit,
                    showFormTitle: values.showFormTitle,
                    showFormDescription: values.showFormDescription,
                    submitButtonText: values.submitButtonText,
                    submitButtonPosition: values.submitButtonPosition,
                    submitButtonIcon: values.submitButtonIcon,
                    enableDraft: values.enableDraft,
                    requireConfirmation: values.requireConfirmation,
                    redirectAfterSubmit: values.redirectAfterSubmit,
                    redirectUrl: values.redirectUrl,
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
                        security: {
                            autoSave: values.autoSave,
                            autoSaveInterval: values.autoSaveInterval,
                            enableFormAutoSave: values.enableFormAutoSave,
                            formAutoSaveInterval: values.formAutoSaveInterval,
                            saveTrigger: values.saveTrigger,
                            saveLocation: values.saveLocation,
                            autoSaveNotification: values.autoSaveNotification
                        },
                        submission: {
                            enableSubmissionLimit: values.enableSubmissionLimit,
                            maxSubmissions: values.maxSubmissions,
                            limitType: values.limitType,
                            resetPeriod: values.resetPeriod,
                            limitMessage: values.limitMessage
                        },
                        expiry: {
                            enableExpiry: values.enableExpiry,
                            expiryType: values.expiryType,
                            expiryDate: values.expiryDate ? dayjs(values.expiryDate).toISOString() : null,
                            expiryDuration: values.expiryDuration,
                            expirySubmissions: values.expirySubmissions,
                            expiryMessage: values.expiryMessage
                        },
                        notification: {
                            templates: values.notification?.templates || []
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
                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                    基础设置
                </span>
            ),
            children: (
                <BasicSettingsTab
                    form={form}
                    formData={formData}
                    formCategories={formCategories}
                    categoriesLoading={categoriesLoading}
                    submissionLimitEnabled={submissionLimitEnabled}
                    expiryEnabled={expiryEnabled}
                    expiryType={expiryType}
                    selectedIcon={selectedIcon}
                    setSubmissionLimitEnabled={setSubmissionLimitEnabled}
                    setExpiryEnabled={setExpiryEnabled}
                    setExpiryType={setExpiryType}
                    setSelectedIcon={setSelectedIcon}
                />
            )
        },
        {
            key: 'notification',
            label: (
                <span>
                    <BellOutlined style={{ marginRight: 8 }} />
                    通知设置
                </span>
            ),
            children: (
                <NotificationTemplateManager
                    form={form}
                    formData={formData}
                />
            )
        },
        {
            key: 'project',
            label: (
                <span>
                    <ProjectOutlined style={{ marginRight: 8 }} />
                    项目设置
                </span>
            ),
            children: (
                <ProjectSettingsTab
                    form={form}
                    formData={formData}
                />
            )
        },
        {
            key: 'article',
            label: (
                <span>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    文章设置
                </span>
            ),
            children: (
                <ArticleSettingsTab
                    form={form}
                    formData={formData}
                />
            )
        },
        {
            key: 'contract',
            label: (
                <span>
                    <FileProtectOutlined style={{ marginRight: 8 }} />
                    合同设置
                </span>
            ),
            children: (
                <ContractSettingsTab
                    form={form}
                    formData={formData}
                    onExportConfig={handleExportConfig}
                />
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
                onValuesChange={handleFormValuesChange}
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
