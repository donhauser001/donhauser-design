import React from 'react';
import { Form, Input, Switch, Select, DatePicker, InputNumber } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import { getLinearIcon, getAllIconKeys } from '../utils/iconUtils';
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
    const isDateComponent = component.type === 'date' || component.type === 'articlePublishTime';
    // 合同方组件不需要图标、默认值和占位符
    const isContractPartyComponent = component.type === 'contractParty';
    // 我方证照组件只保留字段说明
    const isOurCertificateComponent = component.type === 'ourCertificate';
    // 文章分类组件不需要默认值设置
    const isArticleCategoryComponent = component.type === 'articleCategory';
    // 文章标签组件不需要默认值设置（支持双模式：输入框/下拉选择）
    const isArticleTagsComponent = component.type === 'articleTags';
    // SEO设置组件不需要图标、默认值和占位符设置
    const isArticleSeoComponent = component.type === 'articleSeo';
    // 文章内容组件不需要图标和默认值设置
    const isArticleContentComponent = component.type === 'articleContent';
    // 文章摘要组件不需要图标和默认值设置
    const isArticleSummaryComponent = component.type === 'articleSummary';
    // 文章封面图片组件不需要图标、默认值和占位符设置
    const isArticleCoverImageComponent = component.type === 'articleCoverImage';
    // 金额组件需要数字类型的默认值处理
    const isAmountComponent = ['amount', 'total'].includes(component.type);
    // 总计组件不需要必填和默认值设置
    const isTotalComponent = component.type === 'total';
    // 发票类型组件不需要默认值设置
    const isInvoiceTypeComponent = component.type === 'invoiceType';
    // 付款方式组件不需要默认值设置
    const isPaymentMethodComponent = component.type === 'paymentMethod';
    // 开票信息组件不需要必填、图标、默认值和占位符设置
    const isInvoiceInfoComponent = component.type === 'invoiceInfo';
    // 金额大写组件不需要必填、图标、默认值和占位符设置
    const isAmountInWordsComponent = component.type === 'amountInWords';


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

            {/* 可见性设置（所有非布局组件都可以设置） */}
            {!isLayoutComponent && (
                <Form.Item label="可见性">
                    <Select
                        value={component.visibility || 'visible'}
                        onChange={(value) => onPropertyChange('visibility', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="visible">正常显示</Option>
                        <Option value="hidden">隐藏</Option>
                        <Option value="admin">管理员可见</Option>
                    </Select>
                </Form.Item>
            )}

            {/* 字段说明（对所有非布局组件可见） */}
            {!isLayoutComponent && (
                <Form.Item label="字段说明">
                    <TextArea
                        value={component.fieldDescription || ''}
                        onChange={(e) => onPropertyChange('fieldDescription', e.target.value)}
                        placeholder="请输入字段说明"
                        rows={2}
                    />
                </Form.Item>
            )}

            {/* 通用属性（排除布局组件和特殊组件） */}
            {!isLayoutComponent && !isSpecialComponent && !isOurCertificateComponent && (
                <>
                    <Form.Item label="隐藏标签">
                        <Switch
                            checked={component.hideLabel || false}
                            onChange={(checked) => onPropertyChange('hideLabel', checked)}
                        />
                    </Form.Item>

                    {!isOrderComponent && !isTaskListComponent && !isAmountInWordsComponent && !isTotalComponent && !isInvoiceInfoComponent && component.type !== 'signature' && (
                        <Form.Item label="必填字段">
                            <Switch
                                checked={component.required || false}
                                onChange={(checked) => onPropertyChange('required', checked)}
                            />
                        </Form.Item>
                    )}

                    {!isTextAreaComponent && !isRadioComponent && !isSliderComponent && !isQuotationComponent && !isOrderComponent && !isInstructionComponent && !isTaskListComponent && !isDateComponent && !isContractPartyComponent && !isArticleSeoComponent && !isArticleContentComponent && !isArticleSummaryComponent && !isArticleCoverImageComponent && !isInvoiceInfoComponent && !isAmountInWordsComponent && component.type !== 'upload' && component.type !== 'signature' && component.type !== 'articlePublishTime' && (
                        <Form.Item label="图标">
                            <div style={{
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                padding: '8px',
                                backgroundColor: '#fafafa'
                            }}>
                                {/* 当前选择的图标显示 */}
                                <div style={{
                                    marginBottom: '8px',
                                    padding: '4px 8px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '4px',
                                    border: '1px solid #e8e8e8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minHeight: '24px'
                                }}>
                                    {component.icon ? (
                                        <>
                                            {getLinearIcon(component.icon)}
                                            <span style={{ fontSize: '12px', color: '#666' }}>
                                                已选择图标
                                            </span>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#999' }}>
                                            未选择图标
                                        </span>
                                    )}
                                    {component.icon && (
                                        <button
                                            type="button"
                                            onClick={() => onPropertyChange('icon', '')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#999',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                marginLeft: 'auto'
                                            }}
                                        >
                                            清除
                                        </button>
                                    )}
                                </div>

                                {/* 图标网格 */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(6, 1fr)',
                                    gap: '4px',
                                    maxHeight: '120px',
                                    overflowY: 'auto'
                                }}>
                                    {getAllIconKeys().map(iconKey => (
                                        <div
                                            key={iconKey}
                                            onClick={() => onPropertyChange('icon', iconKey)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: component.icon === iconKey ? '2px solid #1890ff' : '1px solid #e8e8e8',
                                                borderRadius: '4px',
                                                backgroundColor: component.icon === iconKey ? '#e6f7ff' : '#ffffff',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (component.icon !== iconKey) {
                                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (component.icon !== iconKey) {
                                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                                    e.currentTarget.style.borderColor = '#e8e8e8';
                                                }
                                            }}
                                        >
                                            {getLinearIcon(iconKey)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Form.Item>
                    )}

                    {!isRadioComponent && !isQuotationComponent && !isOrderComponent && !isInstructionComponent && !isTextAreaComponent && !isTaskListComponent && !isNumberComponent && !isDateComponent && !isContractPartyComponent && !isArticleCategoryComponent && !isArticleTagsComponent && !isArticleSeoComponent && !isArticleContentComponent && !isArticleSummaryComponent && !isArticleCoverImageComponent && !isAmountComponent && !isInvoiceTypeComponent && !isPaymentMethodComponent && !isInvoiceInfoComponent && !isAmountInWordsComponent && component.type !== 'upload' && component.type !== 'signature' && (
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

                    {component.type === 'amount' && (
                        <Form.Item label="默认值">
                            <InputNumber
                                value={component.defaultValue ? parseFloat(component.defaultValue) : undefined}
                                onChange={(value) => onPropertyChange('defaultValue', value?.toString() || '')}
                                placeholder="请输入默认金额"
                                style={{ width: '100%' }}
                                precision={component.precision || 2}
                                min={0}
                                step={1}
                                formatter={(value) => {
                                    if (value === undefined || value === null ||
                                        (typeof value === 'string' && value === '') ||
                                        isNaN(Number(value))) return '';
                                    // 使用组件的precision设置进行格式化
                                    const precision = component.precision || 2;
                                    const numValue = parseFloat(value.toString());
                                    if (isNaN(numValue)) return '';
                                    const formattedValue = numValue.toFixed(precision);

                                    // 分离整数和小数部分
                                    const parts = formattedValue.split('.');
                                    // 只对整数部分添加千分号
                                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                                    return `¥ ${parts.join('.')}`;
                                }}
                                parser={(value) => {
                                    if (!value) return 0;
                                    const cleanValue = value.replace(/¥\s?|(,*)/g, '');
                                    const parsed = parseFloat(cleanValue);
                                    return isNaN(parsed) ? 0 : parsed;
                                }}
                                addonAfter="元"
                            />
                            <div style={{
                                fontSize: '12px',
                                color: '#8c8c8c',
                                marginTop: '4px'
                            }}>
                                设置金额组件的默认数值
                            </div>
                        </Form.Item>
                    )}

                    {!isRadioComponent && !isSliderComponent && !isQuotationComponent && !isOrderComponent && !isTaskListComponent && !isNumberComponent && !isContractPartyComponent && !isArticleSeoComponent && !isArticleCoverImageComponent && !isAmountComponent && !isInvoiceInfoComponent && !isAmountInWordsComponent && component.type !== 'upload' && component.type !== 'signature' && (
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
