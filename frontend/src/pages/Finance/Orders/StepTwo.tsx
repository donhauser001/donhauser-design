import React from 'react'
import { Button, Checkbox, Tag } from 'antd'
import { ServiceDetail, Quotation } from './types'


interface StepTwoProps {
    selectedQuotation: Quotation | null
    serviceDetails: ServiceDetail[]
    selectedServices: string[]
    onServiceSelect: (serviceId: string, checked: boolean) => void
    onCategorySelectAll: (categoryName: string, checked: boolean) => void
    isCategoryAllSelected: (categoryName: string) => boolean
    isCategoryIndeterminate: (categoryName: string) => boolean
    onPrevious: () => void
    onNext: () => void
    onCancel: () => void
}

const StepTwo: React.FC<StepTwoProps> = ({
    selectedQuotation,
    serviceDetails,
    selectedServices,
    onServiceSelect,
    onCategorySelectAll,
    isCategoryAllSelected,
    isCategoryIndeterminate,
    onPrevious,
    onNext,
    onCancel
}) => {
    if (!selectedQuotation) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ marginBottom: 16 }}>
                    <h4>该客户暂无关联的报价单</h4>
                    <p style={{ color: '#666' }}>请先为客户创建报价单，或联系管理员设置客户关联的报价单。</p>
                </div>
                <Button
                    style={{ marginRight: 8 }}
                    onClick={onPrevious}
                >
                    上一步
                </Button>
            </div>
        )
    }

    // 按分类分组
    const groupedServices = serviceDetails.reduce((groups: any, service: ServiceDetail) => {
        const categoryName = service.categoryName || '未分类'
        if (!groups[categoryName]) {
            groups[categoryName] = []
        }
        groups[categoryName].push(service)
        return groups
    }, {})

    return (
        <div>
            {/* 报价单信息显示 */}
            {selectedQuotation && (
                <div style={{
                    marginBottom: 16,
                    padding: 12,
                    backgroundColor: '#f0f8ff',
                    border: '1px solid #91d5ff',
                    borderRadius: 6
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>
                            当前报价单：{selectedQuotation.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                            服务项目数量：{serviceDetails.length} 项
                            {serviceDetails.filter(service => service.status === 'inactive').length > 0 && (
                                <span style={{ color: '#ff4d4f', marginLeft: 8 }}>
                                    ({serviceDetails.filter(service => service.status === 'inactive').length} 项已禁用)
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: 16 }}>
                {Object.entries(groupedServices).map(([categoryName, services]) => (
                    <div key={categoryName} style={{ marginBottom: '24px' }}>
                        {/* 分类标题 */}
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '12px',
                            padding: '8px 12px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '6px',
                            borderLeft: '4px solid #1890ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                {categoryName}
                                <span style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    fontWeight: 'normal',
                                    marginLeft: '8px'
                                }}>
                                    ({(services as ServiceDetail[]).filter(s => s.status !== 'inactive').length} 项可用服务)
                                </span>
                            </div>
                            <Checkbox
                                checked={isCategoryAllSelected(categoryName)}
                                indeterminate={isCategoryIndeterminate(categoryName)}
                                onChange={(e) => onCategorySelectAll(categoryName, e.target.checked)}
                            >
                                全选
                            </Checkbox>
                        </div>

                        {/* 服务项目网格 */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '16px'
                        }}>
                            {(services as ServiceDetail[]).map((service: ServiceDetail, index: number) => {
                                const isDisabled = service.status === 'inactive'
                                return (
                                    <div
                                        key={service._id || service.id || index}
                                        style={{
                                            border: isDisabled ? '1px solid #d9d9d9' : '1px solid #e8e8e8',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            backgroundColor: isDisabled ? '#f5f5f5' : '#fff',
                                            boxShadow: isDisabled ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                                            transition: 'box-shadow 0.3s ease',
                                            position: 'relative',
                                            opacity: isDisabled ? 0.6 : 1,
                                            cursor: isDisabled ? 'not-allowed' : 'default'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isDisabled) {
                                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isDisabled) {
                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                                            }
                                        }}
                                    >
                                        {/* 已禁用标识 */}
                                        {isDisabled && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '8px',
                                                left: '8px',
                                                zIndex: 2,
                                                backgroundColor: '#ff4d4f',
                                                color: 'white',
                                                fontSize: '10px',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold'
                                            }}>
                                                已禁用
                                            </div>
                                        )}

                                        {/* 选框 */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            zIndex: 1
                                        }}>
                                            <Checkbox
                                                checked={selectedServices.includes(service._id || service.id || '')}
                                                onChange={(e) => onServiceSelect(service._id || service.id || '', e.target.checked)}
                                                disabled={isDisabled}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                color: isDisabled ? '#999' : '#333',
                                                marginBottom: '4px',
                                                paddingRight: '24px' // 为选框留出空间
                                            }}>
                                                {service.serviceName}
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: isDisabled ? '#ccc' : '#666'
                                            }}>
                                                {service.alias}
                                            </div>
                                        </div>

                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: isDisabled ? '#999' : '#1890ff',
                                            marginBottom: '8px'
                                        }}>
                                            ¥{service.unitPrice?.toLocaleString()}/{service.unit}
                                        </div>

                                        <div>
                                            {service.pricingPolicyNames && service.pricingPolicyNames.length > 0 ? (
                                                service.pricingPolicyNames.map((policy: string, policyIndex: number) => (
                                                    <Tag
                                                        key={policyIndex}
                                                        color={isDisabled ? "default" : "blue"}
                                                        style={{
                                                            marginBottom: '4px',
                                                            marginRight: '4px',
                                                            fontSize: '12px',
                                                            opacity: isDisabled ? 0.6 : 1
                                                        }}
                                                    >
                                                        {policy}
                                                    </Tag>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '12px', color: isDisabled ? '#ccc' : '#999' }}>无价格政策</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
                    已选择 {selectedServices.length} 项服务
                </div>
                <Button
                    style={{ marginRight: 8 }}
                    onClick={onCancel}
                >
                    取消
                </Button>
                <Button
                    style={{ marginRight: 8 }}
                    onClick={onPrevious}
                >
                    上一步
                </Button>
                <Button
                    type="primary"
                    onClick={onNext}
                    disabled={selectedServices.length === 0}
                >
                    下一步
                </Button>
            </div>
        </div>
    )
}

export default StepTwo 