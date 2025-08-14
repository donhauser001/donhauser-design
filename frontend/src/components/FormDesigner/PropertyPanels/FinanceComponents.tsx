import React from 'react';
import { Form, Select, Switch, InputNumber, Input } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import { useFormDesignerStore } from '../../../stores/formDesignerStore';
import { getActiveEnterprises } from '../../../api/enterprises';

const { Option } = Select;

interface FinanceComponentsProps {
    component: FormComponent;
    onPropertyChange: (key: string, value: any) => void;
}

const FinanceComponents: React.FC<FinanceComponentsProps> = ({ component, onPropertyChange }) => {
    const { components } = useFormDesignerStore();

    // 金额组件属性
    const renderAmountProperties = () => (
        <>
            <Form.Item label="小数位数" style={{ marginBottom: 8 }}>
                <InputNumber
                    value={component.precision || 2}
                    onChange={(value) => onPropertyChange('precision', value)}
                    min={0}
                    max={4}
                    style={{ width: '100%' }}
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    设置金额显示的小数位数
                </div>
            </Form.Item>

            <Form.Item label="显示千分位符号" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.formatter !== false}
                    onChange={(checked) => onPropertyChange('formatter', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    启用后显示千分位逗号分隔符
                </div>
            </Form.Item>

            <Form.Item label="最小值" style={{ marginBottom: 8 }}>
                <InputNumber
                    value={component.min}
                    onChange={(value) => onPropertyChange('min', value)}
                    style={{ width: '100%' }}
                    placeholder="无限制"
                />
            </Form.Item>

            <Form.Item label="最大值" style={{ marginBottom: 8 }}>
                <InputNumber
                    value={component.max}
                    onChange={(value) => onPropertyChange('max', value)}
                    style={{ width: '100%' }}
                    placeholder="无限制"
                />
            </Form.Item>

            <Form.Item label="步长" style={{ marginBottom: 8 }}>
                <InputNumber
                    value={component.step || 1}
                    onChange={(value) => onPropertyChange('step', value)}
                    min={0.01}
                    step={0.01}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="关联订单总计" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.linkOrderTotal === true}
                    onChange={(checked) => onPropertyChange('linkOrderTotal', checked)}
                    size="small"
                />
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    启用后自动显示订单组件的总计金额
                </div>
            </Form.Item>

            {component.linkOrderTotal && (
                <Form.Item label="总计金额百分比" style={{ marginBottom: 8 }}>
                    <InputNumber
                        value={component.orderTotalPercentage || 100}
                        onChange={(value) => onPropertyChange('orderTotalPercentage', value)}
                        min={0}
                        max={1000}
                        precision={1}
                        step={1}
                        style={{ width: '100%' }}
                        addonAfter="%"
                    />
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px'
                    }}>
                        设置显示订单总计的百分比，如预付款30%、尾款70%
                    </div>
                </Form.Item>
            )}
        </>
    );

    // 金额大写组件属性
    const renderAmountInWordsProperties = () => {
        // 获取画布中所有的金额相关组件
        const amountComponents = components.filter(comp =>
            ['amount', 'total'].includes(comp.type) && comp.id !== component.id
        );

        // 检查当前关联的组件是否还存在
        const currentLinkedComponent = component.linkedAmountComponentId ?
            amountComponents.find(comp => comp.id === component.linkedAmountComponentId) : null;

        // 如果关联的组件不存在，显示为空
        const selectValue = currentLinkedComponent ? component.linkedAmountComponentId : '';

        return (
            <>
                <Form.Item label="关联金额组件" style={{ marginBottom: 8 }}>
                    <Select
                        value={selectValue}
                        onChange={(value) => onPropertyChange('linkedAmountComponentId', value)}
                        placeholder="选择要关联的金额组件"
                        style={{ width: '100%' }}
                        allowClear
                    >
                        {amountComponents.map(comp => (
                            <Option key={comp.id} value={comp.id}>
                                {comp.label} ({comp.type === 'amount' ? '金额' : '总计'})
                            </Option>
                        ))}
                    </Select>
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px'
                    }}>
                        {amountComponents.length === 0
                            ? '画布中暂无金额组件，请先添加金额或总计组件'
                            : !currentLinkedComponent && component.linkedAmountComponentId
                                ? `原关联组件已删除，请重新选择关联组件（可选 ${amountComponents.length} 个）`
                                : `共找到 ${amountComponents.length} 个金额组件可关联`
                        }
                    </div>
                </Form.Item>

                <Form.Item label="内容样式" style={{ marginBottom: 8 }}>
                    <Select
                        value={component.amountStyle || 'normal'}
                        onChange={(value) => onPropertyChange('amountStyle', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="normal">普通</Option>
                        <Option value="bold">加粗</Option>
                        <Option value="italic">斜体</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="字体大小" style={{ marginBottom: 8 }}>
                    <InputNumber
                        value={component.fontSize || 14}
                        onChange={(value) => onPropertyChange('fontSize', value)}
                        min={12}
                        max={24}
                        style={{ width: '100%' }}
                        addonAfter="px"
                    />
                </Form.Item>

                <Form.Item label="包含'人民币'前缀" style={{ marginBottom: 8 }}>
                    <Switch
                        checked={component.includePrefix !== false}
                        onChange={(checked) => onPropertyChange('includePrefix', checked)}
                        size="small"
                    />
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px'
                    }}>
                        启用后显示"人民币"前缀
                    </div>
                </Form.Item>

                <Form.Item label="背景颜色" style={{ marginBottom: 8 }}>
                    <Select
                        value={component.backgroundColor || 'default'}
                        onChange={(value) => onPropertyChange('backgroundColor', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="default">默认灰色</Option>
                        <Option value="transparent">透明</Option>
                        <Option value="white">白色</Option>
                    </Select>
                </Form.Item>
            </>
        );
    };

    // 总计组件属性
    const renderTotalProperties = () => {
        // 获取画布中所有的金额组件（排除自己）
        const amountComponents = components.filter(comp =>
            comp.type === 'amount' && comp.id !== component.id
        );

        return (
            <>
                <Form.Item label="总计模式" style={{ marginBottom: 8 }}>
                    <Select
                        value={component.totalMode || 'order'}
                        onChange={(value) => onPropertyChange('totalMode', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="order">关联订单总计</Option>
                        <Option value="amounts">金额组件求和</Option>
                    </Select>
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px'
                    }}>
                        {component.totalMode === 'amounts'
                            ? '选择画布上的金额组件进行自动求和'
                            : '自动显示订单组件的总计金额'
                        }
                    </div>
                </Form.Item>

                {component.totalMode === 'order' && (
                    <Form.Item label="订单总计百分比" style={{ marginBottom: 8 }}>
                        <InputNumber
                            value={component.orderTotalPercentage || 100}
                            onChange={(value) => onPropertyChange('orderTotalPercentage', value)}
                            min={0}
                            max={1000}
                            precision={1}
                            step={1}
                            style={{ width: '100%' }}
                            addonAfter="%"
                        />
                        <div style={{
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginTop: '4px'
                        }}>
                            设置显示订单总计的百分比，如预付款30%、尾款70%
                        </div>
                    </Form.Item>
                )}

                {component.totalMode === 'amounts' && (
                    <Form.Item label="选择金额组件" style={{ marginBottom: 8 }}>
                        <Select
                            mode="multiple"
                            value={component.selectedAmountIds || []}
                            onChange={(value) => onPropertyChange('selectedAmountIds', value)}
                            placeholder="选择要求和的金额组件"
                            style={{ width: '100%' }}
                            allowClear
                        >
                            {amountComponents.map(comp => (
                                <Option key={comp.id} value={comp.id}>
                                    {comp.label}
                                </Option>
                            ))}
                        </Select>
                        <div style={{
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginTop: '4px'
                        }}>
                            {amountComponents.length === 0
                                ? '画布中暂无金额组件，请先添加金额组件'
                                : `共找到 ${amountComponents.length} 个金额组件可选择`
                            }
                        </div>
                    </Form.Item>
                )}

                <Form.Item label="小数位数" style={{ marginBottom: 8 }}>
                    <InputNumber
                        value={component.precision || 2}
                        onChange={(value) => onPropertyChange('precision', value)}
                        min={0}
                        max={4}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="显示千分位符号" style={{ marginBottom: 8 }}>
                    <Switch
                        checked={component.formatter !== false}
                        onChange={(checked) => onPropertyChange('formatter', checked)}
                        size="small"
                    />
                </Form.Item>

                <Form.Item label="字体大小" style={{ marginBottom: 8 }}>
                    <InputNumber
                        value={component.fontSize || 16}
                        onChange={(value) => onPropertyChange('fontSize', value)}
                        min={12}
                        max={24}
                        style={{ width: '100%' }}
                        addonAfter="px"
                    />
                </Form.Item>

                <Form.Item label="字体粗细" style={{ marginBottom: 8 }}>
                    <Select
                        value={component.fontWeight || 'bold'}
                        onChange={(value) => onPropertyChange('fontWeight', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="normal">普通</Option>
                        <Option value="bold">加粗</Option>
                        <Option value="bolder">更粗</Option>
                    </Select>
                </Form.Item>
            </>
        );
    };

    // 发票类型组件属性
    const renderInvoiceTypeProperties = () => (
        <>
            <Form.Item label="发票类型选项" style={{ marginBottom: 8 }}>
                <Select
                    mode="tags"
                    value={component.invoiceOptions || ['增值税专用发票', '增值税普通发票', '电子发票', '纸质发票', '收据']}
                    onChange={(value) => onPropertyChange('invoiceOptions', value)}
                    style={{ width: '100%' }}
                    placeholder="添加发票类型选项"
                >
                    <Option value="增值税专用发票">增值税专用发票</Option>
                    <Option value="增值税普通发票">增值税普通发票</Option>
                    <Option value="电子发票">电子发票</Option>
                    <Option value="纸质发票">纸质发票</Option>
                    <Option value="收据">收据</Option>
                    <Option value="不开票">不开票</Option>
                </Select>
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    可以添加自定义发票类型
                </div>
            </Form.Item>

            <Form.Item label="允许清空" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowClear !== false}
                    onChange={(checked) => onPropertyChange('allowClear', checked)}
                    size="small"
                />
            </Form.Item>

            <Form.Item label="允许搜索" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowSearch !== false}
                    onChange={(checked) => onPropertyChange('allowSearch', checked)}
                    size="small"
                />
            </Form.Item>
        </>
    );

    // 开票信息组件属性
    const renderInvoiceInfoProperties = () => {
        const [enterprises, setEnterprises] = React.useState<any[]>([]);
        const [loading, setLoading] = React.useState(false);

        // 加载企业列表
        React.useEffect(() => {
            const loadEnterprises = async () => {
                try {
                    setLoading(true);
                    // 使用现有的企业API
                    const response = await getActiveEnterprises();

                    // 处理不同的响应结构
                    if (response) {
                        // 尝试多种可能的数据结构
                        let enterpriseList = [];

                        if ((response as any).success && (response as any).data) {
                            if (Array.isArray((response as any).data)) {
                                enterpriseList = (response as any).data;
                            } else if ((response as any).data.enterprises) {
                                enterpriseList = (response as any).data.enterprises;
                            } else if ((response as any).data.data && (response as any).data.data.enterprises) {
                                enterpriseList = (response as any).data.data.enterprises;
                            }
                        } else if (Array.isArray((response as any).data)) {
                            enterpriseList = (response as any).data;
                        } else if (Array.isArray(response)) {
                            enterpriseList = response;
                        }

                        setEnterprises(enterpriseList);
                    } else {
                        console.warn('获取企业数据失败:', response);
                        setEnterprises([]);
                    }
                } catch (error) {
                    console.error('加载企业列表失败:', error);
                    setEnterprises([]);
                } finally {
                    setLoading(false);
                }
            };

            loadEnterprises();
        }, []);

        return (
            <>
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f6f8fa',
                    borderRadius: '6px',
                    marginBottom: '12px'
                }}>
                    <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '8px'
                    }}>
                        📋 开票信息说明
                    </div>
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        lineHeight: '1.4'
                    }}>
                        开票信息组件会自动从企业设置模块获取企业信息，在属性面板中选择企业后，画布上将显示该企业的完整开票信息。
                    </div>
                </div>

                <Form.Item label="选择开票企业" style={{ marginBottom: 8 }}>
                    <Select
                        value={component.selectedEnterpriseId}
                        onChange={(value) => onPropertyChange('selectedEnterpriseId', value)}
                        placeholder="请选择企业"
                        loading={loading}
                        style={{ width: '100%' }}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
                        }
                    >
                        {enterprises.map(enterprise => (
                            <Option
                                key={enterprise.id}
                                value={enterprise.id}
                                label={enterprise.enterpriseName}
                            >
                                {enterprise.enterpriseName}
                                {enterprise.enterpriseAlias && ` (${enterprise.enterpriseAlias})`}
                            </Option>
                        ))}
                    </Select>
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px'
                    }}>
                        {loading
                            ? '正在加载企业信息...'
                            : enterprises.length === 0
                                ? '暂无企业信息，请先在企业设置模块中添加企业或检查网络连接'
                                : `共找到 ${enterprises.length} 家企业`
                        }
                    </div>
                </Form.Item>

                <Form.Item label="标题显示" style={{ marginBottom: 8 }}>
                    <Select
                        value={component.titleDisplay || 'show'}
                        onChange={(value) => onPropertyChange('titleDisplay', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="show">显示默认标题</Option>
                        <Option value="custom">自定义标题</Option>
                        <Option value="hide">隐藏标题</Option>
                    </Select>
                </Form.Item>

                {component.titleDisplay === 'custom' && (
                    <Form.Item label="自定义标题" style={{ marginBottom: 8 }}>
                        <Input
                            value={component.customTitle || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPropertyChange('customTitle', e.target.value)}
                            placeholder="请输入自定义标题"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                )}

                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                }}>
                    💡 组件将直接显示企业的开票信息字段内容
                </div>
            </>
        );
    };

    // 付款方式组件属性
    const renderPaymentMethodProperties = () => (
        <>
            <Form.Item label="付款方式选项" style={{ marginBottom: 8 }}>
                <Select
                    mode="tags"
                    value={component.paymentOptions || ['现金', '银行转账', '支票', '微信支付', '支付宝', '信用卡']}
                    onChange={(value) => onPropertyChange('paymentOptions', value)}
                    style={{ width: '100%' }}
                    placeholder="添加付款方式选项"
                >
                    <Option value="现金">现金</Option>
                    <Option value="银行转账">银行转账</Option>
                    <Option value="支票">支票</Option>
                    <Option value="微信支付">微信支付</Option>
                    <Option value="支付宝">支付宝</Option>
                    <Option value="信用卡">信用卡</Option>
                    <Option value="分期付款">分期付款</Option>
                </Select>
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px'
                }}>
                    可以添加自定义付款方式
                </div>
            </Form.Item>

            <Form.Item label="允许清空" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowClear !== false}
                    onChange={(checked) => onPropertyChange('allowClear', checked)}
                    size="small"
                />
            </Form.Item>

            <Form.Item label="允许搜索" style={{ marginBottom: 8 }}>
                <Switch
                    checked={component.allowSearch !== false}
                    onChange={(checked) => onPropertyChange('allowSearch', checked)}
                    size="small"
                />
            </Form.Item>
        </>
    );



    // 根据组件类型渲染对应的属性面板
    const renderFinanceProperties = () => {
        switch (component.type) {
            case 'amount':
                return renderAmountProperties();
            case 'amountInWords':
                return renderAmountInWordsProperties();
            case 'total':
                return renderTotalProperties();
            case 'invoiceType':
                return renderInvoiceTypeProperties();
            case 'invoiceInfo':
                return renderInvoiceInfoProperties();
            case 'paymentMethod':
                return renderPaymentMethodProperties();
            default:
                return <div>未知的财务组件类型</div>;
        }
    };

    return (
        <>
            {renderFinanceProperties()}
        </>
    );
};

export default FinanceComponents;
