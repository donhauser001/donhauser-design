import React from 'react';
import { Card, Form, Tabs, Collapse, ColorPicker, Select, Switch } from 'antd';
import { SettingOutlined, AppstoreOutlined, FormatPainterOutlined } from '@ant-design/icons';
import { useFormDesignerStore } from '../../stores/formDesignerStore';

// 导入各种属性面板组件
import CommonProperties from './PropertyPanels/CommonProperties';
import BasicComponents from './PropertyPanels/BasicComponents';
import LayoutComponents from './PropertyPanels/LayoutComponents';
import OptionComponents from './PropertyPanels/OptionComponents';
import MediaComponents from './PropertyPanels/MediaComponents';
import ContentComponents from './PropertyPanels/ContentComponents';
import ProjectComponents from './PropertyPanels/ProjectComponents';

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

            if (basicTypes.includes(selectedComponentData.type)) return 'basic';
            if (layoutTypes.includes(selectedComponentData.type)) return 'layout';
            if (optionTypes.includes(selectedComponentData.type)) return 'option';
            if (mediaTypes.includes(selectedComponentData.type)) return 'media';
            if (contentTypes.includes(selectedComponentData.type)) return 'content';
            if (projectTypes.includes(selectedComponentData.type)) return 'project';
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
                        </Form>
                    </div>
                )
            },

            // 样式属性面板（仅特定组件显示）
            ...(['presetText', 'image', 'countdown', 'quotation'].includes(selectedComponentData.type) ? [{
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
            }] : [])
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
    };

    const renderLayoutProperties = () => (
        <Form layout="vertical" size="small">
            <Form.Item label="栅格列数">
                <Select
                    value={layout.columns}
                    onChange={(value) => updateLayout({ columns: value })}
                >
                    <Option value={1}>1列</Option>
                    <Option value={2}>2列</Option>
                    <Option value={3}>3列</Option>
                    <Option value={4}>4列</Option>
                </Select>
            </Form.Item>

            <Form.Item label="栅格间距">
                <Select
                    value={layout.gutter}
                    onChange={(value) => updateLayout({ gutter: value })}
                >
                    <Option value={8}>8px</Option>
                    <Option value={16}>16px</Option>
                    <Option value={24}>24px</Option>
                    <Option value={32}>32px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="响应式">
                <Switch
                    checked={layout.responsive}
                    onChange={(checked) => updateLayout({ responsive: checked })}
                />
            </Form.Item>
        </Form>
    );

    const renderThemeProperties = () => (
        <Form layout="vertical" size="small">
            <Form.Item label="主色调">
                <ColorPicker
                    value={theme.primaryColor}
                    onChange={(color) => updateTheme({ primaryColor: color?.toHexString() || '#1890ff' })}
                    showText
                />
            </Form.Item>

            <Form.Item label="背景色">
                <ColorPicker
                    value={theme.backgroundColor}
                    onChange={(color) => updateTheme({ backgroundColor: color?.toHexString() || '#ffffff' })}
                    showText
                />
            </Form.Item>

            <Form.Item label="边框色">
                <ColorPicker
                    value={theme.borderColor}
                    onChange={(color) => updateTheme({ borderColor: color?.toHexString() || '#d9d9d9' })}
                    showText
                />
            </Form.Item>

            <Form.Item label="圆角">
                <Select
                    value={theme.borderRadius}
                    onChange={(value) => updateTheme({ borderRadius: value })}
                >
                    <Option value="0px">无圆角</Option>
                    <Option value="4px">小圆角</Option>
                    <Option value="6px">中圆角</Option>
                    <Option value="8px">大圆角</Option>
                </Select>
            </Form.Item>

            <Form.Item label="字体大小">
                <Select
                    value={theme.fontSize}
                    onChange={(value) => updateTheme({ fontSize: value })}
                >
                    <Option value="12px">12px</Option>
                    <Option value="14px">14px</Option>
                    <Option value="16px">16px</Option>
                    <Option value="18px">18px</Option>
                </Select>
            </Form.Item>
        </Form>
    );

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
                                组件属性
                            </span>
                        ),
                        children: renderComponentProperties()
                    },
                    {
                        key: 'layout',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <SettingOutlined style={{ marginRight: 6 }} />
                                布局设置
                            </span>
                        ),
                        children: renderLayoutProperties()
                    },
                    {
                        key: 'theme',
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                <FormatPainterOutlined style={{ marginRight: 6 }} />
                                主题设置
                            </span>
                        ),
                        children: renderThemeProperties()
                    }
                ]}
            />
        </Card>
    );
};

export default PropertyPanel;
