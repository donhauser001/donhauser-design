import React, { useState, useEffect } from 'react';
import { Input, Select, AutoComplete } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getUsers } from '../../../../api/users';
import { getIconPrefix, getLinearIcon } from '../../utils/iconUtils';
import { useAuth } from '../../../../contexts/AuthContext';

interface AuthorComponentProps {
    component: FormComponent;
}

const AuthorComponent: React.FC<AuthorComponentProps> = ({ component }) => {
    const [authors, setAuthors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo } = useAuth();

    // 获取输入框模式的图标前缀（向上调整3px）
    const getInputPrefix = () => {
        if (component.icon) {
            const icon = getLinearIcon(component.icon);
            if (icon) {
                return <span style={{
                    opacity: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    transform: 'translateY(-3px)' // 向上移动3px
                }}>{icon}</span>;
            }
        }
        return <span style={{ opacity: 0, width: '0px' }}></span>;
    };

    // 获取下拉选择/自动完成模式的图标前缀（使用全局调整）
    const getSelectPrefix = () => {
        return getIconPrefix(component.icon);
    };

    // 获取当前用户作为默认作者（优先使用真实姓名）
    const getCurrentUserAuthor = () => {
        if (component.autoCurrentUser && userInfo) {
            return userInfo.realName || '';
        }
        return '';
    };

    useEffect(() => {
        // 根据组件配置决定是否从用户表加载作者数据
        if (component.fromUserTable) {
            loadAuthors();
        } else {
            // 如果不从用户表加载，清空作者列表
            setAuthors([]);
        }
    }, [component.fromUserTable]);

    // 当组件重新挂载时，如果启用了从用户表加载，则重新获取数据
    useEffect(() => {
        if (component.fromUserTable) {
            loadAuthors();
        }
    }, []); // 组件挂载时执行

    const loadAuthors = async (forceReload = false) => {
        try {
            setLoading(true);
            // 清空现有数据，确保重新加载
            setAuthors([]);

            if (forceReload) {
                console.log('强制从用户表重新加载作者数据...');
            }

            // 从用户表获取所有活跃用户，不使用缓存
            const response = await getUsers({
                status: 'active',
                limit: 1000,  // 获取足够多的用户
                _t: Date.now()  // 添加时间戳避免缓存
            });

            console.log('从用户表加载作者数据:', response);

            const userList = response.data || [];
            if (userList.length === 0) {
                console.warn('用户表中没有找到活跃用户');
                return;
            }

            console.log(`成功从用户表加载 ${userList.length} 个用户作为作者选项`);

            setAuthors(userList.map((user: any) => ({
                value: user.realName || user.username,
                label: user.realName || user.username,
                userId: user._id,
                role: user.role // 保存用户角色以便调试
            })));
        } catch (error) {
            console.error('从用户表加载作者列表失败:', error);
            setAuthors([]); // 确保错误时清空数据
        } finally {
            setLoading(false);
        }
    };

    // 如果启用了从用户表选择作者
    if (component.fromUserTable) {
        if (component.authorSelectMode === 'select') {
            const currentUserAuthor = getCurrentUserAuthor();
            const defaultValue = currentUserAuthor || component.defaultValue;

            return (
                <Select
                    placeholder={component.placeholder || '请选择作者'}
                    disabled={component.disabled || loading}
                    style={{ width: '100%' }}
                    allowClear={component.allowClear}
                    showSearch={component.allowSearch}
                    loading={loading}
                    prefix={getSelectPrefix()}
                    value={defaultValue}
                    filterOption={(input, option) =>
                        option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                    }
                >
                    {authors.map((author) => (
                        <Select.Option key={author.userId} value={author.value}>
                            {author.label}
                        </Select.Option>
                    ))}
                </Select>
            );
        } else {
            // 自动完成模式
            const currentUserAuthor = getCurrentUserAuthor();
            const defaultValue = currentUserAuthor || component.defaultValue;

            return (
                <AutoComplete
                    placeholder={component.placeholder || '请输入或选择作者'}
                    disabled={component.disabled || loading}
                    style={{ width: '100%' }}
                    options={authors}
                    prefix={getSelectPrefix()}
                    value={defaultValue}
                    filterOption={(inputValue, option) =>
                        option?.value?.toString().toLowerCase().includes(inputValue.toLowerCase()) || false
                    }
                    allowClear={component.allowClear}
                />
            );
        }
    }

    // 普通文本输入模式
    const currentUserAuthor = getCurrentUserAuthor();
    const defaultValue = currentUserAuthor || component.defaultValue;

    return (
        <Input
            placeholder={component.placeholder || '请输入作者真实姓名'}
            disabled={component.disabled}
            maxLength={component.maxLength || 50}
            showCount={component.showCharCount}
            prefix={getInputPrefix()}
            value={defaultValue}
        />
    );
};

export default AuthorComponent; 