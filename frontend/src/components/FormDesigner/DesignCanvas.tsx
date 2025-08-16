import React, { useState } from 'react';
import { Card, Empty, Button, message, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import SortableComponent from './components/SortableComponent';
import FormComponentRenderer from './FormComponentRenderer';
import LogicEngineProvider from './LogicEngineProvider';
import { globalLogicEngine } from './utils/logicEngine';
import { getButtonIcon } from './utils/iconUtils';

interface DesignCanvasProps {
    isPreviewMode?: boolean;
    formData?: any; // 表单数据，包含提交按钮配置
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ isPreviewMode = false, formData: formSettings }) => {
    const {
        components,
        selectComponent,
        layout,
        theme,
    } = useFormDesignerStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    // 配置画布为可放置区域
    const { setNodeRef, isOver } = useDroppable({
        id: 'design-canvas',
        data: {
            type: 'canvas',
            accepts: ['component-from-library', 'component-in-canvas']
        }
    });

    const handleCanvasClick = (e: React.MouseEvent) => {
        // 点击画布空白区域取消选择
        if (e.target === e.currentTarget) {
            selectComponent(null);
        }
    };

    // 收集表单数据
    const collectFormData = () => {
        const data: any = {};
        const inputComponents = components.filter(comp =>
            ['input', 'textarea', 'number', 'date', 'select', 'radio', 'slider', 'upload'].includes(comp.type)
        );

        inputComponents.forEach(comp => {
            const value = globalLogicEngine.getComponentValue(comp.id);
            data[comp.id] = {
                label: comp.label,
                type: comp.type,
                value: value !== undefined ? value : comp.defaultValue || '',
                required: comp.required || false
            };
        });

        return data;
    };

    // 验证必填字段
    const validateForm = (data: any) => {
        const errors: string[] = [];
        Object.keys(data).forEach(key => {
            const field = data[key];
            if (field.required && (!field.value || field.value === '')) {
                errors.push(`${field.label} 为必填项`);
            }
        });
        return errors;
    };

    // 处理表单提交
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const data = collectFormData();
            const errors = validateForm(data);

            if (errors.length > 0) {
                message.error(`表单验证失败：${errors.join('、')}`);
                setIsSubmitting(false);
                return;
            }

            // 模拟提交延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            setFormData(data);
            setSubmitModalVisible(true);
            message.success('表单提交成功！');

        } catch (error) {
            message.error('提交失败，请重试');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 获取根级组件（没有父组件的组件）
    const rootComponents = components.filter(comp => !comp.parentId).sort((a, b) => a.order - b.order);
    const rootComponentIds = rootComponents.map(comp => comp.id);

    // 生成表单容器样式
    const getFormContainerStyle = () => {
        const baseStyle: React.CSSProperties = {
            minHeight: '100%',
            padding: layout.padding || '16px',
            backgroundColor: theme.backgroundColor || '#fff',
            borderRadius: theme.borderRadius || '6px',
            position: 'relative',
            transition: 'all 0.2s ease'
        };

        // 应用最大宽度和对齐方式（两种模式都适用）
        baseStyle.maxWidth = layout.maxWidth === 'none' ? '100%' : layout.maxWidth || '100%';
        baseStyle.margin = layout.alignment === 'center' ? '0 auto' : layout.alignment === 'right' ? '0 0 0 auto' : '0';

        // 预览模式下的特殊样式
        if (isPreviewMode) {
            baseStyle.border = isOver ? '2px dashed #1890ff' : (theme.showFormBorder ? `1px solid ${theme.borderColor || '#d9d9d9'}` : 'none');
            baseStyle.boxShadow = theme.boxShadow || 'none';
            baseStyle.color = theme.textColor || '#000000';
            baseStyle.fontSize = theme.fontSize || '14px';
        } else {
            // 设计模式下的样式
            baseStyle.backgroundColor = isOver ? '#f0f8ff' : theme.backgroundColor || '#fff';
            baseStyle.border = isOver ? '2px dashed #1890ff' : '2px dashed #d9d9d9';
        }

        return baseStyle;
    };

    // 生成组件间距样式
    const getComponentSpacing = () => {
        return layout.componentSpacing || '16px';
    };

    // 生成主题样式
    const getThemeStyles = () => {
        const primaryColor = theme.primaryColor || '#1890ff';
        const borderColor = theme.borderColor || '#d9d9d9';
        const borderRadius = theme.borderRadius || '6px';
        const fontSize = theme.fontSize || '14px';
        const textColor = theme.textColor || '#000000';
        const boxShadow = theme.boxShadow || 'none';

        console.log('🎨 应用主题样式:', {
            primaryColor,
            borderColor,
            borderRadius,
            fontSize,
            textColor,
            timestamp: new Date().toLocaleTimeString()
        });

        return `
            /* 基础输入组件样式 */
            .form-designer-canvas .ant-input,
            .form-designer-canvas .ant-select .ant-select-selector,
            .form-designer-canvas .ant-picker,
            .form-designer-canvas .ant-input-number,
            .form-designer-canvas .ant-input-number .ant-input-number-input,
            .form-designer-canvas .ant-input-number-affix-wrapper,
            .form-designer-canvas .ant-mentions,
            .form-designer-canvas .ant-cascader-picker,
            .form-designer-canvas .ant-input-number-input,
            .form-designer-canvas .ant-input-affix-wrapper,
            .form-designer-canvas .ant-input-group-addon,
            .form-designer-canvas .ant-textarea {
                border-color: ${borderColor} !important;
                border-radius: ${borderRadius} !important;
                font-size: ${fontSize} !important;
                color: ${textColor} !important;
                box-shadow: ${boxShadow} !important;
            }
            
            /* InputNumber 特殊样式 */
            .form-designer-canvas .ant-input-number-group-wrapper {
                border-color: ${borderColor} !important;
            }
            
            .form-designer-canvas .ant-input-number-group-addon {
                border-color: ${borderColor} !important;
                background-color: #fafafa !important;
            }
            
            /* 聚焦状态 - 使用主色调 */
            .form-designer-canvas .ant-input:focus,
            .form-designer-canvas .ant-input:focus-within,
            .form-designer-canvas .ant-select.ant-select-focused .ant-select-selector,
            .form-designer-canvas .ant-select:focus .ant-select-selector,
            .form-designer-canvas .ant-picker.ant-picker-focused,
            .form-designer-canvas .ant-picker:focus,
            .form-designer-canvas .ant-input-number.ant-input-number-focused,
            .form-designer-canvas .ant-input-number:focus-within,
            .form-designer-canvas .ant-input-number-affix-wrapper.ant-input-number-affix-wrapper-focused,
            .form-designer-canvas .ant-input-number-group-wrapper.ant-input-number-group-wrapper-focused,
            .form-designer-canvas .ant-mentions.ant-mentions-focused,
            .form-designer-canvas .ant-cascader-picker.ant-cascader-picker-focused {
                border-color: ${primaryColor} !important;
                box-shadow: 0 0 0 2px rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.2) !important;
                outline: none !important;
            }
            
            /* 主要按钮样式 */
            .form-designer-canvas .ant-btn-primary {
                background-color: ${primaryColor} !important;
                border-color: ${primaryColor} !important;
                border-radius: ${borderRadius} !important;
                font-size: ${fontSize} !important;
                color: #fff !important;
            }
            
            .form-designer-canvas .ant-btn-primary:hover,
            .form-designer-canvas .ant-btn-primary:focus {
                background-color: ${primaryColor} !important;
                border-color: ${primaryColor} !important;
                opacity: 0.85 !important;
            }
            
            /* 单选框样式 */
            .form-designer-canvas .ant-radio-wrapper .ant-radio.ant-radio-checked .ant-radio-inner {
                border-color: ${primaryColor} !important;
                background-color: ${primaryColor} !important;
            }
            
            .form-designer-canvas .ant-radio-wrapper .ant-radio.ant-radio-checked::after {
                border-color: ${primaryColor} !important;
            }
            
            .form-designer-canvas .ant-radio-wrapper:hover .ant-radio .ant-radio-inner {
                border-color: ${primaryColor} !important;
            }
            
            /* 复选框样式 */
            .form-designer-canvas .ant-checkbox-wrapper .ant-checkbox.ant-checkbox-checked .ant-checkbox-inner {
                background-color: ${primaryColor} !important;
                border-color: ${primaryColor} !important;
            }
            
            .form-designer-canvas .ant-checkbox-wrapper:hover .ant-checkbox .ant-checkbox-inner {
                border-color: ${primaryColor} !important;
            }
            
            /* 滑块样式 */
            .form-designer-canvas .ant-slider .ant-slider-track {
                background-color: ${primaryColor} !important;
            }
            
            .form-designer-canvas .ant-slider .ant-slider-handle {
                border-color: ${primaryColor} !important;
            }
            
            .form-designer-canvas .ant-slider .ant-slider-handle:focus {
                box-shadow: 0 0 0 5px rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.2) !important;
            }
            
            /* 评分组件样式 */
            .form-designer-canvas .ant-rate .ant-rate-star.ant-rate-star-full .ant-rate-star-second {
                color: ${primaryColor} !important;
            }
            
            /* 下拉选择项样式 */
            .ant-select-dropdown .ant-select-item.ant-select-item-option.ant-select-item-option-selected {
                background-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1) !important;
                color: ${primaryColor} !important;
            }
            
            .ant-select-dropdown .ant-select-item.ant-select-item-option:hover {
                background-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.05) !important;
            }
            
            /* 日期选择器样式 */
            .ant-picker-dropdown .ant-picker-cell.ant-picker-cell-selected .ant-picker-cell-inner {
                background: ${primaryColor} !important;
                color: #fff !important;
            }
            
            .ant-picker-dropdown .ant-picker-cell:hover .ant-picker-cell-inner {
                background: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1) !important;
            }
            
            /* 链接和高亮文字 */
            .form-designer-canvas a,
            .form-designer-canvas .ant-typography a {
                color: ${primaryColor} !important;
            }
            
            .form-designer-canvas a:hover,
            .form-designer-canvas .ant-typography a:hover {
                color: ${primaryColor} !important;
                opacity: 0.85 !important;
            }
            
            /* Tabs 选项卡样式 */
            .form-designer-canvas .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                color: ${primaryColor} !important;
            }
            
            .form-designer-canvas .ant-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
                color: ${primaryColor} !important;
            }
            
            .form-designer-canvas .ant-tabs .ant-tabs-ink-bar {
                background-color: ${primaryColor} !important;
            }
            
            /* Card 卡片组件样式 */
            .form-designer-canvas .ant-card {
                border-color: ${borderColor} !important;
                border-radius: ${borderRadius} !important;
            }
            
            .form-designer-canvas .ant-card-head {
                border-bottom-color: ${borderColor} !important;
            }
            
            .form-designer-canvas .ant-card-body {
                border-color: ${borderColor} !important;
            }
            
            /* Collapse 折叠面板样式 */
            .form-designer-canvas .ant-collapse {
                border-color: ${borderColor} !important;
                border-radius: ${borderRadius} !important;
            }
            
            .form-designer-canvas .ant-collapse > .ant-collapse-item {
                border-bottom-color: ${borderColor} !important;
            }
            
            .form-designer-canvas .ant-collapse > .ant-collapse-item:last-child {
                border-bottom-color: ${borderColor} !important;
            }
            
            .form-designer-canvas .ant-collapse-header {
                border-color: ${borderColor} !important;
            }
            
            .form-designer-canvas .ant-collapse-content {
                border-top-color: ${borderColor} !important;
            }
            
            /* 说明文字全局样式 */
            .form-designer-canvas [class*="description-text"],
            .form-designer-canvas div[style*="提示："] {
                font-size: ${theme.descriptionFontSize || '12px'} !important;
                color: ${theme.descriptionColor || '#8c8c8c'} !important;
                line-height: 1.4 !important;
            }
        `;
    };

    return (
        <Card
            title={isPreviewMode ? "表单预览" : "设计画布"}
            styles={{
                body: {
                    padding: '16px',
                    backgroundColor: isPreviewMode ? '#fff' : '#fafafa'
                }
            }}
        >
            {/* 动态主题样式 - 使用更高的优先级 */}
            <style id="form-designer-theme-styles" dangerouslySetInnerHTML={{
                __html: getThemeStyles()
            }} />

            {/* 全局CSS变量 */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    :root {
                        --form-primary-color: ${theme.primaryColor || '#1890ff'};
                        --form-border-color: ${theme.borderColor || '#d9d9d9'};
                        --form-border-radius: ${theme.borderRadius || '6px'};
                        --form-font-size: ${theme.fontSize || '14px'};
                        --form-text-color: ${theme.textColor || '#000000'};
                    }
                    
                    /* 强制应用主色调到提交按钮 */
                    .form-designer-canvas .ant-btn.ant-btn-primary {
                        background-color: ${theme.primaryColor || '#1890ff'} !important;
                        border-color: ${theme.primaryColor || '#1890ff'} !important;
                    }
                    
                    /* 测试用的明显样式 */
                    .form-designer-canvas {
                        --primary-color: ${theme.primaryColor || '#1890ff'};
                    }
                `
            }} />

            <div
                ref={setNodeRef}
                className="form-designer-canvas"
                style={getFormContainerStyle()}
                onClick={handleCanvasClick}
            >
                {rootComponents.length === 0 ? (
                    <Empty
                        description={isPreviewMode ? "暂无表单内容" : "拖拽组件到此处开始设计表单"}
                        style={{ margin: '60px 0' }}
                    />
                ) : isPreviewMode ? (
                    // 预览模式：使用逻辑引擎提供者包装组件
                    <LogicEngineProvider isPreviewMode={isPreviewMode}>
                        <div style={{ position: 'relative' }}>
                            {/* 表单标题和描述 */}
                            {(formSettings?.showFormTitle || formSettings?.showFormDescription) && (
                                <div style={{
                                    marginBottom: theme.formDescriptionMarginBottom || '32px',
                                    paddingBottom: '24px',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    {formSettings?.showFormTitle && formSettings?.name && (
                                        <h1 style={{
                                            margin: `0 0 ${theme.formTitleMarginBottom || '16px'} 0`,
                                            fontSize: theme.formTitleFontSize || '28px',
                                            fontWeight: theme.formTitleFontWeight || 600,
                                            color: theme.formTitleColor || theme.textColor || '#262626',
                                            textAlign: theme.formTitleAlign || 'center'
                                        }}>
                                            {formSettings.name}
                                        </h1>
                                    )}
                                    {formSettings?.showFormDescription && formSettings?.description && (
                                        <p style={{
                                            margin: 0,
                                            fontSize: theme.formDescriptionFontSize || '16px',
                                            color: theme.formDescriptionColor || theme.descriptionColor || '#8c8c8c',
                                            textAlign: theme.formDescriptionAlign || 'center',
                                            lineHeight: theme.formDescriptionLineHeight || 1.6
                                        }}>
                                            {formSettings.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {rootComponents.map((component) => (
                                <div key={component.id} style={{ marginBottom: getComponentSpacing() }}>
                                    <FormComponentRenderer component={component} isDesignMode={false} />
                                </div>
                            ))}

                            {/* 提交按钮 */}
                            <div style={{
                                marginTop: '32px',
                                paddingTop: '24px',
                                borderTop: '1px solid #f0f0f0',
                                textAlign: formSettings?.submitButtonPosition || 'center'
                            }}>
                                {/* 添加样式覆盖 */}
                                <style>
                                    {`
                                        .custom-submit-button.ant-btn-primary {
                                            color: ${theme.buttonTextColor || '#ffffff'} !important;
                                            background-color: ${theme.primaryColor || '#1890ff'} !important;
                                            border-color: ${theme.primaryColor || '#1890ff'} !important;
                                        }
                                        .custom-submit-button.ant-btn-primary:hover {
                                            color: ${theme.buttonTextColor || '#ffffff'} !important;
                                            background-color: ${theme.primaryColor || '#1890ff'} !important;
                                            border-color: ${theme.primaryColor || '#1890ff'} !important;
                                            opacity: 0.8;
                                        }
                                        .custom-submit-button.ant-btn-primary:focus {
                                            color: ${theme.buttonTextColor || '#ffffff'} !important;
                                            background-color: ${theme.primaryColor || '#1890ff'} !important;
                                            border-color: ${theme.primaryColor || '#1890ff'} !important;
                                        }
                                        .custom-submit-button .anticon {
                                            color: ${theme.buttonTextColor || '#ffffff'} !important;
                                        }
                                    `}
                                </style>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={formSettings?.submitButtonIcon ? getButtonIcon(formSettings.submitButtonIcon) : <SendOutlined />}
                                    loading={isSubmitting}
                                    onClick={handleSubmit}
                                    className="custom-submit-button"
                                    style={{
                                        minWidth: '120px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isSubmitting ? '提交中...' : (formSettings?.submitButtonText || '提交表单')}
                                </Button>
                            </div>
                        </div>
                    </LogicEngineProvider>
                ) : (
                    // 设计模式：使用可排序组件
                    <SortableContext items={rootComponentIds} strategy={verticalListSortingStrategy}>
                        <div style={{ position: 'relative' }}>
                            {rootComponents.map((component) => (
                                <div key={component.id} style={{ marginBottom: getComponentSpacing() }}>
                                    <SortableComponent component={component} />
                                </div>
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>

            {/* 提交结果模态框 */}
            <Modal
                title="表单提交成功"
                open={submitModalVisible}
                onCancel={() => setSubmitModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setSubmitModalVisible(false)}>
                        关闭
                    </Button>
                ]}
                width={600}
            >
                <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                    <h4 style={{ marginBottom: '16px', color: '#52c41a' }}>✅ 提交的表单数据：</h4>
                    {formData && (
                        <div style={{ backgroundColor: '#f6f8fa', padding: '16px', borderRadius: '6px' }}>
                            {Object.keys(formData).map(key => {
                                const field = formData[key];
                                return (
                                    <div key={key} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e1e4e8' }}>
                                        <div style={{ fontWeight: 'bold', color: '#24292e', marginBottom: '4px' }}>
                                            {field.label} {field.required && <span style={{ color: '#d73a49' }}>*</span>}
                                        </div>
                                        <div style={{ color: '#586069', fontSize: '12px', marginBottom: '4px' }}>
                                            类型: {field.type} | ID: {key}
                                        </div>
                                        <div style={{
                                            backgroundColor: '#fff',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #e1e4e8',
                                            fontFamily: 'monospace'
                                        }}>
                                            {typeof field.value === 'object' ?
                                                JSON.stringify(field.value, null, 2) :
                                                String(field.value || '(空值)')
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Modal>
        </Card>
    );
};

export default DesignCanvas;