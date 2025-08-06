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
const ClientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    invoiceType: {
        type: String,
        required: true,
        enum: ['增值税专用发票', '增值税普通发票', '不开票']
    },
    invoiceInfo: {
        type: String,
        default: '',
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    quotationId: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 3,
        min: 1,
        max: 5
    },
    files: [{
            path: {
                type: String,
                required: true
            },
            originalName: {
                type: String,
                required: true
            },
            size: {
                type: Number,
                required: true
            }
        }],
    summary: {
        type: String,
        default: '',
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
    updateTime: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Client', ClientSchema);
//# sourceMappingURL=Client.js.map