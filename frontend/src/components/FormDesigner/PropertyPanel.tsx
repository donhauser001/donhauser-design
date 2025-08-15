import React from 'react';
import { Card, Form, Tabs, Collapse, ColorPicker, Select, Switch, Input, InputNumber, Button } from 'antd';
import { SettingOutlined, AppstoreOutlined, FormatPainterOutlined, BranchesOutlined } from '@ant-design/icons';
import { useFormDesignerStore } from '../../stores/formDesignerStore';

// 导入各种属性面板组件
import CommonProperties from './PropertyPanels/CommonProperties';
import BasicComponents from './PropertyPanels/BasicComponents';
import LayoutComponents from './PropertyPanels/LayoutComponents';
import OptionComponents from './PropertyPanels/OptionComponents';
import MediaComponents from './PropertyPanels/MediaComponents';
import ContentComponents from './PropertyPanels/ContentComponents';
import ProjectComponents from './PropertyPanels/ProjectComponents';
import ContractComponents from './PropertyPanels/ContractComponents';
import ArticleComponents from './PropertyPanels/ArticleComponents';
import FinanceComponents from './PropertyPanels/FinanceComponents';
import StyleProperties from './PropertyPanels/StyleProperties';

const { Option } = Select;

const PropertyPanel: React.FC = () => {
    const {
        components,
        selectedComponent,
        updateComponent,
        layout,
        theme,
        updateLayout,
        updateTheme
    } = useFormDesignerStore();

    const selectedComponentData = components.find(comp => comp.id === selectedComponent);

    const handlePropertyChange = (field: string, value: any) => {
        if (selectedComponent) {
            updateComponent(selectedComponent, { [field]: value });
        }
    };

    const renderComponentProperties = () => {
        if (!selectedComponentData) {
            return (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                    请选择一个组件来编辑属性
                </div>
            );
        }

        // 根据组件类型获取所属分类
        const getComponentCategory = () => {
            const basicTypes = ['input', 'textarea', 'number', 'date'];
            const layoutTypes = ['columnContainer', 'group', 'divider', 'pagination', 'steps'];
            const optionTypes = ['radio', 'select'];
            const mediaTypes = ['upload', 'image'];
            const contentTypes = ['presetText', 'html', 'countdown', 'slider'];
            const projectTypes = ['projectName', 'client', 'contact', 'quotation', 'order', 'instruction', 'taskList'];
            const contractTypes = ['contractName', 'contractParty', 'ourCertificate', 'signature'];
            const articleTypes = ['articleTitle', 'articleContent', 'author', 'articleSummary', 'articleCategory', 'articleTags', 'articlePublishTime', 'articleCoverImage', 'articleSeo'];
            const financeTypes = ['amount', 'amountInWords', 'total', 'invoiceType', 'invoiceInfo', 'paymentMethod'];

            if (basicTypes.includes(selectedComponentData.type)) return 'basic';
            if (layoutTypes.includes(selectedComponentData.type)) return 'layout';
            if (optionTypes.includes(selectedComponentData.type)) return 'option';
            if (mediaTypes.includes(selectedComponentData.type)) return 'media';
            if (contentTypes.includes(selectedComponentData.type)) return 'content';
            if (projectTypes.includes(selectedComponentData.type)) return 'project';
            if (contractTypes.includes(selectedComponentData.type)) return 'contract';
            if (articleTypes.includes(selectedComponentData.type)) return 'article';
            if (financeTypes.includes(selectedComponentData.type)) return 'finance';
            return 'basic';
        };

        const category = getComponentCategory();

        // 创建折叠面板项
        const collapseItems = [
            // 基础属性面板（除布局组件外都有）
            ...(!['columnContainer', 'group'].includes(selectedComponentData.type) ? [{
                key: 'basic',
                label: (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 0',
                        fontWeight: 500
                    }}>
                        <SettingOutlined style={{
                            marginRight: 8,
                            fontSize: '16px'
                        }} />
                        基础属性
                    </div>
                ),
                children: (
                    <div style={{
                        padding: '16px 12px',
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        marginTop: '8px',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Form layout="vertical" size="small">
                            <CommonProperties
                                component={selectedComponentData}
                                onPropertyChange={handlePropertyChange}
                            />
                        </Form>
                    </div>
                )
            }] : []),

            // 组件特定属性面板
            {
                key: 'specific',
                label: (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 0',
                        fontWeight: 500
                    }}>
                        <AppstoreOutlined style={{
                            marginRight: 8,
                            fontSize: '16px'
                        }} />
                        组件属性
                    </div>
                ),
                children: (
                    <div style={{
                        padding: '16px 12px',
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        marginTop: '8px',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Form layout="vertical" size="small">
                            {category === 'basic' && (
                                <BasicComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'layout' && (
                                <LayoutComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'option' && (
                                <OptionComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'media' && (
                                <MediaComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'content' && (
                                <ContentComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'project' && (
                                <ProjectComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'contract' && (
                                <ContractComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'article' && (
                                <ArticleComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                            {category === 'finance' && (
                                <FinanceComponents
                                    component={selectedComponentData}
                                    onPropertyChange={handlePropertyChange}
                                />
                            )}
                        </Form>
                    </div>
                )
            },

            // 样式属性面板（所有组件都显示）
            ...([{
                key: 'style',
                label: (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 0',
                        fontWeight: 500
                    }}>
                        <FormatPainterOutlined style={{
                            marginRight: 8,
                            fontSize: '16px'
                        }} />
                        样式设置
                    </div>
                ),
                children: (
                    <div style={{
                        padding: '16px 12px',
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        marginTop: '8px',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Form layout="vertical" size="small">
                            {renderStyleProperties()}
                        </Form>
                    </div>
                )
            }])
        ];

        return (
            <div style={{ padding: '4px' }}>
                <style>
                    {`
                        .property-panel-collapse .ant-collapse-item {
                            margin-bottom: 8px;
                            border: 1px solid #e8e8e8 !important;
                            border-radius: 8px !important;
                            overflow: hidden;
                        }
                        .property-panel-collapse .ant-collapse-header {
                            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                            border-radius: 8px 8px 0 0 !important;
                            padding: 12px 16px !important;
                            border-bottom: 1px solid #e8e8e8 !important;
                        }
                        .property-panel-collapse .ant-collapse-header:hover {
                            background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
                        }
                        .property-panel-collapse .ant-collapse-content {
                            border-radius: 0 0 8px 8px !important;
                            background: #fafafa !important;
                        }
                        .property-panel-collapse .ant-collapse-content-box {
                            padding: 0 !important;
                        }
                        .property-panel-collapse .ant-collapse-expand-icon {
                            color: #8c8c8c !important;
                            font-size: 14px !important;
                        }
                    `}
                </style>
                <Collapse
                    className="property-panel-collapse"
                    items={collapseItems}
                    defaultActiveKey={['basic']}
                    size="small"
                    expandIconPosition="end"
                    bordered={false}
                />
            </div>
        );
    };

    // 样式属性渲染函数
    const renderStyleProperties = () => {
        if (!selectedComponentData) return null;

        const showBorderSettings = selectedComponentData.style?.borderWidth && selectedComponentData.style?.borderWidth !== '0';
        const isCountdownComponent = selectedComponentData.type === 'countdown';
        const isQuotationComponent = selectedComponentData.type === 'quotation';

        // 报价单组件有自己特殊的样式设置
        if (isQuotationComponent) {
            return (
                <>
                    <Form.Item label="显示模式">
                        <Select
                            value={selectedComponentData.quotationDisplayMode || 'card'}
                            onChange={(value) => handlePropertyChange('quotationDisplayMode', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="card">卡片列表</Option>
                            <Option value="tabs">选项卡形式</Option>
                            <Option value="list">列表形式</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="背景颜色">
                        <ColorPicker
                            value={selectedComponentData.style?.backgroundColor || 'transparent'}
                            onChange={(color) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                backgroundColor: typeof color === 'string' ? color : color.toHexString()
                            })}
                            showText
                            allowClear
                            presets={[
                                { label: '推荐颜色', colors: ['#f0f8ff', '#f5f5f5', '#ffffff', '#fafafa', '#1890ff'] }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="内边距">
                        <Select
                            value={selectedComponentData.style?.padding || '16px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                padding: value
                            })}
                        >
                            <Option value="0px">无内边距</Option>
                            <Option value="8px">8px</Option>
                            <Option value="12px">12px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="24px">24px</Option>
                            <Option value="32px">32px</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="外边距">
                        <Select
                            value={selectedComponentData.style?.margin || '0'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                margin: value
                            })}
                        >
                            <Option value="0">无外边距</Option>
                            <Option value="8px">8px</Option>
                            <Option value="12px">12px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="24px">24px</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="圆角">
                        <Select
                            value={selectedComponentData.style?.borderRadius || '8px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                borderRadius: value
                            })}
                        >
                            <Option value="0">无圆角</Option>
                            <Option value="4px">小圆角</Option>
                            <Option value="8px">中圆角</Option>
                            <Option value="12px">大圆角</Option>
                            <Option value="16px">超大圆角</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="边框宽度">
                        <Select
                            value={selectedComponentData.style?.borderWidth || '1px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                borderWidth: value
                            })}
                        >
                            <Option value="0">无边框</Option>
                            <Option value="1px">1px</Option>
                            <Option value="2px">2px</Option>
                            <Option value="3px">3px</Option>
                        </Select>
                    </Form.Item>

                    {selectedComponentData.style?.borderWidth && selectedComponentData.style.borderWidth !== '0' && (
                        <>
                            <Form.Item label="边框样式">
                                <Select
                                    value={selectedComponentData.style?.borderStyle || 'solid'}
                                    onChange={(value) => handlePropertyChange('style', {
                                        ...selectedComponentData.style,
                                        borderStyle: value
                                    })}
                                >
                                    <Option value="solid">实线</Option>
                                    <Option value="dashed">虚线</Option>
                                    <Option value="dotted">点线</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="边框颜色">
                                <ColorPicker
                                    value={selectedComponentData.style?.borderColor || '#e8e8e8'}
                                    onChange={(color) => handlePropertyChange('style', {
                                        ...selectedComponentData.style,
                                        borderColor: typeof color === 'string' ? color : color.toHexString()
                                    })}
                                    showText
                                />
                            </Form.Item>
                        </>
                    )}
                </>
            );
        }

        // 倒计时组件有自己特殊的样式设置
        if (isCountdownComponent) {
            return (
                <>
                    <Form.Item label="字体大小">
                        <Select
                            value={selectedComponentData.style?.fontSize || '24px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                fontSize: value
                            })}
                        >
                            <Option value="14px">14px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="18px">18px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="24px">24px</Option>
                            <Option value="28px">28px</Option>
                            <Option value="32px">32px</Option>
                            <Option value="36px">36px</Option>
                            <Option value="48px">48px</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="字重">
                        <Select
                            value={selectedComponentData.style?.fontWeight || 'bold'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                fontWeight: value
                            })}
                        >
                            <Option value="300">细体</Option>
                            <Option value="400">正常</Option>
                            <Option value="500">中等</Option>
                            <Option value="600">半粗</Option>
                            <Option value="700">粗体</Option>
                            <Option value="800">很粗</Option>
                            <Option value="bold">加粗</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="文字颜色">
                        <ColorPicker
                            value={selectedComponentData.style?.color || '#1890ff'}
                            onChange={(color) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                color: color.toHexString()
                            })}
                            showText
                        />
                    </Form.Item>

                    <Form.Item label="背景颜色">
                        <ColorPicker
                            value={selectedComponentData.style?.backgroundColor || '#f0f8ff'}
                            onChange={(color) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                backgroundColor: color.toHexString()
                            })}
                            showText
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item label="内边距">
                        <Select
                            value={selectedComponentData.style?.padding || '16px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                padding: value
                            })}
                        >
                            <Option value="0px">0px</Option>
                            <Option value="8px">8px</Option>
                            <Option value="12px">12px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="24px">24px</Option>
                            <Option value="32px">32px</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="外边距">
                        <Select
                            value={selectedComponentData.style?.margin || '0px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                margin: value
                            })}
                        >
                            <Option value="0px">0px</Option>
                            <Option value="4px">4px</Option>
                            <Option value="8px">8px</Option>
                            <Option value="12px">12px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="24px">24px</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="边框宽度">
                        <Select
                            value={selectedComponentData.style?.borderWidth || '2px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                borderWidth: value
                            })}
                        >
                            <Option value="0px">无边框</Option>
                            <Option value="1px">1px</Option>
                            <Option value="2px">2px</Option>
                            <Option value="3px">3px</Option>
                            <Option value="4px">4px</Option>
                            <Option value="5px">5px</Option>
                        </Select>
                    </Form.Item>

                    {selectedComponentData.style?.borderWidth && selectedComponentData.style.borderWidth !== '0px' && (
                        <>
                            <Form.Item label="边框样式">
                                <Select
                                    value={selectedComponentData.style?.borderStyle || 'solid'}
                                    onChange={(value) => handlePropertyChange('style', {
                                        ...selectedComponentData.style,
                                        borderStyle: value
                                    })}
                                >
                                    <Option value="solid">实线</Option>
                                    <Option value="dashed">虚线</Option>
                                    <Option value="dotted">点线</Option>
                                    <Option value="double">双线</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="边框颜色">
                                <ColorPicker
                                    value={selectedComponentData.style?.borderColor || '#1890ff'}
                                    onChange={(color) => handlePropertyChange('style', {
                                        ...selectedComponentData.style,
                                        borderColor: color.toHexString()
                                    })}
                                    showText
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item label="圆角">
                        <Select
                            value={selectedComponentData.style?.borderRadius || '8px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                borderRadius: value
                            })}
                        >
                            <Option value="0px">无圆角</Option>
                            <Option value="2px">2px</Option>
                            <Option value="4px">4px</Option>
                            <Option value="6px">6px</Option>
                            <Option value="8px">8px</Option>
                            <Option value="12px">12px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="50%">圆形</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="文本对齐">
                        <Select
                            value={selectedComponentData.style?.textAlign || 'center'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                textAlign: value
                            })}
                        >
                            <Option value="left">左对齐</Option>
                            <Option value="center">居中对齐</Option>
                            <Option value="right">右对齐</Option>
                        </Select>
                    </Form.Item>
                </>
            );
        }

        // 其他组件的通用样式设置
        return (
            <>
                {/* 背景色 */}
                <Form.Item label="背景颜色">
                    <ColorPicker
                        value={selectedComponentData.style?.backgroundColor || 'transparent'}
                        onChange={(color) => handlePropertyChange('style', {
                            ...selectedComponentData.style,
                            backgroundColor: color.toHexString()
                        })}
                        showText
                        allowClear
                    />
                </Form.Item>

                {/* 内边距 */}
                <Form.Item label="内边距">
                    <Select
                        value={selectedComponentData.style?.padding || '0'}
                        onChange={(value) => handlePropertyChange('style', {
                            ...selectedComponentData.style,
                            padding: value
                        })}
                    >
                        <Option value="0">0px</Option>
                        <Option value="4px">4px</Option>
                        <Option value="8px">8px</Option>
                        <Option value="12px">12px</Option>
                        <Option value="16px">16px</Option>
                        <Option value="20px">20px</Option>
                    </Select>
                </Form.Item>

                {/* 外边距 */}
                <Form.Item label="外边距">
                    <Select
                        value={selectedComponentData.style?.margin || '0'}
                        onChange={(value) => handlePropertyChange('style', {
                            ...selectedComponentData.style,
                            margin: value
                        })}
                    >
                        <Option value="0">0px</Option>
                        <Option value="4px">4px</Option>
                        <Option value="8px">8px</Option>
                        <Option value="12px">12px</Option>
                        <Option value="16px">16px</Option>
                        <Option value="20px">20px</Option>
                    </Select>
                </Form.Item>

                {/* 边框设置 */}
                <Form.Item label="边框宽度">
                    <Select
                        value={selectedComponentData.style?.borderWidth || '0'}
                        onChange={(value) => handlePropertyChange('style', {
                            ...selectedComponentData.style,
                            borderWidth: value
                        })}
                    >
                        <Option value="0">无边框</Option>
                        <Option value="1px">1px</Option>
                        <Option value="2px">2px</Option>
                        <Option value="3px">3px</Option>
                        <Option value="4px">4px</Option>
                    </Select>
                </Form.Item>

                {showBorderSettings && (
                    <>
                        <Form.Item label="边框样式">
                            <Select
                                value={selectedComponentData.style?.borderStyle || 'solid'}
                                onChange={(value) => handlePropertyChange('style', {
                                    ...selectedComponentData.style,
                                    borderStyle: value
                                })}
                            >
                                <Option value="solid">实线</Option>
                                <Option value="dashed">虚线</Option>
                                <Option value="dotted">点线</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="边框颜色">
                            <ColorPicker
                                value={selectedComponentData.style?.borderColor || '#d9d9d9'}
                                onChange={(color) => handlePropertyChange('style', {
                                    ...selectedComponentData.style,
                                    borderColor: color.toHexString()
                                })}
                                showText
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item label="圆角">
                    <Select
                        value={selectedComponentData.style?.borderRadius || '4px'}
                        onChange={(value) => handlePropertyChange('style', {
                            ...selectedComponentData.style,
                            borderRadius: value
                        })}
                    >
                        <Option value="0">无圆角</Option>
                        <Option value="2px">2px</Option>
                        <Option value="4px">4px</Option>
                        <Option value="8px">8px</Option>
                        <Option value="12px">12px</Option>
                        <Option value="50%">圆形</Option>
                    </Select>
                </Form.Item>
            </>
        );

        // 图片组件的样式设置
        if (selectedComponentData.type === 'image') {
            return (
                <>
                    <Form.Item label="背景颜色">
                        <ColorPicker
                            value={selectedComponentData.style?.backgroundColor || 'transparent'}
                            onChange={(color) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                backgroundColor: typeof color === 'string' ? color : color.toHexString()
                            })}
                            showText
                            allowClear
                            presets={[
                                { label: '推荐颜色', colors: ['#f0f8ff', '#f5f5f5', '#ffffff', '#000000', '#1890ff'] }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="内边距">
                        <Input
                            value={selectedComponentData.style?.padding || '0'}
                            onChange={(e) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                padding: e.target.value
                            })}
                            placeholder="如：8px, 10px 15px"
                        />
                    </Form.Item>

                    <Form.Item label="外边距">
                        <Input
                            value={selectedComponentData.style?.margin || '0'}
                            onChange={(e) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                margin: e.target.value
                            })}
                            placeholder="如：8px, 10px 15px"
                        />
                    </Form.Item>

                    <Form.Item label="边框宽度">
                        <Select
                            value={selectedComponentData.style?.borderWidth || '1px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                borderWidth: value
                            })}
                            style={{ width: '100%' }}
                        >
                            <Option value="0">无边框</Option>
                            <Option value="1px">1px</Option>
                            <Option value="2px">2px</Option>
                            <Option value="3px">3px</Option>
                            <Option value="4px">4px</Option>
                            <Option value="5px">5px</Option>
                        </Select>
                    </Form.Item>

                    {selectedComponentData.style?.borderWidth !== '0' && (
                        <>
                            <Form.Item label="边框样式">
                                <Select
                                    value={selectedComponentData.style?.borderStyle || 'solid'}
                                    onChange={(value) => handlePropertyChange('style', {
                                        ...selectedComponentData.style,
                                        borderStyle: value
                                    })}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="solid">实线</Option>
                                    <Option value="dashed">虚线</Option>
                                    <Option value="dotted">点线</Option>
                                    <Option value="double">双线</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="边框颜色">
                                <ColorPicker
                                    value={selectedComponentData.style?.borderColor || '#d9d9d9'}
                                    onChange={(color) => handlePropertyChange('style', {
                                        ...selectedComponentData.style,
                                        borderColor: typeof color === 'string' ? color : color.toHexString()
                                    })}
                                    showText
                                    presets={[
                                        { label: '推荐颜色', colors: ['#d9d9d9', '#f0f0f0', '#bfbfbf', '#8c8c8c', '#595959'] }
                                    ]}
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item label="圆角">
                        <Select
                            value={selectedComponentData.style?.borderRadius || '4px'}
                            onChange={(value) => handlePropertyChange('style', {
                                ...selectedComponentData.style,
                                borderRadius: value
                            })}
                            style={{ width: '100%' }}
                        >
                            <Option value="0">无圆角</Option>
                            <Option value="2px">小圆角</Option>
                            <Option value="4px">中圆角</Option>
                            <Option value="8px">大圆角</Option>
                            <Option value="16px">超大圆角</Option>
                            <Option value="50%">圆形</Option>
                        </Select>
                    </Form.Item>
                </>
            );
        }

        // 其他组件使用通用样式设置组件
        return (
            <StyleProperties
                component={selectedComponentData}
                onPropertyChange={handlePropertyChange}
            />
        );
    };

    // 合并布局设置和主题设置
    const renderLayoutAndThemeProperties = () => (
        <Form layout="vertical" size="small">
            {/* 布局设置 */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#262626' }}>
                    布局设置
                </h4>

                <Form.Item label="表单内边距">
                    <Select
                        value={layout.padding || '16px'}
                        onChange={(value) => updateLayout({ padding: value })}
                    >
                        <Option value="8px">紧凑 (8px)</Option>
                        <Option value="16px">标准 (16px)</Option>
                        <Option value="24px">宽松 (24px)</Option>
                        <Option value="32px">很宽松 (32px)</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="组件间距">
                    <Select
                        value={layout.componentSpacing || '16px'}
                        onChange={(value) => updateLayout({ componentSpacing: value })}
                    >
                        <Option value="8px">紧凑 (8px)</Option>
                        <Option value="12px">较紧凑 (12px)</Option>
                        <Option value="16px">标准 (16px)</Option>
                        <Option value="20px">较宽松 (20px)</Option>
                        <Option value="24px">宽松 (24px)</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="标签位置">
                    <Select
                        value={layout.labelPosition || 'top'}
                        onChange={(value) => updateLayout({ labelPosition: value })}
                    >
                        <Option value="top">顶部</Option>
                        <Option value="left">左侧</Option>
                        <Option value="right">右侧</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="标签宽度" style={{ display: layout.labelPosition === 'left' || layout.labelPosition === 'right' ? 'block' : 'none' }}>
                    <Select
                        value={layout.labelWidth || '100px'}
                        onChange={(value) => updateLayout({ labelWidth: value })}
                    >
                        <Option value="80px">80px</Option>
                        <Option value="100px">100px</Option>
                        <Option value="120px">120px</Option>
                        <Option value="150px">150px</Option>
                        <Option value="200px">200px</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="表单最大宽度">
                    <Select
                        value={layout.maxWidth || 'none'}
                        onChange={(value) => updateLayout({ maxWidth: value })}
                    >
                        <Option value="none">不限制</Option>
                        <Option value="600px">600px</Option>
                        <Option value="800px">800px</Option>
                        <Option value="1000px">1000px</Option>
                        <Option value="1200px">1200px</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="表单对齐">
                    <Select
                        value={layout.alignment || 'left'}
                        onChange={(value) => updateLayout({ alignment: value })}
                    >
                        <Option value="left">左对齐</Option>
                        <Option value="center">居中</Option>
                        <Option value="right">右对齐</Option>
                    </Select>
                </Form.Item>
            </div>

            {/* 主题设置 */}
            <div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#262626' }}>
                    主题设置
                </h4>

                <Form.Item label="主色调">
                    <ColorPicker
                        value={theme.primaryColor || '#1890ff'}
                        onChange={(color) => updateTheme({ primaryColor: color?.toHexString() || '#1890ff' })}
                        showText
                    />
                </Form.Item>

                <Form.Item label="表单背景色">
                    <ColorPicker
                        value={theme.backgroundColor || '#ffffff'}
                        onChange={(color) => updateTheme({ backgroundColor: color?.toHexString() || '#ffffff' })}
                        showText
                    />
                </Form.Item>

                <Form.Item label="组件边框色">
                    <ColorPicker
                        value={theme.borderColor || '#d9d9d9'}
                        onChange={(color) => updateTheme({ borderColor: color?.toHexString() || '#d9d9d9' })}
                        showText
                    />
                </Form.Item>

                <Form.Item label="文字颜色">
                    <ColorPicker
                        value={theme.textColor || '#000000'}
                        onChange={(color) => updateTheme({ textColor: color?.toHexString() || '#000000' })}
                        showText
                    />
                </Form.Item>

                <Form.Item label="标签颜色">
                    <ColorPicker
                        value={theme.labelColor || '#262626'}
                        onChange={(color) => updateTheme({ labelColor: color?.toHexString() || '#262626' })}
                        showText
                    />
                </Form.Item>

                <Form.Item label="组件圆角">
                    <Select
                        value={theme.borderRadius || '6px'}
                        onChange={(value) => updateTheme({ borderRadius: value })}
                    >
                        <Option value="0px">无圆角</Option>
                        <Option value="2px">很小 (2px)</Option>
                        <Option value="4px">小 (4px)</Option>
                        <Option value="6px">标准 (6px)</Option>
                        <Option value="8px">大 (8px)</Option>
                        <Option value="12px">很大 (12px)</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="字体大小">
                    <Select
                        value={theme.fontSize || '14px'}
                        onChange={(value) => updateTheme({ fontSize: value })}
                    >
                        <Option value="12px">小 (12px)</Option>
                        <Option value="13px">较小 (13px)</Option>
                        <Option value="14px">标准 (14px)</Option>
                        <Option value="15px">较大 (15px)</Option>
                        <Option value="16px">大 (16px)</Option>
                        <Option value="18px">很大 (18px)</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="标签字体大小">
                    <Select
                        value={theme.labelFontSize || '14px'}
                        onChange={(value) => updateTheme({ labelFontSize: value })}
                    >
                        <Option value="12px">小 (12px)</Option>
                        <Option value="13px">较小 (13px)</Option>
                        <Option value="14px">标准 (14px)</Option>
                        <Option value="15px">较大 (15px)</Option>
                        <Option value="16px">大 (16px)</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="组件阴影">
                    <Select
                        value={theme.boxShadow || 'none'}
                        onChange={(value) => updateTheme({ boxShadow: value })}
                    >
                        <Option value="none">无阴影</Option>
                        <Option value="0 1px 2px rgba(0,0,0,0.1)">轻微阴影</Option>
                        <Option value="0 2px 4px rgba(0,0,0,0.1)">标准阴影</Option>
                        <Option value="0 4px 8px rgba(0,0,0,0.15)">明显阴影</Option>
                        <Option value="0 8px 16px rgba(0,0,0,0.2)">强烈阴影</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="表单边框">
                    <Switch
                        checked={theme.showFormBorder || false}
                        onChange={(checked) => updateTheme({ showFormBorder: checked })}
                    />
                </Form.Item>

                <Form.Item label="紧凑模式">
                    <Switch
                        checked={theme.compactMode || false}
                        onChange={(checked) => updateTheme({ compactMode: checked })}
                    />
                </Form.Item>
            </div>

            {/* 说明文字设置 */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#262626' }}>
                    说明文字设置
                </h4>

                <Form.Item label="说明文字位置">
                    <Select
                        value={theme.descriptionPosition || 'bottom'}
                        onChange={(value) => updateTheme({ descriptionPosition: value })}
                    >
                        <Option value="bottom">底部</Option>
                        <Option value="top">顶部</Option>
                        <Option value="right">右侧</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="说明文字大小">
                    <Select
                        value={theme.descriptionFontSize || '12px'}
                        onChange={(value) => updateTheme({ descriptionFontSize: value })}
                    >
                        <Option value="10px">很小 (10px)</Option>
                        <Option value="11px">小 (11px)</Option>
                        <Option value="12px">标准 (12px)</Option>
                        <Option value="13px">较大 (13px)</Option>
                        <Option value="14px">大 (14px)</Option>
                        <Option value="15px">很大 (15px)</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="说明文字颜色">
                    <ColorPicker
                        value={theme.descriptionColor || '#8c8c8c'}
                        onChange={(color) => updateTheme({ descriptionColor: color?.toHexString() || '#8c8c8c' })}
                        showText
                    />
                </Form.Item>
            </div>
        </Form>
    );

    // 新增逻辑设置
    const renderLogicProperties = () => {
        // 获取全局逻辑规则（从store或layout中获取）
        const logicRules = layout.logicRules || [];

        // 获取所有可用的组件选项（用于选择源组件和目标组件）
        const getComponentOptions = () => {
            return components.map(comp => ({
                value: comp.id,
                label: `${comp.label || comp.type} (${comp.id})`
            }));
        };

        // 添加新的逻辑规则
        const addLogicRule = (type: 'linkage' | 'visibility') => {
            const newRule = {
                id: Date.now().toString(),
                type,
                sourceComponent: '',
                condition: 'equals',
                value: '',
                targetComponent: '',
                action: type === 'linkage' ? 'setValue' : 'hidden',
                targetValue: type === 'linkage' ? '' : undefined
            };

            const updatedRules = [...logicRules, newRule];
            updateLayout({ ...layout, logicRules: updatedRules });
        };

        // 删除逻辑规则
        const removeLogicRule = (ruleId: string) => {
            const updatedRules = logicRules.filter((rule: any) => rule.id !== ruleId);
            updateLayout({ ...layout, logicRules: updatedRules });
        };

        // 更新逻辑规则
        const updateLogicRule = (ruleId: string, field: string, value: any) => {
            const updatedRules = logicRules.map((rule: any) =>
                rule.id === ruleId ? { ...rule, [field]: value } : rule
            );
            updateLayout({ ...layout, logicRules: updatedRules });
        };

        // 渲染单个逻辑规则
        const renderLogicRule = (rule: any, index: number) => {
            const isLinkage = rule.type === 'linkage';
            const componentOptions = getComponentOptions();

            return (
                <div key={rule.id} style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: '#fafafa'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                    }}>
                        <span style={{ fontWeight: 500, color: '#262626' }}>
                            {isLinkage ? '联动性逻辑' : '可见性逻辑'} #{index + 1}
                        </span>
                        <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => removeLogicRule(rule.id)}
                        >
                            删除
                        </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {/* 条件设置 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ minWidth: '30px' }}>当</span>
                            <Select
                                style={{ minWidth: '120px' }}
                                value={rule.sourceComponent}
                                onChange={(value) => updateLogicRule(rule.id, 'sourceComponent', value)}
                                placeholder="选择组件"
                                size="small"
                            >
                                {componentOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                            <span>的值</span>
                            <Select
                                style={{ minWidth: '80px' }}
                                value={rule.condition}
                                onChange={(value) => updateLogicRule(rule.id, 'condition', value)}
                                size="small"
                            >
                                <Option value="equals">等于</Option>
                                <Option value="greater">大于</Option>
                                <Option value="less">小于</Option>
                                <Option value="notEquals">不等于</Option>
                                <Option value="contains">包含</Option>
                                <Option value="notContains">不包含</Option>
                            </Select>
                            {(() => {
                                // 检查源组件是否为选择类组件，如果是则显示选项选择器
                                const sourceComponent = components.find(c => c.id === rule.sourceComponent);
                                if (sourceComponent && ['select', 'radio'].includes(sourceComponent.type) && sourceComponent.options) {
                                    return (
                                        <Select
                                            style={{ minWidth: '100px' }}
                                            value={rule.value}
                                            onChange={(value) => updateLogicRule(rule.id, 'value', value)}
                                            placeholder="选择值"
                                            size="small"
                                        >
                                            {sourceComponent.options.map(option => (
                                                <Option key={option.value} value={option.value}>
                                                    {option.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    );
                                } else {
                                    return (
                                        <Input
                                            style={{ minWidth: '100px' }}
                                            value={rule.value}
                                            onChange={(e) => updateLogicRule(rule.id, 'value', e.target.value)}
                                            placeholder="输入值"
                                            size="small"
                                        />
                                    );
                                }
                            })()}
                            <span>时</span>
                        </div>

                        {/* 动作设置 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ minWidth: '30px' }}>设置</span>
                            {isLinkage ? (
                                <>
                                    <Select
                                        style={{ minWidth: '120px' }}
                                        value={rule.targetComponent}
                                        onChange={(value) => updateLogicRule(rule.id, 'targetComponent', value)}
                                        placeholder="选择组件"
                                        size="small"
                                    >
                                        {componentOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                    <span>的值为</span>
                                    <Input
                                        style={{ minWidth: '100px' }}
                                        value={rule.targetValue || ''}
                                        onChange={(e) => updateLogicRule(rule.id, 'targetValue', e.target.value)}
                                        placeholder="输入值"
                                        size="small"
                                    />
                                </>
                            ) : (
                                <>
                                    <Select
                                        style={{ minWidth: '120px' }}
                                        value={rule.targetComponent}
                                        onChange={(value) => updateLogicRule(rule.id, 'targetComponent', value)}
                                        placeholder="选择组件"
                                        size="small"
                                    >
                                        {componentOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                    <Select
                                        style={{ minWidth: '80px' }}
                                        value={rule.action}
                                        onChange={(value) => updateLogicRule(rule.id, 'action', value)}
                                        size="small"
                                    >
                                        <Option value="visible">显示</Option>
                                        <Option value="hidden">隐藏</Option>
                                        <Option value="admin">管理员可见</Option>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <Form layout="vertical" size="small">
                {/* 逻辑规则列表 */}
                <div style={{ marginBottom: '16px' }}>
                    {logicRules.map((rule: any, index: number) => renderLogicRule(rule, index))}
                </div>

                {/* 添加逻辑按钮 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="dashed"
                        onClick={() => addLogicRule('linkage')}
                        style={{ flex: 1 }}
                        size="small"
                    >
                        + 添加联动性逻辑
                    </Button>
                    <Button
                        type="dashed"
                        onClick={() => addLogicRule('visibility')}
                        style={{ flex: 1 }}
                        size="small"
                    >
                        + 添加可见性逻辑
                    </Button>
                </div>

                {logicRules.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#8c8c8c',
                        fontSize: '13px'
                    }}>
                        暂无全局逻辑规则，点击上方按钮添加
                    </div>
                )}
            </Form>
        );
    };

    return (
        <Card
            title={
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: 600
                }}>
                    <SettingOutlined style={{ marginRight: 8 }} />
                    属性配置
                </div>
            }
            size="small"
            style={{
                height: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
            styles={{
                body: {
                    padding: '8px',
                    height: 'calc(100% - 57px)',
                    overflow: 'auto',
                    backgroundColor: '#f8f9fa'
                },
                header: {
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    borderBottom: '1px solid #e8e8e8'
                }
            }}
        >
            <Tabs
                defaultActiveKey="component"
                size="small"
                style={{
                    height: '100%'
                }}
                items={[
                    {
                        key: 'component',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <AppstoreOutlined style={{ marginRight: 6 }} />
                                组件设置
                            </span>
                        ),
                        children: renderComponentProperties()
                    },
                    {
                        key: 'logic',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <BranchesOutlined style={{ marginRight: 6 }} />
                                逻辑设置
                            </span>
                        ),
                        children: renderLogicProperties()
                    },
                    {
                        key: 'layout-theme',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <FormatPainterOutlined style={{ marginRight: 6 }} />
                                布局主题
                            </span>
                        ),
                        children: renderLayoutAndThemeProperties()
                    }
                ]}
            />
        </Card>
    );
};

export default PropertyPanel;
