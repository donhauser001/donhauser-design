import React, { useState, useEffect } from 'react';
import { Input, Select, Spin, Alert } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix, getSmallLinearIcon } from '../../utils/iconUtils';
import { contactService, ContactItem } from '../../services/contactService';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

const { Option } = Select;

interface ContactComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ContactComponent: React.FC<ContactComponentProps> = ({ component, isDesignMode = false }) => {
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [allContacts, setAllContacts] = useState<ContactItem[]>([]); // 存储所有联系人数据

    // 从store获取所有组件信息
    const { components, getComponentValue, componentValues, theme } = useFormDesignerStore();

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    // 检查画布中是否有符合条件的客户组件
    const checkClientComponent = () => {
        const clientComponents = components.filter(comp =>
            comp.type === 'client' && comp.fromClientTable === true
        );
        return clientComponents.length > 0 ? clientComponents[0] : null;
    };

    // 根据客户组件的选择过滤联系人
    const filterContactsByCompany = (contactsList: ContactItem[], selectedCompany?: string) => {
        // 如果开启了公司过滤
        if (component.enableCompanyFilter) {
            // 没有选择公司时，返回空数组
            if (!selectedCompany) {
                return [];
            }
            // 有选择公司时，按公司过滤（支持双向包含匹配）
            const filtered = contactsList.filter(contact => {
                if (!contact.company) return false;

                // 双向包含匹配：客户名称包含联系人公司 或 联系人公司包含客户名称
                const companyMatch = contact.company.includes(selectedCompany) ||
                    selectedCompany.includes(contact.company);

                // 添加调试信息
                if (companyMatch) {
                    console.log('匹配联系人:', {
                        contactName: contact.realName,
                        contactCompany: contact.company,
                        selectedCompany: selectedCompany
                    });
                }

                return companyMatch;
            });

            console.log('过滤结果:', {
                selectedCompany,
                totalContacts: contactsList.length,
                filteredCount: filtered.length,
                filteredContacts: filtered.map(c => ({ name: c.realName, company: c.company }))
            });

            return filtered;
        }

        // 未开启公司过滤时，返回所有联系人
        return contactsList;
    };

    // 获取客户组件的当前选择值
    const getSelectedCompany = () => {
        const clientComponent = checkClientComponent();
        if (!clientComponent) return '';

        // 优先从运行时值获取，然后是defaultValue
        const runtimeValue = getComponentValue(clientComponent.id);
        const selectedValue = runtimeValue || clientComponent.defaultValue || '';

        // 添加详细调试信息
        console.log('联系人组件调试:', {
            enableCompanyFilter: component.enableCompanyFilter,
            clientComponent: {
                id: clientComponent.id,
                type: clientComponent.type,
                fromClientTable: clientComponent.fromClientTable,
                defaultValue: clientComponent.defaultValue,
                runtimeValue: runtimeValue
            },
            selectedCompany: selectedValue,
            allContacts: allContacts.length,
            filteredContacts: contacts.length
        });

        return selectedValue;
    };

