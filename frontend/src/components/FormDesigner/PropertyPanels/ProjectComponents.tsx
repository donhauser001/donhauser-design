import React, { useState, useEffect } from 'react';
import { Form, Switch, Select, Spin, Input, InputNumber } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import { quotationService, QuotationItem } from '../services/quotationService';
import { useFormDesignerStore } from '../../../stores/formDesignerStore';

const { Option } = Select;

interface ProjectComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const ProjectComponents: React.FC<ProjectComponentsProps> = ({ component, onPropertyChange }) => {
    // 报价单相关状态（移到组件顶层）
    const [quotations, setQuotations] = useState<QuotationItem[]>([]);
    const [quotationLoading, setQuotationLoading] = useState(false);

    // 订单组件所需的store钩子（移到组件顶层）
    const { components } = useFormDesignerStore();

    // 订单组件依赖判断（移到顶层）
    const hasQuotationComponent = components.some(comp => comp.type === 'quotation');
    const hasProjectNameComponent = components.some(comp => comp.type === 'projectName');

    // 当组件类型为报价单时，加载报价单数据并选择默认报价单
    useEffect(() => {
        if (component.type === 'quotation') {
            const initializeQuotations = async () => {
                setQuotationLoading(true);
                try {
                    const quotationData = await quotationService.getAllQuotations();
                    setQuotations(quotationData);

                    // 如果当前没有选择报价单，则自动选择默认报价单
                    if (!component.selectedQuotationId) {
                        const defaultQuotation = quotationData.find(q => q.isDefault && q.status === 'active');
                        if (defaultQuotation) {
                            onPropertyChange('selectedQuotationId', defaultQuotation._id);
                        }
                    }
                } catch (error) {
                    console.error('加载报价单数据失败:', error);
                } finally {
                    setQuotationLoading(false);
                }
            };

            initializeQuotations();
        }
    }, [component.type, component.selectedQuotationId, onPropertyChange]);

    // 注意：订单组件的自动更新关联模式逻辑已移到 OrderComponent.tsx 中
    // 这样确保无论属性面板是否展开，都能正确执行

    // 项目名称组件：当画布上只有项目名称和订单组件时，自动开启"来自项目表"
    useEffect(() => {
        if (component.type === 'projectName') {
            // 检查画布上是否只有项目名称和订单组件（或者还有其他非关键组件）
            const orderComponent = components.find(comp => comp.type === 'order');
            const hasOnlyProjectAndOrder = hasProjectNameComponent && orderComponent && !hasQuotationComponent;

            if (hasOnlyProjectAndOrder && !component.fromProjectTable) {
                onPropertyChange('fromProjectTable', true);
            }
        }
    }, [component.type, hasProjectNameComponent, hasQuotationComponent, components, component.fromProjectTable, onPropertyChange]);

