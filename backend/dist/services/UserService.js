"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    async getUsers(query = {}) {
        try {
            let filter = {};
            if (query.search) {
                filter.$or = [
                    { username: { $regex: query.search, $options: 'i' } },
                    { realName: { $regex: query.search, $options: 'i' } },
                    { email: { $regex: query.search, $options: 'i' } },
                    { phone: { $regex: query.search, $options: 'i' } },
                    { company: { $regex: query.search, $options: 'i' } },
                    { enterpriseName: { $regex: query.search, $options: 'i' } }
                ];
            }
            if (query.role && query.role !== 'all') {
                filter.role = query.role;
            }
            if (query.status && query.status !== 'all') {
                filter.status = query.status;
            }
            if (query.department && query.department !== 'all') {
                filter.department = query.department;
            }
            const total = await User_1.default.countDocuments(filter);
            const page = query.page || 1;
            const limit = query.limit || 10;
            const skip = (page - 1) * limit;
            const users = await User_1.default.find(filter)
                .sort({ createTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            const usersWithId = users.map(user => ({
                ...user,
                id: user._id.toString()
            }));
            return { users: usersWithId, total };
        }
        catch (error) {
            console.error('获取用户列表失败:', error);
            throw new Error('获取用户列表失败');
        }
    }
    async getUserById(id) {
        try {
            const user = await User_1.default.findById(id).lean();
            if (user) {
                return {
                    ...user,
                    id: user._id.toString()
                };
            }
            return null;
        }
        catch (error) {
            throw new Error('获取用户详情失败');
        }
    }
    async getUserByUsername(username) {
        try {
            const user = await User_1.default.findOne({ username }).lean();
            if (user) {
                return {
                    ...user,
                    id: user._id.toString()
                };
            }
            return null;
        }
        catch (error) {
            throw new Error('获取用户详情失败');
        }
    }
    async createUser(userData) {
        try {
            const existingUser = await this.getUserByUsername(userData.username);
            if (existingUser) {
                throw new Error('用户名已存在');
            }
            if (userData.email && userData.email.trim() !== '') {
                const existingEmail = await User_1.default.findOne({ email: userData.email });
                if (existingEmail) {
                    throw new Error('邮箱已存在');
                }
            }
            const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
            const newUser = new User_1.default({
                ...userData,
                password: hashedPassword,
                createTime: new Date().toISOString().split('T')[0],
                permissions: userData.permissions || [],
                permissionGroups: userData.permissionGroups || []
            });
            return await newUser.save();
        }
        catch (error) {
            throw new Error('创建用户失败');
        }
    }
    async updateUser(id, userData) {
        try {
            if (userData.username) {
                const existingUser = await User_1.default.findOne({ username: userData.username, _id: { $ne: id } });
                if (existingUser) {
                    throw new Error('用户名已存在');
                }
            }
            let processedUserData = { ...userData };
            if (userData.hasOwnProperty('email')) {
                if (!userData.email || userData.email.trim() === '') {
                    processedUserData.email = null;
                }
                else {
                    const existingEmail = await User_1.default.findOne({ email: userData.email, _id: { $ne: id } });
                    if (existingEmail) {
                        throw new Error('邮箱已存在');
                    }
                }
            }
            return await User_1.default.findByIdAndUpdate(id, processedUserData, { new: true, runValidators: true }).lean();
        }
        catch (error) {
            throw new Error('更新用户失败');
        }
    }
    async deleteUser(id) {
        try {
            const user = await User_1.default.findById(id);
            if (!user) {
                return false;
            }
            if (user.role === '超级管理员') {
                throw new Error('超级管理员不能删除');
            }
            await User_1.default.findByIdAndDelete(id);
            return true;
        }
        catch (error) {
            throw new Error('删除用户失败');
        }
    }
    async resetPassword(id, passwordData) {
        try {
            const hashedPassword = await bcryptjs_1.default.hash(passwordData.newPassword, 10);
            await User_1.default.findByIdAndUpdate(id, { password: hashedPassword });
            return true;
        }
        catch (error) {
            throw new Error('重置密码失败');
        }
    }
    async updateUserPermissions(id, permissionData) {
        try {
            return await User_1.default.findByIdAndUpdate(id, {
                permissions: permissionData.permissions,
                permissionGroups: permissionData.permissionGroups
            }, { new: true }).lean();
        }
        catch (error) {
            throw new Error('更新用户权限失败');
        }
    }
    async toggleUserStatus(id) {
        try {
            const user = await User_1.default.findById(id);
            if (!user) {
                return null;
            }
            if (user.role === '超级管理员') {
                throw new Error('超级管理员状态不能修改');
            }
            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            return await User_1.default.findByIdAndUpdate(id, { status: newStatus }, { new: true }).lean();
        }
        catch (error) {
            throw new Error('切换用户状态失败');
        }
    }
    async getAllUsers() {
        try {
            return await User_1.default.find().lean();
        }
        catch (error) {
            throw new Error('获取所有用户失败');
        }
    }
    async isUsernameExists(username) {
        try {
            const user = await User_1.default.findOne({ username });
            return !!user;
        }
        catch (error) {
            throw new Error('检查用户名失败');
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await User_1.default.findOne({ email }).lean();
            if (user) {
                return {
                    ...user,
                    id: user._id.toString()
                };
            }
            return null;
        }
        catch (error) {
            throw new Error('根据邮箱获取用户失败');
        }
    }
    async isEmailExists(email) {
        try {
            const user = await User_1.default.findOne({ email });
            return !!user;
        }
        catch (error) {
            throw new Error('检查邮箱失败');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map