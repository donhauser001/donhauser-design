import React from 'react'
import { Form, Input, Select, InputNumber, DatePicker } from 'antd'
import { Client } from './types'
import { Order } from '../../../api/orders'
import dayjs from 'dayjs'

const { Option } = Select
const { TextArea } = Input

interface EditFormProps {
    form: any
    editingOrder: Order | null
    clients: Client[]
}

const EditForm: React.FC<EditFormProps> = ({ form, editingOrder, clients }) => {
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                status: 'pending'
            }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item
                    name="orderNo"
                    label="订单号"
                    rules={[{ required: true, message: '请输入订单号' }]}
                >
                    <Input placeholder="请输入订单号" />
                </Form.Item>

                <Form.Item
                    name="clientId"
                    label="客户"
                    rules={[{ required: true, message: '请选择客户' }]}
                >
                    <Select placeholder="请选择客户" showSearch>
                        {clients.map(client => (
                            <Option key={client.id || client._id} value={client.id || client._id}>
                                {client.companyName || client.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="currentAmount"
                    label="订单金额"
                    rules={[{ required: true, message: '请输入订单金额' }]}
                >
                    <InputNumber
                        placeholder="请输入金额"
                        style={{ width: '100%' }}
                        min={0}
                        precision={2}
                        formatter={(value: number | string | undefined) => {
                            if (value === undefined || value === null) return ''
                            return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }}
                        parser={(value: string | undefined) => {
                            if (!value) return ''
                            return value.replace(/\¥\s?|(,*)/g, '')
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="订单状态"
                    rules={[{ required: true, message: '请选择订单状态' }]}
                >
                    <Select placeholder="请选择状态">
                        <Option value="pending">待确认</Option>
                        <Option value="confirmed">已确认</Option>
                        <Option value="processing">处理中</Option>
                        <Option value="completed">已完成</Option>
                        <Option value="cancelled">已取消</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="createTime"
                    label="创建时间"
                >
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="deliveryDate"
                    label="交付日期"
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="paymentMethod"
                    label="支付方式"
                >
                    <Select placeholder="请选择支付方式">
                        <Option value="银行转账">银行转账</Option>
                        <Option value="支付宝">支付宝</Option>
                        <Option value="微信支付">微信支付</Option>
                        <Option value="现金">现金</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="contactPerson"
                    label="联系人"
                >
                    <Input placeholder="请输入联系人" />
                </Form.Item>

                <Form.Item
                    name="contactPhone"
                    label="联系电话"
                >
                    <Input placeholder="请输入联系电话" />
                </Form.Item>
            </div>

            <Form.Item
                name="description"
                label="项目描述"
                rules={[{ required: true, message: '请输入项目描述' }]}
            >
                <TextArea rows={3} placeholder="请输入项目描述" />
            </Form.Item>

            <Form.Item
                name="address"
                label="交付地址"
            >
                <TextArea rows={2} placeholder="请输入交付地址" />
            </Form.Item>

            <Form.Item
                name="remark"
                label="备注"
            >
                <TextArea rows={2} placeholder="请输入备注信息" />
            </Form.Item>
        </Form>
    )
}

export default EditForm 