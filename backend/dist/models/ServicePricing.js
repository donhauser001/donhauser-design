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
const ServicePricingSchema = new mongoose_1.Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true
    },
    alias: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        trim: true
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        trim: true
    },
    priceDescription: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    additionalConfigId: {
        type: String
    },
    additionalConfigName: {
        type: String,
        trim: true
    },
    serviceProcessId: {
        type: String
    },
    serviceProcessName: {
        type: String,
        trim: true
    },
    pricingPolicyIds: [{
            type: String
        }],
    pricingPolicyNames: [{
            type: String,
            trim: true
        }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
});
ServicePricingSchema.index({ serviceName: 1 });
ServicePricingSchema.index({ alias: 1 });
ServicePricingSchema.index({ categoryId: 1 });
ServicePricingSchema.index({ status: 1 });
exports.default = mongoose_1.default.model('ServicePricing', ServicePricingSchema);
//# sourceMappingURL=ServicePricing.js.map