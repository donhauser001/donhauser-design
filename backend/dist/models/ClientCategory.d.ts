export interface ClientCategory {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    clientCount: number;
    createTime: string;
}
export interface CreateClientCategoryRequest {
    name: string;
    description?: string;
    status?: 'active' | 'inactive';
}
export interface UpdateClientCategoryRequest {
    name?: string;
    description?: string;
    status?: 'active' | 'inactive';
}
//# sourceMappingURL=ClientCategory.d.ts.map