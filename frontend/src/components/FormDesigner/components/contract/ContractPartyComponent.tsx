import React, { useState, useEffect } from 'react';
import { Card, Input, Space, Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getOrganizationEnterprises, Enterprise } from '../../../../api/enterprises';
import { getEmployees, getClientUsers, User } from '../../../../api/users';
import { getClients, Client } from '../../../../api/clients';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface ContractPartyComponentProps {
    component: FormComponent;
}

const ContractPartyComponent: React.FC<ContractPartyComponentProps> = ({ component }) => {
    const partyCount = component.partyCount || 2;
    const { updateComponent } = useFormDesignerStore();
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [ourEnterpriseData, setOurEnterpriseData] = useState<Enterprise | null>(null);
    const [employees, setEmployees] = useState<User[]>([]);
    const [selectedContact, setSelectedContact] = useState<User | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [clientUsers, setClientUsers] = useState<User[]>([]);

    // 中文序数映射
    const getChineseOrder = (index: number): string => {
        const orders = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        return orders[index] || `第${index + 1}`;
    };

    // 获取我方在合同中的位置索引
    const getOurPartyIndex = (): number => {
        const orders = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        return orders.indexOf(component.ourParty || '甲');
    };

    // 处理联系人选择
    const handleContactSelect = (userId: string) => {
        updateComponent(component.id, { selectedContactId: userId });
    };

    // 处理客户选择
    const handleClientSelect = (partyIndex: number, clientName: string) => {
        const clientData = clients.find(client => client.name === clientName);
        updateComponent(component.id, {
            [`party${partyIndex}ClientName`]: clientName,
            [`party${partyIndex}ClientData`]: clientData
        });
    };

    // 处理客户联系人选择
    const handleClientContactSelect = (partyIndex: number, userId: string) => {
        const contactData = clientUsers.find(user => user._id === userId);
        updateComponent(component.id, {
            [`party${partyIndex}ContactId`]: userId,
            [`party${partyIndex}ContactData`]: contactData
        });
    };

    // 处理字段手动编辑
    const handleFieldChange = (partyIndex: number, fieldName: string, value: string) => {
        updateComponent(component.id, {
            [`party${partyIndex}${fieldName}`]: value
        });
    };

    // 获取企业数据并找到我方承接团队的详细信息
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取企业数据
                const enterpriseResponse = await getOrganizationEnterprises();
                if (enterpriseResponse.success) {
                    setEnterprises(enterpriseResponse.data);

                    // 查找我方承接团队的详细数据
                    if (component.ourTeam) {
                        const ourEnterprise = enterpriseResponse.data.find(
                            (enterprise: Enterprise) => enterprise.enterpriseName === component.ourTeam
                        );
                        setOurEnterpriseData(ourEnterprise || null);
                    }
                }

                // 获取员工数据
                const employeeResponse = await getEmployees();
                if (employeeResponse.success) {
                    setEmployees(employeeResponse.data);
                }

                // 获取客户数据（如果启用了客户数据开关）
                if (component.enableClientData) {
                    const [clientResponse, clientUserResponse] = await Promise.all([
                        getClients(),
                        getClientUsers()
                    ]);

                    if (clientResponse.success) {
                        setClients(clientResponse.data);
                    }
                    if (clientUserResponse.success) {
                        setClientUsers(clientUserResponse.data);
                    }
                }
            } catch (error) {
                console.error('获取数据失败:', error);
            }
        };

        fetchData();
    }, [component.ourTeam, component.enableClientData]);

    // 处理选中联系人的变化
    useEffect(() => {
        if (component.selectedContactId && employees.length > 0) {
            const contact = employees.find(emp => emp._id === component.selectedContactId);
            setSelectedContact(contact || null);
        } else {
            setSelectedContact(null);
        }
    }, [component.selectedContactId, employees]);

    // 生成每个合作方的输入字段
    const renderPartyFields = (partyIndex: number) => {
        const partyLabel = `${getChineseOrder(partyIndex)}方`;
        const isOurParty = partyIndex === getOurPartyIndex();
        const enterpriseData = isOurParty ? ourEnterpriseData : null;

        // 获取当前方的客户数据
        const currentClientName = (component as any)[`party${partyIndex}ClientName`];
        const currentClientData = (component as any)[`party${partyIndex}ClientData`];
        const currentContactId = (component as any)[`party${partyIndex}ContactId`];
        const currentContactData = (component as any)[`party${partyIndex}ContactData`];

        // 获取手动编辑的字段值，如果没有则使用自动填充的值
        const getFieldValue = (fieldName: string, autoValue: string) => {
            const manualValue = (component as any)[`party${partyIndex}${fieldName}`];
            return manualValue !== undefined ? manualValue : autoValue;
        };

        // 过滤与选中客户相关的联系人
        const filteredClientUsers = clientUsers.filter(user =>
            user.company === currentClientName || !currentClientName
        );

        return (
            <Card
                key={partyIndex}
                title={partyLabel}
                size="small"
                style={{
                    marginBottom: partyIndex < partyCount - 1 ? '16px' : '0',
                    ...component.style
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {component.showCompanyName !== false && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                公司名称 {component.required && <span style={{ color: '#ff4d4f' }}>*</span>}
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                                {!isOurParty && component.enableClientData && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(客户数据)</span>}
                            </label>
                            {isOurParty ? (
                                <Input
                                    placeholder="请输入公司名称"
                                    value={enterpriseData?.enterpriseName || ''}
                                    readOnly={true}
                                    style={{
                                        backgroundColor: enterpriseData ? '#f6ffed' : undefined,
                                        borderColor: enterpriseData ? '#b7eb8f' : undefined
                                    }}
                                />
                            ) : component.enableClientData ? (
                                <Select
                                    placeholder="请选择公司名称"
                                    value={currentClientName || undefined}
                                    onChange={(value) => handleClientSelect(partyIndex, value)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: currentClientData ? '#f6ffed' : undefined
                                    }}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {clients.map((client) => (
                                        <Select.Option key={client._id} value={client.name}>
                                            {client.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    placeholder="请输入公司名称"
                                    value={getFieldValue('CompanyName', currentClientData?.name || '')}
                                    onChange={(e) => handleFieldChange(partyIndex, 'CompanyName', e.target.value)}
                                    style={{
                                        backgroundColor: currentClientData ? '#f6ffed' : undefined,
                                        borderColor: currentClientData ? '#b7eb8f' : undefined
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {component.showShortName && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                简称
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            <Input
                                placeholder="请输入公司简称"
                                value={isOurParty ? (enterpriseData?.enterpriseAlias || '') : getFieldValue('ShortName', '')}
                                onChange={isOurParty ? undefined : (e) => handleFieldChange(partyIndex, 'ShortName', e.target.value)}
                                readOnly={isOurParty}
                                style={{
                                    backgroundColor: isOurParty && enterpriseData ? '#f6ffed' : undefined,
                                    borderColor: isOurParty && enterpriseData ? '#b7eb8f' : undefined
                                }}
                            />
                        </div>
                    )}

                    {component.showCreditCode && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                统一社会信用代码
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            <Input
                                placeholder="请输入统一社会信用代码"
                                value={isOurParty ? (enterpriseData?.creditCode || '') : getFieldValue('CreditCode', '')}
                                onChange={isOurParty ? undefined : (e) => handleFieldChange(partyIndex, 'CreditCode', e.target.value)}
                                readOnly={isOurParty}
                                style={{
                                    backgroundColor: isOurParty && enterpriseData ? '#f6ffed' : undefined,
                                    borderColor: isOurParty && enterpriseData ? '#b7eb8f' : undefined
                                }}
                            />
                        </div>
                    )}

                    {component.showAddress && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                地址
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            <Input
                                placeholder="请输入地址"
                                value={isOurParty ? (enterpriseData?.companyAddress || '') : getFieldValue('Address', currentClientData?.address || '')}
                                onChange={isOurParty ? undefined : (e) => handleFieldChange(partyIndex, 'Address', e.target.value)}
                                readOnly={isOurParty}
                                style={{
                                    backgroundColor: (isOurParty && enterpriseData) || (!isOurParty && currentClientData) ? '#f6ffed' : undefined,
                                    borderColor: (isOurParty && enterpriseData) || (!isOurParty && currentClientData) ? '#b7eb8f' : undefined
                                }}
                            />
                        </div>
                    )}

                    {component.showContactPerson !== false && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                联系人 {component.required && <span style={{ color: '#ff4d4f' }}>*</span>}
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            {isOurParty ? (
                                <Select
                                    placeholder="请选择联系人"
                                    value={component.selectedContactId || undefined}
                                    onChange={handleContactSelect}
                                    style={{
                                        width: '100%',
                                        backgroundColor: selectedContact ? '#f6ffed' : undefined
                                    }}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {employees.map((employee) => (
                                        <Select.Option key={employee._id} value={employee._id}>
                                            {employee.realName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : component.enableClientData ? (
                                <Select
                                    placeholder="请选择联系人"
                                    value={currentContactId || undefined}
                                    onChange={(value) => handleClientContactSelect(partyIndex, value)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: currentContactData ? '#f6ffed' : undefined
                                    }}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {filteredClientUsers.map((user) => (
                                        <Select.Option key={user._id} value={user._id}>
                                            {user.realName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    placeholder="请输入联系人姓名"
                                    value=""
                                    readOnly={true}
                                />
                            )}
                        </div>
                    )}

                    {component.showPhone && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                电话
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            <Input
                                placeholder="请输入联系电话"
                                value={isOurParty ? (selectedContact?.phone || '') : getFieldValue('Phone', currentContactData?.phone || '')}
                                onChange={isOurParty ? undefined : (e) => handleFieldChange(partyIndex, 'Phone', e.target.value)}
                                readOnly={isOurParty}
                                style={{
                                    backgroundColor: (isOurParty && selectedContact) || (!isOurParty && currentContactData) ? '#f6ffed' : undefined,
                                    borderColor: (isOurParty && selectedContact) || (!isOurParty && currentContactData) ? '#b7eb8f' : undefined
                                }}
                            />
                        </div>
                    )}

                    {component.showEmail && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                邮箱
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            <Input
                                placeholder="请输入邮箱地址"
                                value={isOurParty ? (selectedContact?.email || '') : getFieldValue('Email', currentContactData?.email || '')}
                                onChange={isOurParty ? undefined : (e) => handleFieldChange(partyIndex, 'Email', e.target.value)}
                                readOnly={isOurParty}
                                style={{
                                    backgroundColor: (isOurParty && selectedContact) || (!isOurParty && currentContactData) ? '#f6ffed' : undefined,
                                    borderColor: (isOurParty && selectedContact) || (!isOurParty && currentContactData) ? '#b7eb8f' : undefined
                                }}
                            />
                        </div>
                    )}

                    {component.showLegalRepresentative && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                法人代表
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            <Input
                                placeholder="请输入法人代表姓名"
                                value={isOurParty ? (enterpriseData?.legalRepresentative || '') : getFieldValue('LegalRepresentative', '')}
                                onChange={isOurParty ? undefined : (e) => handleFieldChange(partyIndex, 'LegalRepresentative', e.target.value)}
                                readOnly={isOurParty}
                                style={{
                                    backgroundColor: isOurParty && enterpriseData ? '#f6ffed' : undefined,
                                    borderColor: isOurParty && enterpriseData ? '#b7eb8f' : undefined
                                }}
                            />
                        </div>
                    )}

                    {component.showLegalRepresentativeId && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
                                法人代表证件号码
                                {isOurParty && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(我方)</span>}
                            </label>
                            <Input
                                placeholder="请输入法人代表证件号码"
                                value={isOurParty ? (enterpriseData?.legalRepresentativeId || '') : getFieldValue('LegalRepresentativeId', '')}
                                onChange={isOurParty ? undefined : (e) => handleFieldChange(partyIndex, 'LegalRepresentativeId', e.target.value)}
                                readOnly={isOurParty}
                                style={{
                                    backgroundColor: isOurParty && enterpriseData ? '#f6ffed' : undefined,
                                    borderColor: isOurParty && enterpriseData ? '#b7eb8f' : undefined
                                }}
                            />
                        </div>
                    )}
                </Space>
            </Card>
        );
    };

    return (
        <div style={{ width: '100%' }}>
            {Array.from({ length: partyCount }, (_, index) => renderPartyFields(index))}
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '8px',
                    lineHeight: '1.4'
                }}>
                    {component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ContractPartyComponent; 