    // 加载联系人数据
    const loadContacts = async () => {
        if (!component.fromContactTable) return;

        setLoading(true);
        try {
            const contactData = await contactService.getAllContacts();
            setAllContacts(contactData); // 存储所有联系人数据

            // 如果开启了公司过滤，根据当前选择的公司过滤联系人
            const selectedCompany = getSelectedCompany();
            const filteredContacts = filterContactsByCompany(contactData, selectedCompany);
            setContacts(filteredContacts);
        } catch (error) {
            console.error('加载联系人数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 搜索联系人
    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            loadContacts();
            return;
        }

        setSearchLoading(true);
        try {
            const searchResults = await contactService.searchContacts(value);

            // 如果开启了公司过滤，对搜索结果也进行过滤
            const selectedCompany = getSelectedCompany();
            const filteredResults = filterContactsByCompany(searchResults, selectedCompany);
            setContacts(filteredResults);
        } catch (error) {
            console.error('搜索联系人失败:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    // 当组件切换到联系人表模式时加载数据
    useEffect(() => {
        if (component.fromContactTable) {
            loadContacts();
        }
    }, [component.fromContactTable]);

    // 监听客户组件的变化，当公司过滤开启时重新过滤联系人
    useEffect(() => {
        if (component.enableCompanyFilter && allContacts.length > 0) {
            const selectedCompany = getSelectedCompany();
            const filteredContacts = filterContactsByCompany(allContacts, selectedCompany);
            setContacts(filteredContacts);
        }
    }, [components, component.enableCompanyFilter, allContacts, componentValues]);

    // 检查公司过滤的前置条件
    const getCompanyFilterStatus = () => {
        if (!component.enableCompanyFilter) {
            return { valid: true, message: '' };
        }

        const clientComponent = checkClientComponent();
        if (!clientComponent) {
            return {
                valid: false,
                message: '画布中未找到客户组件，请先添加客户组件并开启"来自客户表"模式'
            };
        }

        if (!clientComponent.fromClientTable) {
            return {
                valid: false,
                message: '客户组件未开启"来自客户表"模式，请在客户组件属性中开启此选项'
            };
        }

        return { valid: true, message: '' };
    };

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
        const companyFilterStatus = getCompanyFilterStatus();
        const selectedCompany = getSelectedCompany();

        const selectComponent = (
            <Select
                showSearch
                mode={component.allowMultipleContacts ? 'multiple' : undefined}
                placeholder={component.placeholder || (component.allowMultipleContacts ? '请选择联系人（可多选）' : '请选择联系人')}
                value={component.defaultValue || undefined}
                style={{ width: '100%', ...(component.style as React.CSSProperties) }}
                styles={{
                    popup: { root: { minWidth: '400px' } }
                }}
                loading={loading || searchLoading}
                onSearch={handleSearch}
                onSelect={() => {
                    // 选择完成后，清空搜索词，恢复显示所有联系人
                    handleSearch('');
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
                            {(() => {
                                if (component.enableCompanyFilter && !companyFilterStatus.valid) {
                                    return '请先配置客户组件';
                                }
                                if (component.enableCompanyFilter && companyFilterStatus.valid && !selectedCompany) {
                                    return '请先选择客户';
                                }
                                return '暂无联系人数据';
                            })()}
                        </div>
                    )
                }
                popupRender={(menu) => (
                    <div>
                        {menu}
                        {(contacts.length > 0 || (component.enableCompanyFilter && companyFilterStatus.valid)) && (
                            <div style={{
                                padding: '8px 12px',
                                fontSize: '12px',
                                color: '#999',
                                borderTop: `1px solid ${theme.borderColor || '#d9d9d9'}`,
                                backgroundColor: '#fafafa'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '4px' }}>
                                    {contacts.length > 0 ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>共 {contacts.length} 个联系人</span>
                                            <span>支持搜索姓名、公司、电话</span>
                                        </div>
                                    ) : component.enableCompanyFilter && companyFilterStatus.valid && !selectedCompany ? (
                                        <div style={{ textAlign: 'center' }}>
                                            请先在客户组件中选择公司，然后联系人列表将显示该公司的联系人
                                        </div>
                                    ) : null}

                                    {component.enableCompanyFilter && companyFilterStatus.valid && selectedCompany && (
                                        <div style={{ fontSize: '11px' }}>
                                            已过滤公司：{selectedCompany}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            >
                {contacts.map(contact => {
                    const isDisabled = contact.status === 'inactive';

                    return (
                        <Option
                            key={contact._id}
                            value={contact.realName}
                            disabled={isDisabled}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                opacity: isDisabled ? 0.5 : 1
                            }}>
                                {/* 左侧：联系人姓名 */}
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
                                    {contact.realName}
                                    {/* 停用联系人显示禁用标签 */}
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

                                {/* 右侧：动态显示信息 */}
                                {(component.showContactPhone || component.showContactEmail || component.showContactCompany || component.showContactPosition) && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        flexShrink: 0,
                                        fontSize: '11px',
                                        flexWrap: 'wrap'
                                    }}>
                                        {component.showContactPhone && contact.phone && (
                                            <span style={{
                                                color: '#666',
                                                fontSize: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {getSmallLinearIcon('phone')}
                                                {contact.phone}
                                            </span>
                                        )}

                                        {component.showContactEmail && contact.email && (
                                            <span style={{
                                                color: '#666',
                                                fontSize: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {getSmallLinearIcon('email')}
                                                {contact.email}
                                            </span>
                                        )}

                                        {component.showContactCompany && contact.company && (
                                            <span style={{
                                                color: '#666',
                                                fontSize: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {getSmallLinearIcon('company')}
                                                {contact.company}
                                            </span>
                                        )}

                                        {component.showContactPosition && contact.position && (
                                            <span style={{
                                                color: '#666',
                                                fontSize: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {getSmallLinearIcon('user')}
                                                {contact.position}
                                            </span>
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
            const containerClass = `contact-select-with-icon-${component.id}`;
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

    const companyFilterStatus = getCompanyFilterStatus();

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                {component.fromContactTable ? renderSelectMode() : renderInputMode()}

                {/* 公司过滤错误提示 */}
                {component.enableCompanyFilter && !companyFilterStatus.valid && (
                    <Alert
                        message="公司过滤配置错误"
                        description={companyFilterStatus.message}
                        type="warning"
                        showIcon
                        style={{ marginTop: '8px' }}
                    />
                )}
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ContactComponent; 