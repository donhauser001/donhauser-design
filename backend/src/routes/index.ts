import { Router } from 'express';
import userRoutes from './users';
import enterpriseRoutes from './enterprises';
import departmentRoutes from './departments';
import permissionRoutes from './permissions';
import roleRoutes from './roles';
import uploadRoutes from './upload';
import clientRoutes from './clients';
import clientCategoryRoutes from './clientCategories';
import serviceProcessRoutes from './serviceProcesses';
import additionalConfigRoutes from './additionalConfigs';
import pricingPolicyRoutes from './pricingPolicies';
import servicePricingRoutes from './servicePricing';
import quotationRoutes from './quotations';

const router = Router();

// 用户管理路由
router.use('/users', userRoutes);

// 企业管理路由
router.use('/enterprises', enterpriseRoutes);

// 部门管理路由
router.use('/departments', departmentRoutes);

// 权限管理路由
router.use('/permissions', permissionRoutes);

// 角色管理路由
router.use('/roles', roleRoutes);

// 文件上传路由
router.use('/upload', uploadRoutes);

// 客户管理路由
router.use('/clients', clientRoutes);

// 客户分类路由
router.use('/client-categories', clientCategoryRoutes);

// 服务流程路由
router.use('/service-processes', serviceProcessRoutes);

// 附加配置路由
router.use('/additional-configs', additionalConfigRoutes);

// 价格政策路由
router.use('/pricing-policies', pricingPolicyRoutes);

// 服务定价路由
router.use('/service-pricing', servicePricingRoutes);

// 报价单路由
router.use('/quotations', quotationRoutes);

export default router; 