import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Modal, Form, Input, Upload, message, Table, Tag, Select } from 'antd'
import { BankOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import axios from 'axios'

const { TextArea } = Input
const { Option } = Select

interface EnterpriseData {
    id: string
    enterpriseName: string
    enterpriseAlias?: string
    creditCode: string
    businessLicense: string
    bankPermit?: string
    bankPermitNumber?: string
    legalRepresentative: string
    legalRepresentativeId: string
    companyAddress: string
    shippingAddress: string
    contactPerson: string
    contactPhone: string
    invoiceInfo: string
    bankName: string
    accountName: string
    accountNumber: string
    status: 'active' | 'inactive'
    createTime: string
}

const Enterprise: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingEnterprise, setEditingEnterprise] = useState<EnterpriseData | null>(null)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [enterprises, setEnterprises] = useState<EnterpriseData[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [bankPermitFileList, setBankPermitFileList] = useState<UploadFile[]>([])

    // 生成文件URL的辅助函数
    const getFileUrl = (filename: string) => {
        // 使用相对路径，通过代理访问后端文件
        return `/uploads/enterprises/${filename}`
    }

    // 获取企业列表
    const fetchEnterprises = async () => {
        try {
            setTableLoading(true)
            const response = await axios.get('/api/enterprises')
            if (response.data.success) {
                setEnterprises(response.data.data)
            }
        } catch (error) {
            console.error('获取企业列表失败:', error)
            message.error('获取企业列表失败')
        } finally {
            setTableLoading(false)
        }
    }

    // 组件加载时获取数据
    useEffect(() => {
        fetchEnterprises()
    }, [])

    // 显示新增企业模态窗
    const showAddModal = () => {
        setEditingEnterprise(null)
        setFileList([])
        form.resetFields()
        setIsModalVisible(true)
    }

    // 显示编辑企业模态窗
    const showEditModal = (enterprise: EnterpriseData) => {
        setEditingEnterprise(enterprise)

        // 设置文件列表
        if (enterprise.businessLicense) {
            setFileList([
                {
                    uid: '-1',
                    name: enterprise.businessLicense,
                    status: 'done',
                    url: getFileUrl(enterprise.businessLicense), // 使用辅助函数生成URL
                }
            ])
        } else {
            setFileList([])
        }

        // 设置开户许可证文件列表
        if (enterprise.bankPermit) {
            setBankPermitFileList([
                {
                    uid: '-2',
                    name: enterprise.bankPermit,
                    status: 'done',
                    url: getFileUrl(enterprise.bankPermit),
                }
            ])
        } else {
            setBankPermitFileList([])
        }

        form.setFieldsValue({
            enterpriseName: enterprise.enterpriseName,
            enterpriseAlias: enterprise.enterpriseAlias,
            creditCode: enterprise.creditCode,
            businessLicense: enterprise.businessLicense,
            bankPermit: enterprise.bankPermit,
            bankPermitNumber: enterprise.bankPermitNumber,
            legalRepresentative: enterprise.legalRepresentative,
            legalRepresentativeId: enterprise.legalRepresentativeId,
            companyAddress: enterprise.companyAddress,
            shippingAddress: enterprise.shippingAddress,
            contactPerson: enterprise.contactPerson,
            contactPhone: enterprise.contactPhone,
            invoiceInfo: enterprise.invoiceInfo,
            bankName: enterprise.bankName,
            accountName: enterprise.accountName,
            accountNumber: enterprise.accountNumber,
            status: enterprise.status
        })
        setIsModalVisible(true)
    }

    // 处理文件上传
    const handleFileUpload = (info: any) => {
        setFileList(info.fileList)

        // 更新表单中的businessLicense字段
        if (info.fileList.length > 0) {
            const fileName = info.fileList[0].name || info.fileList[0].originFileObj?.name
            form.setFieldsValue({ businessLicense: fileName })

            // 为新上传的文件设置预览URL
            if (info.fileList[0].originFileObj) {
                const updatedFileList = info.fileList.map((file: any, index: number) => {
                    if (index === 0 && file.originFileObj) {
                        return {
                            ...file,
                            url: URL.createObjectURL(file.originFileObj) // 本地预览
                        }
                    }
                    return file
                })
                setFileList(updatedFileList)
            }
        } else {
            form.setFieldsValue({ businessLicense: '' })
        }
    }

    // 处理开户许可证文件上传
    const handleBankPermitUpload = (info: any) => {
        setBankPermitFileList(info.fileList)

        // 更新表单中的bankPermit字段
        if (info.fileList.length > 0) {
            const fileName = info.fileList[0].name || info.fileList[0].originFileObj?.name
            form.setFieldsValue({ bankPermit: fileName })

            // 为新上传的文件设置预览URL
            if (info.fileList[0].originFileObj) {
                const updatedFileList = info.fileList.map((file: any, index: number) => {
                    if (index === 0 && file.originFileObj) {
                        return {
                            ...file,
                            url: URL.createObjectURL(file.originFileObj)
                        }
                    }
                    return file
                })
                setBankPermitFileList(updatedFileList)
            }
        } else {
            form.setFieldsValue({ bankPermit: '' })
        }
    }

    // 处理模态窗确认
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)

            // 处理文件上传
            if (fileList.length > 0 && fileList[0].originFileObj) {
                try {
                    const formData = new FormData()
                    formData.append('businessLicense', fileList[0].originFileObj)

                    const uploadResponse = await axios.post('/api/upload/business-license', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    if (uploadResponse.data.success) {
                        values.businessLicense = uploadResponse.data.data.filename

                        // 更新文件列表中的URL，使其指向服务器文件
                        const updatedFileList = fileList.map((file, index) => {
                            if (index === 0) {
                                return {
                                    ...file,
                                    url: getFileUrl(uploadResponse.data.data.filename),
                                    name: uploadResponse.data.data.filename
                                }
                            }
                            return file
                        })
                        setFileList(updatedFileList)
                    } else {
                        message.error('文件上传失败')
                        return
                    }
                } catch (uploadError) {
                    console.error('文件上传失败:', uploadError)
                    message.error('文件上传失败')
                    return
                }
            }

            // 处理开户许可证文件上传
            if (bankPermitFileList.length > 0 && bankPermitFileList[0].originFileObj) {
                try {
                    const formData = new FormData()
                    formData.append('bankPermit', bankPermitFileList[0].originFileObj)

                    const uploadResponse = await axios.post('/api/upload/bank-permit', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    if (uploadResponse.data.success) {
                        values.bankPermit = uploadResponse.data.data.filename

                        // 更新文件列表中的URL，使其指向服务器文件
                        const updatedFileList = bankPermitFileList.map((file, index) => {
                            if (index === 0) {
                                return {
                                    ...file,
                                    url: getFileUrl(uploadResponse.data.data.filename),
                                    name: uploadResponse.data.data.filename
                                }
                            }
                            return file
                        })
                        setBankPermitFileList(updatedFileList)
                    } else {
                        message.error('开户许可证上传失败')
                        return
                    }
                } catch (uploadError) {
                    console.error('开户许可证上传失败:', uploadError)
                    message.error('开户许可证上传失败')
                    return
                }
            }

            if (editingEnterprise) {
                // 编辑企业
                const response = await axios.put(`/api/enterprises/${editingEnterprise.id}`, values)
                if (response.data.success) {
                    message.success('企业信息更新成功')
                    fetchEnterprises() // 重新获取数据
                } else {
                    message.error(response.data.message || '更新失败')
                }
            } else {
                // 新增企业
                const response = await axios.post('/api/enterprises', values)
                if (response.data.success) {
                    message.success('企业创建成功')
                    fetchEnterprises() // 重新获取数据
                } else {
                    message.error(response.data.message || '创建失败')
                }
            }

            setIsModalVisible(false)
            form.resetFields()
            setFileList([])
            setBankPermitFileList([])
        } catch (error: any) {
            console.error('操作失败:', error)
            if (error.response?.data?.message) {
                message.error(error.response.data.message)
            } else {
                message.error('操作失败')
            }
        } finally {
            setLoading(false)
        }
    }

    // 处理模态窗取消
    const handleModalCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
        setEditingEnterprise(null)
        setFileList([])
    }

    // 删除企业
    const handleDeleteEnterprise = (enterpriseId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个企业吗？删除后无法恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/api/enterprises/${enterpriseId}`)
                    if (response.data.success) {
                        message.success('企业删除成功')
                        fetchEnterprises() // 重新获取数据
                    } else {
                        message.error(response.data.message || '删除失败')
                    }
                } catch (error: any) {
                    console.error('删除失败:', error)
                    if (error.response?.data?.message) {
                        message.error(error.response.data.message)
                    } else {
                        message.error('删除失败')
                    }
                }
            }
        })
    }

    // 企业表格列
    const enterpriseColumns = [
        {
            title: '企业名称',
            dataIndex: 'enterpriseName',
            key: 'enterpriseName',
            render: (text: string, record: EnterpriseData) => (
                <div>
                    <strong>{text}</strong>
                    {record.enterpriseAlias && (
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            别名: {record.enterpriseAlias}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: '统一社会信用代码',
            dataIndex: 'creditCode',
            key: 'creditCode',
            render: (text: string) => <code style={{ fontSize: 12 }}>{text}</code>
        },
        {
            title: '法人代表',
            dataIndex: 'legalRepresentative',
            key: 'legalRepresentative'
        },
        {
            title: '联系人',
            dataIndex: 'contactPerson',
            key: 'contactPerson'
        },
        {
            title: '联系电话',
            dataIndex: 'contactPhone',
            key: 'contactPhone'
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
            render: (_: any, record: EnterpriseData) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => showEditModal(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeleteEnterprise(record.id)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>企业管理</h1>
                <Button icon={<BankOutlined />} type="primary" onClick={showAddModal}>
                    新增企业
                </Button>
            </div>

            <Card>
                <Table
                    columns={enterpriseColumns}
                    dataSource={enterprises}
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

            {/* 新增/编辑企业模态窗 */}
            <Modal
                title={editingEnterprise ? '编辑企业' : '新增企业'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={loading}
                width={1200}
                okText="确认"
                cancelText="取消"
                style={{ top: 20 }}
                bodyStyle={{ 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    padding: '24px'
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: 'active'
                    }}
                >
                    {/* 基本信息区域 */}
                    <div style={{ 
                        marginBottom: 24,
                        padding: 20,
                        border: '1px solid #e8e8e8',
                        borderRadius: 8,
                        backgroundColor: '#fafafa'
                    }}>
                        <h4 style={{ 
                            marginBottom: 16, 
                            fontSize: 16, 
                            fontWeight: 600, 
                            color: '#1890ff',
                            borderBottom: '2px solid #1890ff',
                            paddingBottom: 8,
                            display: 'inline-block'
                        }}>
                            📋 基本信息
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <Form.Item
                                name="enterpriseName"
                                label="企业名称"
                                rules={[
                                    { required: true, message: '请输入企业名称' }
                                ]}
                            >
                                <Input placeholder="请输入企业名称" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="enterpriseAlias"
                                label="企业别名"
                                extra="用于项目承接团队显示，如：设计团队A、创意工作室等"
                            >
                                <Input placeholder="请输入企业别名（选填）" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="creditCode"
                                label="统一社会信用代码"
                                rules={[
                                    { required: true, message: '请输入统一社会信用代码' },
                                    { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入正确的统一社会信用代码格式' }
                                ]}
                                extra="统一社会信用代码为18位，包含数字和大写字母"
                                style={{ gridColumn: '1 / -1' }}
                            >
                                <Input placeholder="请输入统一社会信用代码" size="large" />
                            </Form.Item>
                        </div>
                    </div>

                    {/* 证照信息区域 */}
                    <div style={{ 
                        marginBottom: 24,
                        padding: 16,
                        border: '1px solid #f0f0f0',
                        borderRadius: 8,
                        backgroundColor: '#fafafa'
                    }}>
                        <h4 style={{ 
                            marginBottom: 16, 
                            fontSize: 14, 
                            fontWeight: 600, 
                            color: '#262626',
                            borderBottom: '1px solid #e8e8e8',
                            paddingBottom: 8
                        }}>
                            证照信息
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Form.Item
                                name="enterpriseName"
                                label="企业名称"
                                rules={[
                                    { required: true, message: '请输入企业名称' }
                                ]}
                            >
                                <Input placeholder="请输入企业名称" />
                            </Form.Item>

                            <Form.Item
                                name="enterpriseAlias"
                                label="企业别名"
                                extra="用于项目承接团队显示，如：设计团队A、创意工作室等"
                            >
                                <Input placeholder="请输入企业别名（选填）" />
                            </Form.Item>

                            <Form.Item
                                name="creditCode"
                                label="统一社会信用代码"
                                rules={[
                                    { required: true, message: '请输入统一社会信用代码' },
                                    { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入正确的统一社会信用代码格式' }
                                ]}
                                extra="统一社会信用代码为18位，包含数字和大写字母"
                            >
                                <Input placeholder="请输入统一社会信用代码" />
                            </Form.Item>

                            <Form.Item
                                name="businessLicense"
                                label="营业执照"
                                rules={[
                                    { required: true, message: '请上传营业执照' }
                                ]}
                                extra={
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                        <div><strong>上传说明：</strong></div>
                                        <div>• 支持格式：JPG、PNG、GIF、PDF</div>
                                        <div>• 文件大小：最大10MB</div>

                                    </div>
                                }
                            >
                                <Upload
                                    listType="picture"
                                    maxCount={1}
                                    fileList={fileList}
                                    onChange={handleFileUpload}
                                    beforeUpload={() => false}
                                    onRemove={() => {
                                        setFileList([])
                                        form.setFieldsValue({ businessLicense: '' })
                                    }}
                                    accept=".jpg,.jpeg,.png,.gif,.pdf"
                                    showUploadList={{
                                        showPreviewIcon: true,
                                        showRemoveIcon: true,
                                        showDownloadIcon: false
                                    }}
                                    itemRender={(originNode, file) => {
                                        // 只显示图片预览和删除按钮，隐藏文件名
                                        return (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                }}
                                                title={file.name}
                                            >
                                                {/* 图片预览 */}
                                                <div style={{ flex: 1 }}>
                                                    <img
                                                        src={file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')}
                                                        alt="营业执照"
                                                        style={{
                                                            width: 80,
                                                            height: 80,
                                                            objectFit: 'cover',
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                </div>

                                                {/* 操作按钮 */}
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    {/* 预览按钮 */}
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            if (file.url) {
                                                                window.open(file.url, '_blank')
                                                            }
                                                        }}
                                                        title="预览"
                                                    />

                                                    {/* 删除按钮 */}
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            setFileList([])
                                                            form.setFieldsValue({ businessLicense: '' })
                                                        }}
                                                        title="删除"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>上传营业执照</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                name="bankPermit"
                                label="开户许可证"
                                extra={
                                    <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                        支持 jpg、png、gif、pdf 格式，文件大小不超过 10MB
                                    </span>
                                }
                            >
                                <Upload
                                    listType="picture"
                                    maxCount={1}
                                    fileList={bankPermitFileList}
                                    onChange={handleBankPermitUpload}
                                    beforeUpload={() => false}
                                    onRemove={() => {
                                        setBankPermitFileList([])
                                        form.setFieldsValue({ bankPermit: '' })
                                    }}
                                    accept=".jpg,.jpeg,.png,.gif,.pdf"
                                    showUploadList={{
                                        showPreviewIcon: true,
                                        showRemoveIcon: true,
                                        showDownloadIcon: false
                                    }}
                                    itemRender={(originNode, file) => {
                                        return (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                }}
                                                title={file.name}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <img
                                                        src={file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')}
                                                        alt="开户许可证"
                                                        style={{
                                                            width: 80,
                                                            height: 80,
                                                            objectFit: 'cover',
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            if (file.url) {
                                                                window.open(file.url, '_blank')
                                                            }
                                                        }}
                                                        title="预览"
                                                    />
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            setBankPermitFileList([])
                                                            form.setFieldsValue({ bankPermit: '' })
                                                        }}
                                                        title="删除"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>上传开户许可证</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                name="bankPermitNumber"
                                label="开户许可证核准号"
                                extra={
                                    <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                        请输入开户许可证核准号，如：J1000000000000000000
                                    </span>
                                }
                            >
                                <Input placeholder="请输入开户许可证核准号" />
                            </Form.Item>

                            <Form.Item
                                name="legalRepresentative"
                                label="法人代表"
                                rules={[
                                    { required: true, message: '请输入法人代表' }
                                ]}
                            >
                                <Input placeholder="请输入法人代表姓名" />
                            </Form.Item>

                            <Form.Item
                                name="legalRepresentativeId"
                                label="法人代表证件号"
                                rules={[
                                    { required: true, message: '请输入法人代表证件号' },
                                    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号格式' }
                                ]}
                                extra="请输入18位身份证号码"
                            >
                                <Input placeholder="请输入法人代表身份证号" />
                            </Form.Item>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Form.Item
                                name="companyAddress"
                                label="公司地址"
                                rules={[
                                    { required: true, message: '请输入公司地址' }
                                ]}
                            >
                                <Input placeholder="请输入公司注册地址" />
                            </Form.Item>

                            <Form.Item
                                name="shippingAddress"
                                label="公司收件地址"
                            >
                                <Input placeholder="请输入公司收件地址（选填）" />
                            </Form.Item>

                            <Form.Item
                                name="contactPerson"
                                label="联系人"
                                rules={[
                                    { required: true, message: '请输入联系人' }
                                ]}
                            >
                                <Input placeholder="请输入联系人姓名" />
                            </Form.Item>

                            <Form.Item
                                name="contactPhone"
                                label="联系电话"
                                rules={[
                                    { required: true, message: '请输入联系电话' },
                                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
                                ]}
                                extra="请输入11位手机号码，以1开头"
                            >
                                <Input placeholder="请输入联系电话" />
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
                        </div>
                    </div>

                    <Form.Item
                        name="invoiceInfo"
                        label="开票信息"

                    >
                        <TextArea
                            placeholder="请输入完整的开票信息，包括公司名称、税号、地址、开户行、账号等（选填）"
                            rows={4}
                            showCount
                            maxLength={500}
                            style={{
                                resize: 'vertical'
                            }}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item
                            name="bankName"
                            label="开户行"
                            rules={[
                                { required: true, message: '请输入开户行' }
                            ]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="请输入开户行" />
                        </Form.Item>

                        <Form.Item
                            name="accountName"
                            label="账户名称"
                            rules={[
                                { required: true, message: '请输入账户名称' }
                            ]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="请输入账户名称" />
                        </Form.Item>

                        <Form.Item
                            name="accountNumber"
                            label="银行账号"
                            rules={[
                                { required: true, message: '请输入银行账号' }
                            ]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="请输入银行账号" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default Enterprise 