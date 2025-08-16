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
import pricingCategoryRoutes from './pricingCategories';
import servicePricingRoutes from './servicePricing';
import quotationRoutes from './quotations';

import specificationRoutes from './specifications';
import projectRoutes from './projects';
import taskRoutes from './tasks';
import articleRoutes from './articles';
import articleCategoryRoutes from './articleCategories';
import articleTagRoutes from './articleTags';
import formCategoryRoutes from './formCategories';
import formRoutes from './forms';
import emailSettingRoutes from './emailSettings';

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

// 定价分类路由
router.use('/pricing-categories', pricingCategoryRoutes);

// 服务定价路由
router.use('/service-pricing', servicePricingRoutes);

// 报价单路由
router.use('/quotations', quotationRoutes);



// 规格管理路由
router.use('/specifications', specificationRoutes);

// 项目管理路由
router.use('/projects', projectRoutes);

// 任务管理路由
router.use('/tasks', taskRoutes);

// 文章管理路由
router.use('/articles', articleRoutes);

// 文章分类路由
router.use('/article-categories', articleCategoryRoutes);

// 文章标签路由
router.use('/article-tags', articleTagRoutes);

// 表单分类路由
router.use('/form-categories', formCategoryRoutes);

// 表单管理路由
router.use('/forms', formRoutes);

// 邮件设置路由
router.use('/email-settings', emailSettingRoutes);

export default router; 