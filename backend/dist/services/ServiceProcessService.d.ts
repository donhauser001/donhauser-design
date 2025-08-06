import { IServiceProcess, IProcessStep } from '../models/ServiceProcess';
export declare class ServiceProcessService {
    getAllProcesses(): Promise<(import("mongoose").Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getProcessById(id: string): Promise<import("mongoose").Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createProcess(processData: {
        name: string;
        description: string;
        steps: IProcessStep[];
    }): Promise<import("mongoose").Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateProcess(id: string, updateData: {
        name?: string;
        description?: string;
        steps?: IProcessStep[];
    }): Promise<import("mongoose").Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    toggleProcessStatus(id: string): Promise<import("mongoose").Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteProcess(id: string): Promise<import("mongoose").Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    searchProcesses(searchTerm: string): Promise<(import("mongoose").Document<unknown, {}, IServiceProcess, {}, {}> & IServiceProcess & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
declare const _default: ServiceProcessService;
export default _default;
//# sourceMappingURL=ServiceProcessService.d.ts.map