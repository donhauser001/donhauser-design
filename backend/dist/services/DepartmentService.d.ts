import { Department, CreateDepartmentRequest, UpdateDepartmentRequest, DepartmentQuery } from '../models/Department';
export declare class DepartmentService {
    private enterpriseService;
    getDepartments(query?: DepartmentQuery): Promise<{
        departments: Department[];
        total: number;
    }>;
    getDepartmentById(id: string): Promise<Department | null>;
    createDepartment(departmentData: CreateDepartmentRequest): Promise<Department>;
    updateDepartment(id: string, departmentData: UpdateDepartmentRequest): Promise<Department | null>;
    deleteDepartment(id: string): Promise<boolean>;
    getParentDepartmentOptions(enterpriseId: string): Promise<{
        label: string;
        value: string;
    }[]>;
    updateEmployeeCount(departmentId: string, count: number): Promise<boolean>;
    toggleDepartmentStatus(id: string): Promise<Department | null>;
}
//# sourceMappingURL=DepartmentService.d.ts.map