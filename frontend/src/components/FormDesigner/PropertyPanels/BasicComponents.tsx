import React from 'react';
import { Form, Input, Switch, Select, InputNumber, DatePicker } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import dayjs from 'dayjs';

const { Option } = Select;

interface BasicComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const BasicComponents: React.FC<BasicComponentsProps> = ({ component, onPropertyChange }) => {
    // 单行文本特有属性
    const renderInputProperties = () => (
        <>
            <Form.Item label="输入格式">
                <Select
                    value={component.inputFormat || 'text'}
                    onChange={(value) => onPropertyChange('inputFormat', value)}
                >
                    <Option value="text">普通文本</Option>
                    <Option value="email">邮箱</Option>
                    <Option value="name">姓名</Option>
                    <Option value="phone">电话</Option>
                </Select>
            </Form.Item>

            <Form.Item label="占位符">
                <Input
                    value={component.placeholder}
                    onChange={(e) => onPropertyChange('placeholder', e.target.value)}
                    placeholder="请输入占位符"
                />
            </Form.Item>

            <Form.Item label="默认值">
                <Input
                    value={component.defaultValue}
                    onChange={(e) => onPropertyChange('defaultValue', e.target.value)}
                    placeholder="请输入默认值"
                />
            </Form.Item>
        </>
    );

    // 多行文本组件专有属性
    const renderTextareaProperties = () => (
        <>
            <Form.Item label="最大字符数">
                <InputNumber
                    value={component.maxLength || 500}
                    onChange={(value) => onPropertyChange('maxLength', value)}
                    min={50}
                    max={2000}
                    step={50}
                    style={{ width: '100%' }}
                    addonAfter="字符"
                />
            </Form.Item>

            <Form.Item label="显示字符统计" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.showCharCount !== false}
                    onChange={(checked) => onPropertyChange('showCharCount', checked)}
                    size="small"
                />
            </Form.Item>

            <Form.Item label="启用富文本编辑器" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.enableRichText === true}
                    onChange={(checked) => onPropertyChange('enableRichText', checked)}
                    size="small"
                />
            </Form.Item>

            {component.enableRichText && (
                <Form.Item label="富文本编辑器高度">
                    <InputNumber
                        value={component.richTextHeight || 300}
                        onChange={(value) => onPropertyChange('richTextHeight', value)}
                        min={200}
                        max={800}
                        step={50}
                        style={{ width: '100%' }}
                        addonAfter="px"
                    />
                </Form.Item>
            )}

            <Form.Item label="使用说明" style={{ marginBottom: 0 }}>
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f6f8fa',
                    border: '1px solid #e1e4e8',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#586069'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#24292e' }}>
                        多行文本组件说明
                    </div>
                    <div>
                        • 用途：用于输入多行文本内容，支持换行和长文本输入<br />
                        • 字符限制：可设置最大字符数，防止内容过长<br />
                        • 字符统计：显示当前输入的字符数和剩余字符数<br />
                        • 支持换行：用户可以输入多行文本内容<br />
                        • 可调整大小：用户可以拖拽调整输入框高度<br />
                        • 富文本编辑器：启用后支持文字格式化、表格、链接等丰富内容<br />
                        • 高度设置：富文本模式下可自定义编辑器高度（200-800px）
                    </div>
                </div>
            </Form.Item>
        </>
    );

    // 数字组件基础属性（保留默认值）
    const renderNumberBasicProperties = () => (
        <>
            <Form.Item label="占位符">
                <Input
                    value={component.placeholder}
                    onChange={(e) => onPropertyChange('placeholder', e.target.value)}
                    placeholder="请输入占位符"
                />
            </Form.Item>

            <Form.Item label="默认值">
                <Input
                    value={component.defaultValue}
                    onChange={(e) => onPropertyChange('defaultValue', e.target.value)}
                    placeholder="请输入默认值"
                />
            </Form.Item>
        </>
    );

    // 数字组件特定属性
    const renderNumberSpecificProperties = () => (
        <>
            <Form.Item label="显示千分号">
                <Switch
                    checked={component.showThousandSeparator || false}
                    onChange={(checked) => onPropertyChange('showThousandSeparator', checked)}
                />
            </Form.Item>

            <Form.Item label="小数位数">
                <Select
                    value={component.decimalPlaces !== undefined ? component.decimalPlaces : 0}
                    onChange={(value) => onPropertyChange('decimalPlaces', value)}
                >
                    <Option value={-1}>不限制</Option>
                    <Option value={0}>0位小数</Option>
                    <Option value={1}>1位小数</Option>
                    <Option value={2}>2位小数</Option>
                    <Option value={3}>3位小数</Option>
                    <Option value={4}>4位小数</Option>
                </Select>
            </Form.Item>

            <Form.Item label="单位">
                <Input
                    value={component.unit || ''}
                    onChange={(e) => onPropertyChange('unit', e.target.value)}
                    placeholder="请输入单位，如：元、个、米"
                />
            </Form.Item>
        </>
    );

    // 日期组件特定属性
    const renderDateProperties = () => (
        <>
            <Form.Item label="包含时间选择">
                <Switch
                    checked={component.showTimePicker || false}
                    onChange={(checked) => onPropertyChange('showTimePicker', checked)}
                />
            </Form.Item>

            <Form.Item label="自动抓取当前时间">
                <Switch
                    checked={component.autoCurrentTime || false}
                    onChange={(checked) => onPropertyChange('autoCurrentTime', checked)}
                />
            </Form.Item>

            <Form.Item label="占位符">
                <Input
                    value={component.placeholder}
                    onChange={(e) => onPropertyChange('placeholder', e.target.value)}
                    placeholder={component.showTimePicker ? "请选择日期时间" : "请选择日期"}
                />
            </Form.Item>

            <Form.Item label="默认值">
                {component.autoCurrentTime ? (
                    <Input
                        value="自动抓取填表时间"
                        disabled={true}
                        style={{
                            width: '100%',
                            backgroundColor: '#f0f2f5',
                            color: '#8c8c8c',
                            fontStyle: 'italic'
                        }}
                    />
                ) : component.showTimePicker ? (
                    <DatePicker
                        showTime={{
                            format: 'HH:mm:ss'
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择默认日期时间"
                        value={component.defaultValue ? dayjs(component.defaultValue) : null}
                        onChange={(date) => onPropertyChange('defaultValue', date ? date.format('YYYY-MM-DD HH:mm:ss') : '')}
                        style={{ width: '100%' }}
                    />
                ) : (
                    <DatePicker
                        format="YYYY-MM-DD"
                        placeholder="选择默认日期"
                        value={component.defaultValue ? dayjs(component.defaultValue) : null}
                        onChange={(date) => onPropertyChange('defaultValue', date ? date.format('YYYY-MM-DD') : '')}
                        style={{ width: '100%' }}
                    />
                )}
            </Form.Item>
        </>
    );

    return (
        <>
            {component.type === 'input' && renderInputProperties()}
            {component.type === 'textarea' && renderTextareaProperties()}
            {component.type === 'number' && renderNumberBasicProperties()}
            {component.type === 'number' && renderNumberSpecificProperties()}
            {component.type === 'date' && renderDateProperties()}
        </>
    );
};

export default BasicComponents;
