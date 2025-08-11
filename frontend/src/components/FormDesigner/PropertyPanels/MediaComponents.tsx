import React from 'react';
import { Form, Input, Switch, Select, InputNumber, Button, ColorPicker } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../types/formDesigner';

const { Option } = Select;
const { TextArea } = Input;

interface MediaComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const MediaComponents: React.FC<MediaComponentsProps> = ({ component, onPropertyChange }) => {
    // 文件上传组件属性
    const renderUploadProperties = () => (
        <>
            <Form.Item label="上传类型">
                <Select
                    value={component.uploadType || 'button'}
                    onChange={(value) => onPropertyChange('uploadType', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="button">按钮上传</Option>
                    <Option value="dragger">拖拽上传</Option>
                </Select>
            </Form.Item>

            <Form.Item label="上传按钮文本">
                <Input
                    value={component.uploadButtonText || ''}
                    onChange={(e) => onPropertyChange('uploadButtonText', e.target.value)}
                    placeholder="点击上传"
                />
            </Form.Item>

            <Form.Item label="上传提示文本">
                <TextArea
                    value={component.uploadTip || ''}
                    onChange={(e) => onPropertyChange('uploadTip', e.target.value)}
                    placeholder="支持单个文件上传"
                    rows={2}
                />
            </Form.Item>

            <Form.Item label="最大文件数量">
                <InputNumber
                    min={1}
                    max={20}
                    value={component.maxFileCount || 1}
                    onChange={(value) => onPropertyChange('maxFileCount', value || 1)}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="最大文件大小(MB)">
                <InputNumber
                    min={1}
                    max={100}
                    value={component.maxFileSize || 10}
                    onChange={(value) => onPropertyChange('maxFileSize', value || 10)}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="显示文件列表">
                <Switch
                    checked={component.showFileList !== false}
                    onChange={(checked) => onPropertyChange('showFileList', checked)}
                />
            </Form.Item>

            <Form.Item label="允许的文件类型">
                <Select
                    mode="multiple"
                    value={component.allowedFileTypes || []}
                    onChange={(value) => onPropertyChange('allowedFileTypes', value)}
                    placeholder="选择允许的文件类型，不选表示不限制"
                    style={{ width: '100%' }}
                >
                    <Option value="image/*">图片文件</Option>
                    <Option value=".pdf">PDF文档</Option>
                    <Option value=".doc,.docx">Word文档</Option>
                    <Option value=".xls,.xlsx">Excel表格</Option>
                    <Option value=".ppt,.pptx">PowerPoint</Option>
                    <Option value=".txt">文本文件</Option>
                    <Option value=".zip,.rar">压缩文件</Option>
                    <Option value="video/*">视频文件</Option>
                    <Option value="audio/*">音频文件</Option>
                    <Option value=".psd">Photoshop文件</Option>
                    <Option value=".ai">Illustrator文件</Option>
                    <Option value=".indd">InDesign文件</Option>
                    <Option value=".idml">InDesign标记语言</Option>
                    <Option value=".eps">封装PostScript</Option>
                </Select>
            </Form.Item>
        </>
    );

    // 图片展示组件属性
    const renderImageProperties = () => (
        <>
            <Form.Item label="图片模式">
                <Select
                    value={component.imageMode || 'single'}
                    onChange={(value) => onPropertyChange('imageMode', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="single">单图模式</Option>
                    <Option value="multiple">多图模式</Option>
                    <Option value="slideshow">幻灯片模式</Option>
                </Select>
            </Form.Item>

            {component.imageMode === 'single' && (
                <Form.Item label="图片URL">
                    <Input
                        value={component.imageUrl || ''}
                        onChange={(e) => onPropertyChange('imageUrl', e.target.value)}
                        placeholder="请输入图片地址，如：https://example.com/image.jpg"
                    />
                </Form.Item>
            )}

            {(component.imageMode === 'multiple' || component.imageMode === 'slideshow') && (
                <>
                    <Form.Item label="图片列表">
                        <div>
                            {(component.imageList || []).map((image: any, index: number) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                    padding: '8px',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '4px'
                                }}>
                                    <Input
                                        size="small"
                                        value={image.name || ''}
                                        onChange={(e) => {
                                            const newList = [...(component.imageList || [])];
                                            newList[index] = { ...image, name: e.target.value };
                                            onPropertyChange('imageList', newList);
                                        }}
                                        placeholder="图片名称"
                                        style={{ marginRight: '8px', width: '100px' }}
                                    />
                                    <Input
                                        size="small"
                                        value={image.url || ''}
                                        onChange={(e) => {
                                            const newList = [...(component.imageList || [])];
                                            newList[index] = { ...image, url: e.target.value };
                                            onPropertyChange('imageList', newList);
                                        }}
                                        placeholder="图片URL"
                                        style={{ marginRight: '8px', flex: 1 }}
                                    />
                                    <Button
                                        size="small"
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            const newList = (component.imageList || []).filter((_: any, i: number) => i !== index);
                                            onPropertyChange('imageList', newList);
                                        }}
                                    />
                                </div>
                            ))}
                            <Button
                                size="small"
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    const newList = [...(component.imageList || [])];
                                    newList.push({
                                        url: '',
                                        name: `图片${newList.length + 1}`,
                                        id: Date.now().toString()
                                    });
                                    onPropertyChange('imageList', newList);
                                }}
                                style={{ width: '100%' }}
                                disabled={(component.imageList || []).length >= (component.maxImageCount || 9)}
                            >
                                添加图片 ({(component.imageList || []).length}/{component.maxImageCount || 9})
                            </Button>
                        </div>
                    </Form.Item>

