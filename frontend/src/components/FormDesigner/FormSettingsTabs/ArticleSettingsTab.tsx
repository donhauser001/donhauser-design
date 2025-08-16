import React from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Select,
    Switch,
    InputNumber,
    Alert
} from 'antd';
import { FormSettingsTabProps } from './types';

const { Option } = Select;
const { TextArea } = Input;

const ArticleSettingsTab: React.FC<FormSettingsTabProps> = ({
    form,
    formData
}) => {
    return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
            <Card size="small" title="文章关联" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="articleCategory" label="文章分类">
                            <Select placeholder="选择文章分类">
                                <Option value="news">新闻资讯</Option>
                                <Option value="tutorial">教程指南</Option>
                                <Option value="case">案例分析</Option>
                                <Option value="blog">博客文章</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="articleTags" label="文章标签">
                            <Select mode="multiple" placeholder="选择或输入标签">
                                <Option value="design">设计</Option>
                                <Option value="development">开发</Option>
                                <Option value="ui">UI</Option>
                                <Option value="ux">UX</Option>
                                <Option value="business">商务</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="articleSummary" label="文章摘要">
                    <TextArea
                        rows={3}
                        placeholder="输入文章摘要，将用于SEO和预览"
                        maxLength={300}
                        showCount
                    />
                </Form.Item>
            </Card>

            <Card size="small" title="发布设置" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="autoPublish" label="自动发布" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="allowComments" label="允许评论" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="seoOptimized" label="SEO优化" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="featured" label="推荐文章" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card size="small" title="内容管理">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="contentTemplate" label="内容模板">
                            <Select>
                                <Option value="standard">标准模板</Option>
                                <Option value="rich">富文本模板</Option>
                                <Option value="minimal">简约模板</Option>
                                <Option value="gallery">图册模板</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="readingTime" label="预计阅读时长(分钟)">
                            <InputNumber min={1} max={60} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Alert
                message="文章说明"
                description="配置与该表单相关的文章设置，包括分类、标签、发布选项等。"
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
        </div>
    );
};

export default ArticleSettingsTab;
