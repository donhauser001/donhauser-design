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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    orderNo: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    contactIds: { type: [String], required: true },
    contactNames: { type: [String], required: true },
    contactPhones: { type: [String], required: true },
    projectName: { type: String, required: true },
    quotationId: { type: String },
    currentVersion: { type: Number },
    currentAmount: { type: Number },
    currentAmountRMB: { type: String },
    latestVersionInfo: {
        versionNumber: { type: Number },
        totalAmount: { type: Number },
        totalItems: { type: Number }
    },
    status: {
        type: String,
        enum: ['normal', 'cancelled', 'draft'],
        default: 'normal',
        set: function (value) {
            if (value === 'draft') {
                return 'normal';
            }
            return value;
        }
    },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    paymentMethod: { type: String },
    deliveryDate: { type: Date },
    address: { type: String },
    remark: { type: String }
}, {
    timestamps: true,
    collection: 'orders'
});
OrderSchema.index({ orderNo: 1 });
OrderSchema.index({ clientId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createTime: -1 });
exports.Order = mongoose_1.default.model('Order', OrderSchema);
exports.default = exports.Order;
//# sourceMappingURL=Order.js.map