import { IClientCategory, CreateClientCategoryRequest, UpdateClientCategoryRequest } from '../models/ClientCategory';
export declare class ClientCategoryService {
    static getCategories(): Promise<IClientCategory[]>;
    static getCategoryById(id: string): Promise<IClientCategory | null>;
    static createCategory(data: CreateClientCategoryRequest): Promise<IClientCategory>;
    static updateCategory(id: string, data: UpdateClientCategoryRequest): Promise<IClientCategory | null>;
    static deleteCategory(id: string): Promise<boolean>;
}
//# sourceMappingURL=ClientCategoryService.d.ts.map