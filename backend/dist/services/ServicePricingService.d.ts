import { IServicePricing } from '../models/ServicePricing';
export interface CreateServicePricingData {
    serviceName: string;
    alias: string;
    categoryId: string;
    unitPrice: number;
    unit: string;
    priceDescription: string;
    link: string;
    additionalConfigId?: string;
    serviceProcessId?: string;
    pricingPolicyIds?: string[];
}
export interface UpdateServicePricingData {
    serviceName: string;
    alias: string;
    categoryId: string;
    unitPrice: number;
    unit: string;
    priceDescription: string;
    link: string;
    additionalConfigId?: string;
    serviceProcessId?: string;
    pricingPolicyIds?: string[];
}
export declare class ServicePricingService {
    static getAllServicePricing(): Promise<IServicePricing[]>;
    static getServicePricingById(id: string): Promise<IServicePricing | null>;
    static getServicePricingByIds(ids: string[]): Promise<IServicePricing[]>;
    static createServicePricing(data: CreateServicePricingData): Promise<IServicePricing>;
    static updateServicePricing(id: string, data: UpdateServicePricingData): Promise<IServicePricing | null>;
    static toggleServicePricingStatus(id: string): Promise<IServicePricing | null>;
    static deleteServicePricing(id: string): Promise<void>;
    static searchServicePricing(searchTerm: string): Promise<IServicePricing[]>;
}
//# sourceMappingURL=ServicePricingService.d.ts.map