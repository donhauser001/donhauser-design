import React from 'react';
import { Form, Input, Switch, Select, DatePicker } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import { getLinearIcon } from '../utils/iconUtils';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface CommonPropertiesProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const CommonProperties: React.FC<CommonPropertiesProps> = ({ component, onPropertyChange }) => {
    const isLayoutComponent = ['columnContainer', 'group'].includes(component.type);
    const isSpecialComponent = ['divider', 'pagination', 'steps', 'presetText', 'image', 'html', 'countdown'].includes(component.type);
    const isRadioComponent = component.type === 'radio';
    const isSliderComponent = component.type === 'slider';
    const isQuotationComponent = component.type === 'quotation';
    const isOrderComponent = component.type === 'order';
    const isInstructionComponent = component.type === 'instruction';
    const isTextAreaComponent = component.type === 'textarea';
    const isTaskListComponent = component.type === 'taskList';
    // 数字组件有自己的特殊默认值/占位符处理逻辑，日期组件使用基础属性但不需要图标
    const isNumberComponent = component.type === 'number';
    const isDateComponent = component.type === 'date';
    // 合同方组件不需要图标、默认值和占位符
    const isContractPartyComponent = component.type === 'contractParty';
    // 我方证照组件只保留字段说明
    const isOurCertificateComponent = component.type === 'ourCertificate';


    return (
        <>
            {/* 基础属性 */}
            {!isLayoutComponent && !isOurCertificateComponent && (
                <Form.Item label="标签">
                    <Input
                        value={component.label}
                        onChange={(e) => onPropertyChange('label', e.target.value)}
                        placeholder="请输入标签"
                    />
                </Form.Item>
            )}

            {/* 通用属性（非布局组件和特殊组件） */}
            {!isLayoutComponent && !isSpecialComponent && !isOurCertificateComponent && (
                <>
                    <Form.Item label="隐藏标签">
                        <Switch
                            checked={component.hideLabel || false}
                            onChange={(checked) => onPropertyChange('hideLabel', checked)}
                        />
                    </Form.Item>

                    {!isOrderComponent && !isTaskListComponent && (
                        <Form.Item label="必填字段">
                            <Switch
                                checked={component.required || false}
                                onChange={(checked) => onPropertyChange('required', checked)}
                            />
                        </Form.Item>
                    )}

                    {!isTextAreaComponent && !isRadioComponent && !isSliderComponent && !isQuotationComponent && !isOrderComponent && !isInstructionComponent && !isTaskListComponent && !isDateComponent && !isContractPartyComponent && (
                        <Form.Item label="图标">
                            <Select
                                value={component.icon || ''}
                                onChange={(value) => onPropertyChange('icon', value)}
                                placeholder="选择图标"
                                allowClear
                            >
                                <Option value="user">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('user')}
                                        <span>用户</span>
                                    </div>
                                </Option>
                                <Option value="email">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('email')}
                                        <span>邮箱</span>
                                    </div>
                                </Option>
                                <Option value="phone">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('phone')}
                                        <span>电话</span>
                                    </div>
                                </Option>
                                <Option value="home">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('home')}
                                        <span>地址</span>
                                    </div>
                                </Option>
                                <Option value="company">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('company')}
                                        <span>公司</span>
                                    </div>
                                </Option>
                                <Option value="money">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('money')}
                                        <span>金额</span>
                                    </div>
                                </Option>
                                <Option value="calendar">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('calendar')}
                                        <span>日期</span>
                                    </div>
                                </Option>
                                <Option value="time">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('time')}
                                        <span>时间</span>
                                    </div>
                                </Option>
                                <Option value="number">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('number')}
                                        <span>数字</span>
                                    </div>
                                </Option>
                                <Option value="text">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('text')}
                                        <span>文本</span>
                                    </div>
                                </Option>
                                <Option value="search">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('search')}
                                        <span>搜索</span>
                                    </div>
                                </Option>
                                <Option value="link">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('link')}
                                        <span>链接</span>
                                    </div>
                                </Option>
                                <Option value="file">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('file')}
                                        <span>文件</span>
                                    </div>
                                </Option>
                                <Option value="image">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('image')}
                                        <span>图片</span>
                                    </div>
                                </Option>
                                <Option value="video">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('video')}
                                        <span>视频</span>
                                    </div>
                                </Option>
                                <Option value="heart">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('heart')}
                                        <span>喜爱</span>
                                    </div>
                                </Option>
                                <Option value="star">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('star')}
                                        <span>星标</span>
                                    </div>
                                </Option>
                                <Option value="message">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getLinearIcon('message')}
                                        <span>消息</span>
                                    </div>
                                </Option>
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item label="字段说明">
                        <TextArea
                            value={component.fieldDescription || ''}
                            onChange={(e) => onPropertyChange('fieldDescription', e.target.value)}
                            placeholder="请输入字段说明"
                            rows={2}
                        />
                    </Form.Item>

                    {!isRadioComponent && !isQuotationComponent && !isOrderComponent && !isInstructionComponent && !isTextAreaComponent && !isTaskListComponent && !isNumberComponent && !isDateComponent && !isContractPartyComponent && (
                        <Form.Item label="默认值">
                            <Input
                                value={component.defaultValue || ''}
                                onChange={(e) => onPropertyChange('defaultValue', e.target.value)}
                                placeholder="请输入默认值"
                            />
                        </Form.Item>
                    )}

                    {isDateComponent && (
                        <Form.Item label="默认值">
                            {component.autoCurrentTime ? (
                                <Input
                                    value="自动抓取填表时间"
                                    disabled={true}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#f0f2f5',
                                        color: '#8c8c8c',
                                        fontStyle: 'italic'
                                    }}
                                />
                            ) : component.showTimePicker ? (
                                <DatePicker
                                    showTime={{
                                        format: 'HH:mm:ss'
                                    }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择默认日期时间"
                                    value={component.defaultValue ? dayjs(component.defaultValue) : null}
                                    onChange={(date) => onPropertyChange('defaultValue', date ? date.format('YYYY-MM-DD HH:mm:ss') : '')}
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="选择默认日期"
                                    value={component.defaultValue ? dayjs(component.defaultValue) : null}
                                    onChange={(date) => onPropertyChange('defaultValue', date ? date.format('YYYY-MM-DD') : '')}
                                    style={{ width: '100%' }}
                                />
                            )}
                        </Form.Item>
                    )}

                    {!isRadioComponent && !isSliderComponent && !isQuotationComponent && !isOrderComponent && !isTaskListComponent && !isNumberComponent && !isContractPartyComponent && (
                        <Form.Item label="占位符">
                            <Input
                                value={component.placeholder || ''}
                                onChange={(e) => onPropertyChange('placeholder', e.target.value)}
                                placeholder="请输入占位符"
                            />
                        </Form.Item>
                    )}
                </>
            )}

            {/* 我方证照组件只显示字段说明 */}
            {isOurCertificateComponent && (
                <Form.Item label="字段说明">
                    <TextArea
                        value={component.fieldDescription || ''}
                        onChange={(e) => onPropertyChange('fieldDescription', e.target.value)}
                        placeholder="请输入字段说明"
                        rows={2}
                    />
                </Form.Item>
            )}
        </>
    );
};

export default CommonProperties;
