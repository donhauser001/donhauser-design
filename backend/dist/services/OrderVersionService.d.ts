import { IOrderVersion } from '../models/OrderVersion';
export declare class OrderVersionService {
    createOrderVersion(versionData: {
        orderId: string;
        clientId: string;
        clientName: string;
        contactIds: string[];
        contactNames: string[];
        contactPhones: string[];
        projectName: string;
        quotationId?: string;
        selectedServices: any[];
        serviceDetails: any[];
        policies: any[];
        createdBy: string;
    }): Promise<IOrderVersion>;
    getOrderVersions(orderId: string): Promise<IOrderVersion[]>;
    getOrderVersion(orderId: string, versionNumber: number): Promise<IOrderVersion | null>;
    getLatestOrderVersion(orderId: string): Promise<IOrderVersion | null>;
    getLatestVersionNumber(orderId: string): Promise<number>;
    deleteOrderVersions(orderId: string): Promise<void>;
    private generateVersionSnapshot;
}
//# sourceMappingURL=OrderVersionService.d.ts.map