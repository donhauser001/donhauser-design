import React from 'react';
import { Card, Form, Input, Switch, Select, Button, Space, Tabs, ColorPicker } from 'antd';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import { FormComponent, ValidationRule } from '../../types/formDesigner';

const { TextArea } = Input;
const { Option } = Select;
// 使用 items API 替代 TabPane

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

        return (
            <Form layout="vertical" size="small">
                <Form.Item label="标签">
                    <Input
                        value={selectedComponentData.label}
                        onChange={(e) => handlePropertyChange('label', e.target.value)}
                        placeholder="请输入标签"
                    />
                </Form.Item>

                {['input', 'textarea', 'number'].includes(selectedComponentData.type) && (
                    <Form.Item label="占位符">
                        <Input
                            value={selectedComponentData.placeholder}
                            onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                            placeholder="请输入占位符"
                        />
                    </Form.Item>
                )}

                {selectedComponentData.type === 'presetText' && (
                    <Form.Item label="文本内容">
                        <TextArea
                            value={selectedComponentData.content}
                            onChange={(e) => handlePropertyChange('content', e.target.value)}
                            placeholder="请输入预设文本内容"
                            rows={4}
                        />
                    </Form.Item>
                )}

                <Form.Item label="必填">
                    <Switch
                        checked={selectedComponentData.required}
                        onChange={(checked) => handlePropertyChange('required', checked)}
                    />
                </Form.Item>

                <Form.Item label="禁用">
                    <Switch
                        checked={selectedComponentData.disabled}
                        onChange={(checked) => handlePropertyChange('disabled', checked)}
                    />
                </Form.Item>

                {['select', 'radio', 'checkbox'].includes(selectedComponentData.type) && (
                    <Form.Item label="选项">
                        <div style={{ marginBottom: '8px' }}>
                            {selectedComponentData.options?.map((option, index) => (
                                <div key={index} style={{ display: 'flex', marginBottom: '4px' }}>
                                    <Input
                                        value={option.label}
                                        onChange={(e) => {
                                            const newOptions = [...(selectedComponentData.options || [])];
                                            newOptions[index] = { ...option, label: e.target.value };
                                            handlePropertyChange('options', newOptions);
                                        }}
                                        placeholder="选项标签"
                                        style={{ marginRight: '8px' }}
                                    />
                                    <Input
                                        value={option.value}
                                        onChange={(e) => {
                                            const newOptions = [...(selectedComponentData.options || [])];
                                            newOptions[index] = { ...option, value: e.target.value };
                                            handlePropertyChange('options', newOptions);
                                        }}
                                        placeholder="选项值"
                                    />
                                    <Button
                                        size="small"
                                        danger
                                        onClick={() => {
                                            const newOptions = selectedComponentData.options?.filter((_, i) => i !== index);
                                            handlePropertyChange('options', newOptions);
                                        }}
                                        style={{ marginLeft: '4px' }}
                                    >
                                        删除
                                    </Button>
                                </div>
                            ))}
                            <Button
                                size="small"
                                onClick={() => {
                                    const newOptions = [...(selectedComponentData.options || []), { label: '新选项', value: 'new_option' }];
                                    handlePropertyChange('options', newOptions);
                                }}
                            >
                                添加选项
                            </Button>
                        </div>
                    </Form.Item>
                )}
            </Form>
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
                />
            </Form.Item>

            <Form.Item label="背景色">
                <ColorPicker
                    value={theme.backgroundColor}
                    onChange={(color) => updateTheme({ backgroundColor: color?.toHexString() || '#ffffff' })}
                />
            </Form.Item>

            <Form.Item label="边框色">
                <ColorPicker
                    value={theme.borderColor}
                    onChange={(color) => updateTheme({ borderColor: color?.toHexString() || '#d9d9d9' })}
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
            title="属性配置"
            size="small"
            style={{ height: '100%', overflow: 'hidden' }}
            styles={{ body: { padding: '12px', height: 'calc(100% - 57px)', overflow: 'auto' } }}
        >
            <Tabs
                defaultActiveKey="component"
                size="small"
                items={[
                    { key: 'component', label: '组件属性', children: renderComponentProperties() },
                    { key: 'layout', label: '布局设置', children: renderLayoutProperties() },
                    { key: 'theme', label: '主题设置', children: renderThemeProperties() }
                ]}
            />
        </Card>
    );
};

export default PropertyPanel; 