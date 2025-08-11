// 客户服务 - 为表单设计器提供客户数据
export interface ClientItem {
    _id: string;
    name: string;
    category: string;
    rating: number;
    status: 'active' | 'inactive';
    address?: string;
    invoiceType?: string;
}

export const clientService = {
    // 获取所有客户列表（用于表单设计器下拉选择）
    async getAllClients(): Promise<ClientItem[]> {
        try {
            const response = await fetch('/api/clients');
            const data = await response.json();

            if (data.success) {
                return data.data.map((client: any) => ({
                    _id: client._id,
                    name: client.name,
                    category: client.category || '',
                    rating: client.rating || 0,
                    status: client.status || 'active',
                    address: client.address || '',
                    invoiceType: client.invoiceType || ''
                }));
            } else {
                console.error('获取客户列表失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('获取客户列表失败:', error);
            return [];
        }
    },

    // 搜索客户（支持按客户名称搜索）
    async searchClients(keyword: string): Promise<ClientItem[]> {
        try {
            const params = new URLSearchParams({
                search: keyword
            });

            const response = await fetch(`/api/clients?${params}`);
            const data = await response.json();

            if (data.success) {
                return data.data.map((client: any) => ({
                    _id: client._id,
                    name: client.name,
                    category: client.category || '',
                    rating: client.rating || 0,
                    status: client.status || 'active',
                    address: client.address || '',
                    invoiceType: client.invoiceType || ''
                }));
            } else {
                console.error('搜索客户失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('搜索客户失败:', error);
            return [];
        }
    }
};
