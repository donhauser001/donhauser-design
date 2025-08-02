"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./users"));
const enterprises_1 = __importDefault(require("./enterprises"));
const departments_1 = __importDefault(require("./departments"));
const permissions_1 = __importDefault(require("./permissions"));
const roles_1 = __importDefault(require("./roles"));
const upload_1 = __importDefault(require("./upload"));
const clientCategories_1 = __importDefault(require("./clientCategories"));
const router = (0, express_1.Router)();
router.use('/users', users_1.default);
router.use('/enterprises', enterprises_1.default);
router.use('/departments', departments_1.default);
router.use('/permissions', permissions_1.default);
router.use('/roles', roles_1.default);
router.use('/upload', upload_1.default);
router.use('/client-categories', clientCategories_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map