import React from 'react';
import { Tooltip } from 'antd';
import { FormComponent } from '../../../../../types/formDesigner';
import { formatCalculationDetails, calculatePriceWithPolicies } from '../../../../PricePolicyCalculator';

// 格式化政策描述（仅计费方式，不包含价格计算）
export const formatPolicyDescription = (policy: any, service?: any) => {
    if (!policy) return '';

    let description = '';

    if (policy.type === 'uniform_discount') {
        // 统一折扣：只显示计费方式
        description = `优惠说明: 按${policy.discountRatio || 100}%计费`;
    } else if (policy.type === 'tiered_discount' && policy.tierSettings) {
        // 阶梯折扣：显示阶梯计费说明
        const unit = service?.unit || '项';
        const tierDescriptions = policy.tierSettings.map((tier: any) => {
            const startQuantity = tier.startQuantity || 0;
            const endQuantity = tier.endQuantity;
            const discountRatio = tier.discountRatio || 0;

            if (startQuantity === endQuantity) {
                return `第${startQuantity}${unit}按${discountRatio}%计费`;
            } else if (endQuantity === undefined || endQuantity === null || endQuantity === Infinity) {
                return `${startQuantity}${unit}及以上按${discountRatio}%计费`;
            } else {
                return `${startQuantity}-${endQuantity}${unit}按${discountRatio}%计费`;
            }
        }).join('，');

        description = `优惠说明: ${tierDescriptions}`;
    } else {
        description = `类型：${policy.type === 'uniform_discount' ? '统一折扣' : '阶梯折扣'}`;
        if (policy.summary) {
            description += `，说明：${policy.summary}`;
        }
    }

    return description;
};

// 渲染政策详情文本（使用计算器逻辑）
export const formatPolicyDetail = (policy: any, service?: any, mode: 'hover' | 'modal' | 'append' = 'hover') => {
    if (!policy) return '';

    // 悬停模式只显示计费方式说明，不显示具体价格计算
    if (mode === 'hover') {
        return formatPolicyDescription(policy, service);
    }

    // 附加模式也只显示计费方式说明，适合嵌入到价格说明中
    if (mode === 'append') {
        return formatPolicyDescription(policy, service);
    }

    // 弹窗模式使用完整的价格计算
    if (service && service.unitPrice) {
        const quantity = 1; // 默认数量为1
        const originalPrice = service.unitPrice * quantity;

        const calculationResult = calculatePriceWithPolicies(
            originalPrice,
            quantity,
            [policy],
            [policy._id],
            service.unit || '项'
        );

        // 使用计算器的格式化方法
        if (calculationResult.appliedPolicy) {
            return formatCalculationDetails(calculationResult);
        }
    }

    // 回退到简单格式
    return formatPolicyDescription(policy, service);
};

// 为价格说明附加政策详情（返回JSX元素）
export const renderPriceDescriptionWithPolicy = (
    originalDescription: string, 
    service: any, 
    component: FormComponent,
    getPolicyById: (id: string) => any
) => {
    const hasOriginalDescription = originalDescription && originalDescription !== '—';

    // 检查是否需要显示政策详情
    const shouldShowPolicy = component.policyDetailMode === 'append' &&
        component.showPricingPolicy &&
        service.pricingPolicyNames &&
        service.pricingPolicyNames.length > 0;

    if (!shouldShowPolicy) {
        return hasOriginalDescription ? originalDescription : '—';
    }

    const policyDetails = service.pricingPolicyNames.map((policyName: string) => {
        const policyId = service.pricingPolicyIds?.[service.pricingPolicyNames.indexOf(policyName)] || '';
        const policy = getPolicyById(policyId);
        if (policy) {
            const detailContent = formatPolicyDetail(policy, service, 'append');
            return detailContent.replace(/<br\/?>/g, ' ');
        }
        return '';
    }).filter((detail: string) => detail).join('；');

    // 返回JSX元素，确保换行
    if (!hasOriginalDescription) {
        return policyDetails;
    }

    return React.createElement(React.Fragment, null,
        originalDescription,
        React.createElement('br'),
        policyDetails
    );
};

// 渲染价格政策标签
export const renderPolicyTag = (
    policyName: string,
    policyId: string,
    index: number,
    service: any,
    component: FormComponent,
    getPolicyById: (id: string) => any,
    handlePolicyClick: (policyId: string, service?: any) => void,
    style: any = {}
) => {
    const detailMode = component.policyDetailMode || 'hover';
    const policy = getPolicyById(policyId);

    const tagElement = React.createElement('div', {
        key: index,
        style: {
            backgroundColor: '#fff2f0',
            color: '#f5222d',
            border: '1px solid #ffa39e',
            padding: style.padding || '2px 6px',
            borderRadius: style.borderRadius || '4px',
            fontSize: style.fontSize || '10px',
            fontWeight: 500,
            marginBottom: style.marginBottom || '0',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            lineHeight: '1.2',
            cursor: detailMode === 'modal' ? 'pointer' : 'default',
            ...style
        },
        onClick: () => detailMode === 'modal' && handlePolicyClick(policyId, service)
    }, policyName);

    if (detailMode === 'hover' && policy) {
        const detailContent = formatPolicyDetail(policy, service, 'hover');
        return React.createElement(Tooltip, {
            key: index,
            title: React.createElement('div', null,
                React.createElement('div', null, React.createElement('strong', null, policy.name)),
                React.createElement('div', {
                    style: { marginTop: '4px', fontSize: '12px', maxWidth: '300px' }
                }, detailContent)
            ),
            placement: 'topRight',
            overlayStyle: { maxWidth: '350px' }
        }, tagElement);
    }

    return tagElement;
};
