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
const TaskSchema = new mongoose_1.Schema({
    taskName: { type: String, required: true },
    projectId: { type: String, required: true },
    serviceId: { type: String, required: true },
    assignedDesigners: [{ type: String }],
    specificationId: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    subtotal: { type: Number, required: true },
    pricingPolicies: [{
            policyId: { type: String, required: true },
            policyName: { type: String, required: true },
            policyType: {
                type: String,
                enum: ['uniform_discount', 'tiered_discount'],
                required: true
            },
            discountRatio: { type: Number, required: true },
            calculationDetails: { type: String, required: true }
        }],
    billingDescription: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: Date },
    dueDate: { type: Date },
    completedDate: { type: Date },
    settlementStatus: {
        type: String,
        enum: ['unpaid', 'prepaid', 'draft-paid', 'fully-paid', 'cancelled'],
        default: 'unpaid'
    },
    settlementTime: { type: Date },
    remarks: { type: String },
    attachmentIds: [{ type: String }],
    proposalId: { type: String }
}, {
    timestamps: true,
    collection: 'tasks'
});
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ assignedDesigners: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ settlementStatus: 1 });
TaskSchema.index({ dueDate: 1 });
exports.default = mongoose_1.default.model('Task', TaskSchema);
//# sourceMappingURL=Task.js.map