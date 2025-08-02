import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Modal, Form, Input, message, Table, Tag, Select, Avatar, Dropdown, Tree, Divider } from 'antd'
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, SettingOutlined, LockOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import PermissionSelector from '../../components/PermissionSelector'
import axios from 'axios'

const { Option } = Select

interface EmployeeData {
    id: string
    name: string
    departmentId: string
    departmentName: string
    enterpriseId: string
    enterpriseName: string
    position: string
    email: string
    phone: string
    status: 'active' | 'inactive'
    createTime: string
}

// 从用户表获取员工数据的接口
interface UserData {
    id: string
    username: string
    email: string
    phone: string
    realName: string
    userType: 'super_admin' | 'employee' | 'client'
    role: string
    department: string
    status: 'active' | 'inactive'
    createTime: string
    // 企业员工特有字段
    enterpriseId?: string
    enterpriseName?: string
    departmentId?: string
    departmentName?: string
    position?: string
    password?: string // 新增密码字段
    // 用户权限
    permissions?: string[]
    // 用户权限组
    permissionGroups?: string[]
}

interface DepartmentData {
    id: string
    name: string
    enterpriseId: string
}

interface EnterpriseData {
    id: string
    enterpriseName: string
}

interface PermissionData {
    key: string
    title: string
    children?: PermissionData[]
}

interface PermissionGroup {
    id: string
    name: string
    description: string
    permissions: string[]
    createTime: string
}

