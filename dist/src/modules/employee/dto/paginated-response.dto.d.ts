export declare class PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class PaginatedEmployeeResponseDto {
    data: any[];
    meta: PaginationMetaDto;
}
