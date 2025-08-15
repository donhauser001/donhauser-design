import React, { useState, useEffect } from 'react';
import { Input, Collapse, Form } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { SearchOutlined } from '@ant-design/icons';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

const { TextArea } = Input;

interface ArticleSeoComponentProps {
    component: FormComponent;
}

const ArticleSeoComponent: React.FC<ArticleSeoComponentProps> = ({ component }) => {
    const { theme } = useFormDesignerStore();
    const borderColor = theme.borderColor || '#d9d9d9';
    const [activeKey, setActiveKey] = useState<string[]>(
        component.defaultExpanded ? ['seo'] : []
    );

    // 当属性变化时更新展开状态
    useEffect(() => {
        setActiveKey(component.defaultExpanded ? ['seo'] : []);
    }, [component.defaultExpanded]);

    const items = [
        {
            key: 'seo',
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SearchOutlined style={{ marginRight: '8px' }} />
                    SEO优化设置
                </div>
            ),
            children: (
                <div style={{ padding: '12px 0' }}>
                    <Form layout="vertical" size="small">
                        <Form.Item
                            label="SEO标题"
                            style={{ marginBottom: '16px' }}
                        >
                            <div className={component.showCharCount === false ? 'hide-count' : ''}>
                                <Input
                                    placeholder={component.seoTitlePlaceholder || '请输入SEO标题（建议60字符以内）'}
                                    disabled={component.disabled}
                                    maxLength={component.seoTitleMaxLength || 60}
                                    showCount={true}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="SEO关键词"
                            style={{ marginBottom: '16px' }}
                        >
                            <div className={component.showCharCount === false ? 'hide-count' : ''}>
                                <Input
                                    placeholder={component.seoKeywordsPlaceholder || '请输入关键词，用逗号分隔'}
                                    disabled={component.disabled}
                                    maxLength={component.seoKeywordsMaxLength || 200}
                                    showCount={true}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="SEO描述"
                            style={{ marginBottom: '0' }}
                        >
                            <div className={component.showCharCount === false ? 'hide-count' : ''}>
                                <TextArea
                                    placeholder={component.seoDescriptionPlaceholder || '请输入SEO描述（建议160字符以内）'}
                                    disabled={component.disabled}
                                    rows={3}
                                    maxLength={component.seoDescriptionMaxLength || 160}
                                    showCount={true}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
    ];

    return (
        <div style={{ width: '100%' }}>
            <div style={component.style}>
                <style>
                    {`
                        .hide-count .ant-input-show-count-suffix,
                        .hide-count .ant-input-data-count {
                            display: none !important;
                        }
                    `}
                </style>
                <Collapse
                    items={items}
                    activeKey={activeKey}
                    onChange={(keys) => setActiveKey(Array.isArray(keys) ? keys : [keys])}
                    size="small"
                    ghost={component.ghost}
                    expandIconPosition={component.expandIconPosition || 'start'}
                />
            </div>
            {component.fieldDescription && (
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
                    提示：{component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ArticleSeoComponent;
