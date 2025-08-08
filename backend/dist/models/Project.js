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
const ProjectSchema = new mongoose_1.Schema({
    projectName: { type: String, required: true },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    contactIds: [{ type: String, required: true }],
    contactNames: [{ type: String, required: true }],
    contactPhones: [{ type: String, required: true }],
    undertakingTeam: { type: String, required: true },
    mainDesigners: [{ type: String }],
    assistantDesigners: [{ type: String }],
    progressStatus: {
        type: String,
        enum: ['consulting', 'in-progress', 'partial-delivery', 'completed', 'on-hold', 'cancelled'],
        default: 'consulting'
    },
    settlementStatus: {
        type: String,
        enum: ['unpaid', 'prepaid', 'partial-paid', 'fully-paid'],
        default: 'unpaid'
    },
    createdAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    deliveredAt: { type: Date },
    settledAt: { type: Date },
    clientRequirements: { type: String },
    quotationId: { type: String },
    remark: { type: String },
    taskIds: [{ type: String }],
    fileIds: [{ type: String }],
    contractIds: [{ type: String }],
    invoiceIds: [{ type: String }],
    proposalIds: [{ type: String }],
    logIds: [{ type: String }]
}, {
    timestamps: true,
    collection: 'projects'
});
ProjectSchema.index({ projectName: 1 });
ProjectSchema.index({ clientId: 1 });
ProjectSchema.index({ undertakingTeam: 1 });
ProjectSchema.index({ progressStatus: 1 });
ProjectSchema.index({ settlementStatus: 1 });
ProjectSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model('Project', ProjectSchema);
//# sourceMappingURL=Project.js.map