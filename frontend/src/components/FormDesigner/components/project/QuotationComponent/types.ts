import { FormComponent } from '../../../../../types/formDesigner';
import { QuotationWithServices } from '../../../services/quotationService';

export interface QuotationComponentProps {
    component: FormComponent;
}

export interface PolicyTagProps {
    policyName: string;
    policyId: string;
    index: number;
    service: any;
    style?: any;
}

export interface RenderModeProps {
    groupedServices: { [key: string]: any[] };
    sortedCategories: string[];
    component: FormComponent;
    renderPolicyTag: (policyName: string, policyId: string, index: number, service: any, style?: any) => JSX.Element;
    renderPriceDescriptionWithPolicy: (originalDescription: string, service: any) => JSX.Element | string;
    hasOrderComponent: boolean;
    onServiceSelect: (service: any) => void;
    isServiceSelected: (serviceId: string) => boolean;
}

export interface QuotationState {
    selectedQuotation: QuotationWithServices | null;
    loading: boolean;
    initialized: boolean;
    allPolicies: any[];
    policyModalVisible: boolean;
    selectedPolicy: any;
    selectedPolicyService: any;
}
