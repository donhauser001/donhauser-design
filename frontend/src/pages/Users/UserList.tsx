import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, Avatar, Modal, Form, message, Switch, Tree, Divider, Dropdown, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, UserOutlined, EditOutlined, DeleteOutlined, LockOutlined, CopyOutlined, SettingOutlined, MoreOutlined, StopOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import PermissionSelector from '../../components/PermissionSelector'
import axios from 'axios'

const { Option } = Select

interface UserData {
    id: string
    username: string
    password?: string
    email: string
    phone: string
    realName: string
    role: string
    department: string
    status: 'active' | 'inactive'
    createTime: string
    lastLogin?: string
    // 企业信息
    enterpriseId?: string
    enterpriseName?: string
    departmentId?: string
    departmentName?: string
    position?: string
    // 客户信息
    company?: string
    contactPerson?: string
    address?: string
    shippingMethod?: string
    // 用户描述
    description?: string
    // 用户权限
    permissions?: string[]
    // 用户权限组
    permissionGroups?: string[]
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

const UserList: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<UserData | null>(null)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedRole, setSelectedRole] = useState<string>('')

    // 修改密码相关状态
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
    const [resettingUser, setResettingUser] = useState<UserData | null>(null)
    const [passwordForm] = Form.useForm()
    const [passwordLoading, setPasswordLoading] = useState(false)

    // 权限设置相关状态
    const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [userCheckedKeys, setUserCheckedKeys] = useState<string[]>([])
    const [selectedUserPermissionGroups, setSelectedUserPermissionGroups] = useState<string[]>([])
    const [permissionForm] = Form.useForm()

    // 数据状态
    const [users, setUsers] = useState<UserData[]>([])
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
    const [treeData, setTreeData] = useState<PermissionData[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [permissionLoading, setPermissionLoading] = useState(false)
    const [roles, setRoles] = useState<any[]>([])

    // 模拟客户数据
    const clientData = [
        { id: '1', company: 'ABC科技有限公司', contactPerson: '李客户', address: '北京市朝阳区建国路88号' },
        { id: '2', company: 'XYZ设计工作室', contactPerson: '张设计师', address: '上海市浦东新区陆家嘴金融中心' },
        { id: '3', company: '创新科技集团', contactPerson: '王经理', address: '深圳市南山区科技园' },
        { id: '4', company: '未来数字公司', contactPerson: '刘总监', address: '广州市天河区珠江新城' },
        { id: '5', company: '智慧解决方案', contactPerson: '陈主管', address: '杭州市西湖区文三路' },
        { id: '6', company: '数字营销公司', contactPerson: '赵总监', address: '成都市高新区天府软件园' },
        { id: '7', company: '创意设计工作室', contactPerson: '孙设计师', address: '武汉市东湖新技术开发区' },
        { id: '8', company: '互联网科技公司', contactPerson: '周经理', address: '西安市高新区科技路' }
    ]

    // 模拟企业数据
    const enterpriseData = [
        { id: '1', name: 'ABC设计有限公司', address: '北京市朝阳区建国路88号', contactPerson: '张总' },
        { id: '2', name: 'XYZ科技有限公司', address: '上海市浦东新区陆家嘴金融中心', contactPerson: '李总' },
        { id: '3', name: '创新集团', address: '深圳市南山区科技园', contactPerson: '王总' },
        { id: '4', name: '未来数字科技', address: '广州市天河区珠江新城', contactPerson: '刘总' }
    ]



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

    // 获取角色数据
    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/roles/all')
            if (response.data.success) {
                setRoles(response.data.data)
            }
        } catch (error) {
            console.error('获取角色数据失败:', error)
            message.error('获取角色数据失败')
        }
    }

    // 获取用户列表
    const fetchUsers = async () => {
        try {
            setTableLoading(true)
            const response = await axios.get('/api/users', {
                params: {
                    search: searchText,
                    role: roleFilter,
                    status: statusFilter,
                    page: 1,
                    limit: 100
                }
            })
            if (response.data.success) {
                setUsers(response.data.data)
            }
        } catch (error) {
            console.error('获取用户列表失败:', error)
            message.error('获取用户列表失败')
        } finally {
            setTableLoading(false)
        }
    }

    // 组件挂载时获取数据
    useEffect(() => {
        fetchPermissionTree()
        fetchPermissionGroups()
        fetchUsers()
        fetchRoles()
    }, [])

    // 当搜索条件变化时重新获取用户列表
    useEffect(() => {
        fetchUsers()
    }, [searchText, roleFilter, statusFilter])

    // 角色选项 - 从真实角色数据生成
    const roleOptions = roles.map(role => ({
        label: role.roleName,
        value: role.roleName
    }))

    // 部门选项
    const departmentOptions = [
        { label: '技术部', value: '技术部' },
        { label: '项目部', value: '项目部' },
        { label: '设计部', value: '设计部' },
        { label: '客户部', value: '客户部' },
        { label: '财务部', value: '财务部' },
        { label: '人事部', value: '人事部' },
        { label: '外部客户', value: '外部客户' }
    ]

    // 快递方式选项
    const shippingMethodOptions = [
        { label: '顺丰快递', value: '顺丰快递' },
        { label: '圆通快递', value: '圆通快递' },
        { label: '中通快递', value: '中通快递' },
        { label: '申通快递', value: '申通快递' },
        { label: '韵达快递', value: '韵达快递' },
        { label: 'EMS', value: 'EMS' },
        { label: '京东物流', value: '京东物流' },
        { label: '自提', value: '自提' }
    ]

    // 显示新增用户模态窗
    const showAddModal = () => {
        setEditingUser(null)
        setSelectedRole('')
        form.resetFields()
        setIsModalVisible(true)
    }

    // 显示编辑用户模态窗
    const showEditModal = (user: UserData) => {
        setEditingUser(user)
        setSelectedRole(user.role)

        form.setFieldsValue({
            username: user.username,
            email: user.email,
            phone: user.phone,
            realName: user.realName,
            role: user.role,
            department: user.department,
            status: user.status,
            position: user.position,
            company: user.company,
            contactPerson: user.contactPerson,
            address: user.address,
            shippingMethod: user.shippingMethod,
            enterpriseName: user.enterpriseName,
            description: user.description
            // 注意：编辑时不设置密码字段
        })
        setIsModalVisible(true)
    }

    // 处理模态窗确认
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)

            // 处理不同角色的字段
            if (values.role === '客户') {
                values.department = '外部客户'
                // 清除员工相关字段
                values.enterpriseId = undefined
                values.enterpriseName = undefined
                values.departmentId = undefined
                values.departmentName = undefined
                values.position = undefined
            } else if (values.role === '员工' || values.role === '超级管理员') {
                // 员工和超级管理员不显示单位字段，清除相关字段
                values.company = undefined
                values.contactPerson = undefined
                values.address = undefined
                values.shippingMethod = undefined
                values.enterpriseId = undefined
                values.enterpriseName = undefined
                values.departmentId = undefined
                values.departmentName = undefined
                values.position = undefined
            }

            if (editingUser) {
                // 编辑用户 - 不更新密码
                const { password, ...updateValues } = values
                const response = await axios.put(`/api/users/${editingUser.id}`, updateValues)
                if (response.data.success) {
                    message.success('用户信息更新成功')
                    fetchUsers()
                } else {
                    message.error(response.data.message || '用户信息更新失败')
                }
            } else {
                // 新增用户 - 包含密码
                const response = await axios.post('/api/users', values)
                if (response.data.success) {
                    message.success('用户创建成功')
                    fetchUsers()
                } else {
                    message.error(response.data.message || '用户创建失败')
                }
            }

            setIsModalVisible(false)
            form.resetFields()
            setSelectedRole('')
        } catch (error) {
            console.error('表单验证失败:', error)
        } finally {
            setLoading(false)
        }
    }

    // 处理模态窗取消
    const handleModalCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
        setSelectedRole('')
        setEditingUser(null)
    }

    // 显示修改密码模态窗
    const showResetPasswordModal = (user: UserData) => {
        setResettingUser(user)
        passwordForm.resetFields()
        setIsPasswordModalVisible(true)
    }

    // 处理修改密码模态窗确认
    const handlePasswordModalOk = async () => {
        try {
            const values = await passwordForm.validateFields()
            setPasswordLoading(true)

            // 更新用户密码
            const response = await axios.put(`/api/users/${resettingUser?.id}/reset-password`, {
                newPassword: values.newPassword
            })
            if (response.data.success) {
                message.success('密码修改成功')
                fetchUsers()
            } else {
                message.error(response.data.message || '密码修改失败')
            }

            setIsPasswordModalVisible(false)
            passwordForm.resetFields()
            setResettingUser(null)
        } catch (error) {
            console.error('密码表单验证失败:', error)
        } finally {
            setPasswordLoading(false)
        }
    }

    // 处理修改密码模态窗取消
    const handlePasswordModalCancel = () => {
        setIsPasswordModalVisible(false)
        passwordForm.resetFields()
        setResettingUser(null)
    }

    // 删除用户
    const handleDeleteUser = (userId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个用户吗？删除后无法恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/api/users/${userId}`)
                    if (response.data.success) {
                        message.success('用户删除成功')
                        fetchUsers()
                    } else {
                        message.error(response.data.message || '用户删除失败')
                    }
                } catch (error: any) {
                    console.error('删除失败:', error)
                    message.error(error.response?.data?.message || '删除失败')
                }
            }
        })
    }

    // 重置密码
    const handleResetPassword = (userId: string) => {
        Modal.confirm({
            title: '确认重置密码',
            content: '确定要重置该用户的密码吗？重置后用户需要使用新密码登录。',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                message.success('密码重置成功，新密码已发送到用户邮箱')
            }
        })
    }

    // 切换用户状态
    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        try {
            const response = await axios.put(`/api/users/${userId}/toggle-status`)
            if (response.data.success) {
                message.success('用户状态更新成功')
                fetchUsers()
            } else {
                message.error(response.data.message || '用户状态更新失败')
            }
        } catch (error: any) {
            console.error('状态更新失败:', error)
            message.error(error.response?.data?.message || '状态更新失败')
        }
    }

    // 处理角色变化
    const handleRoleChange = (role: string) => {
        setSelectedRole(role)

        // 根据角色设置默认部门
        if (role === '客户') {
            form.setFieldsValue({
                department: '外部客户',
                company: undefined // 清空单位选择
            })
        } else if (role === '员工' || role === '超级管理员') {
            // 员工和超级管理员不显示单位字段，清空相关字段
            form.setFieldsValue({
                company: undefined,
                enterpriseId: undefined,
                enterpriseName: undefined
            })
        }
    }

    // 处理客户选择
    const handleClientSelect = (companyName: string) => {
        // 现在直接选择公司名称，不需要额外处理
        console.log('选择的单位:', companyName)
    }

    // 处理企业选择
    const handleEnterpriseSelect = (enterpriseId: string) => {
        const selectedEnterprise = enterpriseData.find(enterprise => enterprise.id === enterpriseId)
        if (selectedEnterprise) {
            form.setFieldsValue({
                enterpriseId: selectedEnterprise.id,
                enterpriseName: selectedEnterprise.name
            })
        }
    }

    // 复制快递信息
    const handleCopyShippingInfo = (shippingInfo: string) => {
        navigator.clipboard.writeText(shippingInfo).then(() => {
            message.success('快递信息已复制到剪贴板')
        }).catch(() => {
            message.error('复制失败，请手动复制')
        })
    }

    // 计算注册时间差
    const calculateTimeDifference = (createTime: string) => {
        const createDate = new Date(createTime)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - createDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 30) {
            return `${diffDays}天前`
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30)
            return `${months}个月前`
        } else {
            const years = Math.floor(diffDays / 365)
            return `${years}年前`
        }
    }

    // 显示用户权限设置模态窗
    const showUserPermissionModal = (user: UserData) => {
        setSelectedUser(user)

        // 处理特殊权限 'all'
        let permissionsToShow: string[] = []
        if (user.permissions?.includes('all')) {
            // 如果包含 'all' 权限，获取所有叶子节点权限
            permissionsToShow = getAllLeafPermissions(treeData)
        } else {
            // 否则使用原始权限
            permissionsToShow = user.permissions || []
        }

        setUserCheckedKeys(permissionsToShow)
        setSelectedUserPermissionGroups(user.permissionGroups || [])
        setIsPermissionModalVisible(true)
    }

    // 处理权限组选择变化
    const handleUserPermissionGroupChange = (groupIds: string[]) => {
        setSelectedUserPermissionGroups(groupIds)

        // 根据选择的权限组，重新计算应该选中的权限
        let groupPermissions: string[] = []
        groupIds.forEach(groupId => {
            const group = permissionGroups.find(g => g.id === groupId)
            if (group && group.permissions) {
                // 处理特殊权限 'all'
                if (group.permissions.includes('all')) {
                    // 如果权限组包含 'all'，获取所有叶子节点权限
                    const allLeafPermissions = getAllLeafPermissions(treeData)
                    groupPermissions = [...groupPermissions, ...allLeafPermissions]
                } else {
                    groupPermissions = [...groupPermissions, ...group.permissions]
                }
            }
        })

        // 获取所有有效的叶子节点权限
        const allLeafPermissions = getAllLeafPermissions(treeData)

        // 过滤出有效的权限组权限
        const validGroupPermissions = groupPermissions.filter(permission =>
            allLeafPermissions.includes(permission)
        )

        // 更新选中的权限（只保留权限组中的权限）
        const newCheckedKeys = [...new Set(validGroupPermissions)]
        setUserCheckedKeys(newCheckedKeys)
    }

    // 处理用户权限选择
    const handleUserPermissionCheck = (checkedKeysValue: any) => {
        // 获取所有有效的叶子节点权限
        const allLeafPermissions = getAllLeafPermissions(treeData)

        // 过滤出有效的权限
        const validCheckedKeys = checkedKeysValue.filter((key: string) =>
            allLeafPermissions.includes(key)
        )

        setUserCheckedKeys(validCheckedKeys)
    }

    // 保存用户权限
    const handleSaveUserPermissions = async () => {
        if (!selectedUser) {
            message.warning('请先选择用户')
            return
        }

        try {
            setPermissionLoading(true)

            // 获取所有有效的叶子节点权限
            const allPermissions = getAllLeafPermissions(treeData)

            // 过滤checkedKeys，只保留有效的叶子节点权限
            const validPermissions = userCheckedKeys.filter((key: string) =>
                allPermissions.includes(key)
            )

            // 处理超级管理员的特殊逻辑
            let permissionsToSave = validPermissions
            if (selectedUser.role === '超级管理员') {
                // 如果选中的权限数量等于所有权限数量，则保存为 ['all']
                if (validPermissions.length === allPermissions.length) {
                    permissionsToSave = ['all']
                }
            }

            // 更新用户权限和权限组
            const response = await axios.put(`/api/users/${selectedUser.id}/permissions`, {
                permissions: permissionsToSave,
                permissionGroups: selectedUserPermissionGroups
            })

            if (response.data.success) {
                message.success('用户权限保存成功')
                fetchUsers()
                setIsPermissionModalVisible(false)
                setSelectedUser(null)
                setUserCheckedKeys([])
                setSelectedUserPermissionGroups([])
            } else {
                message.error(response.data.message || '用户权限保存失败')
            }
        } catch (error: any) {
            console.error('权限保存失败:', error)
            message.error(error.response?.data?.message || '权限保存失败')
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

    // 过滤用户数据
    const filteredUsers = users.filter(user => {
        // 搜索文本过滤
        const searchMatch = !searchText ||
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.realName.toLowerCase().includes(searchText.toLowerCase())

        // 角色过滤
        const roleMatch = roleFilter === 'all' || user.role === roleFilter

        // 状态过滤
        const statusMatch = statusFilter === 'all' || user.status === statusFilter

        return searchMatch && roleMatch && statusMatch
    })

    const columns = [
        {
            title: '姓名',
            key: 'userInfo',
            render: (_: any, record: UserData) => (
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
                        {record.username} | {record.role === '员工' && record.position ? record.position : record.role}
                    </div>
                </div>
            )
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone: string) => (
                <span style={{ color: phone ? '#333' : '#999' }}>
                    {phone || '-'}
                </span>
            )
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                const colorMap: { [key: string]: string } = {
                    '超级管理员': 'red',
                    '项目经理': 'blue',
                    '设计师': 'green',
                    '客户': 'orange'
                }
                return <Tag color={colorMap[role]}>{role}</Tag>
            }
        },

        {
            title: '单位',
            key: 'unit',
            render: (_: any, record: UserData) => {
                if (record.role === '客户' && record.company) {
                    // 客户用户显示公司名称
                    return <span>{record.company}</span>
                } else if (record.role === '员工' && record.enterpriseName) {
                    // 员工用户显示企业名称
                    return <span>{record.enterpriseName}</span>
                } else if (record.role === '超级管理员' && record.enterpriseName) {
                    // 超级管理员显示企业名称
                    return <span>{record.enterpriseName}</span>
                }
                return '-'
            }
        },
        {
            title: '快递信息',
            key: 'shippingMethod',
            render: (_: any, record: UserData) => {
                if (record.role === '客户' && record.shippingMethod) {
                    return (
                        <Button
                            type="link"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopyShippingInfo(record.shippingMethod || '')}
                        >
                            复制快递信息
                        </Button>
                    )
                }
                return '-'
            }
        },
        {
            title: '注册时间',
            key: 'registerTime',
            render: (_: any, record: UserData) => {
                const timeDiff = calculateTimeDifference(record.createTime)
                return (
                    <div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {timeDiff}
                        </div>
                        <div style={{ fontSize: 12, color: '#999' }}>
                            {record.createTime}
                        </div>
                    </div>
                )
            }
        },
        {
            title: '最后登录',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            render: (lastLogin: string) => (
                <span style={{ color: lastLogin === '-' ? '#999' : '#333' }}>
                    {lastLogin}
                </span>
            )
        },
        {
            title: '包含权限',
            key: 'permissions',
            render: (_: any, record: UserData) => {
                // 处理超级管理员用户的特殊显示
                if (record.permissions?.includes('all')) {
                    return (
                        <Tag color="red">
                            所有权限
                        </Tag>
                    )
                }
                return (
                    <Tag color="blue">
                        {record.permissions?.length || 0} 个权限
                    </Tag>
                )
            }
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
                        ...ActionTypes.TOGGLE_STATUS,
                        label: record.status === 'active' ? '停用' : '启用',
                        onClick: () => handleToggleStatus(record.id, record.status)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeleteUser(record.id)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>用户列表</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    新增用户
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input.Search
                            placeholder="搜索用户名、邮箱、姓名"
                            style={{ width: 300 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            placeholder="角色"
                            style={{ width: 120 }}
                            value={roleFilter}
                            onChange={setRoleFilter}
                        >
                            <Option value="all">全部角色</Option>
                            {roleOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="状态"
                            style={{ width: 120 }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
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

            {/* 新增/编辑用户模态窗 */}
            <Modal
                title={editingUser ? '编辑用户' : '新增用户'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={loading}
                width={700}
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
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="username"
                                        label="用户名"
                                        rules={[
                                            { required: true, message: '请输入用户名' },
                                            { min: 3, max: 20, message: '用户名长度在 3-20 个字符' }
                                        ]}
                                    >
                                        <Input placeholder="请输入用户名" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="邮箱"
                                        rules={[
                                            { required: true, message: '请输入邮箱' },
                                            { type: 'email', message: '请输入正确的邮箱格式' }
                                        ]}
                                    >
                                        <Input placeholder="请输入邮箱" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="realName"
                                        label="姓名"
                                        rules={[
                                            { required: true, message: '请输入姓名' },
                                            { min: 2, max: 10, message: '姓名长度在 2-10 个字符' }
                                        ]}
                                    >
                                        <Input placeholder="请输入姓名" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        label="手机号"
                                        rules={[
                                            { required: true, message: '请输入手机号' },
                                            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
                                        ]}
                                    >
                                        <Input placeholder="请输入手机号" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* 单位字段 - 根据角色动态显示 */}
                            {/* 员工和超级管理员不显示单位字段 */}
                            {selectedRole && selectedRole !== '员工' && selectedRole !== '超级管理员' && (
                                <Form.Item
                                    name="company"
                                    label="单位"
                                    rules={[
                                        { required: true, message: '请选择单位' }
                                    ]}
                                >
                                    <Select
                                        placeholder="搜索并选择单位"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={handleClientSelect}
                                    >
                                        {clientData.map(client => (
                                            <Option key={client.id} value={client.company}>
                                                {client.company}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="role"
                                        label="角色"
                                        rules={[
                                            { required: true, message: '请选择角色' }
                                        ]}
                                    >
                                        <Select placeholder="请选择角色" onChange={handleRoleChange}>
                                            {roleOptions.map(option => (
                                                <Option key={option.value} value={option.value}>
                                                    {option.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="status"
                                        label="用户状态"
                                        rules={[
                                            { required: true, message: '请选择用户状态' }
                                        ]}
                                    >
                                        <Select placeholder="请选择用户状态">
                                            <Option value="active">启用</Option>
                                            <Option value="inactive">停用</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {!editingUser && (
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
                                name="position"
                                label="职位"
                            >
                                <Input placeholder="请输入职位，如：项目经理、UI设计师、前端工程师等" />
                            </Form.Item>

                            {/* 部门字段 - 仅对非客户角色显示 */}
                            {selectedRole !== '客户' && (
                                <Form.Item
                                    name="department"
                                    label="部门"
                                    rules={[
                                        { required: true, message: '请选择部门' }
                                    ]}
                                >
                                    <Select
                                        placeholder="请选择部门"
                                    >
                                        {departmentOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}

                            {/* 客户快递信息字段 - 仅对客户角色显示 */}
                            {selectedRole === '客户' && (
                                <Form.Item
                                    name="shippingMethod"
                                    label="快递信息"
                                >
                                    <Input.TextArea
                                        placeholder="请输入客户接收快递的地址、联系人、电话等信息"
                                        rows={3}
                                    />
                                </Form.Item>
                            )}

                            <Form.Item
                                name="description"
                                label="用户描述"
                                rules={[
                                    { max: 200, message: '描述不能超过200个字符' }
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="请输入用户描述（可选）"
                                    rows={2}
                                    showCount
                                    maxLength={200}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>

            {/* 修改密码模态窗 */}
            <Modal
                title={resettingUser ? '修改密码' : ''}
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
                title={`为用户 ${selectedUser?.realName} 设置权限`}
                open={isPermissionModalVisible}
                onOk={handleSaveUserPermissions}
                onCancel={handleUserPermissionModalCancel}
                confirmLoading={permissionLoading}
                width={1200}
                okText="保存"
                cancelText="取消"
            >
                <div style={{ marginBottom: 16 }}>
                    <p><strong>用户：</strong>{selectedUser?.realName} ({selectedUser?.role})</p>
                    <p><strong>说明：</strong>请选择该用户可以访问的功能权限</p>
                </div>

                <Form form={permissionForm} layout="vertical">
                    <Form.Item
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

export default UserList 