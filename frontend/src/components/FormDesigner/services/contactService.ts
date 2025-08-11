// 联系人服务 - 为表单设计器提供联系人数据
export interface ContactItem {
    _id: string;
    realName: string;
    phone: string;
    email?: string;
    username?: string;
    company?: string;
    position?: string;
    status: 'active' | 'inactive';
    role?: string;
    department?: string;
}

export const contactService = {
    // 获取所有联系人列表（用于表单设计器下拉选择）
    async getAllContacts(): Promise<ContactItem[]> {
        try {
            // 获取客户角色的用户作为联系人
            const response = await fetch('/api/users?role=客户&limit=1000');
            const data = await response.json();

            if (data.success) {
                return data.data.map((user: any) => ({
                    _id: user._id,
                    realName: user.realName || user.username,
                    phone: user.phone || '',
                    email: user.email || '',
                    username: user.username,
                    company: user.company || '',
                    position: user.position || '',
                    status: user.status || 'active',
                    role: user.role,
                    department: user.department || ''
                }));
            } else {
                console.error('获取联系人列表失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('获取联系人列表失败:', error);
            return [];
        }
    },

    // 搜索联系人（支持按姓名、公司、电话搜索）
    async searchContacts(keyword: string): Promise<ContactItem[]> {
        try {
            const params = new URLSearchParams({
                search: keyword,
                role: '客户',
                limit: '1000'
            });

            const response = await fetch(`/api/users?${params}`);
            const data = await response.json();

            if (data.success) {
                return data.data.map((user: any) => ({
                    _id: user._id,
                    realName: user.realName || user.username,
                    phone: user.phone || '',
                    email: user.email || '',
                    username: user.username,
                    company: user.company || '',
                    position: user.position || '',
                    status: user.status || 'active',
                    role: user.role,
                    department: user.department || ''
                }));
            } else {
                console.error('搜索联系人失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('搜索联系人失败:', error);
            return [];
        }
    }
};
