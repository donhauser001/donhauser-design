export interface User {
    id: string;
    username: string;
    password?: string;
    email: string;
    phone: string;
    realName: string;
    role: '超级管理员' | '项目经理' | '设计师' | '客户' | '员工';
    department: string;
    status: 'active' | 'inactive';
    createTime: string;
    lastLogin?: string;
    enterpriseId?: string;
    enterpriseName?: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    company?: string;
    contactPerson?: string;
    address?: string;
    shippingMethod?: string;
    description?: string;
    permissions?: string[];
    permissionGroups?: string[];
}
export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
    phone: string;
    realName: string;
    role: '超级管理员' | '项目经理' | '设计师' | '客户' | '员工';
    department: string;
    status: 'active' | 'inactive';
    enterpriseId?: string;
    enterpriseName?: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    company?: string;
    contactPerson?: string;
    address?: string;
    shippingMethod?: string;
    description?: string;
    permissions?: string[];
    permissionGroups?: string[];
}
export interface UpdateUserRequest {
    username?: string;
    email?: string;
    phone?: string;
    realName?: string;
    role?: '超级管理员' | '项目经理' | '设计师' | '客户' | '员工';
    department?: string;
    status?: 'active' | 'inactive';
    enterpriseId?: string;
    enterpriseName?: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    company?: string;
    contactPerson?: string;
    address?: string;
    shippingMethod?: string;
    description?: string;
    permissions?: string[];
    permissionGroups?: string[];
}
export interface UserQuery {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: 'active' | 'inactive';
    department?: string;
}
export interface ResetPasswordRequest {
    newPassword: string;
}
export interface UpdateUserPermissionsRequest {
    permissions: string[];
    permissionGroups: string[];
}
//# sourceMappingURL=User.d.ts.map