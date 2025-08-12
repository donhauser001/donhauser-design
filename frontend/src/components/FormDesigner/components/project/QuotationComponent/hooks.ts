import { useState, useEffect } from 'react';
import { FormComponent } from '../../../../../types/formDesigner';
import { quotationService, QuotationWithServices } from '../../../services/quotationService';
import { QuotationState } from './types';

export const useQuotationData = (component: FormComponent) => {
    const [selectedQuotation, setSelectedQuotation] = useState<QuotationWithServices | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [allPolicies, setAllPolicies] = useState<any[]>([]);
    const [policyModalVisible, setPolicyModalVisible] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
    const [selectedPolicyService, setSelectedPolicyService] = useState<any>(null);

    // 加载报价单详情
    const loadQuotationDetail = async (quotationId: string) => {
        if (!quotationId) {
            setSelectedQuotation(null);
            return;
        }

        setLoading(true);
        try {
            const quotationDetail = await quotationService.getQuotationWithServices(quotationId);
            setSelectedQuotation(quotationDetail);
        } catch (error) {
            console.error('加载报价单详情失败:', error);
            setSelectedQuotation(null);
        } finally {
            setLoading(false);
        }
    };

    // 初始化默认报价单
    const initializeDefaultQuotation = async () => {
        if (!initialized && !component.selectedQuotationId) {
            try {
                const quotations = await quotationService.getAllQuotations();
                const defaultQuotation = quotations.find(q => q.isDefault && q.status === 'active');
                if (defaultQuotation) {
                    await loadQuotationDetail(defaultQuotation._id);
                }
            } catch (error) {
                console.error('初始化默认报价单失败:', error);
            } finally {
                setInitialized(true);
            }
        }
    };

    // 加载价格政策数据
    const loadPoliciesData = async () => {
        try {
            const response = await fetch('/api/pricing-policies');
            const data = await response.json();
            const policies = data.success ? data.data : data;
            setAllPolicies(policies);
        } catch (error) {
            console.error('加载价格政策数据失败:', error);
        }
    };

    // 获取政策详情
    const getPolicyById = (policyId: string) => {
        return allPolicies.find(p => p._id === policyId);
    };

    // 处理政策点击事件
    const handlePolicyClick = (policyId: string, service?: any) => {
        const policy = getPolicyById(policyId);
        if (policy && component.policyDetailMode === 'modal') {
            setSelectedPolicy(policy);
            setSelectedPolicyService(service);
            setPolicyModalVisible(true);
        }
    };

    // Effects
    useEffect(() => {
        if (component.selectedQuotationId) {
            loadQuotationDetail(component.selectedQuotationId);
        } else if (!initialized) {
            initializeDefaultQuotation();
        } else {
            setSelectedQuotation(null);
        }
    }, [component.selectedQuotationId, initialized]);

    useEffect(() => {
        if (component.showPricingPolicy) {
            loadPoliciesData();
        }
    }, [component.showPricingPolicy]);

    return {
        selectedQuotation,
        loading,
        initialized,
        allPolicies,
        policyModalVisible,
        selectedPolicy,
        selectedPolicyService,
        setPolicyModalVisible,
        loadQuotationDetail,
        initializeDefaultQuotation,
        loadPoliciesData,
        getPolicyById,
        handlePolicyClick
    };
};
