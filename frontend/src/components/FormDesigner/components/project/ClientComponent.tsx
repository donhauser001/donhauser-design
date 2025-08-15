import React, { useState, useEffect } from 'react';
import { Input, Select, Spin, Rate } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';
import { clientService, ClientItem } from '../../services/clientService';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

const { Option } = Select;

interface ClientComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ClientComponent: React.FC<ClientComponentProps> = ({ component, isDesignMode = false }) => {
    const [clients, setClients] = useState<ClientItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const { setComponentValue, getComponentValue, theme } = useFormDesignerStore();

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    // 加载客户数据
    const loadClients = async () => {
        if (!component.fromClientTable) return;

        setLoading(true);
        try {
            const clientData = await clientService.getAllClients();
            setClients(clientData);
        } catch (error) {
            console.error('加载客户数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 搜索客户
    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            loadClients();
            return;
        }

        setSearchLoading(true);
        try {
            const searchResults = await clientService.searchClients(value);
            setClients(searchResults);
        } catch (error) {
            console.error('搜索客户失败:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    // 当组件切换到客户表模式时加载数据
    useEffect(() => {
        if (component.fromClientTable) {
            loadClients();
        }
    }, [component.fromClientTable]);

    // 渲染输入框模式
    const renderInputMode = () => (
        <Input
            placeholder={component.placeholder}
            value={component.defaultValue || ''}
            prefix={getPrefix()}
            style={component.style as React.CSSProperties}
            readOnly={isDesignMode}
        />
    );

    // 渲染下拉框模式
    const renderSelectMode = () => {
        const selectComponent = (
            <Select
                showSearch
                placeholder={component.placeholder || '请选择客户'}
                value={getComponentValue(component.id) || component.defaultValue || undefined}
                style={{ width: '100%', ...(component.style as React.CSSProperties) }}
                styles={{
                    popup: { root: { minWidth: '300px' } }
                }}
                loading={loading || searchLoading}
                onSearch={handleSearch}
                onSelect={(value) => {
                    // 选择完成后，清空搜索词，恢复显示所有客户
                    handleSearch('');
                    // 保存运行时选择值，供其他组件使用
                    setComponentValue(component.id, value);
                    console.log('客户组件选择值已保存:', { componentId: component.id, value });
                }}
                filterOption={false} // 禁用本地过滤，使用服务器端搜索
                notFoundContent={
                    loading || searchLoading ? (
                        <div style={{ textAlign: 'center', padding: '12px' }}>
                            <Spin size="small" />
                            <div style={{ marginTop: '8px', color: '#999', fontSize: '12px' }}>
                                加载中...
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '12px', color: '#999' }}>
                            暂无客户数据
                        </div>
                    )
                }
                popupRender={(menu) => (
                    <div>
                        {menu}
                        {clients.length > 0 && (
                            <div style={{
                                padding: '8px 12px',
                                fontSize: '12px',
                                color: '#999',
                                borderTop: `1px solid ${theme.borderColor || '#d9d9d9'}`,
                                backgroundColor: '#fafafa'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>共 {clients.length} 个客户</span>
                                    <span>支持搜索客户名称</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            >
                {clients.map(client => {
                    const isDisabled = client.status === 'inactive';

                    return (
                        <Option
                            key={client._id}
                            value={client.name}
                            disabled={isDisabled}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                opacity: isDisabled ? 0.5 : 1
                            }}>
                                {/* 左侧：客户名称 */}
                                <div style={{
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    flex: 1,
                                    textAlign: 'left',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    marginRight: '12px'
                                }}>
                                    {client.name}
                                    {/* 停用客户显示禁用标签 */}
                                    {isDisabled && (
                                        <span
                                            style={{
                                                color: '#f5222d',
                                                backgroundColor: '#fff2f0',
                                                padding: '1px 6px',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: 500,
                                                marginLeft: '8px'
                                            }}
                                        >
                                            禁用
                                        </span>
                                    )}
                                </div>

                                {/* 右侧：动态显示信息（排除状态，因为状态已经用禁用标签表示了） */}
                                {(component.showClientCategory || component.showClientRating) && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        flexShrink: 0,
                                        fontSize: '11px'
                                    }}>
                                        {component.showClientCategory && client.category && (
                                            <span style={{
                                                color: '#666',
                                                fontSize: '12px'
                                            }}>
                                                {client.category}
                                            </span>
                                        )}

                                        {component.showClientRating && client.rating > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '2px'
                                            }}>
                                                <Rate
                                                    disabled
                                                    value={client.rating}
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#faad14'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Option>
                    );
                })}
            </Select>
        );

        // 如果有图标，则包装在带图标的容器中
        if (component.icon) {
            const containerClass = `client-select-with-icon-${component.id}`;
            return (
                <div className={containerClass} style={{ position: 'relative', width: '100%' }}>
                    <style>
                        {`
                        .${containerClass} .ant-select .ant-select-selector {
                            padding-left: 32px !important;
                        }
                        .${containerClass} .ant-select .ant-select-selection-search-input {
                            padding-left: 32px !important;
                        }
                        .${containerClass} .ant-select .ant-select-selection-item {
                            padding-left: 0 !important;
                        }
                        .${containerClass} .ant-select .ant-select-selection-placeholder {
                            padding-left: 0 !important;
                        }
                        `}
                    </style>
                    <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: 'calc(50% + 2px)',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}>
                        {getPrefix()}
                    </div>
                    {selectComponent}
                </div>
            );
        }

        return selectComponent;
    };

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                {component.fromClientTable ? renderSelectMode() : renderInputMode()}
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ClientComponent; 