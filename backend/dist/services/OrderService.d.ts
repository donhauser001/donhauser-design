import { IOrder } from '../models/Order';
export declare class OrderService {
    private orderVersionService;
    createOrder(orderData: {
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
    }): Promise<IOrder>;
    updateOrder(orderId: string, updateData: {
        clientId?: string;
        clientName?: string;
        contactIds?: string[];
        contactNames?: string[];
        contactPhones?: string[];
        projectName?: string;
        quotationId?: string;
        status?: 'normal' | 'cancelled' | 'draft';
        paymentMethod?: string;
        deliveryDate?: Date;
        address?: string;
        remark?: string;
        updatedBy: string;
    }): Promise<IOrder>;
    getOrders(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        clientId?: string;
    }): Promise<{
        orders: IOrder[];
        total: number;
    }>;
    getOrderById(orderId: string): Promise<IOrder | null>;
    getOrderVersionHistory(orderId: string): Promise<any[]>;
    getOrderSnapshot(orderId: string, versionNumber: number): Promise<any | null>;
    updateOrderStatus(orderId: string, status: 'normal' | 'cancelled' | 'draft', updatedBy: string): Promise<IOrder>;
    deleteOrder(orderId: string): Promise<void>;
}
//# sourceMappingURL=OrderService.d.ts.map