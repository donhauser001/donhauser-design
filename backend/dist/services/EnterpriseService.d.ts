import { Enterprise, CreateEnterpriseRequest, UpdateEnterpriseRequest, EnterpriseQuery } from '../models/Enterprise';
export declare class EnterpriseService {
    getEnterprises(query?: EnterpriseQuery): Promise<{
        enterprises: Enterprise[];
        total: number;
    }>;
    getEnterpriseById(id: string): Promise<Enterprise | null>;
    createEnterprise(enterpriseData: CreateEnterpriseRequest): Promise<Enterprise>;
    updateEnterprise(id: string, enterpriseData: UpdateEnterpriseRequest): Promise<Enterprise | null>;
    deleteEnterprise(id: string): Promise<boolean>;
    toggleEnterpriseStatus(id: string): Promise<Enterprise | null>;
}
//# sourceMappingURL=EnterpriseService.d.ts.map