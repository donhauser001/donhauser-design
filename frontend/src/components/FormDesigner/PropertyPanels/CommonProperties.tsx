import React from 'react';
import { Form, Input, Switch, Select } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import { getLinearIcon } from '../utils/iconUtils';

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

    return (
        <>
            {/* 基础属性 */}
            {!isLayoutComponent && (
                <Form.Item label="标签">
                    <Input
                        value={component.label}
                        onChange={(e) => onPropertyChange('label', e.target.value)}
                        placeholder="请输入标签"
                    />
                </Form.Item>
            )}

            {/* 通用属性（非布局组件和特殊组件） */}
            {!isLayoutComponent && !isSpecialComponent && (
                <>
                    <Form.Item label="隐藏标签">
                        <Switch
                            checked={component.hideLabel || false}
                            onChange={(checked) => onPropertyChange('hideLabel', checked)}
                        />
                    </Form.Item>

                    {!isOrderComponent && (
                        <Form.Item label="必填字段">
                            <Switch
                                checked={component.required || false}
                                onChange={(checked) => onPropertyChange('required', checked)}
                            />
                        </Form.Item>
                    )}

                    {component.type !== 'textarea' && !isRadioComponent && !isSliderComponent && !isQuotationComponent && !isOrderComponent && (
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

                    {!isRadioComponent && !isQuotationComponent && !isOrderComponent && (
                        <Form.Item label="默认值">
                            <Input
                                value={component.defaultValue || ''}
                                onChange={(e) => onPropertyChange('defaultValue', e.target.value)}
                                placeholder="请输入默认值"
                            />
                        </Form.Item>
                    )}

                    {!isRadioComponent && !isSliderComponent && !isQuotationComponent && !isOrderComponent && (
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
        </>
    );
};

export default CommonProperties;
