import { Request, Response } from 'express';
export declare class ServiceProcessController {
    getAllProcesses(req: Request, res: Response): Promise<void>;
    getProcessById(req: Request, res: Response): Promise<void>;
    createProcess(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProcess(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    toggleProcessStatus(req: Request, res: Response): Promise<void>;
    deleteProcess(req: Request, res: Response): Promise<void>;
    searchProcesses(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ServiceProcessController;
export default _default;
//# sourceMappingURL=ServiceProcessController.d.ts.map