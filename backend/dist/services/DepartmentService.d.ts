import { CreateDepartmentRequest, UpdateDepartmentRequest, DepartmentQuery } from '../models/Department';
export declare class DepartmentService {
    private enterpriseService;
    getDepartments(query?: DepartmentQuery): Promise<{
        departments: any[];
        total: number;
    }>;
    getDepartmentById(id: string): Promise<any | null>;
    createDepartment(departmentData: CreateDepartmentRequest): Promise<any>;
    updateDepartment(id: string, departmentData: UpdateDepartmentRequest): Promise<any | null>;
    deleteDepartment(id: string): Promise<boolean>;
    getParentDepartmentOptions(enterpriseId: string): Promise<{
        label: string;
        value: string;
    }[]>;
    updateEmployeeCount(departmentId: string, count: number): Promise<boolean>;
    toggleDepartmentStatus(id: string): Promise<any | null>;
    private isChildDepartment;
}
//# sourceMappingURL=DepartmentService.d.ts.map