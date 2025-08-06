import mongoose, { Document } from 'mongoose';
export interface IDepartment extends Document {
    name: string;
    parentId?: string;
    enterpriseId: string;
    enterpriseName: string;
    level: number;
    employeeCount: number;
    status: 'active' | 'inactive';
    createTime: string;
}
export declare const Department: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment, {}, {}> & IDepartment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export interface Department {
    id: string;
    name: string;
    parentId?: string;
    enterpriseId: string;
    enterpriseName: string;
    level: number;
    employeeCount: number;
    status: 'active' | 'inactive';
    createTime: string;
}
export interface CreateDepartmentRequest {
    name: string;
    parentId?: string;
    enterpriseId: string;
    status: 'active' | 'inactive';
}
export interface UpdateDepartmentRequest {
    name?: string;
    parentId?: string;
    enterpriseId?: string;
    status?: 'active' | 'inactive';
}
export interface DepartmentQuery {
    enterpriseId?: string;
    parentId?: string;
    status?: string;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=Department.d.ts.map