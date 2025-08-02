import { ClientCategory, CreateClientCategoryRequest, UpdateClientCategoryRequest } from '../models/ClientCategory';
export declare class ClientCategoryService {
    getCategories(): ClientCategory[];
    getCategoryById(id: string): ClientCategory | undefined;
    createCategory(data: CreateClientCategoryRequest): ClientCategory;
    updateCategory(id: string, data: UpdateClientCategoryRequest): ClientCategory | null;
    deleteCategory(id: string): boolean;
}
//# sourceMappingURL=ClientCategoryService.d.ts.map