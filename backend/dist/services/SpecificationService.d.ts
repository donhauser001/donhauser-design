import { ISpecification } from '../models/Specification';
export declare class SpecificationService {
    getSpecifications(params: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        isDefault?: boolean;
    }): Promise<{
        specifications: ISpecification[];
        total: number;
    }>;
    getSpecificationById(id: string): Promise<ISpecification | null>;
    createSpecification(specData: {
        name: string;
        length: number;
        width: number;
        height?: number;
        unit: string;
        resolution?: string;
        description?: string;
        isDefault?: boolean;
        category?: string;
        createdBy: string;
    }): Promise<ISpecification>;
    updateSpecification(id: string, updateData: {
        name?: string;
        length?: number;
        width?: number;
        height?: number;
        unit?: string;
        resolution?: string;
        description?: string;
        isDefault?: boolean;
        category?: string;
        updatedBy: string;
    }): Promise<ISpecification | null>;
    deleteSpecification(id: string): Promise<void>;
    getDefaultSpecifications(): Promise<ISpecification[]>;
    setDefaultSpecification(id: string, isDefault: boolean, updatedBy: string): Promise<ISpecification | null>;
}
declare const _default: SpecificationService;
export default _default;
//# sourceMappingURL=SpecificationService.d.ts.map