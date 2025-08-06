import React from 'react'
import { Form, Select, Input, Button, Tag } from 'antd'
import { Client, Contact } from './types'


const { Option } = Select

interface StepOneProps {
    form: any
    clients: Client[]
    contacts: Contact[]
    selectedClientId: string
    selectedContactIds: string[]
    projectName: string
    onClientSelect: (clientId: string) => void
    onContactSelect: (contactIds: string[]) => void
    onProjectNameChange: (name: string) => void
    onNext: () => void
    onCancel: () => void
    onClientSearch?: (search: string) => void
    clientLoading?: boolean
    isUpdateMode?: boolean
}

const StepOne: React.FC<StepOneProps> = ({
    form,
    clients,
    contacts,
    selectedClientId,
    selectedContactIds,
    projectName,
    onClientSelect,
    onContactSelect,
    onProjectNameChange,
    onNext,
    onCancel,
    onClientSearch,
    clientLoading = false,
    isUpdateMode = false
}) => {
    // 监听状态变化，确保表单字段同步
    React.useEffect(() => {


        // 同步表单字段值
        form.setFieldsValue({
            clientId: selectedClientId,
            contactId: selectedContactIds, // 直接使用数组，而不是第一个元素
            projectName: projectName
        })
    }, [selectedClientId, selectedContactIds, projectName, form])

    return (
        <div>
            <Form.Item
                name="clientId"
                label={isUpdateMode ? "当前客户" : "选择客户"}
                rules={[{ required: true, message: '请选择客户' }]}
            >
                <Select
                    placeholder="请选择客户"
                    showSearch
                    value={selectedClientId}
                    loading={clientLoading}
                    disabled={isUpdateMode}
                    onChange={(value: string | undefined) => {
                        onClientSelect(value || '')
                        form.setFieldsValue({ clientId: value })
                    }}
                    onSearch={(value: string) => {
                        if (onClientSearch) {
                            onClientSearch(value)
                        }
                    }}
                    filterOption={false}
                >
                    {clients.map(client => (
                        <Option
                            key={client.id || client._id}
                            value={client.id || client._id}
                            disabled={client.status === 'inactive'}
                        >
                            {client.companyName || client.name}
                            {client.status === 'inactive' && <Tag color="red" style={{ marginLeft: 8 }}>已禁用</Tag>}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            {!isUpdateMode && clients.some(client => client.status === 'inactive') && (
                <div style={{ fontSize: 12, color: '#666', marginTop: 4, marginBottom: 16 }}>
                    如果你选择的客户显示为（已禁用）请先取消禁用后再来操作
                </div>
            )}

            <Form.Item
                name="contactId"
                label={
                    <span>
                        选择联系人
                        {contacts.length > 0 && (
                            <span style={{ fontSize: 12, color: '#666', marginLeft: 8, fontWeight: 'normal' }}>
                                (共找到 {contacts.length} 个)
                            </span>
                        )}
                    </span>
                }
                rules={[{ required: true, message: '请选择联系人' }]}
            >
                <Select
                    placeholder={contacts.length === 0 ? "请先选择客户" : "请选择联系人"}
                    disabled={contacts.length === 0}
                    mode="multiple"
                    value={selectedContactIds || []}
                    onChange={(values: string[]) => {

                        onContactSelect(values)
                        form.setFieldsValue({ contactId: values }) // 直接使用数组
                    }}
                    showSearch
                    filterOption={(input, option) => {
                        const children = option?.children
                        if (typeof children === 'string') {
                            return children.toLowerCase().includes(input.toLowerCase())
                        }
                        return false
                    }}
                >
                    {contacts.map(contact => (
                        <Option
                            key={contact.id || contact._id}
                            value={contact.id || contact._id}
                            disabled={contact.status === 'inactive'}
                        >
                            {contact.realName}
                            {contact.status === 'inactive' && <Tag color="red" style={{ marginLeft: 8 }}>已禁用</Tag>}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            {!isUpdateMode && contacts.length > 0 && contacts.some(contact => contact.status === 'inactive') && (
                <div style={{ fontSize: 12, color: '#666', marginTop: 2, marginBottom: 16 }}>
                    如果你选择的用户显示为（已禁用）请先取消禁用后再来操作
                </div>
            )}

            <Form.Item
                name="projectName"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
            >
                <Input
                    placeholder="请输入项目名称"
                    value={projectName}
                    onChange={(e) => {
                        onProjectNameChange(e.target.value)
                        form.setFieldsValue({ projectName: e.target.value })
                    }}
                />
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
                {/* 状态信息 */}
                <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    客户: {selectedClientId ? '已选择 ✓' : '未选择'} |
                    联系人: {selectedContactIds.length > 0 ? `已选择 ${selectedContactIds.length} 个 ✓` : '未选择'} |
                    项目名称: {projectName ? '已填写 ✓' : '未填写'}
                </div>
                <Button
                    style={{ marginRight: 8 }}
                    onClick={onCancel}
                >
                    取消
                </Button>
                <Button
                    type="primary"
                    onClick={onNext}
                    disabled={!selectedClientId || selectedContactIds.length === 0 || !projectName}
                >
                    下一步
                </Button>
            </div>
        </div>
    )
}

export default StepOne 