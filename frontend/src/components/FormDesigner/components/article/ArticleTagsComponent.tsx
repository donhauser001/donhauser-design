import React, { useState, useEffect } from 'react';
import { Select, Tag, Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getTags } from '../../../../api/articleTags';
import { getIconPrefix, getLinearIcon } from '../../utils/iconUtils';

const { Option } = Select;

interface ArticleTagsComponentProps {
    component: FormComponent;
}

const ArticleTagsComponent: React.FC<ArticleTagsComponentProps> = ({ component }) => {
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    // 输入框模式的图标需要上移3px，下拉模式保持原样
    const getInputPrefix = () => {
        if (component.icon) {
            const icon = getLinearIcon(component.icon);
            if (icon) {
                return <span style={{
                    opacity: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    transform: 'translateY(0px)' // 输入框模式不需要额外偏移（相对于之前已调整的3px上移3px）
                }}>{icon}</span>;
            }
        }
        return <span style={{ opacity: 0, width: '0px' }}></span>;
    };

    const getSelectPrefix = () => {
        return getIconPrefix(component.icon); // 下拉模式使用原有的位置调整
    };

    useEffect(() => {
        // 根据组件配置决定是否从后端加载标签数据
        if (component.fromTagTable) {
            loadTags();
        }
    }, [component.fromTagTable]);

    const loadTags = async () => {
        try {
            setLoading(true);
            const response = await getTags();
            setTags(response.tags || []);
        } catch (error) {
            console.error('加载文章标签失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 如果没有开启从标签表加载，则使用普通输入框模式
    if (!component.fromTagTable) {
        return (
            <div style={{ width: '100%' }}>
                <Input
                    placeholder={component.placeholder || '请输入文章标签，多个标签用逗号分隔'}
                    disabled={component.disabled}
                    style={{ width: '100%' }}
                    maxLength={component.maxLength || 200}
                    showCount={component.showCharCount !== false}
                    prefix={getInputPrefix()}
                />
                {component.fieldDescription && (
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px',
                        lineHeight: '1.4'
                    }}>
                        {component.fieldDescription}
                    </div>
                )}

            </div>
        );
    }

    // 从标签表加载数据的选择模式
    const options = tags.map((tag: any) => ({
        label: tag.name || tag.label,
        value: tag._id || tag.value
    }));

    const tagRender = (props: any) => {
        const { label, closable, onClose } = props;
        return (
            <Tag
                color="blue"
                closable={closable}
                onClose={onClose}
                style={{ margin: '2px 4px 2px 0' }}
            >
                {label}
            </Tag>
        );
    };

    return (
        <div style={{ width: '100%' }}>
            <Select
                mode="multiple"
                placeholder={component.placeholder || '请选择文章标签'}
                disabled={component.disabled || loading}
                style={{ width: '100%' }}
                allowClear={component.allowClear !== false}
                showSearch={component.allowSearch !== false}
                maxTagCount={component.maxTagCount || 5}
                maxTagTextLength={component.maxTagTextLength || 10}
                tagRender={tagRender}
                prefix={getSelectPrefix()}
                filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                }
                notFoundContent={loading ? '加载中...' : '暂无数据'}
                loading={loading}
            >
                {options.map((option: any) => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}
            </Select>
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    {component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ArticleTagsComponent;
