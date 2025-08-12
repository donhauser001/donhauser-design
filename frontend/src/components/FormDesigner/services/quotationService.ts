// 报价单服务 - 为表单设计器提供报价单数据
export interface QuotationItem {
    _id: string;
    name: string;
    status: 'active' | 'inactive';
    validUntil?: string;
    description: string;
    isDefault: boolean;
    selectedServices: string[];
    createTime: string;
    updateTime: string;
}

export interface ServicePricingItem {
    _id: string;
    serviceName: string;
    alias: string;
    categoryId: string;
    categoryName?: string;
    unitPrice: number;
    unit: string;
    priceDescription: string;
    link: string;
    additionalConfigId?: string;
    additionalConfigName?: string;
    serviceProcessId?: string;
    serviceProcessName?: string;
    pricingPolicyIds?: string[];
    pricingPolicyNames?: string[];
    status: 'active' | 'inactive';
    createTime: string;
    updateTime: string;
}

export interface QuotationWithServices extends QuotationItem {
    services: ServicePricingItem[];
    totalAmount?: number;
}

export const quotationService = {
    // 获取所有报价单列表（用于表单设计器下拉选择）
    async getAllQuotations(): Promise<QuotationItem[]> {
        try {
            const response = await fetch('/api/quotations');
            const data = await response.json();

            if (data.success || Array.isArray(data.data)) {
                return (data.data || data).map((quotation: any) => ({
                    _id: quotation._id,
                    name: quotation.name,
                    status: quotation.status || 'active',
                    validUntil: quotation.validUntil,
                    description: quotation.description || '',
                    isDefault: quotation.isDefault || false,
                    selectedServices: quotation.selectedServices || [],
                    createTime: quotation.createTime,
                    updateTime: quotation.updateTime
                }));
            } else {
                console.error('获取报价单列表失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('获取报价单列表失败:', error);
            return [];
        }
    },

    // 搜索报价单（支持按报价单名称搜索）
    async searchQuotations(keyword: string): Promise<QuotationItem[]> {
        try {
            const params = new URLSearchParams({
                q: keyword
            });

            const response = await fetch(`/api/quotations/search?${params}`);
            const data = await response.json();

            if (data.success || Array.isArray(data.data)) {
                return (data.data || data).map((quotation: any) => ({
                    _id: quotation._id,
                    name: quotation.name,
                    status: quotation.status || 'active',
                    validUntil: quotation.validUntil,
                    description: quotation.description || '',
                    isDefault: quotation.isDefault || false,
                    selectedServices: quotation.selectedServices || [],
                    createTime: quotation.createTime,
                    updateTime: quotation.updateTime
                }));
            } else {
                console.error('搜索报价单失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('搜索报价单失败:', error);
            return [];
        }
    },

    // 根据ID获取报价单详情（包含服务信息）
    async getQuotationWithServices(id: string): Promise<QuotationWithServices | null> {
        try {
            // 获取报价单基本信息
            const quotationResponse = await fetch(`/api/quotations/${id}`);
            const quotationData = await quotationResponse.json();

            if (!quotationData.success && !quotationData._id) {
                console.error('获取报价单详情失败:', quotationData.message);
                return null;
            }

            const quotation = quotationData.data || quotationData;

            // 获取所有服务定价信息
            const servicesResponse = await fetch('/api/service-pricing');
            const servicesData = await servicesResponse.json();

            const allServices = servicesData.success ? servicesData.data : servicesData;

            // 获取所有价格政策信息
            const policiesResponse = await fetch('/api/pricing-policies');
            const policiesData = await policiesResponse.json();
            const allPolicies = policiesData.success ? policiesData.data : policiesData;

            // 过滤出报价单包含的服务
            const selectedServices = allServices.filter((service: any) =>
                quotation.selectedServices.includes(service._id)
            ).map((service: any) => {
                // 获取正确的价格政策名称（使用name而不是alias）
                let correctPricingPolicyNames: string[] = [];
                if (service.pricingPolicyIds && service.pricingPolicyIds.length > 0) {
                    correctPricingPolicyNames = service.pricingPolicyIds.map((policyId: string) => {
                        const policy = allPolicies.find((p: any) => p._id === policyId);
                        return policy ? policy.name : '未知政策';
                    }).filter((name: string) => name !== '未知政策');
                }

                return {
                    _id: service._id,
                    serviceName: service.serviceName,
                    alias: service.alias,
                    categoryId: service.categoryId,
                    categoryName: service.categoryName,
                    unitPrice: service.unitPrice,
                    unit: service.unit,
                    priceDescription: service.priceDescription,
                    link: service.link,
                    additionalConfigId: service.additionalConfigId,
                    additionalConfigName: service.additionalConfigName,
                    serviceProcessId: service.serviceProcessId,
                    serviceProcessName: service.serviceProcessName,
                    pricingPolicyIds: service.pricingPolicyIds,
                    pricingPolicyNames: correctPricingPolicyNames, // 使用正确的价格政策名称
                    status: service.status,
                    createTime: service.createTime,
                    updateTime: service.updateTime
                };
            });

            // 计算总金额（只计算有效服务）
            const totalAmount = selectedServices
                .filter(service => service.status === 'active')
                .reduce((sum, service) => sum + service.unitPrice, 0);

            return {
                _id: quotation._id,
                name: quotation.name,
                status: quotation.status || 'active',
                validUntil: quotation.validUntil,
                description: quotation.description || '',
                isDefault: quotation.isDefault || false,
                selectedServices: quotation.selectedServices || [],
                createTime: quotation.createTime,
                updateTime: quotation.updateTime,
                services: selectedServices,
                totalAmount
            };
        } catch (error) {
            console.error('获取报价单详情失败:', error);
            return null;
        }
    }
};
