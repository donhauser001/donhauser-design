export interface PriceCalculationResult {
    originalPrice: number;
    discountedPrice: number;
    discountAmount: number;
    discountRatio: number;
    appliedPolicy: any | null;
    calculationDetails: string;
}
export declare const calculatePriceWithPolicies: (originalPrice: number, quantity: number, policies: any[], selectedPolicyIds: string[], unit?: string) => PriceCalculationResult;
//# sourceMappingURL=pricePolicyCalculator.d.ts.map