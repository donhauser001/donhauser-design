import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
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
    // 企业信息
    enterpriseId?: string;
    enterpriseName?: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    // 客户信息
    company?: string;
    contactPerson?: string;
    address?: string;
    shippingMethod?: string;
    // 用户描述
    description?: string;
    // 用户权限
    permissions?: string[];
    // 用户权限组
    permissionGroups?: string[];
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    realName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['超级管理员', '项目经理', '设计师', '客户', '员工'],
        index: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        index: true
    },
    createTime: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    lastLogin: {
        type: String
    },
    // 企业信息
    enterpriseId: {
        type: String
    },
    enterpriseName: {
        type: String,
        trim: true
    },
    departmentId: {
        type: String
    },
    departmentName: {
        type: String,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    // 客户信息
    company: {
        type: String,
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    shippingMethod: {
        type: String,
        trim: true
    },
    // 用户描述
    description: {
        type: String,
        default: '',
        trim: true
    },
    // 用户权限
    permissions: [{
        type: String
    }],
    // 用户权限组
    permissionGroups: [{
        type: String
    }]
}, {
    timestamps: true
})

export default mongoose.model<IUser>('User', UserSchema)

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
    // 企业信息
    enterpriseId?: string;
    enterpriseName?: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    // 客户信息
    company?: string;
    contactPerson?: string;
    address?: string;
    shippingMethod?: string;
    // 用户描述
    description?: string;
    // 用户权限
    permissions?: string[];
    // 用户权限组
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
    // 企业信息
    enterpriseId?: string;
    enterpriseName?: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    // 客户信息
    company?: string;
    contactPerson?: string;
    address?: string;
    shippingMethod?: string;
    // 用户描述
    description?: string;
    // 用户权限
    permissions?: string[];
    // 用户权限组
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
    // 企业信息
    enterpriseId?: string;
    enterpriseName?: string;
    departmentId?: string;
    departmentName?: string;
    position?: string;
    // 客户信息
    company?: string;
    contactPerson?: string;
    address?: string;
    shippingMethod?: string;
    // 用户描述
    description?: string;
    // 用户权限
    permissions?: string[];
    // 用户权限组
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