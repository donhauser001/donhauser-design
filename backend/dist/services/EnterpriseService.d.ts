import { CreateEnterpriseRequest, UpdateEnterpriseRequest, EnterpriseQuery } from '../models/Enterprise';
export declare class EnterpriseService {
    getEnterprises(query?: EnterpriseQuery): Promise<{
        enterprises: any[];
        total: number;
    }>;
    getEnterpriseById(id: string): Promise<any | null>;
    createEnterprise(enterpriseData: CreateEnterpriseRequest): Promise<any>;
    updateEnterprise(id: string, enterpriseData: UpdateEnterpriseRequest): Promise<any | null>;
    deleteEnterprise(id: string): Promise<boolean>;
    toggleEnterpriseStatus(id: string): Promise<any | null>;
}
//# sourceMappingURL=EnterpriseService.d.ts.map