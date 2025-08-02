"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const users_1 = __importDefault(require("./routes/users"));
const enterprises_1 = __importDefault(require("./routes/enterprises"));
const departments_1 = __importDefault(require("./routes/departments"));
const permissions_1 = __importDefault(require("./routes/permissions"));
const roles_1 = __importDefault(require("./routes/roles"));
const upload_1 = __importDefault(require("./routes/upload"));
const clientCategories_1 = __importDefault(require("./routes/clientCategories"));
const pricingCategories_1 = __importDefault(require("./routes/pricingCategories"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.gif')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
    }
}));
app.get('/', (req, res) => {
    res.json({
        message: '设计业务管理系统 API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            users: '/api/users',
            enterprises: '/api/enterprises',
            departments: '/api/departments',
            permissions: '/api/permissions',
            roles: '/api/roles',
            clientCategories: '/api/client-categories',
            pricingCategories: '/api/pricing-categories'
        }
    });
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/users', users_1.default);
app.use('/api/enterprises', enterprises_1.default);
app.use('/api/departments', departments_1.default);
app.use('/api/permissions', permissions_1.default);
app.use('/api/roles', roles_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/client-categories', clientCategories_1.default);
app.use('/api/pricing-categories', pricingCategories_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器内部错误' });
});
app.use('*', (req, res) => {
    res.status(404).json({ error: '接口不存在' });
});
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    console.log(`👥 用户管理: http://localhost:${PORT}/api/users`);
    console.log(`🏢 企业管理: http://localhost:${PORT}/api/enterprises`);
    console.log(`🏛️ 部门管理: http://localhost:${PORT}/api/departments`);
    console.log(`🔐 权限管理: http://localhost:${PORT}/api/permissions`);
    console.log(`🎭 角色管理: http://localhost:${PORT}/api/roles`);
    console.log(`📂 客户分类: http://localhost:${PORT}/api/client-categories`);
    console.log(`💰 定价分类: http://localhost:${PORT}/api/pricing-categories`);
});
exports.default = app;
//# sourceMappingURL=app.js.map