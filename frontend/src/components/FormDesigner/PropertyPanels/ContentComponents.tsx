import React from 'react';
import { Form, Input, Select, ColorPicker, InputNumber, DatePicker, Switch } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import dayjs from 'dayjs';

const { TextArea } = Input;

const { Option } = Select;

interface ContentComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const ContentComponents: React.FC<ContentComponentsProps> = ({ component, onPropertyChange }) => {
    // 预设文本组件属性
    const renderPresetTextProperties = () => (
        <>
            <Form.Item label="文本内容">
                <TextArea
                    value={component.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onPropertyChange('content', e.target.value)}
                    placeholder="请输入预设文本内容"
                    rows={4}
                />
            </Form.Item>

            <Form.Item label="字体大小">
                <Select
                    value={component.style?.fontSize || '14px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        fontSize: value
                    })}
                >
                    <Option value="12px">12px</Option>
                    <Option value="14px">14px</Option>
                    <Option value="16px">16px</Option>
                    <Option value="18px">18px</Option>
                    <Option value="20px">20px</Option>
                    <Option value="24px">24px</Option>
                    <Option value="28px">28px</Option>
                    <Option value="32px">32px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="字重">
                <Select
                    value={component.style?.fontWeight || '400'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        fontWeight: value
                    })}
                >
                    <Option value="300">细体</Option>
                    <Option value="400">正常</Option>
                    <Option value="500">中等</Option>
                    <Option value="600">半粗</Option>
                    <Option value="700">粗体</Option>
                    <Option value="800">很粗</Option>
                </Select>
            </Form.Item>

            <Form.Item label="文字颜色">
                <ColorPicker
                    value={component.style?.color || '#262626'}
                    onChange={(color) => onPropertyChange('style', {
                        ...component.style,
                        color: color.toHexString()
                    })}
                />
            </Form.Item>

            <Form.Item label="行距">
                <Select
                    value={component.style?.lineHeight || '1.5'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        lineHeight: value
                    })}
                >
                    <Option value="1">1倍</Option>
                    <Option value="1.2">1.2倍</Option>
                    <Option value="1.4">1.4倍</Option>
                    <Option value="1.5">1.5倍</Option>
                    <Option value="1.6">1.6倍</Option>
                    <Option value="1.8">1.8倍</Option>
                    <Option value="2">2倍</Option>
                </Select>
            </Form.Item>

            <Form.Item label="背景颜色">
                <ColorPicker
                    value={component.style?.backgroundColor || 'transparent'}
                    onChange={(color) => onPropertyChange('style', {
                        ...component.style,
                        backgroundColor: color.toHexString()
                    })}
                />
            </Form.Item>

            <Form.Item label="内边距">
                <Select
                    value={component.style?.padding || '8px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        padding: value
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

            <Form.Item label="外边距">
                <Select
                    value={component.style?.margin || '0px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
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
                    value={component.style?.borderWidth || '0px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        borderWidth: value
                    })}
                >
                    <Option value="0px">无边框</Option>
                    <Option value="1px">1px</Option>
                    <Option value="2px">2px</Option>
                    <Option value="3px">3px</Option>
                    <Option value="4px">4px</Option>
                </Select>
            </Form.Item>

            <Form.Item label="边框样式">
                <Select
                    value={component.style?.borderStyle || 'solid'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
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
                    value={component.style?.borderColor || '#d9d9d9'}
                    onChange={(color) => onPropertyChange('style', {
                        ...component.style,
                        borderColor: color.toHexString()
                    })}
                />
            </Form.Item>

            <Form.Item label="圆角">
                <Select
                    value={component.style?.borderRadius || '0px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
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
                    <Option value="50%">圆形</Option>
                </Select>
            </Form.Item>

            <Form.Item label="文本对齐">
                <Select
                    value={component.style?.textAlign || 'left'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
                        textAlign: value
                    })}
                >
                    <Option value="left">左对齐</Option>
                    <Option value="center">居中对齐</Option>
                    <Option value="right">右对齐</Option>
                    <Option value="justify">两端对齐</Option>
                </Select>
            </Form.Item>
        </>
    );

    // HTML内容组件属性
    const renderHtmlProperties = () => (
        <Form.Item label="HTML内容">
            <TextArea
                value={component.htmlContent || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onPropertyChange('htmlContent', e.target.value)}
                placeholder="请输入HTML代码"
                rows={6}
            />
        </Form.Item>
    );

    // 倒计时组件属性
    const renderCountdownProperties = () => (
        <>
            <Form.Item label="与表单有效期同步">
                <Switch
                    checked={component.syncWithFormExpiry || false}
                    onChange={(checked) => onPropertyChange('syncWithFormExpiry', checked)}
                />
            </Form.Item>

            {!component.syncWithFormExpiry && (
                <Form.Item label="目标时间">
                    <DatePicker
                        showTime
                        value={component.targetDate ? dayjs(component.targetDate) : null}
                        onChange={(date) => onPropertyChange('targetDate', date ? date.toISOString() : '')}
                        placeholder="选择目标时间"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            )}

            <Form.Item label="前缀文本">
                <Input
                    value={component.countdownPrefix || ''}
                    onChange={(e) => onPropertyChange('countdownPrefix', e.target.value)}
                    placeholder="倒计时前的文本，如：距离截止还有："
                />
            </Form.Item>

            <Form.Item label="倒计时格式">
                <Select
                    value={component.countdownFormat || 'DD天 HH:mm:ss'}
                    onChange={(value) => onPropertyChange('countdownFormat', value)}
                >
                    <Option value="DD天 HH:mm:ss">天 时:分:秒</Option>
                    <Option value="HH:mm:ss">时:分:秒</Option>
                    <Option value="mm:ss">分:秒</Option>
                    <Option value="ss">秒</Option>
                    <Option value="自定义">自定义格式</Option>
                </Select>
            </Form.Item>

            {component.countdownFormat === '自定义' && (
                <Form.Item label="自定义格式">
                    <Input
                        value={component.countdownFormat || 'DD天 HH:mm:ss'}
                        onChange={(e) => onPropertyChange('countdownFormat', e.target.value)}
                        placeholder="如：DD天HH时mm分ss秒"
                    />
                </Form.Item>
            )}

            <Form.Item label="后缀文本">
                <Input
                    value={component.countdownSuffix || ''}
                    onChange={(e) => onPropertyChange('countdownSuffix', e.target.value)}
                    placeholder="倒计时后的文本"
                />
            </Form.Item>

            <Form.Item label="结束文本">
                <Input
                    value={component.finishedText || '时间到！'}
                    onChange={(e) => onPropertyChange('finishedText', e.target.value)}
                    placeholder="倒计时结束时显示的文本"
                />
            </Form.Item>
        </>
    );

    // 滑块组件属性
    const renderSliderProperties = () => (
        <>
            <Form.Item label="滑块模式">
                <Select
                    value={component.sliderMode || 'slider'}
                    onChange={(value) => onPropertyChange('sliderMode', value)}
                >
                    <Option value="slider">滑动条</Option>
                    <Option value="rate">星星评级</Option>
                </Select>
            </Form.Item>

            <Form.Item label="最小值">
                <InputNumber
                    value={component.min || 0}
                    onChange={(value) => onPropertyChange('min', value || 0)}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="最大值">
                <InputNumber
                    value={component.max || 100}
                    onChange={(value) => onPropertyChange('max', value || 100)}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="步长">
                <InputNumber
                    value={component.step || 1}
                    onChange={(value) => onPropertyChange('step', value || 1)}
                    min={0.1}
                    step={0.1}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="对齐方式">
                <Select
                    value={component.sliderAlign || 'left'}
                    onChange={(value) => onPropertyChange('sliderAlign', value)}
                >
                    <Option value="left">左对齐</Option>
                    <Option value="center">居中对齐</Option>
                    <Option value="right">右对齐</Option>
                </Select>
            </Form.Item>
        </>
    );

    return (
        <>
            {component.type === 'presetText' && renderPresetTextProperties()}
            {component.type === 'html' && renderHtmlProperties()}
            {component.type === 'countdown' && renderCountdownProperties()}
            {component.type === 'slider' && renderSliderProperties()}
        </>
    );
};

export default ContentComponents;
