"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
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
    description: {
        type: String,
        default: '',
        trim: true
    },
    permissions: [{
            type: String
        }],
    permissionGroups: [{
            type: String
        }]
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map