const Employee: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<UserData | null>(null)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [selectedEnterprise, setSelectedEnterprise] = useState<string>('')
    const [selectedDepartment, setSelectedDepartment] = useState<string>('')

    // 修改密码相关状态
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
    const [resettingEmployee, setResettingEmployee] = useState<UserData | null>(null)
    const [passwordForm] = Form.useForm()
    const [passwordLoading, setPasswordLoading] = useState(false)

    // 权限设置相关状态
    const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [userCheckedKeys, setUserCheckedKeys] = useState<string[]>([])
    const [selectedUserPermissionGroups, setSelectedUserPermissionGroups] = useState<string[]>([])
    const [permissionForm] = Form.useForm()
    const [permissionLoading, setPermissionLoading] = useState(false)

    // 数据状态
    const [enterprises, setEnterprises] = useState<EnterpriseData[]>([])
    const [departments, setDepartments] = useState<DepartmentData[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
    const [treeData, setTreeData] = useState<PermissionData[]>([])

    // 员工数据
    const [userEmployees, setUserEmployees] = useState<UserData[]>([])

    // 获取企业数据
    const fetchEnterprises = async () => {
        try {
            const response = await axios.get('/api/enterprises')
            if (response.data.success) {
                setEnterprises(response.data.data)
            }
        } catch (error) {
            console.error('获取企业数据失败:', error)
            message.error('获取企业数据失败')
        }
    }

    // 获取部门数据
    const fetchDepartments = async (enterpriseId?: string) => {
        try {
            const url = enterpriseId ? `/api/departments?enterpriseId=${enterpriseId}` : '/api/departments'
            const response = await axios.get(url)
            if (response.data.success) {
                setDepartments(response.data.data)
            }
        } catch (error) {
            console.error('获取部门数据失败:', error)
            message.error('获取部门数据失败')
        }
    }

    // 获取权限树数据
    const fetchPermissionTree = async () => {
        try {
            const response = await axios.get('/api/permissions/tree')
            if (response.data.success) {
                setTreeData(response.data.data)
            }
        } catch (error) {
            console.error('获取权限树失败:', error)
            message.error('获取权限树失败')
        }
    }

    // 获取权限组数据
    const fetchPermissionGroups = async () => {
        try {
            const response = await axios.get('/api/permissions/groups')
            if (response.data.success) {
                setPermissionGroups(response.data.data)
            }
        } catch (error) {
            console.error('获取权限组失败:', error)
            message.error('获取权限组失败')
        }
    }

    // 获取所有叶子节点权限的辅助函数
    const getAllLeafPermissions = (nodes: PermissionData[]): string[] => {
        const permissions: string[] = []

        const extractPermissions = (nodeList: PermissionData[]) => {
            nodeList.forEach(node => {
                if (node.children && node.children.length > 0) {
                    extractPermissions(node.children)
                } else {
                    permissions.push(node.key)
                }
            })
        }

        extractPermissions(nodes)
        return permissions
    }

    // 获取员工数据（只获取员工和超级管理员）
    const fetchEmployees = async () => {
        try {
            setTableLoading(true)
            const response = await axios.get('/api/users', {
                params: {
                    role: 'all',
                    status: 'all',
                    page: 1,
                    limit: 100
                }
            })
            if (response.data.success) {
                // 过滤出员工和超级管理员
                const employees = response.data.data.filter((user: UserData) =>
                    user.role === '员工' || user.role === '超级管理员'
                )
                setUserEmployees(employees)
            }
        } catch (error) {
            console.error('获取员工数据失败:', error)
            message.error('获取员工数据失败')
        } finally {
            setTableLoading(false)
        }
    }

    // 组件加载时获取数据
    useEffect(() => {
        fetchEnterprises()
        fetchDepartments()
        fetchEmployees()
        fetchPermissionTree()
        fetchPermissionGroups()
    }, [])

    // 显示新增员工模态窗
    const showAddModal = () => {
        setEditingEmployee(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    // 显示编辑员工模态窗
    const showEditModal = async (employee: UserData) => {
        setEditingEmployee(employee)

        // 如果员工有企业信息，先获取对应的部门数据
        if (employee.enterpriseId) {
            await fetchDepartments(employee.enterpriseId)
        }

        form.setFieldsValue({
            username: employee.username,
            realName: employee.realName,
            email: employee.email,
            phone: employee.phone,
            position: employee.position,
            enterpriseId: employee.enterpriseId,
            departmentId: employee.departmentId,
            status: employee.status
            // 注意：编辑时不设置密码字段，密码修改应该通过单独的功能
        })
        setIsModalVisible(true)
    }

    // 处理模态窗确认
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)

            const enterprise = enterprises.find(e => e.id === values.enterpriseId)
            const department = departments.find(d => d.id === values.departmentId && d.enterpriseId === values.enterpriseId)

            if (editingEmployee) {
                // 编辑员工 - 不更新密码
                const { password, ...updateValues } = values
                const updatedEmployee = {
                    ...updateValues,
                    enterpriseName: enterprise?.enterpriseName || '',
                    departmentName: department?.name || '',
                    role: '员工'
                }

                // 调用API更新员工信息
                await axios.put(`/api/users/${editingEmployee.id}`, updatedEmployee)
                message.success('员工信息更新成功')
            } else {
                // 新增员工 - 包含密码
                const newEmployee = {
                    ...values,
                    role: '员工',
                    department: department?.name || '',
                    enterpriseName: enterprise?.enterpriseName || '',
                    departmentName: department?.name || ''
                }

                // 调用API创建员工
                await axios.post('/api/users', newEmployee)
                message.success('员工创建成功')
            }

            fetchEmployees() // 重新获取员工数据

            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('员工表单验证失败:', error)
        } finally {
            setLoading(false)
        }
    }

    // 处理模态窗取消
    const handleModalCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
        setEditingEmployee(null)
    }

    // 显示修改密码模态窗
    const showResetPasswordModal = (employee: UserData) => {
        setResettingEmployee(employee)
        passwordForm.resetFields()
        setIsPasswordModalVisible(true)
    }

    // 处理修改密码模态窗确认
    const handlePasswordModalOk = async () => {
        try {
            const values = await passwordForm.validateFields()
            setPasswordLoading(true)

            // 调用API更新密码
            await axios.put(`/api/users/${resettingEmployee?.id}/reset-password`, {
                newPassword: values.newPassword
            })
            message.success('密码修改成功')

            setIsPasswordModalVisible(false)
            passwordForm.resetFields()
            setResettingEmployee(null)
        } catch (error) {
            console.error('密码修改失败:', error)
            message.error('密码修改失败')
        } finally {
            setPasswordLoading(false)
        }
    }

    // 处理修改密码模态窗取消
    const handlePasswordModalCancel = () => {
        setIsPasswordModalVisible(false)
        passwordForm.resetFields()
        setResettingEmployee(null)
    }

    // 删除员工
    const handleDeleteEmployee = (employeeId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个员工吗？删除后无法恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await axios.delete(`/api/users/${employeeId}`)
                    message.success('员工删除成功')
                    fetchEmployees() // 重新获取员工数据
                } catch (error) {
                    console.error('删除员工失败:', error)
                    message.error('删除员工失败')
                }
            }
        })
    }

    // 显示用户权限设置模态窗
    const showUserPermissionModal = (user: UserData) => {
        setSelectedUser(user)

        // 处理权限数据，如果包含"all"权限，则展开为所有具体权限
        let userPermissions = user.permissions || []
        if (userPermissions.includes('all')) {
            // 如果包含"all"权限，获取所有叶子节点权限
            userPermissions = getAllLeafPermissions(treeData)
        }

        setUserCheckedKeys(userPermissions)
        setSelectedUserPermissionGroups(user.permissionGroups || [])
        setIsPermissionModalVisible(true)
    }

    // 处理权限组选择变化
    const handleUserPermissionGroupChange = (groupIds: string[]) => {
        setSelectedUserPermissionGroups(groupIds)

        // 根据选择的权限组，自动更新权限树中的选中项
        let allPermissions: string[] = []
        groupIds.forEach(groupId => {
            const group = permissionGroups.find(g => g.id === groupId)
            if (group) {
                allPermissions = [...allPermissions, ...group.permissions]
            }
        })

        // 合并手动选择的权限和权限组中的权限
        const manualPermissions = userCheckedKeys.filter(key =>
            !allPermissions.includes(key)
        )
        const newCheckedKeys = [...new Set([...manualPermissions, ...allPermissions])]
        setUserCheckedKeys(newCheckedKeys)
    }

    // 处理用户权限选择
    const handleUserPermissionCheck = (checkedKeysValue: any) => {
        setUserCheckedKeys(checkedKeysValue)
    }

    // 保存用户权限
    const handleSaveUserPermissions = async () => {
        if (!selectedUser) {
            message.warning('请先选择用户')
            return
        }

        setPermissionLoading(true)
        try {
            // 处理权限数据，如果选择了所有权限，则保存为["all"]
            let permissionsToSave = userCheckedKeys
            const allLeafPermissions = getAllLeafPermissions(treeData)

            // 检查是否选择了所有权限
            const hasAllPermissions = allLeafPermissions.every(permission =>
                userCheckedKeys.includes(permission)
            )

            if (hasAllPermissions && allLeafPermissions.length > 0) {
                permissionsToSave = ['all']
            }

            // 调用API更新用户权限
            await axios.put(`/api/users/${selectedUser.id}/permissions`, {
                permissions: permissionsToSave,
                permissionGroups: selectedUserPermissionGroups
            })
            message.success('用户权限保存成功')
            setIsPermissionModalVisible(false)
            setSelectedUser(null)
            setUserCheckedKeys([])
            setSelectedUserPermissionGroups([])
            fetchEmployees() // 重新获取员工数据
        } catch (error) {
            console.error('保存用户权限失败:', error)
            message.error('保存用户权限失败')
        } finally {
            setPermissionLoading(false)
        }
    }

    // 处理用户权限模态窗取消
    const handleUserPermissionModalCancel = () => {
        setIsPermissionModalVisible(false)
        setSelectedUser(null)
        setUserCheckedKeys([])
        setSelectedUserPermissionGroups([])
    }

    // 获取部门选项
    const getDepartmentOptions = (enterpriseId: string) => {
        return departments
            .filter(dept => dept.enterpriseId === enterpriseId)
            .map(dept => ({
                label: dept.name,
                value: dept.id
            }))
    }

    // 员工表格列
    const employeeColumns = [
        {
            title: '员工信息',
            key: 'employeeInfo',
            render: (_: any, record: UserData) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                    <div>
                        <div style={{
                            color: record.status === 'active' ? '#000' : '#999',
                            fontWeight: 'bold'
                        }}>
                            {record.realName}
                            {record.status === 'inactive' && (
                                <Tag color="red" style={{ marginLeft: 8 }}>已禁用</Tag>
                            )}
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {record.username} | {record.position}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: '所属企业',
            dataIndex: 'enterpriseName',
            key: 'enterpriseName'
        },
        {
            title: '所属部门',
            dataIndex: 'departmentName',
            key: 'departmentName'
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? '启用' : '禁用'}
                </Tag>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: UserData) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => showEditModal(record)
                    },
                    {
                        ...ActionTypes.PERMISSION,
                        onClick: () => showUserPermissionModal(record)
                    },
                    {
                        ...ActionTypes.PASSWORD,
                        onClick: () => showResetPasswordModal(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeleteEmployee(record.id)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    // 过滤员工数据
    const filteredEmployees = userEmployees.filter(emp => {
        if (selectedEnterprise && emp.enterpriseId !== selectedEnterprise) return false
        if (selectedDepartment && emp.departmentId !== selectedDepartment) return false
        return true
    })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>员工列表</h1>
                <Button icon={<PlusOutlined />} type="primary" onClick={showAddModal}>
                    新增员工
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <span>企业筛选：</span>
                        <Select
                            placeholder="请选择企业"
                            style={{ width: 200 }}
                            allowClear
                            value={selectedEnterprise}
                            onChange={async (value) => {
                                setSelectedEnterprise(value)
                                setSelectedDepartment('')
                                if (value) {
                                    // 获取选中企业的部门数据
                                    await fetchDepartments(value)
                                }
                            }}
                        >
                            {enterprises.map(enterprise => (
                                <Option key={enterprise.id} value={enterprise.id}>
                                    {enterprise.enterpriseName}
                                </Option>
                            ))}
                        </Select>
                        <span>部门筛选：</span>
                        <Select
                            placeholder="请选择部门"
                            style={{ width: 200 }}
                            allowClear
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            disabled={!selectedEnterprise}
                        >
                            {selectedEnterprise &&
                                getDepartmentOptions(selectedEnterprise).map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={employeeColumns}
                    dataSource={filteredEmployees}
                    rowKey="id"
                    loading={tableLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
                />
            </Card>

            {/* 新增/编辑员工模态窗 */}
            <Modal
                title={editingEmployee ? '编辑员工' : '新增员工'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={loading}
                width={600}
                okText="确认"
                cancelText="取消"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: 'active'
                    }}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[
                            { required: true, message: '请输入用户名' }
                        ]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    {!editingEmployee && (
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码长度不能少于6位' }
                            ]}
                        >
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="realName"
                        label="员工姓名"
                        rules={[
                            { required: true, message: '请输入员工姓名' }
                        ]}
                    >
                        <Input placeholder="请输入员工姓名" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { type: 'email', message: '请输入正确的邮箱地址' }
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="联系电话"
                        rules={[
                            { required: true, message: '请输入联系电话' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
                        ]}
                    >
                        <Input placeholder="请输入联系电话" />
                    </Form.Item>

                    <Form.Item
                        name="position"
                        label="职位"
                        rules={[
                            { required: true, message: '请输入职位' }
                        ]}
                    >
                        <Input placeholder="请输入职位" />
                    </Form.Item>

                    <Form.Item
                        name="enterpriseId"
                        label="所属企业"
                        rules={[
                            { required: true, message: '请选择所属企业' }
                        ]}
                    >
                        <Select
                            placeholder="请选择所属企业"
                            onChange={async (value) => {
                                form.setFieldsValue({ departmentId: undefined })
                                if (value) {
                                    // 获取选中企业的部门数据
                                    await fetchDepartments(value)
                                }
                            }}
                        >
                            {enterprises.map(enterprise => (
                                <Option key={enterprise.id} value={enterprise.id}>
                                    {enterprise.enterpriseName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="departmentId"
                        label="所属部门"
                        rules={[
                            { required: true, message: '请选择所属部门' }
                        ]}
                    >
                        <Select
                            placeholder="请选择所属部门"
                            disabled={!form.getFieldValue('enterpriseId')}
                        >
                            {departments
                                .filter(dept => dept.enterpriseId === form.getFieldValue('enterpriseId'))
                                .map(dept => (
                                    <Option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="状态"
                        rules={[
                            { required: true, message: '请选择状态' }
                        ]}
                    >
                        <Select placeholder="请选择状态">
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 修改密码模态窗 */}
            <Modal
                title={resettingEmployee ? '修改密码' : ''}
                open={isPasswordModalVisible}
                onOk={handlePasswordModalOk}
                onCancel={handlePasswordModalCancel}
                confirmLoading={passwordLoading}
                width={500}
                okText="确认"
                cancelText="取消"
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 6, message: '密码长度不能少于6位' }
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        rules={[
                            { required: true, message: '请确认新密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致！'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请确认新密码" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 用户权限设置模态窗 */}
            <Modal
                title={`为员工 ${selectedUser?.realName} 设置权限`}
                open={isPermissionModalVisible}
                onOk={handleSaveUserPermissions}
                onCancel={handleUserPermissionModalCancel}
                confirmLoading={permissionLoading}
                width={1200}
                okText="保存"
                cancelText="取消"
            >
                <div style={{ marginBottom: 16 }}>
                    <p><strong>员工：</strong>{selectedUser?.realName} ({selectedUser?.role})</p>
                    <p><strong>说明：</strong>请选择该员工可以访问的功能权限</p>
                </div>

                <Form form={permissionForm} layout="vertical">
                    <Form.Item
                        name="permissionGroups"
                        label="权限组设置"
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择权限组（可选）"
                            style={{ width: '100%' }}
                            maxTagCount="responsive"
                            value={selectedUserPermissionGroups}
                            onChange={handleUserPermissionGroupChange}
                        >
                            {permissionGroups.map(group => (
                                <Option key={group.id} value={group.id}>
                                    {group.name} - {group.description}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Divider>或手动选择具体权限</Divider>

                    <Form.Item
                        name="permissions"
                        label="选择权限"
                        required
                    >
                        <PermissionSelector
                            treeData={treeData}
                            checkedKeys={userCheckedKeys}
                            onCheck={handleUserPermissionCheck}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Employee 