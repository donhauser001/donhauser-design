import React from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Select,
    Switch,
    InputNumber,
    DatePicker,
    Button,
    Typography
} from 'antd';
import { BasicSettingsProps } from './types';
import { getLinearIcon, getAllIconKeys } from '../utils/iconUtils';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

const BasicSettingsTab: React.FC<BasicSettingsProps> = ({
    form,
    formData,
    formCategories,
    categoriesLoading,
    submissionLimitEnabled,
    expiryEnabled,
    expiryType,
    selectedIcon,
    setSubmissionLimitEnabled,
    setExpiryEnabled,
    setExpiryType,
    setSelectedIcon
}) => {
    return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
            {/* 表单信息 */}
            <Card size="small" title="表单信息" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="表单名称"
                            rules={[{ required: true, message: '请输入表单名称' }]}
                        >
                            <Input placeholder="请输入表单名称" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="categoryId" label="表单分类">
                            <Select
                                placeholder="请选择表单分类"
                                loading={categoriesLoading}
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {formCategories.map(category => (
                                    <Option key={category._id} value={category._id} label={category.name}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '2px',
                                                    backgroundColor: category.color
                                                }}
                                            />
                                            {category.name}
                                            <span style={{ color: '#999', fontSize: '12px' }}>
                                                ({category.formCount}个表单)
                                            </span>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="表单状态">
                            <Select>
                                <Option value="draft">草稿</Option>
                                <Option value="published">已发布</Option>
                                <Option value="disabled">已停用</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="allowGuestView" label="允许游客查看" valuePropName="checked" tooltip="开启后未登录用户也可以查看此表单">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="allowGuestSubmit" label="允许游客提交" valuePropName="checked" tooltip="开启后未登录用户也可以提交此表单">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="showFormTitle" label="显示表单名称" valuePropName="checked" tooltip="开启后在预览页面显示表单名称">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="showFormDescription" label="显示表单描述" valuePropName="checked" tooltip="开启后在预览页面显示表单描述">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="description" label="表单描述">
                    <TextArea
                        rows={3}
                        placeholder="请输入表单描述"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>
            </Card>

            {/* 保存设置 */}
            <Card size="small" title="保存设置" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Text strong style={{ fontSize: '13px', color: '#666' }}>编辑器自动保存</Text>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="autoSave" label="启用编辑器自动保存" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="autoSaveInterval" label="保存间隔(秒)" tooltip="表单设计器自动保存间隔">
                            <InputNumber min={10} max={300} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={24}>
                        <Text strong style={{ fontSize: '13px', color: '#666' }}>表单填写自动保存</Text>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="enableFormAutoSave" label="启用填写自动保存" valuePropName="checked" tooltip="用户填写表单时自动保存草稿">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="formAutoSaveInterval" label="保存间隔(秒)" tooltip="用户填写表单时的自动保存间隔">
                            <InputNumber min={5} max={120} style={{ width: '100%' }} placeholder="默认30秒" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="saveTrigger" label="保存触发方式">
                            <Select placeholder="选择保存触发方式">
                                <Option value="interval">定时保存</Option>
                                <Option value="change">内容变化时保存</Option>
                                <Option value="both">定时+变化时保存</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="saveLocation" label="保存位置">
                            <Select placeholder="选择保存位置">
                                <Option value="localStorage">本地存储</Option>
                                <Option value="server">服务器</Option>
                                <Option value="both">本地+服务器</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="autoSaveNotification" label="显示自动保存提示" valuePropName="checked" tooltip="是否在用户界面显示自动保存状态">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 提交限制 */}
            <Card size="small" title="提交限制" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="enableSubmissionLimit" label="启用提交限制" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>

                    {submissionLimitEnabled && (
                        <>
                            <Col span={12}>
                                <Form.Item
                                    name="maxSubmissions"
                                    label="最大提交次数"
                                    tooltip="设置每个IP或每个用户的最大提交次数，0表示不限制"
                                    rules={submissionLimitEnabled ? [{
                                        required: true,
                                        message: '请输入最大提交次数',
                                        type: 'number',
                                        min: 0
                                    }] : []}
                                >
                                    <InputNumber
                                        min={0}
                                        max={10000}
                                        style={{ width: '100%' }}
                                        placeholder="0表示不限制"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="limitType"
                                    label="限制类型"
                                    rules={submissionLimitEnabled ? [{ required: true, message: '请选择限制类型' }] : []}
                                >
                                    <Select placeholder="选择限制类型">
                                        <Option value="ip">每IP限制</Option>
                                        <Option value="user">每用户限制</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="resetPeriod"
                                    label="重置周期"
                                    rules={submissionLimitEnabled ? [{ required: true, message: '请选择重置周期' }] : []}
                                >
                                    <Select placeholder="选择重置周期">
                                        <Option value="never">永不重置</Option>
                                        <Option value="daily">每日重置</Option>
                                        <Option value="weekly">每周重置</Option>
                                        <Option value="monthly">每月重置</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="limitMessage"
                                    label="限制提示语"
                                    tooltip="当用户达到提交限制时显示的提示信息"
                                >
                                    <Input.TextArea
                                        rows={2}
                                        placeholder="您已达到提交次数限制，请稍后再试"
                                        maxLength={200}
                                        showCount
                                    />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                </Row>
            </Card>

            {/* 有效期设置 */}
            <Card size="small" title="有效期设置" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="enableExpiry" label="启用有效期" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    {expiryEnabled && (
                        <Col span={12}>
                            <Form.Item name="expiryType" label="有效期类型">
                                <Select
                                    placeholder="选择有效期类型"
                                    onChange={(value) => setExpiryType(value)}
                                    value={expiryType}
                                >
                                    <Option value="date">指定日期</Option>
                                    <Option value="duration">持续时间</Option>
                                    <Option value="submissions">提交次数</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    )}

                    {/* 指定日期模式 */}
                    {expiryEnabled && expiryType === 'date' && (
                        <Col span={24}>
                            <Form.Item
                                name="expiryDate"
                                label="截止日期"
                                tooltip="表单将在此日期后停止接收提交"
                                rules={expiryEnabled ? [{ required: true, message: '请选择截止日期' }] : []}
                            >
                                <DatePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                    placeholder="选择截止日期和时间"
                                    disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                                />
                            </Form.Item>
                        </Col>
                    )}

                    {/* 持续时间模式 */}
                    {expiryEnabled && expiryType === 'duration' && (
                        <Col span={24}>
                            <Form.Item
                                name="expiryDuration"
                                label="有效时长(天)"
                                tooltip="从表单发布时开始计算有效时长"
                                rules={expiryEnabled ? [{ required: true, message: '请输入有效时长' }] : []}
                            >
                                <InputNumber
                                    min={1}
                                    max={365}
                                    style={{ width: '100%' }}
                                    placeholder="从发布开始计算，如：30天"
                                    addonAfter="天"
                                />
                            </Form.Item>
                        </Col>
                    )}

                    {/* 提交次数模式 */}
                    {expiryEnabled && expiryType === 'submissions' && (
                        <Col span={24}>
                            <Form.Item
                                name="expirySubmissions"
                                label="总提交次数限制"
                                tooltip="表单达到此提交次数后将自动过期"
                                rules={expiryEnabled ? [{ required: true, message: '请输入总提交次数限制' }] : []}
                            >
                                <InputNumber
                                    min={1}
                                    max={100000}
                                    style={{ width: '100%' }}
                                    placeholder="如：1000次提交后自动过期"
                                    addonAfter="次"
                                />
                            </Form.Item>
                        </Col>
                    )}

                    {/* 过期提示 - 启用有效期时显示 */}
                    {expiryEnabled && (
                        <Col span={24}>
                            <Form.Item name="expiryMessage" label="过期提示">
                                <Input
                                    placeholder="表单已过期，无法提交"
                                    style={{ width: '100%' }}
                                    showCount
                                    maxLength={200}
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>
            </Card>

            {/* 提交设置 */}
            <Card size="small" title="提交设置" extra={
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    💡 保存设置后可在预览模式中查看效果
                </Text>
            }>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="submitButtonText" label="提交按钮文本">
                            <Input placeholder="提交" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="submitButtonPosition" label="按钮位置">
                            <Select>
                                <Option value="left">左对齐</Option>
                                <Option value="center">居中</Option>
                                <Option value="right">右对齐</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="submitButtonIcon" label="按钮图标">
                            <div>
                                {/* 当前选中的图标预览 */}
                                <div style={{
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '4px',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <span style={{ fontSize: '12px', color: '#666' }}>当前图标:</span>
                                    {selectedIcon ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {getLinearIcon(selectedIcon)}
                                            <span style={{ fontSize: '12px', color: '#666' }}>
                                                {selectedIcon}
                                            </span>
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#999' }}>未选择</span>
                                    )}
                                    {selectedIcon && (
                                        <Button
                                            size="small"
                                            type="text"
                                            onClick={() => {
                                                form.setFieldsValue({ submitButtonIcon: '' });
                                                setSelectedIcon('');
                                            }}
                                            style={{ padding: '0 4px', fontSize: '10px' }}
                                        >
                                            清除
                                        </Button>
                                    )}
                                </div>

                                {/* 图标网格 */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(8, 1fr)',
                                    gap: '4px',
                                    maxHeight: '120px',
                                    overflowY: 'auto',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '4px',
                                    padding: '8px'
                                }}>
                                    {getAllIconKeys().map(iconKey => (
                                        <div
                                            key={iconKey}
                                            onClick={() => {
                                                form.setFieldsValue({ submitButtonIcon: iconKey });
                                                setSelectedIcon(iconKey);
                                            }}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: selectedIcon === iconKey ? '2px solid #1890ff' : '1px solid #e8e8e8',
                                                borderRadius: '4px',
                                                backgroundColor: selectedIcon === iconKey ? '#e6f7ff' : '#ffffff',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                                                if (selectedIcon !== iconKey) {
                                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                                }
                                            }}
                                            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                                if (selectedIcon !== iconKey) {
                                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                                    e.currentTarget.style.borderColor = '#e8e8e8';
                                                }
                                            }}
                                            title={iconKey}
                                        >
                                            {getLinearIcon(iconKey)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="enableDraft" label="启用草稿保存" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="requireConfirmation" label="提交前确认" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="redirectAfterSubmit" label="提交后跳转" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="redirectUrl" label="跳转地址">
                            <Input placeholder="https://..." />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="successMessage" label="提交成功提示">
                    <TextArea
                        rows={2}
                        placeholder="表单提交成功！感谢您的填写。"
                        maxLength={200}
                        showCount
                    />
                </Form.Item>
            </Card>
        </div>
    );
};

export default BasicSettingsTab;
