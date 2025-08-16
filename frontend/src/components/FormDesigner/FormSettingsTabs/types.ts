import { FormInstance } from 'antd';
import { FormCategory } from '../../../api/formCategories';

export interface FormSettingsTabProps {
    form: FormInstance;
    formData?: any;
    loading?: boolean;
}

export interface BasicSettingsProps extends FormSettingsTabProps {
    formCategories: FormCategory[];
    categoriesLoading: boolean;
    submissionLimitEnabled: boolean;
    expiryEnabled: boolean;
    expiryType: string;
    selectedIcon: string;
    setSubmissionLimitEnabled: (enabled: boolean) => void;
    setExpiryEnabled: (enabled: boolean) => void;
    setExpiryType: (type: string) => void;
    setSelectedIcon: (icon: string) => void;
}

export interface SubmissionSettingsProps extends FormSettingsTabProps {
    submissionLimitEnabled: boolean;
    expiryEnabled: boolean;
    expiryType: string;
    selectedIcon: string;
    setSubmissionLimitEnabled: (enabled: boolean) => void;
    setExpiryEnabled: (enabled: boolean) => void;
    setExpiryType: (type: string) => void;
    setSelectedIcon: (icon: string) => void;
}
