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
exports.OrderVersion = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PricingPolicySnapshotSchema = new mongoose_1.Schema({
    policyId: { type: String, required: true },
    policyName: { type: String, required: true },
    policyType: {
        type: String,
        enum: ['uniform_discount', 'tiered_discount'],
        required: true
    },
    discountRatio: { type: Number, required: true },
    calculationDetails: { type: String, required: true }
}, { _id: false });
const OrderItemSnapshotSchema = new mongoose_1.Schema({
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    categoryName: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    priceDescription: { type: String, required: true },
    pricingPolicies: [PricingPolicySnapshotSchema]
}, { _id: false });
const OrderVersionSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, index: true },
    versionNumber: { type: Number, required: true },
    iterationTime: { type: Date, required: true, default: Date.now },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    contactIds: { type: [String], required: true },
    contactNames: { type: [String], required: true },
    contactPhones: { type: [String], required: true },
    projectName: { type: String, required: true },
    quotationId: { type: String },
    items: [OrderItemSnapshotSchema],
    totalAmount: { type: Number, required: true },
    totalAmountRMB: { type: String, required: true },
    calculationSummary: {
        totalItems: { type: Number, required: true },
        totalQuantity: { type: Number, required: true },
        appliedPolicies: [String]
    },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
OrderVersionSchema.index({ orderId: 1, versionNumber: 1 }, { unique: true });
OrderVersionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.OrderVersion = mongoose_1.default.model('OrderVersion', OrderVersionSchema);
//# sourceMappingURL=OrderVersion.js.map