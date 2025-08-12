import React from 'react';
import { Modal, Typography } from 'antd';
import { FormComponent } from '../../../../../types/formDesigner';
import { calculatePriceWithPolicies } from '../../../../PricePolicyCalculator';

const { Text } = Typography;

interface PolicyModalProps {
    visible: boolean;
    onClose: () => void;
    selectedPolicy: any;
    selectedPolicyService: any;
    component: FormComponent;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
    visible,
    onClose,
    selectedPolicy,
    selectedPolicyService,
    component
}) => {
    if (!selectedPolicy) return null;

    return (
        <Modal
            title={selectedPolicy?.name || "价格政策详情"}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <div>
                {/* 政策说明（仅非统一折扣显示） */}
                {selectedPolicy.summary && selectedPolicy.type !== 'uniform_discount' && (
                    <div style={{ marginBottom: '16px' }}>
                        <Text strong>政策说明：</Text>
                        <Text>{selectedPolicy.summary}</Text>
                    </div>
                )}

                {/* 计费说明 */}
                <div style={{ marginTop: '16px' }}>
                    <Text strong>计费说明：</Text>
                    <div style={{ marginTop: '8px' }}>
                        {selectedPolicy.type === 'uniform_discount' ? (
                            // 统一折扣显示
                            <div
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '6px',
                                    border: '1px solid #d9d9d9',
                                    fontSize: '14px',
                                    color: '#666'
                                }}
                            >
                                统一按照{selectedPolicy.discountRatio || 100}%计费
                            </div>
                        ) : (
                            // 阶梯折扣显示
                            selectedPolicy.tierSettings && selectedPolicy.tierSettings.length > 0 && (
                                (() => {
                                    const unit = selectedPolicyService?.unit || '项';
                                    const sortedTiers = [...selectedPolicy.tierSettings].sort((a: any, b: any) => (a.startQuantity || 0) - (b.startQuantity || 0));
                                    return sortedTiers.map((tier: any, index: number) => {
                                        const startQuantity = tier.startQuantity || 0;
                                        const endQuantity = tier.endQuantity;
                                        const discountRatio = tier.discountRatio || 0;

                                        let description = '';
                                        if (startQuantity === endQuantity) {
                                            description = `第${startQuantity}${unit}按${discountRatio}%计费`;
                                        } else if (endQuantity === undefined || endQuantity === null || endQuantity === Infinity) {
                                            description = `${startQuantity}${unit}及以上按${discountRatio}%计费`;
                                        } else {
                                            description = `${startQuantity}-${endQuantity}${unit}按${discountRatio}%计费`;
                                        }

                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    marginBottom: index < sortedTiers.length - 1 ? '6px' : '0',
                                                    padding: '8px 12px',
                                                    backgroundColor: '#f5f5f5',
                                                    borderRadius: '6px',
                                                    border: '1px solid #d9d9d9',
                                                    fontSize: '14px',
                                                    color: '#666'
                                                }}
                                            >
                                                {description}
                                            </div>
                                        );
                                    });
                                })()
                            )
                        )}
                    </div>

                    {/* 政策有效期 */}
                    <div style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        backgroundColor: selectedPolicy.validUntil ? '#fff7e6' : '#f6ffed',
                        borderRadius: '4px',
                        border: selectedPolicy.validUntil ? '1px solid #ffd591' : '1px solid #b7eb8f',
                        fontSize: '14px',
                        color: selectedPolicy.validUntil ? '#d48806' : '#52c41a'
                    }}>
                        {selectedPolicy.validUntil
                            ? `政策有效期至：${new Date(selectedPolicy.validUntil).toLocaleDateString()}`
                            : '政策有效期：永久有效'
                        }
                    </div>
                </div>

                {/* 价格计算示例 */}
                <div style={{ marginTop: '16px' }}>
                    <Text strong>价格计算示例：</Text>
                    <div style={{ marginTop: '8px' }}>
                        {(() => {
                            const unitPrice = selectedPolicyService?.unitPrice || 1000;
                            const unit = selectedPolicyService?.unit || "项";
                            const calculationResult = calculatePriceWithPolicies(
                                unitPrice * 25,
                                25,
                                [selectedPolicy],
                                [selectedPolicy._id],
                                unit
                            );

                            return (
                                <div>
                                    <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                                        以25{unit}为例
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f6ffed',
                                        padding: 8,
                                        borderRadius: 4,
                                        border: '1px solid #b7eb8f',
                                        fontSize: '14px',
                                        lineHeight: 1.6
                                    }}>
                                        {calculationResult.appliedPolicy?.type === 'tiered_discount' ? (
                                            <div dangerouslySetInnerHTML={{
                                                __html: calculationResult.calculationDetails
                                                    .replace(/^优惠说明:.*?<br\/><br\/>/i, '') // 移除开头的优惠说明
                                                    .replace(/计费方式:<br\/>/i, '') // 移除计费方式标题
                                            }} />
                                        ) : (
                                            <div>
                                                折扣计算：¥{unitPrice.toLocaleString()} × 25{unit} × {calculationResult.discountRatio}% = ¥{calculationResult.discountedPrice.toLocaleString()}<br />
                                                原价: ¥{calculationResult.originalPrice.toLocaleString()}<br />
                                                优惠金额: ¥{calculationResult.discountAmount.toLocaleString()}<br />
                                                最终价格: ¥{calculationResult.discountedPrice.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
