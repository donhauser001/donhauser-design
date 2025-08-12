import React from 'react';
import { Card, Typography, Empty, Spin, Divider } from 'antd';
import { QuotationComponentProps } from './types';
import { useQuotationData } from './hooks';
import { renderPolicyTag, renderPriceDescriptionWithPolicy } from './policyUtils';
import { CardMode } from './CardMode';
import { TabsMode } from './TabsMode';
import { ListMode } from './ListMode';
import { PolicyModal } from './PolicyModal';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

const { Text } = Typography;

const QuotationComponent: React.FC<QuotationComponentProps> = ({ component }) => {
    const {
        selectedQuotation,
        loading,
        allPolicies,
        policyModalVisible,
        selectedPolicy,
        selectedPolicyService,
        setPolicyModalVisible,
        getPolicyById,
        handlePolicyClick
    } = useQuotationData(component);

    const { components, addServiceToOrder } = useFormDesignerStore();

    // 检查是否存在订单组件
    const orderComponent = components.find(comp => comp.type === 'order');
    const hasOrderComponent = !!orderComponent;

    // 处理服务选择
    const handleServiceSelect = (service: any) => {
        if (hasOrderComponent && orderComponent) {
            addServiceToOrder(component.id, orderComponent.id, service);
        }
    };

    // 渲染报价单详情内容
    const renderQuotationDetails = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>
                        <Text type="secondary">正在加载报价单详情...</Text>
                    </div>
                </div>
            );
        }

        if (!selectedQuotation) {
            return (
                <Empty
                    description="请在右侧属性面板中选择报价单"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            );
        }

        // 过滤掉停用的服务
        const activeServices = selectedQuotation.services.filter(service => service.status === 'active');

        // 按分类对服务进行分组排序
        const groupedServices: { [key: string]: any[] } = {};
        activeServices.forEach(service => {
            const category = service.categoryName || '其他';
            if (!groupedServices[category]) {
                groupedServices[category] = [];
            }
            groupedServices[category].push(service);
        });

        // 按分类名称排序
        const sortedCategories = Object.keys(groupedServices).sort();

        // 获取显示模式
        const displayMode = component.quotationDisplayMode || 'card';

        // 创建渲染函数的wrapper
        const wrappedRenderPolicyTag = (policyName: string, policyId: string, index: number, service: any, style: any = {}) =>
            renderPolicyTag(policyName, policyId, index, service, component, getPolicyById, handlePolicyClick, style);

        const wrappedRenderPriceDescriptionWithPolicy = (originalDescription: string, service: any) =>
            renderPriceDescriptionWithPolicy(originalDescription, service, component, getPolicyById);

        // 共同的props
        const renderProps = {
            groupedServices,
            sortedCategories,
            component,
            renderPolicyTag: wrappedRenderPolicyTag,
            renderPriceDescriptionWithPolicy: wrappedRenderPriceDescriptionWithPolicy,
            hasOrderComponent,
            onServiceSelect: handleServiceSelect
        };

        // 渲染内容
        const renderContent = () => {
            switch (displayMode) {
                case 'tabs':
                    return <TabsMode {...renderProps} />;
                case 'list':
                    return <ListMode {...renderProps} />;
                case 'card':
                default:
                    return <CardMode {...renderProps} />;
            }
        };

        // 根据设置决定显示的标题
        const getDisplayTitle = () => {
            const nameDisplay = component.quotationNameDisplay || 'show';

            switch (nameDisplay) {
                case 'hide':
                    return null; // 不显示标题
                case 'custom':
                    return component.customQuotationName || selectedQuotation.name;
                case 'show':
                default:
                    return selectedQuotation.name;
            }
        };

        const displayTitle = getDisplayTitle();

        return (
            <Card
                title={
                    displayTitle ? (
                        <div style={{ textAlign: 'center' }}>
                            <Text strong style={{ fontSize: '16px' }}>
                                {displayTitle}
                            </Text>
                        </div>
                    ) : undefined
                }
                size="small"
                style={{
                    width: '100%',
                    backgroundColor: component.style?.backgroundColor,
                    padding: component.style?.padding,
                    margin: component.style?.margin,
                    borderRadius: component.style?.borderRadius
                }}
            >
                {selectedQuotation.validUntil && (
                    <>
                        <div style={{ marginBottom: '16px' }}>
                            <Text type="secondary">
                                有效期至：{new Date(selectedQuotation.validUntil).toLocaleDateString()}
                            </Text>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                    </>
                )}

                {renderContent()}
            </Card>
        );
    };

    return (
        <div style={{ width: '100%' }}>
            {renderQuotationDetails()}
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    {component.fieldDescription}
                </div>
            )}

            {/* 政策详情弹窗 */}
            <PolicyModal
                visible={policyModalVisible}
                onClose={() => setPolicyModalVisible(false)}
                selectedPolicy={selectedPolicy}
                selectedPolicyService={selectedPolicyService}
                component={component}
            />
        </div>
    );
};

export default QuotationComponent;
