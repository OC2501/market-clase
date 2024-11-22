
export interface ApiAllResponse<T>{
    meta: Metadata;
    data: T[];
}

export interface Metadata {
    page: number;
    lastPage: number;
    limit: number;
    total: number;
}