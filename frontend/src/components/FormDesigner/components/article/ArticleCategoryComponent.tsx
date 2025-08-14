import React, { useState, useEffect } from 'react';
import { Select, Spin, Tag } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getCategories } from '../../../../api/articleCategories';
import { getIconPrefix } from '../../utils/iconUtils';

const { Option } = Select;

interface ArticleCategoryComponentProps {
    component: FormComponent;
}

const ArticleCategoryComponent: React.FC<ArticleCategoryComponentProps> = ({ component }) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // 默认加载状态为true

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    useEffect(() => {
        // 始终从文章分类表加载数据
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories({ isActive: true }); // 只获取激活的分类
            const categoriesList = response.categories || [];

            // 转换数据格式，支持层级显示
            const formattedCategories = categoriesList.map((category: any) => ({
                label: formatCategoryLabel(category),
                value: category._id,
                name: category.name,
                level: category.level,
                color: category.color,
                slug: category.slug
            }));

            setCategories(formattedCategories);
        } catch (error) {
            console.error('加载文章分类失败:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // 格式化分类标签，根据层级添加缩进
    const formatCategoryLabel = (category: any) => {
        const indent = '　'.repeat(category.level - 1); // 使用全角空格进行缩进
        return `${indent}${category.name}`;
    };

    // 自定义选项渲染，显示分类颜色标识
    const renderOption = (category: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {category.color && (
                <div
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        backgroundColor: category.color,
                        flexShrink: 0
                    }}
                />
            )}
            <span style={{ flex: 1 }}>{category.label}</span>
            {category.slug && (
                <Tag style={{ fontSize: '10px', margin: 0, padding: '0 4px', height: '16px', lineHeight: '16px' }}>
                    {category.slug}
                </Tag>
            )}
        </div>
    );

    if (loading) {
        return (
            <Select
                placeholder="加载分类中..."
                disabled={true}
                style={{ width: '100%' }}
                prefix={getPrefix()}
                notFoundContent={<Spin size="small" />}
            />
        );
    }

    return (
        <Select
            placeholder={component.placeholder || '请选择文章分类'}
            disabled={component.disabled}
            style={{ width: '100%' }}
            allowClear={component.allowClear !== false}
            showSearch={component.allowSearch !== false}
            prefix={getPrefix()}
            filterOption={(input, option) => {
                const category = categories.find(cat => cat.value === option?.value);
                if (!category) return false;
                return category.name.toLowerCase().includes(input.toLowerCase()) ||
                    category.slug.toLowerCase().includes(input.toLowerCase());
            }}
            notFoundContent={categories.length === 0 ? '暂无分类数据' : '未找到匹配的分类'}
        >
            {categories.map((category) => (
                <Option key={category.value} value={category.value}>
                    {renderOption(category)}
                </Option>
            ))}
        </Select>
    );
};

export default ArticleCategoryComponent;
