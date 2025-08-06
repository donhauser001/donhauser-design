import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// 导入路由
import userRoutes from './routes/users';
import enterpriseRoutes from './routes/enterprises';
import departmentRoutes from './routes/departments';
import permissionRoutes from './routes/permissions';
import roleRoutes from './routes/roles';
import uploadRoutes from './routes/upload';
import clientRoutes from './routes/clients';
import clientCategoryRoutes from './routes/clientCategories';
import pricingCategoryRoutes from './routes/pricingCategories';
import serviceProcessRoutes from './routes/serviceProcesses';
import additionalConfigRoutes from './routes/additionalConfigs';
import pricingPolicyRoutes from './routes/pricingPolicies';
import servicePricingRoutes from './routes/servicePricing';
import quotationRoutes from './routes/quotations';
import orderRoutes from './routes/orders';
import orderVersionRoutes from './routes/orderVersions';
import contractElementRoutes from './routes/contractElements';
import specificationRoutes from './routes/specifications';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 连接MongoDB数据库
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/donhauser');
    console.log('✅ MongoDB数据库连接成功');
  } catch (error) {
    console.error('❌ MongoDB数据库连接失败:', error);
    process.exit(1);
  }
};

// 启动数据库连接
connectDB();

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务 - 为每个业务板块提供文件访问
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    // 设置图片文件的缓存和CORS头
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1年缓存
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
}));

// 基础路由
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
      clients: '/api/clients',
      clientCategories: '/api/client-categories',
      pricingCategories: '/api/pricing-categories',
      serviceProcesses: '/api/service-processes',
      additionalConfigs: '/api/additional-configs',
      pricingPolicies: '/api/pricing-policies',
      servicePricing: '/api/service-pricing',
      quotations: '/api/quotations',
      orders: '/api/orders',
      orderVersions: '/api/order-versions',
      contractElements: '/api/contract-elements',
      specifications: '/api/specifications',
      projects: '/api/projects',
      tasks: '/api/tasks'
    }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/users', userRoutes);
app.use('/api/enterprises', enterpriseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/client-categories', clientCategoryRoutes);
app.use('/api/pricing-categories', pricingCategoryRoutes);
app.use('/api/service-processes', serviceProcessRoutes);
app.use('/api/additional-configs', additionalConfigRoutes);
app.use('/api/pricing-policies', pricingPolicyRoutes);
app.use('/api/service-pricing', servicePricingRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-versions', orderVersionRoutes);
app.use('/api/contract-elements', contractElementRoutes);
app.use('/api/specifications', specificationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 404 处理
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
  console.log(`👥 客户管理: http://localhost:${PORT}/api/clients`);
  console.log(`📂 客户分类: http://localhost:${PORT}/api/client-categories`);
  console.log(`💰 定价分类: http://localhost:${PORT}/api/pricing-categories`);
  console.log(`🔄 服务流程: http://localhost:${PORT}/api/service-processes`);
});

export default app; 