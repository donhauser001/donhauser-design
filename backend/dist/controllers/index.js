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
exports.clientController = void 0;
__exportStar(require("./EnterpriseController"), exports);
__exportStar(require("./DepartmentController"), exports);
__exportStar(require("./RoleController"), exports);
__exportStar(require("./PermissionController"), exports);
__exportStar(require("./UserController"), exports);
__exportStar(require("./AdditionalConfigController"), exports);
__exportStar(require("./PricingPolicyController"), exports);
__exportStar(require("./ServicePricingController"), exports);
__exportStar(require("./QuotationController"), exports);
__exportStar(require("./SpecificationController"), exports);
__exportStar(require("./ProjectController"), exports);
__exportStar(require("./TaskController"), exports);
exports.clientController = {};
//# sourceMappingURL=index.js.map