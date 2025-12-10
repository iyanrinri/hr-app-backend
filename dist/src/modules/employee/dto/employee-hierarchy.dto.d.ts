export declare class AssignSubordinatesDto {
    subordinateIds: number[];
}
export declare class SetManagerDto {
    managerId?: number;
}
export declare class EmployeeHierarchyResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    department: string;
    managerId?: number;
}
export declare class OrganizationTreeDto {
    manager?: EmployeeHierarchyResponseDto;
    employee: EmployeeHierarchyResponseDto;
    subordinates: EmployeeHierarchyResponseDto[];
    siblings: EmployeeHierarchyResponseDto[];
    managementChain: EmployeeHierarchyResponseDto[];
}
