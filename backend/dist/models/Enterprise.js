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
exports.Enterprise = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const EnterpriseSchema = new mongoose_1.Schema({
    enterpriseName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    enterpriseAlias: {
        type: String,
        trim: true,
        index: true
    },
    creditCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    businessLicense: {
        type: String,
        trim: true
    },
    bankPermit: {
        type: String,
        trim: true
    },
    bankPermitNumber: {
        type: String,
        trim: true
    },
    legalRepresentative: {
        type: String,
        required: true,
        trim: true
    },
    legalRepresentativeId: {
        type: String,
        required: true,
        trim: true
    },
    companyAddress: {
        type: String,
        required: true,
        trim: true
    },
    shippingAddress: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        required: true,
        trim: true
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true
    },
    invoiceInfo: {
        type: String,
        trim: true
    },
    bankName: {
        type: String,
        trim: true
    },
    accountName: {
        type: String,
        trim: true
    },
    accountNumber: {
        type: String,
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
        default: () => new Date().toLocaleString()
    }
}, {
    timestamps: true
});
exports.Enterprise = mongoose_1.default.model('Enterprise', EnterpriseSchema);
//# sourceMappingURL=Enterprise.js.map