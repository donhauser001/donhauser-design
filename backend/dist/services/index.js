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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.clientService = void 0;
__exportStar(require("./EnterpriseService"), exports);
__exportStar(require("./DepartmentService"), exports);
__exportStar(require("./RoleService"), exports);
__exportStar(require("./PermissionService"), exports);
__exportStar(require("./UserService"), exports);
__exportStar(require("./AdditionalConfigService"), exports);
__exportStar(require("./PricingPolicyService"), exports);
__exportStar(require("./ServicePricingService"), exports);
__exportStar(require("./QuotationService"), exports);
__exportStar(require("./SpecificationService"), exports);
__exportStar(require("./ProjectService"), exports);
__exportStar(require("./TaskService"), exports);
exports.clientService = {};
exports.authService = {};
//# sourceMappingURL=index.js.map