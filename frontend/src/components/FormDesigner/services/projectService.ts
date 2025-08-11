// 项目服务 - 为表单设计器提供项目数据
export interface ProjectItem {
    _id: string;
    projectName: string;
    clientName: string;
    contactNames: string | string[]; // 兼容字符串和数组两种格式
    progressStatus: string;
    settlementStatus: string;
}

export const projectService = {
    // 获取所有项目列表（用于表单设计器下拉选择）
    async getAllProjects(): Promise<ProjectItem[]> {
        try {
            // 获取所有项目，不分页，不过滤已取消项目（用户可能需要选择历史项目）
            const params = new URLSearchParams({
                page: '1',
                limit: '1000', // 获取大量数据，实际项目中可能需要分页加载
            });

            const response = await fetch(`/api/projects?${params}`);
            const data = await response.json();

            if (data.success) {
                return data.data.map((project: any) => ({
                    _id: project._id,
                    projectName: project.projectName,
                    clientName: project.clientName,
                    contactNames: project.contactNames || '',
                    progressStatus: project.progressStatus,
                    settlementStatus: project.settlementStatus
                }));
            } else {
                console.error('获取项目列表失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('获取项目列表失败:', error);
            return [];
        }
    },

    // 搜索项目（支持按项目名称和客户名称搜索）
    async searchProjects(keyword: string): Promise<ProjectItem[]> {
        try {
            const params = new URLSearchParams({
                page: '1',
                limit: '100',
                search: keyword
            });

            const response = await fetch(`/api/projects?${params}`);
            const data = await response.json();

            if (data.success) {
                return data.data.map((project: any) => ({
                    _id: project._id,
                    projectName: project.projectName,
                    clientName: project.clientName,
                    contactNames: project.contactNames || '',
                    progressStatus: project.progressStatus,
                    settlementStatus: project.settlementStatus
                }));
            } else {
                console.error('搜索项目失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('搜索项目失败:', error);
            return [];
        }
    }
};
