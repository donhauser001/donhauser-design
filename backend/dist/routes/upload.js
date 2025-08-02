"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const createStorage = (subDir) => {
    return multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path_1.default.join(__dirname, '../../uploads', subDir);
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path_1.default.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
};
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('不支持的文件类型'));
    }
};
const createUpload = (subDir) => {
    return (0, multer_1.default)({
        storage: createStorage(subDir),
        fileFilter: fileFilter,
        limits: {
            fileSize: 10 * 1024 * 1024
        }
    });
};
router.post('/single', createUpload('general').single('file'), (req, res) => {
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
                url: `/uploads/general/${req.file.filename}`
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '文件上传失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.post('/business-license', createUpload('enterprises').single('businessLicense'), (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '营业执照上传失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.post('/avatar', createUpload('avatars').single('avatar'), (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '头像上传失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.post('/project', createUpload('projects').single('projectFile'), (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '项目文件上传失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.post('/client', createUpload('clients').single('clientFile'), (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '客户文件上传失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.post('/contract', createUpload('contracts').single('contractFile'), (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '合同文件上传失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.post('/department', createUpload('departments').single('departmentFile'), (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '部门文件上传失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.use((error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
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
router.delete('/:category/:filename', (req, res) => {
    try {
        const { category, filename } = req.params;
        const filePath = path_1.default.join(__dirname, '../../uploads', category, filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return res.json({
                success: true,
                message: '文件删除成功'
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: '文件不存在'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: '文件删除失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map