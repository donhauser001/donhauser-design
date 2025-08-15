import React from 'react';
import { Form, Input, Switch, Select, InputNumber } from 'antd';
import { FormComponent } from '../../../types/formDesigner';

const { Option } = Select;

interface ArticleComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const ArticleComponents: React.FC<ArticleComponentsProps> = ({ component, onPropertyChange }) => {
    const renderArticleTitleProperties = () => (
        <>
            <Form.Item label="最大长度">
                <InputNumber
                    value={component.maxLength || 100}
                    onChange={(value) => onPropertyChange('maxLength', value)}
                    min={1}
                    max={500}
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item label="显示字数统计">
                <Switch
                    checked={component.showCharCount}
                    onChange={(checked) => onPropertyChange('showCharCount', checked)}
                />
            </Form.Item>
        </>
    );

    const renderArticleContentProperties = () => (
        <>
            <Form.Item label="启用富文本编辑器" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.enableRichText === true}
                    onChange={(checked) => onPropertyChange('enableRichText', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    启用后支持文字格式化、表格、链接等丰富内容
                </div>
            </Form.Item>

            {component.enableRichText ? (
                <Form.Item label="富文本编辑器高度">
                    <InputNumber
                        value={component.richTextHeight || 400}
                        onChange={(value) => onPropertyChange('richTextHeight', value)}
                        min={200}
                        max={800}
                        step={50}
                        style={{ width: '100%' }}
                        addonAfter="px"
                    />
                </Form.Item>
            ) : (
                <>
                    <Form.Item label="文本框行数">
                        <InputNumber
                            value={component.rows || 8}
                            onChange={(value) => onPropertyChange('rows', value)}
                            min={3}
                            max={30}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item label="自动调整高度" style={{ marginBottom: 8 }}>
                        <Switch
                            checked={component.autoSize}
                            onChange={(checked) => onPropertyChange('autoSize', checked)}
                            size="small"
                        />
                        <div style={{
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginTop: '4px'
                        }}>
                            启用后文本框高度会根据内容自动调整
                        </div>
                    </Form.Item>

                    <Form.Item label="最大字符数">
                        <InputNumber
                            value={component.maxLength}
                            onChange={(value) => onPropertyChange('maxLength', value)}
                            min={100}
                            max={50000}
                            step={100}
                            style={{ width: '100%' }}
                            placeholder="不限制"
                            addonAfter="字符"
                        />
                    </Form.Item>

                    <Form.Item label="显示字数统计" style={{ marginBottom: 8 }}>
                        <Switch
                            checked={component.showCharCount !== false}
                            onChange={(checked) => onPropertyChange('showCharCount', checked)}
                            size="small"
                        />
                    </Form.Item>
                </>
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
                        文章内容组件说明
                    </div>
                    <div>
                        • <strong>普通模式</strong>：支持多行文本输入，可设置行数和字符统计<br />
                        • <strong>富文本模式</strong>：支持文字格式化、插入链接、表格、图片等<br />
                        • <strong>自动调整</strong>：普通模式下可启用高度自动调整功能<br />
                        • <strong>字符统计</strong>：显示当前输入字符数和剩余字符数<br />
                        • <strong>高度设置</strong>：富文本模式下可自定义编辑器高度（200-800px）
                    </div>
                </div>
            </Form.Item>
        </>
    );

    const renderAuthorProperties = () => (
        <>
            <Form.Item label="从用户表选择" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.fromUserTable}
                    onChange={(checked) => onPropertyChange('fromUserTable', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    启用后可以从用户表选择作者
                </div>
            </Form.Item>

            <Form.Item label="自动获取当前用户为作者" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.autoCurrentUser}
                    onChange={(checked) => onPropertyChange('autoCurrentUser', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    启用后自动填充当前登录用户为作者
                </div>
            </Form.Item>

            {component.fromUserTable && (
                <Form.Item label="选择模式" style={{ marginBottom: 8 }}>
                    <Select
                        value={component.authorSelectMode || 'input'}
                        onChange={(value) => onPropertyChange('authorSelectMode', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="input">输入框</Option>
                        <Option value="select">下拉选择</Option>
                        <Option value="autocomplete">自动完成</Option>
                    </Select>
                </Form.Item>
            )}

            <Form.Item label="允许清空" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowClear !== false}
                    onChange={(checked) => onPropertyChange('allowClear', checked)}
                    size="small"
                />
            </Form.Item>

            <Form.Item label="允许搜索" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowSearch !== false}
                    onChange={(checked) => onPropertyChange('allowSearch', checked)}
                    size="small"
                />
            </Form.Item>

            {!component.fromUserTable && (
                <>
                    <Form.Item label="最大长度">
                        <InputNumber
                            value={component.maxLength || 50}
                            onChange={(value) => onPropertyChange('maxLength', value)}
                            min={1}
                            max={100}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item label="显示字数统计">
                        <Switch
                            checked={component.showCharCount}
                            onChange={(checked) => onPropertyChange('showCharCount', checked)}
                        />
                    </Form.Item>
                </>
            )}
        </>
    );

    const renderArticleSummaryProperties = () => (
        <>
            <Form.Item label="文本框行数">
                <InputNumber
                    value={component.rows || 4}
                    onChange={(value) => onPropertyChange('rows', value)}
                    min={2}
                    max={20}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="最大长度">
                <InputNumber
                    value={component.maxLength || 200}
                    onChange={(value) => onPropertyChange('maxLength', value)}
                    min={50}
                    max={1000}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="显示字数统计">
                <Switch
                    checked={component.showCharCount !== false}
                    onChange={(checked) => onPropertyChange('showCharCount', checked)}
                />
            </Form.Item>

            <Form.Item label="自动调整高度">
                <Switch
                    checked={component.autoSize}
                    onChange={(checked) => onPropertyChange('autoSize', checked)}
                />
            </Form.Item>
        </>
    );

    const renderArticleCategoryProperties = () => (
        <>
            <Form.Item label="允许清空" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowClear !== false}
                    onChange={(checked) => onPropertyChange('allowClear', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    启用后用户可以清空已选择的分类
                </div>
            </Form.Item>

            <Form.Item label="允许搜索" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowSearch !== false}
                    onChange={(checked) => onPropertyChange('allowSearch', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    启用后可以通过输入搜索分类名称或标识
                </div>
            </Form.Item>

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
                        文章分类组件说明
                    </div>
                    <div>
                        • <strong>数据源</strong>：自动从文章分类表（ArticleCategory）加载数据<br />
                        • <strong>层级显示</strong>：支持多级分类的层级缩进显示<br />
                        • <strong>颜色标识</strong>：显示每个分类的专属颜色标识<br />
                        • <strong>标识标签</strong>：显示分类的英文标识（slug）<br />
                        • <strong>搜索功能</strong>：支持按分类名称和标识进行搜索<br />
                        • <strong>实时加载</strong>：只显示当前激活状态的分类选项
                    </div>
                </div>
            </Form.Item>
        </>
    );

    const renderArticleTagsProperties = () => (
        <>
            <Form.Item label="从标签表加载" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.fromTagTable}
                    onChange={(checked) => onPropertyChange('fromTagTable', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    关闭时为输入框模式，开启时为下拉选择模式
                </div>
            </Form.Item>

            {/* 输入框模式特有属性 */}
            {!component.fromTagTable && (
                <>
                    <Form.Item label="最大字符数" style={{ marginBottom: 8 }}>
                        <InputNumber
                            value={component.maxLength || 200}
                            onChange={(value) => onPropertyChange('maxLength', value)}
                            min={1}
                            max={1000}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item label="显示字符统计" style={{ marginBottom: 8 }}>
                        <Switch
                            checked={component.showCharCount !== false}
                            onChange={(checked) => onPropertyChange('showCharCount', checked)}
                            size="small"
                        />
                    </Form.Item>
                </>
            )}

            {/* 下拉选择模式特有属性 */}
            {component.fromTagTable && (
                <>
                    <Form.Item label="允许清空" style={{ marginBottom: 8 }}>
                        <Switch
                            checked={component.allowClear !== false}
                            onChange={(checked) => onPropertyChange('allowClear', checked)}
                            size="small"
                        />
                    </Form.Item>

                    <Form.Item label="允许搜索" style={{ marginBottom: 8 }}>
                        <Switch
                            checked={component.allowSearch !== false}
                            onChange={(checked) => onPropertyChange('allowSearch', checked)}
                            size="small"
                        />
                    </Form.Item>

                    <Form.Item label="最大标签数量" style={{ marginBottom: 8 }}>
                        <InputNumber
                            value={component.maxTagCount || 5}
                            onChange={(value) => onPropertyChange('maxTagCount', value)}
                            min={1}
                            max={20}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item label="标签最大字符数" style={{ marginBottom: 8 }}>
                        <InputNumber
                            value={component.maxTagTextLength || 10}
                            onChange={(value) => onPropertyChange('maxTagTextLength', value)}
                            min={5}
                            max={50}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </>
            )}

            {/* 使用说明 */}
            <Form.Item style={{ marginTop: 16, marginBottom: 8 }}>
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
                        文章标签组件说明
                    </div>
                    <div>
                        <strong>• 输入框模式（默认）</strong><br />
                        &nbsp;&nbsp;- 用户手动输入标签，多个标签用逗号分隔<br />
                        &nbsp;&nbsp;- 适合自由标签内容，不受预设限制<br />
                        &nbsp;&nbsp;- 示例：技术,设计,产品<br /><br />
                        <strong>• 下拉选择模式</strong><br />
                        &nbsp;&nbsp;- 从后端ArticleTag表加载预设标签<br />
                        &nbsp;&nbsp;- 支持多选、搜索、字符长度限制<br />
                        &nbsp;&nbsp;- 适合标准化标签管理
                    </div>
                </div>
            </Form.Item>
        </>
    );

    const renderArticlePublishTimeProperties = () => (
        <>
            <Form.Item label="显示时间选择器">
                <Switch
                    checked={component.showTimePicker !== false}
                    onChange={(checked) => onPropertyChange('showTimePicker', checked)}
                />
            </Form.Item>

            <Form.Item label="自动设为当前时间">
                <Switch
                    checked={component.autoCurrentTime}
                    onChange={(checked) => onPropertyChange('autoCurrentTime', checked)}
                />
            </Form.Item>

            <Form.Item label="允许清空">
                <Switch
                    checked={component.allowClear !== false}
                    onChange={(checked) => onPropertyChange('allowClear', checked)}
                />
            </Form.Item>



            <Form.Item label="禁止选择过去日期">
                <Switch
                    checked={component.disablePastDates}
                    onChange={(checked) => onPropertyChange('disablePastDates', checked)}
                />
            </Form.Item>
        </>
    );

    const renderArticleCoverImageProperties = () => (
        <>
            <Form.Item label="上传方式">
                <Select
                    value={component.uploadType || 'card'}
                    onChange={(value) => onPropertyChange('uploadType', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="button">按钮上传</Option>
                    <Option value="drag">拖拽上传</Option>
                    <Option value="card">卡片上传</Option>
                </Select>
            </Form.Item>

            <Form.Item label="最大文件大小">
                <InputNumber
                    value={component.maxFileSize || 5}
                    onChange={(value) => onPropertyChange('maxFileSize', value)}
                    min={1}
                    max={20}
                    style={{ width: '100%' }}
                    addonAfter="MB"
                />
            </Form.Item>

            <Form.Item label="支持的文件格式">
                <Select
                    mode="multiple"
                    value={component.acceptedFormats || ['jpeg', 'jpg', 'png', 'webp']}
                    onChange={(value) => onPropertyChange('acceptedFormats', value)}
                    style={{ width: '100%' }}
                    placeholder="选择支持的图片格式"
                >
                    <Option value="jpeg">JPEG</Option>
                    <Option value="jpg">JPG</Option>
                    <Option value="png">PNG</Option>
                    <Option value="webp">WebP</Option>
                    <Option value="gif">GIF</Option>
                    <Option value="bmp">BMP</Option>
                    <Option value="svg">SVG</Option>
                </Select>
            </Form.Item>

            <Form.Item label="上传按钮文字">
                <Input
                    value={component.uploadButtonText || '上传封面图'}
                    onChange={(e) => onPropertyChange('uploadButtonText', e.target.value)}
                    placeholder="上传按钮显示的文字"
                />
            </Form.Item>


        </>
    );

    const renderArticleSeoProperties = () => (
        <>
            <Form.Item label="默认展开">
                <Switch
                    checked={component.defaultExpanded}
                    onChange={(checked) => onPropertyChange('defaultExpanded', checked)}
                />
            </Form.Item>

            <Form.Item label="无边框模式">
                <Switch
                    checked={component.ghost}
                    onChange={(checked) => onPropertyChange('ghost', checked)}
                />
            </Form.Item>

            <Form.Item label="展开图标位置">
                <Select
                    value={component.expandIconPosition || 'start'}
                    onChange={(value) => onPropertyChange('expandIconPosition', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="start">左侧</Option>
                    <Option value="end">右侧</Option>
                </Select>
            </Form.Item>

            <Form.Item label="显示字数统计">
                <Switch
                    checked={component.showCharCount !== false}
                    onChange={(checked) => onPropertyChange('showCharCount', checked)}
                />
            </Form.Item>

            <Form.Item label="SEO标题最大长度" style={{ marginBottom: 8 }}>
                <InputNumber
                    value={component.seoTitleMaxLength || 60}
                    onChange={(value) => onPropertyChange('seoTitleMaxLength', value)}
                    min={30}
                    max={200}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="SEO关键词最大长度" style={{ marginBottom: 8 }}>
                <InputNumber
                    value={component.seoKeywordsMaxLength || 200}
                    onChange={(value) => onPropertyChange('seoKeywordsMaxLength', value)}
                    min={50}
                    max={500}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="SEO描述最大长度" style={{ marginBottom: 8 }}>
                <InputNumber
                    value={component.seoDescriptionMaxLength || 160}
                    onChange={(value) => onPropertyChange('seoDescriptionMaxLength', value)}
                    min={80}
                    max={300}
                    style={{ width: '100%' }}
                />
            </Form.Item>
        </>
    );

    // 根据组件类型渲染对应的属性配置
    switch (component.type) {
        case 'articleTitle':
            return renderArticleTitleProperties();
        case 'articleContent':
            return renderArticleContentProperties();
        case 'author':
            return renderAuthorProperties();
        case 'articleSummary':
            return renderArticleSummaryProperties();
        case 'articleCategory':
            return renderArticleCategoryProperties();
        case 'articleTags':
            return renderArticleTagsProperties();
        case 'articlePublishTime':
            return renderArticlePublishTimeProperties();
        case 'articleCoverImage':
            return renderArticleCoverImageProperties();
        case 'articleSeo':
            return renderArticleSeoProperties();
        default:
            return <div>未知的文章组件类型</div>;
    }
};

export default ArticleComponents;
