import { IContractElement } from '../models/ContractElement';
export interface CreateContractElementData {
    name: string;
    type: IContractElement['type'];
    description?: string;
    status?: 'active' | 'inactive';
    createdBy: string;
}
export interface UpdateContractElementData {
    name?: string;
    type?: IContractElement['type'];
    description?: string;
    status?: 'active' | 'inactive';
}
export interface ContractElementQuery {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
}
declare class ContractElementService {
    create(data: CreateContractElementData): Promise<IContractElement>;
    update(id: string, data: UpdateContractElementData): Promise<IContractElement | null>;
    delete(id: string): Promise<boolean>;
    getById(id: string): Promise<IContractElement | null>;
    getList(query?: ContractElementQuery): Promise<{
        elements: IContractElement[];
        total: number;
        page: number;
        limit: number;
    }>;
    getActiveElements(): Promise<IContractElement[]>;
    isNameExists(name: string, excludeId?: string): Promise<boolean>;
}
declare const _default: ContractElementService;
export default _default;
//# sourceMappingURL=ContractElementService.d.ts.map