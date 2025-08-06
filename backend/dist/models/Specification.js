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
exports.Specification = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SpecificationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    length: {
        type: Number,
        required: true,
        min: 0
    },
    width: {
        type: Number,
        required: true,
        min: 0
    },
    height: {
        type: Number,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['mm', 'cm', 'm', 'px', 'inch']
    },
    resolution: {
        type: String,
        enum: ['72dpi', '150dpi', '300dpi', '600dpi']
    },
    description: {
        type: String,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        trim: true
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'specifications'
});
SpecificationSchema.index({ name: 1 });
SpecificationSchema.index({ category: 1 });
SpecificationSchema.index({ isDefault: 1 });
SpecificationSchema.index({ createTime: -1 });
SpecificationSchema.virtual('displayName').get(function () {
    const parts = [this.name];
    if (this.length && this.width) {
        parts.push(`${this.length}×${this.width}`);
    }
    if (this.height) {
        parts[parts.length - 1] += `×${this.height}`;
    }
    if (this.unit) {
        parts.push(this.unit);
    }
    if (this.resolution) {
        parts.push(this.resolution);
    }
    return parts.join(' ');
});
exports.Specification = mongoose_1.default.model('Specification', SpecificationSchema);
exports.default = exports.Specification;
//# sourceMappingURL=Specification.js.map