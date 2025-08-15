import React from 'react';
import { Typography, Table, Divider } from 'antd';
import { RenderModeProps } from './types';
import { useFormDesignerStore } from '../../../../../stores/formDesignerStore';

const { Text } = Typography;

export const ListMode: React.FC<RenderModeProps> = ({
    groupedServices,
    sortedCategories,
    component,
    renderPolicyTag,
    renderPriceDescriptionWithPolicy,
    hasOrderComponent,
    onServiceSelect,
    isServiceSelected
}) => {
    const { theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
    const borderColor = theme.borderColor || '#d9d9d9';
    const columns = [
        {
            title: '服务名称',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: '25%',
            render: (text: string, record: any) => (
                <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: '14px', color: '#262626' }}>
                        {text}
                    </Text>
                    {/* 价格政策标签 */}
                    {component.showPricingPolicy && record.pricingPolicyNames && record.pricingPolicyNames.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                            {record.pricingPolicyNames.slice(0, 2).map((policyName: string, index: number) => {
                                const policyId = record.pricingPolicyIds?.[record.pricingPolicyNames.indexOf(policyName)] || '';
                                return renderPolicyTag(policyName, policyId, index, record, {
                                    padding: '1px 4px',
                                    borderRadius: '3px',
                                    fontSize: '9px'
                                });
                            })}
                            {record.pricingPolicyNames.length > 2 && (
                                <div
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        color: '#8c8c8c',
                                        border: '1px solid #d9d9d9',
                                        padding: '1px 4px',
                                        borderRadius: '3px',
                                        fontSize: '9px',
                                        fontWeight: 500,
                                        whiteSpace: 'nowrap',
                                        textAlign: 'center',
                                        lineHeight: '1.2'
                                    }}
                                >
                                    +{record.pricingPolicyNames.length - 2}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: '20%',
            align: 'right' as const,
            render: (price: number, record: any) => (
                <div style={{ padding: '4px 0', textAlign: 'right' }}>
                    <Text strong style={{
                        fontSize: '14px',
                        color: primaryColor,
                        fontFamily: 'Monaco, Consolas, monospace'
                    }}>
                        ¥{price.toLocaleString()}
                    </Text>
                    {record.unit && (
                        <Text style={{
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginLeft: '2px'
                        }}>
                            /{record.unit}
                        </Text>
                    )}
                </div>
            )
        },
        {
            title: '价格说明',
            dataIndex: 'priceDescription',
            key: 'priceDescription',
            width: '55%',
            render: (text: string, record: any) => {
                return (
                    <div style={{ padding: '4px 0' }}>
                        <Text style={{
                            fontSize: '12px',
                            color: '#595959',
                            lineHeight: '1.5'
                        }}>
                            {renderPriceDescriptionWithPolicy(text, record)}
                        </Text>
                    </div>
                );
            }
        }
    ];

    return (
        <>
            {sortedCategories.map((category, categoryIndex) => (
                <div key={category} style={{ marginBottom: '32px' }}>
                    {sortedCategories.length > 1 && (
                        <div style={{
                            marginBottom: '16px',
                            paddingBottom: '8px',
                            borderBottom: `2px solid ${primaryColor}`,
                            width: 'fit-content'
                        }}>
                            <Text strong style={{
                                fontSize: '16px',
                                color: primaryColor,
                                letterSpacing: '0.5px'
                            }}>
                                {category}
                            </Text>
                        </div>
                    )}

                    <Table
                        dataSource={groupedServices[category]}
                        columns={columns}
                        rowKey="_id"
                        pagination={false}
                        size="middle"
                        scroll={{ x: 'max-content' }}
                        showHeader={categoryIndex === 0}
                        className="quotation-table"
                        style={{
                            backgroundColor: '#fafafa',
                            borderRadius: component.style?.borderRadius || '8px',
                            overflow: 'hidden'
                        }}
                        rowClassName={(record, index) => {
                            const isSelected = isServiceSelected(record._id);
                            const baseClass = index % 2 === 0 ? 'table-row-even' : 'table-row-odd';
                            return isSelected ? `${baseClass} table-row-selected` : baseClass;
                        }}
                        onRow={(record) => ({
                            onClick: () => hasOrderComponent && onServiceSelect(record),
                            style: {
                                cursor: hasOrderComponent ? 'pointer' : 'default'
                            }
                        })}
                    />

                    {categoryIndex < sortedCategories.length - 1 && (
                        <Divider style={{
                            margin: '24px 0',
                            borderColor: borderColor
                        }} />
                    )}
                </div>
            ))}

            <style>{`
                .quotation-table .ant-table-thead > tr > th {
                    background-color: #f0f2f5 !important;
                    border-bottom: 2px solid ${borderColor} !important;
                    font-weight: 600 !important;
                    color: #262626 !important;
                    padding: 12px 16px !important;
                }
                
                .quotation-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f0f0f0 !important;
                    padding: 12px 16px !important;
                    transition: background-color 0.2s;
                }
                
                .quotation-table .table-row-even > td {
                    background-color: #ffffff !important;
                }
                
                .quotation-table .table-row-odd > td {
                    background-color: #fafafa !important;
                }
                
                .quotation-table .ant-table-tbody .table-row-selected > td {
                    background-color: ${primaryColor}10 !important;
                    border-left: none !important;
                    border-right: none !important;
                    position: relative !important;
                    border-top: 3px solid ${primaryColor} !important;
                    border-bottom: 3px solid ${primaryColor} !important;
                }
                
                .quotation-table .ant-table-tbody .table-row-selected > td:first-child {
                    border-left: 3px solid ${primaryColor} !important;
                }
                
                .quotation-table .ant-table-tbody .table-row-selected > td:last-child {
                    border-right: 3px solid ${primaryColor} !important;
                }
                
                .quotation-table .table-row-selected {
                    box-shadow: 0 2px 8px ${primaryColor}25 !important;
                }
                
                .quotation-table .ant-table-tbody > tr:hover:not(.table-row-selected) > td {
                    background-color: ${primaryColor}08 !important;
                }
                
                .quotation-table .table-row-selected:hover > td {
                    background-color: ${primaryColor}10 !important;
                }
                
                .quotation-table .ant-table {
                    border: 1px solid ${borderColor};
                    border-radius: ${component.style?.borderRadius || '8px'};
                }
                
                .quotation-table .ant-table-container {
                    border-radius: ${component.style?.borderRadius || '8px'};
                }
            `}</style>
        </>
    );
};
