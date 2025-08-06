import { IPricingPolicy, ITierSetting } from '../models/PricingPolicy';
export interface CreatePolicyData {
    name: string;
    alias: string;
    type: 'tiered_discount' | 'uniform_discount';
    summary: string;
    validUntil: string | null;
    discountRatio?: number;
    tierSettings?: ITierSetting[];
}
export interface UpdatePolicyData {
    name: string;
    alias: string;
    type: 'tiered_discount' | 'uniform_discount';
    summary: string;
    validUntil: string | null;
    discountRatio?: number;
    tierSettings?: ITierSetting[];
}
export declare class PricingPolicyService {
    static getAllPolicies(): Promise<IPricingPolicy[]>;
    static getPolicyById(id: string): Promise<IPricingPolicy | null>;
    static createPolicy(data: CreatePolicyData): Promise<IPricingPolicy>;
    static updatePolicy(id: string, data: UpdatePolicyData): Promise<IPricingPolicy | null>;
    static togglePolicyStatus(id: string): Promise<IPricingPolicy | null>;
    static deletePolicy(id: string): Promise<void>;
    static searchPolicies(searchTerm: string): Promise<IPricingPolicy[]>;
}
//# sourceMappingURL=PricingPolicyService.d.ts.map