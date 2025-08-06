export * from './User';
export * from './Enterprise';
export * from './Department';
export * from './Permission';
export * from './Role';
export * from './ServiceProcess';
export * from './AdditionalConfig';
export * from './PricingPolicy';
export * from './ServicePricing';
export * from './Quotation';
export * from './Specification';
export * from './Project';
export * from './Task';
export * from './ProjectLog';
export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=index.d.ts.map