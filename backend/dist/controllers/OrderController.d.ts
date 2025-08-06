import { Request, Response } from 'express';
export declare class OrderController {
    createOrder(req: Request, res: Response): Promise<void>;
    updateOrder(req: Request, res: Response): Promise<void>;
    getOrders(req: Request, res: Response): Promise<void>;
    getOrderById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOrderVersionHistory(req: Request, res: Response): Promise<void>;
    getOrderSnapshot(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateOrderStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteOrder(req: Request, res: Response): Promise<void>;
}
declare const _default: OrderController;
export default _default;
//# sourceMappingURL=OrderController.d.ts.map