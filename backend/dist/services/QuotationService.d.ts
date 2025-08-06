import { IQuotation } from '../models/Quotation';
export declare class QuotationService {
    getAllQuotations(): Promise<IQuotation[]>;
    getQuotationById(id: string): Promise<IQuotation | null>;
    createQuotation(data: {
        name: string;
        description: string;
        isDefault: boolean;
        selectedServices: string[];
        validUntil?: Date;
    }): Promise<IQuotation>;
    updateQuotation(id: string, data: {
        name: string;
        description: string;
        isDefault: boolean;
        selectedServices: string[];
        validUntil?: Date;
    }): Promise<IQuotation | null>;
    deleteQuotation(id: string): Promise<boolean>;
    toggleQuotationStatus(id: string): Promise<IQuotation | null>;
    searchQuotations(searchText: string): Promise<IQuotation[]>;
    getDefaultQuotation(): Promise<IQuotation | null>;
}
declare const _default: QuotationService;
export default _default;
//# sourceMappingURL=QuotationService.d.ts.map