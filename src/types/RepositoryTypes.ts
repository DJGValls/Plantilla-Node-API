
export type Query = Record<string, unknown>;

export interface SortOptions {
    [key: string]: 'asc' | 'desc';
}

export interface Repository<T = unknown> {
    find(query?: Query, sort?: SortOptions): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: T): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
