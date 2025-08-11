import React from 'react';
import { Form, Switch, Select, Input, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../types/formDesigner';

const { Option } = Select;

interface OptionComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const OptionComponents: React.FC<OptionComponentsProps> = ({ component, onPropertyChange }) => {
    // 选择按钮组件属性
    const renderRadioProperties = () => (
        <>
            <Form.Item label="允许多选">
                <Switch
                    checked={component.allowMultiple || false}
                    onChange={(checked) => onPropertyChange('allowMultiple', checked)}
                />
            </Form.Item>

            <Form.Item label="选项布局">
                <Select
                    value={component.optionLayout || 'vertical'}
                    onChange={(value) => onPropertyChange('optionLayout', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="vertical">竖排</Option>
                    <Option value="horizontal">横排</Option>
                </Select>
            </Form.Item>

            {component.optionLayout === 'horizontal' && (
                <Form.Item label="分列数量">
                    <Select
                        value={component.optionColumns || 0}
                        onChange={(value) => onPropertyChange('optionColumns', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value={0}>自动排列</Option>
                        <Option value={2}>2列</Option>
                        <Option value={3}>3列</Option>
                        <Option value={4}>4列</Option>
                        <Option value={5}>5列</Option>
                    </Select>
                </Form.Item>
            )}

            <Form.Item label="选项设置">
                <div>
                    {component.options?.map((option, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                            padding: '8px',
                            border: '1px solid #f0f0f0',
                            borderRadius: '4px'
                        }}>
                            <Switch
                                size="small"
                                checked={option.defaultSelected || false}
                                onChange={(checked) => {
                                    const newOptions = [...(component.options || [])];
                                    if (component.allowMultiple || checked) {
                                        newOptions[index] = { ...option, defaultSelected: checked };
                                    } else {
                                        // 单选模式下，取消其他选项的选中状态
                                        newOptions.forEach((opt, i) => {
                                            newOptions[i] = { ...opt, defaultSelected: i === index };
                                        });
                                    }
                                    onPropertyChange('options', newOptions);
                                }}
                                style={{ marginRight: '8px' }}
                            />
                            <Input
                                size="small"
                                value={option.label}
                                onChange={(e) => {
                                    const newOptions = [...(component.options || [])];
                                    newOptions[index] = { ...option, label: e.target.value };
                                    onPropertyChange('options', newOptions);
                                }}
                                placeholder="选项文本"
                                style={{ marginRight: '8px', flex: 1 }}
                            />
                            <Input
                                size="small"
                                value={option.value}
                                onChange={(e) => {
                                    const newOptions = [...(component.options || [])];
                                    newOptions[index] = { ...option, value: e.target.value };
                                    onPropertyChange('options', newOptions);
                                }}
                                placeholder="选项值"
                                style={{ marginRight: '8px', width: '80px' }}
                            />
                            <Button
                                size="small"
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    const newOptions = component.options?.filter((_, i) => i !== index) || [];
                                    onPropertyChange('options', newOptions);
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        size="small"
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            const newOptions = [...(component.options || [])];
                            newOptions.push({
                                label: `选项${newOptions.length + 1}`,
                                value: `option${newOptions.length + 1}`,
                                defaultSelected: false
                            });
                            onPropertyChange('options', newOptions);
                        }}
                        style={{ width: '100%' }}
                    >
                        添加选项
                    </Button>
                </div>
            </Form.Item>
        </>
    );

    // 下拉选择组件属性
    const renderSelectProperties = () => (
        <>
            <Form.Item label="选择模式">
                <Select
                    value={component.selectMode || 'single'}
                    onChange={(value) => onPropertyChange('selectMode', value)}
                >
                    <Option value="single">单选</Option>
                    <Option value="multiple">多选</Option>
                </Select>
            </Form.Item>

            <Form.Item label="允许清空">
                <Switch
                    checked={component.allowClear !== false}
                    onChange={(checked) => onPropertyChange('allowClear', checked)}
                />
            </Form.Item>

            <Form.Item label="允许搜索">
                <Switch
                    checked={component.allowSearch || false}
                    onChange={(checked) => onPropertyChange('allowSearch', checked)}
                />
            </Form.Item>

            <Form.Item label="选项设置">
                <div>
                    {component.options?.map((option, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                            padding: '8px',
                            border: '1px solid #f0f0f0',
                            borderRadius: '4px'
                        }}>
                            <Switch
                                size="small"
                                checked={option.defaultSelected || false}
                                onChange={(checked) => {
                                    const newOptions = [...(component.options || [])];
                                    if (component.selectMode === 'single' && checked) {
                                        // 单选模式下，设置一个为默认时，清除其他的默认选择
                                        newOptions.forEach((opt, idx) => {
                                            newOptions[idx] = { ...opt, defaultSelected: idx === index };
                                        });
                                    } else {
                                        newOptions[index] = { ...option, defaultSelected: checked };
                                    }
                                    onPropertyChange('options', newOptions);
                                }}
                                style={{ marginRight: '8px' }}
                            />
                            <Input
                                size="small"
                                value={option.label}
                                onChange={(e) => {
                                    const newOptions = [...(component.options || [])];
                                    newOptions[index] = { ...option, label: e.target.value };
                                    onPropertyChange('options', newOptions);
                                }}
                                placeholder="选项文本"
                                style={{ marginRight: '8px', flex: 1 }}
                            />
                            <Input
                                size="small"
                                value={option.value}
                                onChange={(e) => {
                                    const newOptions = [...(component.options || [])];
                                    newOptions[index] = { ...option, value: e.target.value };
                                    onPropertyChange('options', newOptions);
                                }}
                                placeholder="选项值"
                                style={{ marginRight: '8px', width: '80px' }}
                            />
                            <Button
                                size="small"
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    const newOptions = component.options?.filter((_, i) => i !== index) || [];
                                    onPropertyChange('options', newOptions);
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        size="small"
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            const newOptions = [...(component.options || [])];
                            newOptions.push({
                                label: `选项${newOptions.length + 1}`,
                                value: `option${newOptions.length + 1}`,
                                defaultSelected: false
                            });
                            onPropertyChange('options', newOptions);
                        }}
                        style={{ width: '100%' }}
                    >
                        添加选项
                    </Button>
                </div>
            </Form.Item>
        </>
    );

    return (
        <>
            {component.type === 'radio' && renderRadioProperties()}
            {component.type === 'select' && renderSelectProperties()}
        </>
    );
};

export default OptionComponents;