                    <Form.Item label="最大图片数量">
                        <InputNumber
                            value={component.maxImageCount || 9}
                            onChange={(value) => onPropertyChange('maxImageCount', value || 9)}
                            min={1}
                            max={20}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </>
            )}

            {component.imageMode === 'slideshow' && (
                <>
                    <Form.Item label="自动播放">
                        <Switch
                            checked={component.slideshowAutoplay !== false}
                            onChange={(checked) => onPropertyChange('slideshowAutoplay', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="切换间隔(秒)">
                        <InputNumber
                            value={component.slideshowInterval || 3}
                            onChange={(value) => onPropertyChange('slideshowInterval', value || 3)}
                            min={1}
                            max={10}
                            step={0.5}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </>
            )}

            <Form.Item label="显示图片名称">
                <Switch
                    checked={component.showImageName !== false}
                    onChange={(checked) => onPropertyChange('showImageName', checked)}
                />
            </Form.Item>

            <Form.Item label="图片宽度">
                <Input
                    value={component.imageWidth || '200px'}
                    onChange={(e) => onPropertyChange('imageWidth', e.target.value)}
                    placeholder="如：200px, 100%, auto"
                />
            </Form.Item>

            <Form.Item label="图片高度">
                <Input
                    value={component.imageHeight || 'auto'}
                    onChange={(e) => onPropertyChange('imageHeight', e.target.value)}
                    placeholder="如：150px, 100%, auto"
                />
            </Form.Item>

            <Form.Item label="图片描述">
                <Input
                    value={component.imageAlt || ''}
                    onChange={(e) => onPropertyChange('imageAlt', e.target.value)}
                    placeholder="用于屏幕阅读器和SEO"
                />
            </Form.Item>

            <Form.Item label="背景颜色">
                <ColorPicker
                    value={component.style?.backgroundColor || 'transparent'}
                    onChange={(color) => onPropertyChange('style', {
                        ...component.style,
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
                    value={component.style?.padding || '0'}
                    onChange={(e) => onPropertyChange('style', {
                        ...component.style,
                        padding: e.target.value
                    })}
                    placeholder="如：8px, 10px 15px"
                />
            </Form.Item>

            <Form.Item label="外边距">
                <Input
                    value={component.style?.margin || '0'}
                    onChange={(e) => onPropertyChange('style', {
                        ...component.style,
                        margin: e.target.value
                    })}
                    placeholder="如：8px, 10px 15px"
                />
            </Form.Item>

            <Form.Item label="边框宽度">
                <Select
                    value={component.style?.borderWidth || '1px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
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

            {component.style?.borderWidth !== '0' && (
                <>
                    <Form.Item label="边框样式">
                        <Select
                            value={component.style?.borderStyle || 'solid'}
                            onChange={(value) => onPropertyChange('style', {
                                ...component.style,
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
                            value={component.style?.borderColor || '#d9d9d9'}
                            onChange={(color) => onPropertyChange('style', {
                                ...component.style,
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
                    value={component.style?.borderRadius || '4px'}
                    onChange={(value) => onPropertyChange('style', {
                        ...component.style,
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

    return (
        <>
            {component.type === 'upload' && renderUploadProperties()}
            {component.type === 'image' && renderImageProperties()}
        </>
    );
};

export default MediaComponents;
