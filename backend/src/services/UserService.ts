import User, { IUser, CreateUserRequest, UpdateUserRequest, UserQuery, ResetPasswordRequest, UpdateUserPermissionsRequest } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserService {
    // 获取用户列表
    async getUsers(query: UserQuery = {}): Promise<{ users: any[]; total: number }> {
        try {
            let filter: any = {};

            // 搜索过滤
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

            // 角色过滤
            if (query.role && query.role !== 'all') {
                filter.role = query.role;
            }

            // 状态过滤
            if (query.status && query.status !== 'all') {
                filter.status = query.status;
            }

            // 部门过滤
            if (query.department && query.department !== 'all') {
                filter.department = query.department;
            }

            // 计算总数
            const total = await User.countDocuments(filter);

            // 分页
            const page = query.page || 1;
            const limit = query.limit || 10;
            const skip = (page - 1) * limit;

            // 查询用户
            const users = await User.find(filter)
                .sort({ createTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            // 将MongoDB的_id转换为id
            const usersWithId = users.map(user => ({
                ...user,
                id: user._id.toString()
            }));

            return { users: usersWithId, total };
        } catch (error) {
            console.error('获取用户列表失败:', error);
            throw new Error('获取用户列表失败');
        }
    }

    // 根据ID获取用户
    async getUserById(id: string): Promise<any | null> {
        try {
            const user = await User.findById(id).lean();
            if (user) {
                return {
                    ...user,
                    id: user._id.toString()
                };
            }
            return null;
        } catch (error) {
            throw new Error('获取用户详情失败');
        }
    }

    // 根据用户名获取用户
    async getUserByUsername(username: string): Promise<any | null> {
        try {
            const user = await User.findOne({ username }).lean();
            if (user) {
                return {
                    ...user,
                    id: user._id.toString()
                };
            }
            return null;
        } catch (error) {
            throw new Error('获取用户详情失败');
        }
    }

    // 创建用户
    async createUser(userData: CreateUserRequest): Promise<any> {
        try {
            // 检查用户名是否已存在
            const existingUser = await this.getUserByUsername(userData.username);
            if (existingUser) {
                throw new Error('用户名已存在');
            }

            // 检查邮箱是否已存在（只有当邮箱不为空时才检查）
            if (userData.email && userData.email.trim() !== '') {
                const existingEmail = await User.findOne({ email: userData.email });
                if (existingEmail) {
                    throw new Error('邮箱已存在');
                }
            }

            // 加密密码
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const newUser = new User({
                ...userData,
                password: hashedPassword,
                createTime: new Date().toISOString().split('T')[0],
                permissions: userData.permissions || [],
                permissionGroups: userData.permissionGroups || []
            });

            return await newUser.save();
        } catch (error) {
            throw new Error('创建用户失败');
        }
    }

    // 更新用户
    async updateUser(id: string, userData: UpdateUserRequest): Promise<any | null> {
        try {
            // 如果更新用户名，检查是否与其他用户冲突
            if (userData.username) {
                const existingUser = await User.findOne({ username: userData.username, _id: { $ne: id } });
                if (existingUser) {
                    throw new Error('用户名已存在');
                }
            }

            // 处理邮箱字段
            let processedUserData: any = { ...userData };

            // 如果邮箱字段存在且为空或undefined，设置为null以清除该字段
            if (userData.hasOwnProperty('email')) {
                if (!userData.email || userData.email.trim() === '') {
                    processedUserData.email = null;
                } else {
                    // 如果邮箱不为空，检查是否与其他用户冲突
                    const existingEmail = await User.findOne({ email: userData.email, _id: { $ne: id } });
                    if (existingEmail) {
                        throw new Error('邮箱已存在');
                    }
                }
            }

            return await User.findByIdAndUpdate(id, processedUserData, { new: true, runValidators: true }).lean();
        } catch (error) {
            throw new Error('更新用户失败');
        }
    }

    // 删除用户
    async deleteUser(id: string): Promise<boolean> {
        try {
            const user = await User.findById(id);
            if (!user) {
                return false;
            }

            // 检查是否为超级管理员
            if (user.role === '超级管理员') {
                throw new Error('超级管理员不能删除');
            }

            await User.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw new Error('删除用户失败');
        }
    }

    // 重置密码
    async resetPassword(id: string, passwordData: ResetPasswordRequest): Promise<boolean> {
        try {
            const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);
            await User.findByIdAndUpdate(id, { password: hashedPassword });
            return true;
        } catch (error) {
            throw new Error('重置密码失败');
        }
    }

    // 更新用户权限
    async updateUserPermissions(id: string, permissionData: UpdateUserPermissionsRequest): Promise<any | null> {
        try {
            return await User.findByIdAndUpdate(id, {
                permissions: permissionData.permissions,
                permissionGroups: permissionData.permissionGroups
            }, { new: true }).lean();
        } catch (error) {
            throw new Error('更新用户权限失败');
        }
    }

    // 切换用户状态
    async toggleUserStatus(id: string): Promise<any | null> {
        try {
            const user = await User.findById(id);
            if (!user) {
                return null;
            }

            // 检查是否为超级管理员
            if (user.role === '超级管理员') {
                throw new Error('超级管理员状态不能修改');
            }

            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            return await User.findByIdAndUpdate(id, { status: newStatus }, { new: true }).lean();
        } catch (error) {
            throw new Error('切换用户状态失败');
        }
    }

    // 获取所有用户（不分页）
    async getAllUsers(): Promise<any[]> {
        try {
            return await User.find().lean();
        } catch (error) {
            throw new Error('获取所有用户失败');
        }
    }

    // 检查用户名是否存在
    async isUsernameExists(username: string): Promise<boolean> {
        try {
            const user = await User.findOne({ username });
            return !!user;
        } catch (error) {
            throw new Error('检查用户名失败');
        }
    }

    // 根据邮箱获取用户
    async getUserByEmail(email: string): Promise<any | null> {
        try {
            const user = await User.findOne({ email }).lean();
            if (user) {
                return {
                    ...user,
                    id: user._id.toString()
                };
            }
            return null;
        } catch (error) {
            throw new Error('根据邮箱获取用户失败');
        }
    }

    // 检查邮箱是否存在
    async isEmailExists(email: string): Promise<boolean> {
        try {
            const user = await User.findOne({ email });
            return !!user;
        } catch (error) {
            throw new Error('检查邮箱失败');
        }
    }
} 