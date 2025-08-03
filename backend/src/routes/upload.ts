import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// 配置 multer 存储 - 支持按业务板块分类
const createStorage = (subDir: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../uploads', subDir);
      // 确保上传目录存在
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // 生成唯一文件名
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
};

// 文件过滤器
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 允许的文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'));
  }
};

// 创建不同业务板块的上传中间件
const createUpload = (subDir: string) => {
  return multer({
    storage: createStorage(subDir),
    fileFilter: fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  });
};

// 上传单个文件
router.post('/single', createUpload('general').single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    return res.json({
      success: true,
      message: '文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/general/${req.file.filename}?originalname=${encodeURIComponent(req.file.originalname)}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 上传营业执照（企业板块）
router.post('/business-license', createUpload('enterprises').single('businessLicense'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传营业执照文件'
      });
    }

    return res.json({
      success: true,
      message: '营业执照上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/enterprises/${req.file.filename}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '营业执照上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 上传头像（用户板块）
router.post('/avatar', createUpload('avatars').single('avatar'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传头像文件'
      });
    }

    return res.json({
      success: true,
      message: '头像上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/avatars/${req.file.filename}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '头像上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 通用业务类型上传路由
router.post('/:businessType', (req: Request, res: Response) => {
  const { businessType } = req.params;

  // 根据业务类型创建对应的上传中间件
  const upload = createUpload(businessType);

  return upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: '文件上传失败',
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    return res.json({
      success: true,
      message: '文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/${businessType}/${req.file.filename}`
      }
    });
  });
});

// 带子目录的通用上传路由
router.post('/:businessType/:subDirectory', (req: Request, res: Response) => {
  const { businessType, subDirectory } = req.params;

  // 创建带子目录的存储
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../uploads', businessType, subDirectory);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB for projects
    }
  });

  return upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: '文件上传失败',
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    return res.json({
      success: true,
      message: '文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/${businessType}/${subDirectory}/${req.file.filename}`
      }
    });
  });
});

// 上传项目文件（项目板块）
router.post('/project', createUpload('projects').single('projectFile'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传项目文件'
      });
    }

    return res.json({
      success: true,
      message: '项目文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/projects/${req.file.filename}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '项目文件上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 上传客户文件（客户板块）
router.post('/client', createUpload('clients').single('clientFile'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传客户文件'
      });
    }

    return res.json({
      success: true,
      message: '客户文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/clients/${req.file.filename}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '客户文件上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 上传客户文件到子目录
router.post('/clients/:clientId', createUpload('clients').single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const { clientId } = req.params;

    // 创建客户子目录
    const clientDir = path.join(__dirname, '../../uploads/clients', clientId);
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }

    // 检查文件是否已经存在
    const newPath = path.join(clientDir, req.file.filename);
    if (fs.existsSync(newPath)) {
      // 如果文件已存在，删除旧文件
      fs.unlinkSync(newPath);
    }

    // 移动文件到客户子目录
    const oldPath = req.file.path;
    try {
      fs.renameSync(oldPath, newPath);
    } catch (moveError) {
      // 如果移动失败，尝试复制然后删除
      fs.copyFileSync(oldPath, newPath);
      fs.unlinkSync(oldPath);
    }

    return res.json({
      success: true,
      message: '客户文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/clients/${clientId}/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('客户文件上传错误:', error);
    return res.status(500).json({
      success: false,
      message: '客户文件上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 上传合同文件（合同板块）
router.post('/contract', createUpload('contracts').single('contractFile'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传合同文件'
      });
    }

    return res.json({
      success: true,
      message: '合同文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/contracts/${req.file.filename}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '合同文件上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 上传部门文件（部门板块）
router.post('/department', createUpload('departments').single('departmentFile'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传部门文件'
      });
    }

    return res.json({
      success: true,
      message: '部门文件上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/departments/${req.file.filename}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '部门文件上传失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// Multer错误处理中间件
router.use((error: any, req: Request, res: Response, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超过限制（最大10MB）'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '文件数量超过限制'
      });
    }
    return res.status(400).json({
      success: false,
      message: '文件上传错误',
      error: error.message
    });
  }
  next(error);
});

// 删除文件
router.delete('/:category/:filename', (req: Request, res: Response) => {
  try {
    const { category, filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', category, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({
        success: true,
        message: '文件删除成功'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '文件删除失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 