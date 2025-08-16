import React from 'react';
import { Card, Form, Tabs, Collapse, ColorPicker, Select, Switch, Input, InputNumber, Button } from 'antd';
import { DeleteOutlined, EyeOutlined, SwapOutlined, ToolOutlined, ControlOutlined, BulbOutlined } from '@ant-design/icons';
import { SettingOutlined, AppstoreOutlined, FormatPainterOutlined, BranchesOutlined } from '@ant-design/icons';
import { getLinearIcon } from './utils/iconUtils';
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
            // 基础属性面板（除分栏容器外都有）
            ...(!['columnContainer'].includes(selectedComponentData.type) ? [{
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
            <div>
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
        <div>
            <Form layout="vertical" size="small">
                {/* 🎯 布局配置 */}
                <div style={{
                    marginBottom: '32px',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            marginRight: '8px',
                            color: '#1890ff',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            {getLinearIcon('settings')}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                            布局配置
                        </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Form.Item label="表单内边距" style={{ marginBottom: '12px' }}>
                            <Select
                                value={layout.padding || '16px'}
                                onChange={(value) => updateLayout({ padding: value })}
                                size="small"
                            >
                                <Option value="8px">紧凑 (8px)</Option>
                                <Option value="16px">标准 (16px)</Option>
                                <Option value="24px">宽松 (24px)</Option>
                                <Option value="32px">很宽松 (32px)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="组件间距" style={{ marginBottom: '12px' }}>
                            <Select
                                value={layout.componentSpacing || '16px'}
                                onChange={(value) => updateLayout({ componentSpacing: value })}
                                size="small"
                            >
                                <Option value="8px">紧凑 (8px)</Option>
                                <Option value="12px">较紧凑 (12px)</Option>
                                <Option value="16px">标准 (16px)</Option>
                                <Option value="20px">较宽松 (20px)</Option>
                                <Option value="24px">宽松 (24px)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="标签位置" style={{ marginBottom: '12px' }}>
                            <Select
                                value={layout.labelPosition || 'top'}
                                onChange={(value) => updateLayout({ labelPosition: value })}
                                size="small"
                            >
                                <Option value="top">顶部</Option>
                                <Option value="left">左侧</Option>
                                <Option value="right">右侧</Option>
                            </Select>
                        </Form.Item>

                        {(layout.labelPosition === 'left' || layout.labelPosition === 'right') && (
                            <Form.Item label="标签宽度" style={{ marginBottom: '12px' }}>
                                <Select
                                    value={layout.labelWidth || '100px'}
                                    onChange={(value) => updateLayout({ labelWidth: value })}
                                    size="small"
                                >
                                    <Option value="80px">80px</Option>
                                    <Option value="100px">100px</Option>
                                    <Option value="120px">120px</Option>
                                    <Option value="150px">150px</Option>
                                    <Option value="200px">200px</Option>
                                </Select>
                            </Form.Item>
                        )}

                        <Form.Item label="表单最大宽度" style={{ marginBottom: '12px' }}>
                            <Select
                                value={layout.maxWidth || 'none'}
                                onChange={(value) => updateLayout({ maxWidth: value })}
                                size="small"
                            >
                                <Option value="none">不限制</Option>
                                <Option value="600px">600px</Option>
                                <Option value="800px">800px</Option>
                                <Option value="1000px">1000px</Option>
                                <Option value="1200px">1200px</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="表单对齐" style={{ marginBottom: '12px' }}>
                            <Select
                                value={layout.alignment || 'left'}
                                onChange={(value) => updateLayout({ alignment: value })}
                                size="small"
                            >
                                <Option value="left">左对齐</Option>
                                <Option value="center">居中</Option>
                                <Option value="right">右对齐</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                {/* 🎨 颜色主题 */}
                <div style={{
                    marginBottom: '32px',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            marginRight: '8px',
                            color: '#1890ff',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            {getLinearIcon('eye')}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                            颜色主题
                        </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Form.Item label="主色调" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.primaryColor || '#1890ff'}
                                onChange={(color) => updateTheme({ primaryColor: color?.toHexString() || '#1890ff' })}
                                showText
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="表单背景色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.backgroundColor || '#ffffff'}
                                onChange={(color) => updateTheme({ backgroundColor: color?.toHexString() || '#ffffff' })}
                                showText
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="组件边框色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.borderColor || '#d9d9d9'}
                                onChange={(color) => updateTheme({ borderColor: color?.toHexString() || '#d9d9d9' })}
                                showText
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="文字颜色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.textColor || '#000000'}
                                onChange={(color) => updateTheme({ textColor: color?.toHexString() || '#000000' })}
                                showText
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="按钮文本颜色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.buttonTextColor || '#ffffff'}
                                onChange={(color) => updateTheme({ buttonTextColor: color?.toHexString() || '#ffffff' })}
                                showText
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="标签颜色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.labelColor || '#262626'}
                                onChange={(color) => updateTheme({ labelColor: color?.toHexString() || '#262626' })}
                                showText
                                size="small"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* ✨ 视觉效果 */}
                <div style={{
                    marginBottom: '32px',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            marginRight: '8px',
                            color: '#1890ff',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            {getLinearIcon('star')}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                            视觉效果
                        </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Form.Item label="组件圆角" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.borderRadius || '6px'}
                                onChange={(value) => updateTheme({ borderRadius: value })}
                                size="small"
                            >
                                <Option value="0px">无圆角</Option>
                                <Option value="2px">很小 (2px)</Option>
                                <Option value="4px">小 (4px)</Option>
                                <Option value="6px">标准 (6px)</Option>
                                <Option value="8px">大 (8px)</Option>
                                <Option value="12px">很大 (12px)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="组件阴影" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.boxShadow || 'none'}
                                onChange={(value) => updateTheme({ boxShadow: value })}
                                size="small"
                            >
                                <Option value="none">无阴影</Option>
                                <Option value="0 1px 2px rgba(0,0,0,0.1)">轻微阴影</Option>
                                <Option value="0 2px 4px rgba(0,0,0,0.1)">标准阴影</Option>
                                <Option value="0 4px 8px rgba(0,0,0,0.15)">明显阴影</Option>
                                <Option value="0 8px 16px rgba(0,0,0,0.2)">强烈阴影</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="表单边框" style={{ marginBottom: '12px' }}>
                            <Switch
                                checked={theme.showFormBorder || false}
                                onChange={(checked) => updateTheme({ showFormBorder: checked })}
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="紧凑模式" style={{ marginBottom: '12px' }}>
                            <Switch
                                checked={theme.compactMode || false}
                                onChange={(checked) => updateTheme({ compactMode: checked })}
                                size="small"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* 📝 字体设置 */}
                <div style={{
                    marginBottom: '32px',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            marginRight: '8px',
                            color: '#1890ff',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            {getLinearIcon('text')}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                            字体设置
                        </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Form.Item label="字体大小" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.fontSize || '14px'}
                                onChange={(value) => updateTheme({ fontSize: value })}
                                size="small"
                            >
                                <Option value="12px">小 (12px)</Option>
                                <Option value="13px">较小 (13px)</Option>
                                <Option value="14px">标准 (14px)</Option>
                                <Option value="15px">较大 (15px)</Option>
                                <Option value="16px">大 (16px)</Option>
                                <Option value="18px">很大 (18px)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="标签字体大小" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.labelFontSize || '14px'}
                                onChange={(value) => updateTheme({ labelFontSize: value })}
                                size="small"
                            >
                                <Option value="12px">小 (12px)</Option>
                                <Option value="13px">较小 (13px)</Option>
                                <Option value="14px">标准 (14px)</Option>
                                <Option value="15px">较大 (15px)</Option>
                                <Option value="16px">大 (16px)</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                {/* 💬 说明文字 */}
                <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            marginRight: '8px',
                            color: '#1890ff',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            {getLinearIcon('message')}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                            说明文字
                        </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <Form.Item label="显示位置" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.descriptionPosition || 'bottom'}
                                onChange={(value) => updateTheme({ descriptionPosition: value })}
                                size="small"
                            >
                                <Option value="bottom">底部</Option>
                                <Option value="top">顶部</Option>
                                <Option value="right">右侧</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="字体大小" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.descriptionFontSize || '12px'}
                                onChange={(value) => updateTheme({ descriptionFontSize: value })}
                                size="small"
                            >
                                <Option value="10px">很小 (10px)</Option>
                                <Option value="11px">小 (11px)</Option>
                                <Option value="12px">标准 (12px)</Option>
                                <Option value="13px">较大 (13px)</Option>
                                <Option value="14px">大 (14px)</Option>
                                <Option value="15px">很大 (15px)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="文字颜色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.descriptionColor || '#8c8c8c'}
                                onChange={(color) => updateTheme({ descriptionColor: color?.toHexString() || '#8c8c8c' })}
                                showText
                                size="small"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* 📋 表单标题 */}
                <div style={{
                    marginBottom: '32px',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            marginRight: '8px',
                            color: '#1890ff',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            {getLinearIcon('text')}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                            表单标题
                        </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Form.Item label="对齐方式" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formTitleAlign || 'center'}
                                onChange={(value) => updateTheme({ formTitleAlign: value })}
                                size="small"
                            >
                                <Option value="left">左对齐</Option>
                                <Option value="center">居中</Option>
                                <Option value="right">右对齐</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="字体大小" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formTitleFontSize || '28px'}
                                onChange={(value) => updateTheme({ formTitleFontSize: value })}
                                size="small"
                            >
                                <Option value="20px">小 (20px)</Option>
                                <Option value="24px">较小 (24px)</Option>
                                <Option value="28px">标准 (28px)</Option>
                                <Option value="32px">较大 (32px)</Option>
                                <Option value="36px">大 (36px)</Option>
                                <Option value="40px">很大 (40px)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="字体颜色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.formTitleColor || theme.textColor || '#262626'}
                                onChange={(color) => updateTheme({ formTitleColor: color?.toHexString() || '#262626' })}
                                showText
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="字体粗细" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formTitleFontWeight || '600'}
                                onChange={(value) => updateTheme({ formTitleFontWeight: value })}
                                size="small"
                            >
                                <Option value="400">正常</Option>
                                <Option value="500">中等</Option>
                                <Option value="600">半粗体</Option>
                                <Option value="700">粗体</Option>
                                <Option value="800">很粗</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="下边距" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formTitleMarginBottom || '16px'}
                                onChange={(value) => updateTheme({ formTitleMarginBottom: value })}
                                size="small"
                            >
                                <Option value="8px">小 (8px)</Option>
                                <Option value="12px">较小 (12px)</Option>
                                <Option value="16px">标准 (16px)</Option>
                                <Option value="20px">较大 (20px)</Option>
                                <Option value="24px">大 (24px)</Option>
                                <Option value="32px">很大 (32px)</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                {/* 📄 表单描述 */}
                <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            marginRight: '8px',
                            color: '#1890ff',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            {getLinearIcon('file')}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#262626' }}>
                            表单描述
                        </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Form.Item label="对齐方式" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formDescriptionAlign || 'center'}
                                onChange={(value) => updateTheme({ formDescriptionAlign: value })}
                                size="small"
                            >
                                <Option value="left">左对齐</Option>
                                <Option value="center">居中</Option>
                                <Option value="right">右对齐</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="字体大小" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formDescriptionFontSize || '16px'}
                                onChange={(value) => updateTheme({ formDescriptionFontSize: value })}
                                size="small"
                            >
                                <Option value="12px">小 (12px)</Option>
                                <Option value="14px">较小 (14px)</Option>
                                <Option value="16px">标准 (16px)</Option>
                                <Option value="18px">较大 (18px)</Option>
                                <Option value="20px">大 (20px)</Option>
                                <Option value="22px">很大 (22px)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="字体颜色" style={{ marginBottom: '12px' }}>
                            <ColorPicker
                                value={theme.formDescriptionColor || theme.descriptionColor || '#8c8c8c'}
                                onChange={(color) => updateTheme({ formDescriptionColor: color?.toHexString() || '#8c8c8c' })}
                                showText
                                size="small"
                            />
                        </Form.Item>

                        <Form.Item label="行高" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formDescriptionLineHeight || '1.6'}
                                onChange={(value) => updateTheme({ formDescriptionLineHeight: value })}
                                size="small"
                            >
                                <Option value="1.2">紧凑 (1.2)</Option>
                                <Option value="1.4">较紧 (1.4)</Option>
                                <Option value="1.6">标准 (1.6)</Option>
                                <Option value="1.8">较松 (1.8)</Option>
                                <Option value="2.0">宽松 (2.0)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="下边距" style={{ marginBottom: '12px' }}>
                            <Select
                                value={theme.formDescriptionMarginBottom || '32px'}
                                onChange={(value) => updateTheme({ formDescriptionMarginBottom: value })}
                                size="small"
                            >
                                <Option value="16px">小 (16px)</Option>
                                <Option value="20px">较小 (20px)</Option>
                                <Option value="24px">中等 (24px)</Option>
                                <Option value="32px">标准 (32px)</Option>
                                <Option value="40px">较大 (40px)</Option>
                                <Option value="48px">大 (48px)</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </div>
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
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: '#fafafa',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}>
                    {/* 规则类型标识 */}
                    <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '12px',
                        backgroundColor: isLinkage ? '#52c41a' : '#1890ff',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 500
                    }}>
                        {isLinkage ? (
                            <>
                                <SwapOutlined style={{ fontSize: '10px', marginRight: '4px' }} />
                                联动
                            </>
                        ) : (
                            <>
                                <EyeOutlined style={{ fontSize: '10px', marginRight: '4px' }} />
                                可见性
                            </>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        marginTop: '8px'
                    }}>
                        <span style={{ fontWeight: 600, color: '#262626', fontSize: '14px' }}>
                            规则 #{index + 1}
                        </span>
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => removeLogicRule(rule.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #d9d9d9',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#ff4d4f';
                                e.currentTarget.style.borderColor = '#ff4d4f';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                e.currentTarget.style.borderColor = '#d9d9d9';
                                e.currentTarget.style.color = '';
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* 条件设置 */}
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '6px',
                            padding: '12px',
                            border: '1px solid #e8e8e8'
                        }}>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <ControlOutlined style={{ marginRight: '6px', fontSize: '12px' }} />
                                触发条件
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                    minWidth: '24px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#595959'
                                }}>当</span>
                                <Select
                                    style={{ minWidth: '140px' }}
                                    value={rule.sourceComponent}
                                    onChange={(value) => updateLogicRule(rule.id, 'sourceComponent', value)}
                                    placeholder="选择源组件"
                                    size="small"
                                >
                                    {componentOptions.map(option => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                                <span style={{ fontSize: '13px', color: '#595959' }}>的值</span>
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
                                                style={{ minWidth: '120px' }}
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
                                                style={{ minWidth: '120px' }}
                                                value={rule.value}
                                                onChange={(e) => updateLogicRule(rule.id, 'value', e.target.value)}
                                                placeholder="输入触发值"
                                                size="small"
                                            />
                                        );
                                    }
                                })()}
                                <span style={{ fontSize: '13px', color: '#595959' }}>时</span>
                            </div>
                        </div>

                        {/* 动作设置 */}
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRadius: '6px',
                            padding: '12px',
                            border: '1px solid #d9d9d9'
                        }}>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {isLinkage ? (
                                    <>
                                        <SwapOutlined style={{ marginRight: '6px', fontSize: '12px' }} />
                                        执行动作
                                    </>
                                ) : (
                                    <>
                                        <EyeOutlined style={{ marginRight: '6px', fontSize: '12px' }} />
                                        可见性控制
                                    </>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                    minWidth: '30px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#595959'
                                }}>设置</span>
                                {isLinkage ? (
                                    <>
                                        <Select
                                            style={{ minWidth: '140px' }}
                                            value={rule.targetComponent}
                                            onChange={(value) => updateLogicRule(rule.id, 'targetComponent', value)}
                                            placeholder="选择目标组件"
                                            size="small"
                                        >
                                            {componentOptions.map(option => (
                                                <Option key={option.value} value={option.value}>
                                                    {option.label}
                                                </Option>
                                            ))}
                                        </Select>
                                        <span style={{ fontSize: '13px', color: '#595959' }}>的值为</span>
                                        <Input
                                            style={{ minWidth: '120px' }}
                                            value={rule.targetValue || ''}
                                            onChange={(e) => updateLogicRule(rule.id, 'targetValue', e.target.value)}
                                            placeholder="输入目标值"
                                            size="small"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Select
                                            style={{ minWidth: '140px' }}
                                            value={rule.targetComponent}
                                            onChange={(value) => updateLogicRule(rule.id, 'targetComponent', value)}
                                            placeholder="选择目标组件"
                                            size="small"
                                        >
                                            {componentOptions.map(option => (
                                                <Option key={option.value} value={option.value}>
                                                    {option.label}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Select
                                            style={{ minWidth: '100px' }}
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
                </div>
            );
        };

        return (
            <div>
                {/* 逻辑规则列表 */}
                <div style={{ marginBottom: '16px' }}>
                    {logicRules.map((rule: any, index: number) => renderLogicRule(rule, index))}
                </div>

                {logicRules.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '32px 16px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        border: '1px dashed #d9d9d9',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '12px',
                            opacity: 0.3,
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <ToolOutlined />
                        </div>
                        <div style={{
                            fontSize: '14px',
                            marginBottom: '4px',
                            fontWeight: 500
                        }}>
                            暂无逻辑规则
                        </div>
                        <div style={{
                            fontSize: '12px'
                        }}>
                            点击下方按钮添加智能逻辑控制
                        </div>
                    </div>
                )}

                {/* 添加逻辑按钮 */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '8px'
                }}>
                    <Button
                        type="dashed"
                        onClick={() => addLogicRule('visibility')}
                        style={{
                            flex: 1,
                            height: '36px'
                        }}
                        size="small"
                    >
                        <EyeOutlined style={{ fontSize: '12px' }} />
                        <span style={{ marginLeft: '4px' }}>可见性逻辑</span>
                    </Button>
                    <Button
                        type="dashed"
                        onClick={() => addLogicRule('linkage')}
                        style={{
                            flex: 1,
                            height: '36px'
                        }}
                        size="small"
                    >
                        <SwapOutlined style={{ fontSize: '12px' }} />
                        <span style={{ marginLeft: '4px' }}>联动逻辑</span>
                    </Button>
                </div>

                <div style={{
                    fontSize: '11px',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <BulbOutlined style={{ marginRight: '4px', fontSize: '11px' }} />
                    逻辑规则仅在预览模式下生效
                </div>
            </div>
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
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
            styles={{
                body: {
                    padding: '8px',
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
                items={[
                    {
                        key: 'component',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <AppstoreOutlined style={{ marginRight: 8 }} />
                                组件设置
                            </span>
                        ),
                        children: renderComponentProperties()
                    },
                    {
                        key: 'logic',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <BranchesOutlined style={{ marginRight: 8 }} />
                                逻辑设置
                            </span>
                        ),
                        children: renderLogicProperties()
                    },
                    {
                        key: 'layout-theme',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <FormatPainterOutlined style={{ marginRight: 8 }} />
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
