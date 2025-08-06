"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePriceWithPolicies = void 0;
const calculatePriceWithPolicies = (originalPrice, quantity, policies, selectedPolicyIds, unit = '件') => {
    let bestResult = null;
    if (selectedPolicyIds.length === 0) {
        return {
            originalPrice,
            discountedPrice: originalPrice,
            discountAmount: 0,
            discountRatio: 0,
            appliedPolicy: null,
            calculationDetails: '未应用价格政策'
        };
    }
    for (const policyId of selectedPolicyIds) {
        const policy = policies.find(p => p._id === policyId);
        if (!policy || policy.status !== 'active') {
            continue;
        }
        let currentResult;
        if (policy.type === 'uniform_discount') {
            const discountRatio = policy.discountRatio || 0;
            const discountedPrice = (originalPrice * discountRatio) / 100;
            const discountAmount = originalPrice - discountedPrice;
            currentResult = {
                originalPrice,
                discountedPrice,
                discountAmount,
                discountRatio,
                appliedPolicy: policy,
                calculationDetails: `按${discountRatio}%计费`
            };
        }
        else if (policy.type === 'tiered_discount' && policy.tierSettings) {
            currentResult = calculateTieredDiscount(originalPrice, quantity, policy, unit);
        }
        else {
            continue;
        }
        if (!bestResult || currentResult.discountedPrice < bestResult.discountedPrice) {
            bestResult = currentResult;
        }
    }
    return bestResult || {
        originalPrice,
        discountedPrice: originalPrice,
        discountAmount: 0,
        discountRatio: 0,
        appliedPolicy: null,
        calculationDetails: '未找到适用的价格政策'
    };
};
exports.calculatePriceWithPolicies = calculatePriceWithPolicies;
const calculateTieredDiscount = (originalPrice, quantity, policy, unit = '件') => {
    if (!policy.tierSettings || policy.tierSettings.length === 0) {
        return {
            originalPrice,
            discountedPrice: originalPrice,
            discountAmount: 0,
            discountRatio: 0,
            appliedPolicy: policy,
            calculationDetails: '阶梯设置无效'
        };
    }
    const unitPrice = originalPrice / quantity;
    let totalDiscountedPrice = 0;
    let calculationDetails = '';
    let totalDiscountRatio = 0;
    const sortedTiers = [...policy.tierSettings].sort((a, b) => (a.startQuantity || 0) - (b.startQuantity || 0));
    let remainingQuantity = quantity;
    for (let i = 0; i < sortedTiers.length; i++) {
        const tier = sortedTiers[i];
        const startQuantity = tier.startQuantity || 0;
        const endQuantity = tier.endQuantity || Infinity;
        const discountRatio = tier.discountRatio || 0;
        if (remainingQuantity <= 0)
            break;
        let tierQuantityApplicable = 0;
        if (endQuantity === Infinity) {
            tierQuantityApplicable = remainingQuantity;
        }
        else {
            const tierCapacity = endQuantity - startQuantity + 1;
            tierQuantityApplicable = Math.min(remainingQuantity, tierCapacity);
        }
        tierQuantityApplicable = Math.max(0, tierQuantityApplicable);
        if (tierQuantityApplicable > 0) {
            const tierPrice = unitPrice * tierQuantityApplicable;
            const tierDiscountedPrice = (tierPrice * discountRatio) / 100;
            totalDiscountedPrice += tierDiscountedPrice;
            let tierRange = '';
            if (startQuantity === endQuantity) {
                tierRange = `第${startQuantity}${unit}`;
            }
            else if (endQuantity === Infinity) {
                tierRange = `${startQuantity}${unit}以上`;
            }
            else {
                tierRange = `第${startQuantity}-${endQuantity}${unit}`;
            }
            calculationDetails += `${tierRange}按${discountRatio}%计费: ¥${tierDiscountedPrice.toLocaleString()}\n`;
            remainingQuantity -= tierQuantityApplicable;
        }
    }
    const discountAmount = originalPrice - totalDiscountedPrice;
    totalDiscountRatio = ((originalPrice - totalDiscountedPrice) / originalPrice) * 100;
    return {
        originalPrice,
        discountedPrice: totalDiscountedPrice,
        discountAmount,
        discountRatio: 100 - totalDiscountRatio,
        appliedPolicy: policy,
        calculationDetails: calculationDetails.trim()
    };
};
//# sourceMappingURL=pricePolicyCalculator.js.map