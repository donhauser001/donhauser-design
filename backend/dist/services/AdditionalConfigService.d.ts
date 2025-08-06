import { IAdditionalConfig } from '../models/AdditionalConfig';
export interface CreateConfigData {
    name: string;
    description: string;
    initialDraftCount: number;
    maxDraftCount: number;
    mainCreatorRatio: number;
    assistantRatio: number;
}
export interface UpdateConfigData {
    name: string;
    description: string;
    initialDraftCount: number;
    maxDraftCount: number;
    mainCreatorRatio: number;
    assistantRatio: number;
}
export declare class AdditionalConfigService {
    static getAllConfigs(): Promise<IAdditionalConfig[]>;
    static getConfigById(id: string): Promise<IAdditionalConfig | null>;
    static createConfig(data: CreateConfigData): Promise<IAdditionalConfig>;
    static updateConfig(id: string, data: UpdateConfigData): Promise<IAdditionalConfig | null>;
    static toggleConfigStatus(id: string): Promise<IAdditionalConfig | null>;
    static deleteConfig(id: string): Promise<void>;
    static searchConfigs(searchTerm: string): Promise<IAdditionalConfig[]>;
}
//# sourceMappingURL=AdditionalConfigService.d.ts.map