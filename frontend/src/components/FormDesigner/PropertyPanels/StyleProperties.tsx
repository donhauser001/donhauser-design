import React from 'react';
import { Form, Select, InputNumber, Divider } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import ColorPicker from '../../ColorPicker';

const { Option } = Select;

interface StylePropertiesProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const StyleProperties: React.FC<StylePropertiesProps> = ({ component, onPropertyChange }) => {
    // 注意：特定组件的样式设置由PropertyPanel中的renderStyleProperties函数处理
    // 这里只处理通用组件的样式设置

    // 根据组件类型确定需要显示的样式选项
    const getStyleOptions = () => {
        const isTextComponent = ['input', 'textarea', 'articleTitle', 'articleSummary', 'articleContent', 'contractName'].includes(component.type);
        const isSelectComponent = ['select', 'radio', 'articleCategory', 'articleTags', 'author', 'invoiceType', 'paymentMethod'].includes(component.type);
        const isContainerComponent = ['order', 'taskList', 'quotation', 'signature', 'ourCertificate', 'group'].includes(component.type);
        const isInputLikeComponent = ['number', 'date', 'articlePublishTime', 'client', 'projectName', 'contact', 'amount', 'total'].includes(component.type);

        return {
            showTextStyles: isTextComponent,
            showContainerStyles: isContainerComponent,
            showInputStyles: isInputLikeComponent || isSelectComponent,
            showSpacing: true, // 所有组件都可以设置间距
            showSize: true,    // 所有组件都可以设置尺寸
        };
    };

    const styleOptions = getStyleOptions();

    const updateStyle = (styleKey: string, value: any) => {
        onPropertyChange('style', {
            ...component.style,
            [styleKey]: value
        });
    };

    return (
        <>
            <Divider orientation="left" style={{ margin: '16px 0 12px 0', fontSize: '13px', color: '#666' }}>
                样式设置
            </Divider>

            {/* 尺寸设置 */}
            {styleOptions.showSize && (
                <>
                    <Form.Item label="宽度">
                        <Select
                            value={component.style?.width || 'auto'}
                            onChange={(value) => updateStyle('width', value)}
                            placeholder="选择宽度"
                        >
                            <Option value="auto">自动</Option>
                            <Option value="100%">100%</Option>
                            <Option value="80%">80%</Option>
                            <Option value="60%">60%</Option>
                            <Option value="50%">50%</Option>
                            <Option value="40%">40%</Option>
                            <Option value="300px">300px</Option>
                            <Option value="400px">400px</Option>
                            <Option value="500px">500px</Option>
                        </Select>
                    </Form.Item>

                    {styleOptions.showContainerStyles && (
                        <Form.Item label="高度">
                            <Select
                                value={component.style?.height || 'auto'}
                                onChange={(value) => updateStyle('height', value)}
                                placeholder="选择高度"
                            >
                                <Option value="auto">自动</Option>
                                <Option value="200px">200px</Option>
                                <Option value="300px">300px</Option>
                                <Option value="400px">400px</Option>
                                <Option value="500px">500px</Option>
                            </Select>
                        </Form.Item>
                    )}
                </>
            )}

            {/* 间距设置 */}
            {styleOptions.showSpacing && (
                <>
                    <Form.Item label="外边距">
                        <Select
                            value={component.style?.margin || '0px'}
                            onChange={(value) => updateStyle('margin', value)}
                            placeholder="选择外边距"
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

                    <Form.Item label="内边距">
                        <Select
                            value={component.style?.padding || '8px'}
                            onChange={(value) => updateStyle('padding', value)}
                            placeholder="选择内边距"
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
                </>
            )}

            {/* 文本样式 - 仅对文本类组件显示 */}
            {styleOptions.showTextStyles && (
                <>
                    <Form.Item label="字体大小">
                        <Select
                            value={component.style?.fontSize || '14px'}
                            onChange={(value) => updateStyle('fontSize', value)}
                            placeholder="选择字体大小"
                        >
                            <Option value="12px">12px</Option>
                            <Option value="14px">14px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="18px">18px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="24px">24px</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="字体颜色">
                        <ColorPicker
                            value={component.style?.color || '#262626'}
                            onChange={(color) => updateStyle('color', color.toHexString())}
                        />
                    </Form.Item>

                    <Form.Item label="文字对齐">
                        <Select
                            value={component.style?.textAlign || 'left'}
                            onChange={(value) => updateStyle('textAlign', value)}
                            placeholder="选择对齐方式"
                        >
                            <Option value="left">左对齐</Option>
                            <Option value="center">居中</Option>
                            <Option value="right">右对齐</Option>
                        </Select>
                    </Form.Item>
                </>
            )}

            {/* 背景和边框 - 对容器类组件和输入类组件显示 */}
            {(styleOptions.showContainerStyles || styleOptions.showInputStyles) && (
                <>
                    <Form.Item label="背景颜色">
                        <ColorPicker
                            value={component.style?.backgroundColor || 'transparent'}
                            onChange={(color) => updateStyle('backgroundColor', color.toHexString())}
                        />
                    </Form.Item>

                    <Form.Item label="边框样式">
                        <Select
                            value={component.style?.borderStyle || 'none'}
                            onChange={(value) => updateStyle('borderStyle', value)}
                            placeholder="选择边框样式"
                        >
                            <Option value="none">无边框</Option>
                            <Option value="solid">实线</Option>
                            <Option value="dashed">虚线</Option>
                            <Option value="dotted">点线</Option>
                        </Select>
                    </Form.Item>

                    {component.style?.borderStyle && component.style.borderStyle !== 'none' && (
                        <>
                            <Form.Item label="边框宽度">
                                <InputNumber
                                    value={parseInt(component.style?.borderWidth?.replace('px', '') || '1')}
                                    onChange={(value) => updateStyle('borderWidth', `${value || 1}px`)}
                                    min={1}
                                    max={10}
                                    addonAfter="px"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item label="边框颜色">
                                <ColorPicker
                                    value={component.style?.borderColor || '#d9d9d9'}
                                    onChange={(color) => updateStyle('borderColor', color.toHexString())}
                                />
                            </Form.Item>

                            <Form.Item label="圆角">
                                <InputNumber
                                    value={parseInt(component.style?.borderRadius?.replace('px', '') || '4')}
                                    onChange={(value) => updateStyle('borderRadius', `${value || 0}px`)}
                                    min={0}
                                    max={50}
                                    addonAfter="px"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default StyleProperties;
