import React from 'react';
import { Form, Select, ColorPicker, InputNumber, Input, Button, Space, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../types/formDesigner';

const { Option } = Select;
const { TextArea } = Input;

interface LayoutComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const LayoutComponents: React.FC<LayoutComponentsProps> = ({ component, onPropertyChange }) => {
    // 分栏容器属性
    const renderColumnContainerProperties = () => (
        <>
            <Form.Item label="分栏数量">
                <Select
                    value={component.columns || 2}
                    onChange={(value) => onPropertyChange('columns', value)}
                >
                    <Option value={1}>1列</Option>
                    <Option value={2}>2列</Option>
                    <Option value={3}>3列</Option>
                    <Option value={4}>4列</Option>
                    <Option value={6}>6列</Option>
                </Select>
            </Form.Item>

            <Form.Item label="列间距">
                <Select
                    value={component.style?.gap || '16px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        gap: value
                    })}
                >
                    <Option value="0px">0px</Option>
                    <Option value="8px">8px</Option>
                    <Option value="16px">16px</Option>
                    <Option value="24px">24px</Option>
                    <Option value="32px">32px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="容器内边距">
                <Select
                    value={component.style?.padding || '16px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        padding: value
                    })}
                >
                    <Option value="0px">0px</Option>
                    <Option value="8px">8px</Option>
                    <Option value="16px">16px</Option>
                    <Option value="24px">24px</Option>
                    <Option value="32px">32px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="栏内边距">
                <Select
                    value={component.style?.columnPadding || '4px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        columnPadding: value
                    })}
                >
                    <Option value="0px">0px</Option>
                    <Option value="4px">4px</Option>
                    <Option value="8px">8px</Option>
                    <Option value="12px">12px</Option>
                    <Option value="16px">16px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="容器背景色">
                <ColorPicker
                    value={component.style?.backgroundColor || '#fafafa'}
                    onChange={(color) => onPropertyChange('style', {
                        ...component.style,
                        backgroundColor: color.toHexString()
                    })}
                />
            </Form.Item>

            <Form.Item label="边框样式">
                <Select
                    value={component.style?.borderStyle || 'solid'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        borderStyle: value
                    })}
                >
                    <Option value="none">无边框</Option>
                    <Option value="solid">实线</Option>
                    <Option value="dashed">虚线</Option>
                    <Option value="dotted">点线</Option>
                </Select>
            </Form.Item>

            <Form.Item label="边框宽度">
                <Select
                    value={component.style?.borderWidth || '1px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        borderWidth: value
                    })}
                >
                    <Option value="0px">0px</Option>
                    <Option value="1px">1px</Option>
                    <Option value="2px">2px</Option>
                    <Option value="3px">3px</Option>
                    <Option value="4px">4px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="边框颜色">
                <ColorPicker
                    value={component.style?.borderColor || '#d9d9d9'}
                    onChange={(color) => onPropertyChange('style', {
                        ...component.style,
                        borderColor: color.toHexString()
                    })}
                />
            </Form.Item>

            <Form.Item label="圆角">
                <Select
                    value={component.style?.borderRadius || '6px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        borderRadius: value
                    })}
                >
                    <Option value="0px">无圆角</Option>
                    <Option value="4px">4px</Option>
                    <Option value="6px">6px</Option>
                    <Option value="8px">8px</Option>
                    <Option value="12px">12px</Option>
                    <Option value="16px">16px</Option>
                </Select>
            </Form.Item>
        </>
    );

    // 分页组件属性
    const renderPaginationProperties = () => (
        <>
            <Form.Item label="当前页">
                <InputNumber
                    min={1}
                    value={component.current || 1}
                    onChange={(value) => onPropertyChange('current', value || 1)}
                />
            </Form.Item>

            <Form.Item label="总页数">
                <InputNumber
                    min={1}
                    value={Math.ceil((component.total || 100) / (component.pageSize || 10))}
                    onChange={(value) => {
                        const pageSize = component.pageSize || 10;
                        const newTotal = (value || 1) * pageSize;
                        onPropertyChange('total', newTotal);
                    }}
                />
            </Form.Item>

            <Form.Item label="显示页数统计">
                <Switch
                    checked={component.showTotal !== false}
                    onChange={(checked) => onPropertyChange('showTotal', checked)}
                />
            </Form.Item>

            <Form.Item label="对齐方式">
                <Select
                    value={component.align || 'center'}
                    onChange={(value) => onPropertyChange('align', value)}
                >
                    <Option value="left">居左</Option>
                    <Option value="center">居中</Option>
                    <Option value="right">居右</Option>
                </Select>
            </Form.Item>
        </>
    );

    // 步骤组件属性
    const renderStepsProperties = () => (
        <>
            <Form.Item label="当前步骤">
                <InputNumber
                    min={1}
                    value={(component.current || 0) + 1}
                    onChange={(value) => onPropertyChange('current', (value || 1) - 1)}
                />
            </Form.Item>

            <Form.Item label="步骤方向">
                <Select
                    value={component.direction || 'horizontal'}
                    onChange={(value) => onPropertyChange('direction', value)}
                >
                    <Option value="horizontal">水平</Option>
                    <Option value="vertical">垂直</Option>
                </Select>
            </Form.Item>

            <Form.Item label="步骤大小">
                <Select
                    value={component.size || 'default'}
                    onChange={(value) => onPropertyChange('size', value)}
                >
                    <Option value="small">小</Option>
                    <Option value="default">默认</Option>
                </Select>
            </Form.Item>

            <Form.Item label="步骤状态">
                <Select
                    value={component.status || 'process'}
                    onChange={(value) => onPropertyChange('status', value)}
                >
                    <Option value="wait">等待</Option>
                    <Option value="process">进行中</Option>
                    <Option value="finish">完成</Option>
                    <Option value="error">错误</Option>
                </Select>
            </Form.Item>

            <Form.Item label="步骤列表">
                <div style={{ marginBottom: '8px' }}>
                    {(component.steps || []).map((step, index) => (
                        <div key={index} style={{ marginBottom: '12px', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'center' }}>
                                <span style={{ minWidth: '60px', fontWeight: 500 }}>步骤 {index + 1}:</span>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => {
                                        const newSteps = [...(component.steps || [])];
                                        newSteps.splice(index, 1);
                                        onPropertyChange('steps', newSteps);
                                    }}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    删除
                                </Button>
                            </div>
                            <Input
                                placeholder="步骤标题"
                                value={step.title}
                                onChange={(e) => {
                                    const newSteps = [...(component.steps || [])];
                                    newSteps[index] = { ...newSteps[index], title: e.target.value };
                                    onPropertyChange('steps', newSteps);
                                }}
                                style={{ marginBottom: '4px' }}
                            />
                            <Input
                                placeholder="步骤描述"
                                value={step.description}
                                onChange={(e) => {
                                    const newSteps = [...(component.steps || [])];
                                    newSteps[index] = { ...newSteps[index], description: e.target.value };
                                    onPropertyChange('steps', newSteps);
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        type="dashed"
                        onClick={() => {
                            const newSteps = [...(component.steps || [])];
                            newSteps.push({ title: '新步骤', description: '描述' });
                            onPropertyChange('steps', newSteps);
                        }}
                        style={{ width: '100%' }}
                    >
                        + 添加步骤
                    </Button>
                </div>
            </Form.Item>
        </>
    );

    // 分割线组件属性
    const renderDividerProperties = () => (
        <>
            <Form.Item label="标题文本">
                <Input
                    value={component.title || ''}
                    onChange={(e) => onPropertyChange('title', e.target.value)}
                    placeholder="输入标题文本"
                />
            </Form.Item>

            <Form.Item label="说明文本">
                <TextArea
                    value={component.description || ''}
                    onChange={(e) => onPropertyChange('description', e.target.value)}
                    placeholder="输入说明文本"
                    rows={2}
                />
            </Form.Item>

            <Form.Item label="文本对齐">
                <Select
                    value={component.textAlign || 'left'}
                    onChange={(value) => onPropertyChange('textAlign', value)}
                >
                    <Option value="left">左对齐</Option>
                    <Option value="center">居中对齐</Option>
                    <Option value="right">右对齐</Option>
                </Select>
            </Form.Item>

            <Form.Item label="说明文本位置">
                <Select
                    value={component.descriptionPosition || 'below'}
                    onChange={(value) => onPropertyChange('descriptionPosition', value)}
                >
                    <Option value="above">线上</Option>
                    <Option value="below">线下</Option>
                </Select>
            </Form.Item>

            <Form.Item label="线条样式">
                <Select
                    value={component.dividerStyle || 'solid'}
                    onChange={(value) => onPropertyChange('dividerStyle', value)}
                >
                    <Option value="solid">实线</Option>
                    <Option value="dashed">虚线</Option>
                    <Option value="dotted">点线</Option>
                </Select>
            </Form.Item>

            <Form.Item label="线条粗细">
                <InputNumber
                    min={1}
                    max={10}
                    value={component.thickness || 1}
                    onChange={(value) => onPropertyChange('thickness', value || 1)}
                    addonAfter="px"
                />
            </Form.Item>

            <Form.Item label="线条颜色">
                <ColorPicker
                    value={component.lineColor || '#d9d9d9'}
                    onChange={(color) => onPropertyChange('lineColor', color.toHexString())}
                />
            </Form.Item>

            <Form.Item label="标题字体大小">
                <Select
                    value={component.titleStyle?.fontSize || '16px'}
                    onChange={(value) => onPropertyChange('titleStyle', {
                        ...component.titleStyle,
                        fontSize: value
                    })}
                >
                    <Option value="12px">12px</Option>
                    <Option value="14px">14px</Option>
                    <Option value="16px">16px</Option>
                    <Option value="18px">18px</Option>
                    <Option value="20px">20px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="标题字重">
                <Select
                    value={component.titleStyle?.fontWeight || '600'}
                    onChange={(value) => onPropertyChange('titleStyle', {
                        ...component.titleStyle,
                        fontWeight: value
                    })}
                >
                    <Option value="400">正常</Option>
                    <Option value="500">中等</Option>
                    <Option value="600">半粗</Option>
                    <Option value="700">粗体</Option>
                </Select>
            </Form.Item>

            <Form.Item label="标题颜色">
                <ColorPicker
                    value={component.titleStyle?.color || '#262626'}
                    onChange={(color) => onPropertyChange('titleStyle', {
                        ...component.titleStyle,
                        color: color.toHexString()
                    })}
                />
            </Form.Item>

            <Form.Item label="说明字体大小">
                <Select
                    value={component.descriptionStyle?.fontSize || '14px'}
                    onChange={(value) => onPropertyChange('descriptionStyle', {
                        ...component.descriptionStyle,
                        fontSize: value
                    })}
                >
                    <Option value="12px">12px</Option>
                    <Option value="14px">14px</Option>
                    <Option value="16px">16px</Option>
                    <Option value="18px">18px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="说明字重">
                <Select
                    value={component.descriptionStyle?.fontWeight || '400'}
                    onChange={(value) => onPropertyChange('descriptionStyle', {
                        ...component.descriptionStyle,
                        fontWeight: value
                    })}
                >
                    <Option value="400">正常</Option>
                    <Option value="500">中等</Option>
                    <Option value="600">半粗</Option>
                </Select>
            </Form.Item>

            <Form.Item label="说明颜色">
                <ColorPicker
                    value={component.descriptionStyle?.color || '#8c8c8c'}
                    onChange={(color) => onPropertyChange('descriptionStyle', {
                        ...component.descriptionStyle,
                        color: color.toHexString()
                    })}
                />
            </Form.Item>
        </>
    );

    return (
        <>
            {component.type === 'columnContainer' && renderColumnContainerProperties()}
            {component.type === 'pagination' && renderPaginationProperties()}
            {component.type === 'steps' && renderStepsProperties()}
            {component.type === 'divider' && renderDividerProperties()}
        </>
    );
};

export default LayoutComponents;