    // 项目名称组件特有属性
    const renderProjectNameProperties = () => (
        <>
            <Form.Item label="来自项目表">
                <Switch
                    checked={component.fromProjectTable || false}
                    onChange={(checked) => onPropertyChange('fromProjectTable', checked)}
                />
            </Form.Item>

            {component.fromProjectTable && (
                <>
                    <Form.Item label="显示客户信息">
                        <Switch
                            checked={component.showClient || false}
                            onChange={(checked) => onPropertyChange('showClient', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示项目状态">
                        <Switch
                            checked={component.showStatus || false}
                            onChange={(checked) => onPropertyChange('showStatus', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人信息">
                        <Switch
                            checked={component.showContact || false}
                            onChange={(checked) => onPropertyChange('showContact', checked)}
                        />
                    </Form.Item>
                </>
            )}
            {component.fromProjectTable && (
                <Form.Item>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'rgb(248, 249, 250)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'rgb(102, 102, 102)'
                    }}>
                        <div style={{ fontWeight: 500, marginBottom: '6px' }}>
                            已启用项目表模式
                        </div>
                        <div style={{ lineHeight: '1.6' }}>
                            • 数据来源：从 /api/projects 获取真实项目数据<br />
                            • 搜索功能：支持按项目名称和客户名称实时搜索<br />
                            • 信息显示：可选择显示客户信息、项目状态、联系人信息<br />
                            • 隐私保护：可关闭客户和联系人信息显示，避免信息泄露<br />
                            • 动态加载：最多显示1000个项目，支持服务器端搜索<br />
                            • 图标支持：基础属性中设置的图标仍然会显示在下拉框左侧<br />
                            • 在表单预览或实际使用时，用户可以从项目列表中选择已有项目
                        </div>
                    </div>
                </Form.Item>
            )}
        </>
    );

    // 客户组件特有属性
    const renderClientProperties = () => (
        <>
            <Form.Item label="来自客户表">
                <Switch
                    checked={component.fromClientTable || false}
                    onChange={(checked) => onPropertyChange('fromClientTable', checked)}
                />
            </Form.Item>

            {component.fromClientTable && (
                <>
                    <Form.Item label="显示客户分类">
                        <Switch
                            checked={component.showClientCategory || false}
                            onChange={(checked) => onPropertyChange('showClientCategory', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示客户评级">
                        <Switch
                            checked={component.showClientRating || false}
                            onChange={(checked) => onPropertyChange('showClientRating', checked)}
                        />
                    </Form.Item>
                </>
            )}
            {component.fromClientTable && (
                <Form.Item>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'rgb(248, 249, 250)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'rgb(102, 102, 102)'
                    }}>
                        <div style={{ fontWeight: 500, marginBottom: '6px' }}>
                            已启用客户表模式
                        </div>
                        <div style={{ lineHeight: '1.6' }}>
                            • 数据来源：从 /api/clients 获取真实客户数据<br />
                            • 搜索功能：支持按客户名称实时搜索<br />
                            • 信息显示：可选择显示客户分类、评级<br />
                            • 状态处理：停用客户显示"禁用"标签并冻结选项，活跃客户不显示状态<br />
                            • 隐私保护：可选择性显示敏感信息<br />
                            • 动态加载：支持服务器端搜索<br />
                            • 图标支持：基础属性中设置的图标仍然会显示在下拉框左侧<br />
                            • 在表单预览或实际使用时，用户可以从客户列表中选择已有客户
                        </div>
                    </div>
                </Form.Item>
            )}
        </>
    );

    // 联系人组件特有属性
    const renderContactProperties = () => (
        <>
            <Form.Item label="来自联系人表">
                <Switch
                    checked={component.fromContactTable || false}
                    onChange={(checked) => onPropertyChange('fromContactTable', checked)}
                />
            </Form.Item>

            {component.fromContactTable && (
                <>
                    <Form.Item label="显示联系人电话">
                        <Switch
                            checked={component.showContactPhone || false}
                            onChange={(checked) => onPropertyChange('showContactPhone', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人邮箱">
                        <Switch
                            checked={component.showContactEmail || false}
                            onChange={(checked) => onPropertyChange('showContactEmail', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人公司">
                        <Switch
                            checked={component.showContactCompany || false}
                            onChange={(checked) => onPropertyChange('showContactCompany', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人职位">
                        <Switch
                            checked={component.showContactPosition || false}
                            onChange={(checked) => onPropertyChange('showContactPosition', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="公司过滤">
                        <Switch
                            checked={component.enableCompanyFilter || false}
                            onChange={(checked) => onPropertyChange('enableCompanyFilter', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="允许多选">
                        <Switch
                            checked={component.allowMultipleContacts || false}
                            onChange={(checked) => onPropertyChange('allowMultipleContacts', checked)}
                        />
                    </Form.Item>
                </>
            )}
            {component.fromContactTable && (
                <Form.Item>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'rgb(248, 249, 250)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'rgb(102, 102, 102)'
                    }}>
                        <div style={{ fontWeight: 500, marginBottom: '6px' }}>
                            已启用联系人表模式
                        </div>
                        <div style={{ lineHeight: '1.6' }}>
                            • 数据来源：从 /api/users 获取客户角色的真实联系人数据<br />
                            • 搜索功能：支持按姓名、公司、电话实时搜索<br />
                            • 信息显示：可选择显示电话、邮箱、公司、职位<br />
                            • 公司过滤：可根据画布中客户组件的选择自动过滤相关联系人<br />
                            • 状态处理：停用联系人显示"禁用"标签并冻结选项，活跃联系人不显示状态<br />
                            • 隐私保护：可选择性显示敏感信息<br />
                            • 动态加载：支持服务器端搜索<br />
                            • 图标支持：基础属性中设置的图标仍然会显示在下拉框左侧<br />
                            • 在表单预览或实际使用时，用户可以从联系人列表中选择已有联系人
                        </div>
                    </div>
                </Form.Item>
            )}
        </>
    );

    // 报价单组件特有属性
    const renderQuotationProperties = () => {
        return (
            <>
                <Form.Item label="选择报价单">
                    <Select
                        style={{ width: '100%' }}
                        placeholder="请选择报价单"
                        value={component.selectedQuotationId || undefined}
                        onChange={(value) => onPropertyChange('selectedQuotationId', value)}
                        allowClear
                        loading={quotationLoading}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                        }
                        notFoundContent={quotationLoading ? <Spin size="small" /> : '无数据'}
                    >
                        {quotations.map((quotation) => (
                            <Option
                                key={quotation._id}
                                value={quotation._id}
                                disabled={quotation.status === 'inactive'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{quotation.name}</span>
                                    <div>
                                        {quotation.isDefault && (
                                            <span style={{
                                                backgroundColor: '#faad14',
                                                color: '#fff',
                                                padding: '0 4px',
                                                borderRadius: '2px',
                                                fontSize: '10px',
                                                marginRight: '4px'
                                            }}>
                                                默认
                                            </span>
                                        )}
                                        <span style={{
                                            backgroundColor: quotation.status === 'active' ? '#52c41a' : '#f5222d',
                                            color: '#fff',
                                            padding: '0 4px',
                                            borderRadius: '2px',
                                            fontSize: '10px'
                                        }}>
                                            {quotation.status === 'active' ? '有效' : '停用'}
                                        </span>
                                    </div>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>



                <Form.Item label="报价单名称显示">
                    <Select
                        style={{ width: '100%' }}
                        value={component.quotationNameDisplay || 'show'}
                        onChange={(value) => onPropertyChange('quotationNameDisplay', value)}
                    >
                        <Option value="show">显示报价单名称</Option>
                        <Option value="hide">隐藏报价单名称</Option>
                        <Option value="custom">自定义名称</Option>
                    </Select>
                </Form.Item>

                {component.quotationNameDisplay === 'custom' && (
                    <Form.Item label="自定义名称">
                        <Input
                            placeholder="请输入自定义的报价单名称"
                            value={component.customQuotationName || ''}
                            onChange={(e) => onPropertyChange('customQuotationName', e.target.value)}
                        />
                    </Form.Item>
                )}

                <Form.Item label="显示价格政策">
                    <Switch
                        checked={component.showPricingPolicy || false}
                        onChange={(checked) => onPropertyChange('showPricingPolicy', checked)}
                    />
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px'
                    }}>
                        在卡片右上角显示价格政策标签
                    </div>
                </Form.Item>

                {component.showPricingPolicy && (
                    <Form.Item label="政策详情呈现">
                        <Select
                            style={{ width: '100%' }}
                            value={component.policyDetailMode || 'hover'}
                            onChange={(value) => onPropertyChange('policyDetailMode', value)}
                        >
                            <Option value="hover">鼠标悬停提示</Option>
                            <Option value="modal">点击弹窗查看</Option>
                            <Option value="append">附加到价格说明</Option>
                        </Select>
                        <div style={{
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginTop: '4px'
                        }}>
                            选择用户查看政策详情的方式
                        </div>
                    </Form.Item>
                )}

                <Form.Item>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'rgb(248, 249, 250)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'rgb(102, 102, 102)'
                    }}>
                        <div style={{ fontWeight: 500, marginBottom: '6px' }}>
                            报价单组件说明
                        </div>
                        <div style={{ lineHeight: '1.6' }}>
                            • 数据来源：从 /api/quotations 获取真实报价单数据<br />
                            • 报价单选择：在上方下拉菜单中选择具体的报价单<br />
                            • 名称设置：可选择显示、隐藏或自定义报价单名称<br />
                            • 状态处理：停用报价单在下拉菜单中显示为禁用状态<br />
                            • 默认标识：默认报价单会显示"默认"标签<br />
                            • 搜索功能：支持在下拉菜单中按报价单名称搜索<br />
                            • 样式设置：切换到"样式设置"面板可配置显示模式和外观<br />
                            • 实时更新：更改选择后画布内容会立即更新
                        </div>
                    </div>
                </Form.Item>
            </>
        );
    };

    // 嘱托组件特有属性
    const renderInstructionProperties = () => {
        return (
            <>
                <Form.Item label="最大字符数">
                    <InputNumber
                        value={component.maxLength || 500}
                        onChange={(value) => onPropertyChange('maxLength', value)}
                        min={50}
                        max={2000}
                        step={50}
                        style={{ width: '100%' }}
                        addonAfter="字符"
                    />
                </Form.Item>

                <Form.Item label="显示字符统计" style={{ marginBottom: 8 }}>
                    <Switch
                        checked={component.showCharCount !== false}
                        onChange={(checked) => onPropertyChange('showCharCount', checked)}
                        size="small"
                    />
                </Form.Item>

                <Form.Item label="启用富文本编辑器" style={{ marginBottom: 8 }}>
                    <Switch
                        checked={component.enableRichText === true}
                        onChange={(checked) => onPropertyChange('enableRichText', checked)}
                        size="small"
                    />
                </Form.Item>

                {component.enableRichText && (
                    <Form.Item label="富文本编辑器高度">
                        <InputNumber
                            value={component.richTextHeight || 400}
                            onChange={(value) => onPropertyChange('richTextHeight', value)}
                            min={200}
                            max={800}
                            step={50}
                            style={{ width: '100%' }}
                            addonAfter="px"
                        />
                    </Form.Item>
                )}

                <Form.Item label="使用说明" style={{ marginBottom: 0 }}>
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#f6f8fa',
                        border: '1px solid #e1e4e8',
                        borderRadius: '6px',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: '#586069'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#24292e' }}>
                            嘱托组件说明
                        </div>
                        <div>
                            • 用途：用于填写项目嘱托、特殊要求、注意事项等多行文本内容<br />
                            • 字符限制：可设置最大字符数，防止内容过长<br />
                            • 字符统计：显示当前输入的字符数和剩余字符数<br />
                            • 支持换行：用户可以输入多行文本内容<br />
                            • 可调整大小：用户可以拖拽调整输入框高度<br />
                            • 富文本编辑器：启用后支持文字格式化、表格、链接等丰富内容<br />
                            • 高度设置：富文本模式下可自定义编辑器高度（200-800px）
                        </div>
                    </div>
                </Form.Item>
            </>
        );
    };

    // 订单组件特有属性
    const renderOrderProperties = () => {

        const hasQuotationComponent = components.some(comp => comp.type === 'quotation');
        const hasProjectNameComponent = components.some(comp => comp.type === 'projectName');

        // 动态确定关联模式的选项和值
        const getAssociationOptions = () => {
            if (!hasQuotationComponent && !hasProjectNameComponent) {
                // 没有任何依赖组件，冻结设置
                return {
                    options: [{ value: 'auto', label: '无可关联组件' }],
                    value: 'auto',
                    disabled: true
                };
            } else if (hasQuotationComponent && !hasProjectNameComponent) {
                // 只有报价单，自动关联报价单
                return {
                    options: [{ value: 'quotation', label: '关联报价单' }],
                    value: 'quotation',
                    disabled: false
                };
            } else if (!hasQuotationComponent && hasProjectNameComponent) {
                // 只有项目名称，自动关联项目
                return {
                    options: [{ value: 'project', label: '关联项目' }],
                    value: 'project',
                    disabled: false
                };
            } else {
                // 两者都有，提供选择
                return {
                    options: [
                        { value: 'select', label: '请选择关联' },
                        { value: 'quotation', label: '关联报价单' },
                        { value: 'project', label: '关联项目' }
                    ],
                    value: component.associationMode === 'quotation' || component.associationMode === 'project'
                        ? component.associationMode
                        : 'select',
                    disabled: false
                };
            }
        };

        const associationConfig = getAssociationOptions();

        return (
            <>
                <Form.Item label="标题显示">
                    <Select
                        value={component.titleDisplay || 'show'}
                        onChange={(value) => onPropertyChange('titleDisplay', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="show">显示标题</Option>
                        <Option value="hide">隐藏标题</Option>
                        <Option value="custom">自定义标题</Option>
                    </Select>
                </Form.Item>

                {component.titleDisplay === 'custom' && (
                    <Form.Item label="自定义标题">
                        <Input
                            value={component.customTitle || ''}
                            onChange={(e) => onPropertyChange('customTitle', e.target.value)}
                            placeholder="请输入自定义标题"
                        />
                    </Form.Item>
                )}

                <Form.Item label="关联模式">
                    <Select
                        value={component.associationMode || associationConfig.value}
                        onChange={(value) => onPropertyChange('associationMode', value)}
                        disabled={associationConfig.disabled}
                        style={{ width: '100%' }}
                    >
                        {associationConfig.options.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </>
        );
    };

    // 任务列表组件特有属性
    const renderTaskListProperties = () => {
        return (
            <>
                <Form.Item label="标题显示">
                    <Select
                        value={component.titleDisplay || 'show'}
                        onChange={(value) => onPropertyChange('titleDisplay', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="show">显示标题</Option>
                        <Option value="hide">隐藏标题</Option>
                        <Option value="custom">自定义标题</Option>
                    </Select>
                </Form.Item>

                {component.titleDisplay === 'custom' && (
                    <Form.Item label="自定义标题">
                        <Input
                            value={component.customTitle || ''}
                            onChange={(e) => onPropertyChange('customTitle', e.target.value)}
                            placeholder="请输入自定义标题"
                        />
                    </Form.Item>
                )}

                <Form.Item label="显示模式">
                    <Select
                        value={component.displayMode || 'list'}
                        onChange={(value) => onPropertyChange('displayMode', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="list">列表模式</Option>
                        <Option value="text">静态文本模式</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="使用说明" style={{ marginBottom: 0 }}>
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#f6f8fa',
                        border: '1px solid #e1e4e8',
                        borderRadius: '6px',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: '#586069'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#24292e' }}>
                            任务列表组件说明
                        </div>
                        <div>
                            • 任务列表组件需要配合项目名称组件使用<br />
                            • 选择项目后将自动加载该项目的所有任务<br />
                            • <strong>列表模式</strong>：显示任务名称、类别、规格和数量的表格<br />
                            • <strong>静态文本模式</strong>：仅显示任务名称的纯文本，无标题、容器等元素<br />
                            • 支持统计任务总数和总数量
                        </div>
                    </div>
                </Form.Item>
            </>
        );
    };

    // 根据组件类型渲染不同的属性
    const renderComponentProperties = () => {
        switch (component.type) {
            case 'projectName':
                return renderProjectNameProperties();
            case 'client':
                return renderClientProperties();
            case 'contact':
                return renderContactProperties();
            case 'quotation':
                return renderQuotationProperties();
            case 'order':
                return renderOrderProperties();
            case 'instruction':
                return renderInstructionProperties();
            case 'taskList':
                return renderTaskListProperties();
            default:
                return null;
        }
    };

    return (
        <>
            {renderComponentProperties()}
        </>
    );
};

export default ProjectComponents;
