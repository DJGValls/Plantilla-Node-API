import { SortOptions, PaginationOptions } from "types/RepositoryTypes";

export function FilterBuilder(query: any): { filter: any; sort: SortOptions; pagination: PaginationOptions } {
    const filter: any = {};
    const sort: SortOptions = {};
    const pagination: PaginationOptions = {
        page: 1,
        limit: 10,
    };

    if (!query) return { filter, sort, pagination };

    // Procesar paginación
    if (query.page) {
        pagination.page = parseInt(query.page);
    }
    if (query.limit) {
        pagination.limit = parseInt(query.limit);
    }

    // Procesar filtros en formato filter[field]=value
    Object.keys(query).forEach((key) => {
        if (key === "sort") {
            // Procesar parámetros de ordenamiento
            const sortParams = query[key].split(",");
            sortParams.forEach((param: string) => {
                const [field, order] = param.split(":");
                sort[field] = order?.toLowerCase() === "desc" ? "desc" : "asc";
            });
            return;
        }
        if (key === "page" || key === "limit") {
            return;
        }
        const matches = key.match(/^filter\[(.*?)\]$/);
        if (matches) {
            const fieldName = matches[1];
            const value = query[key];

            // Manejar arrays (e.g., permissions)
            if (Array.isArray(value)) {
                filter[fieldName] = { $in: value };
            }
            // Manejar strings con búsqueda case-insensitive
            else if (typeof value === "string") {
                filter[fieldName] = new RegExp(value, "i");
            }
            // Otros tipos de valores
            else {
                filter[fieldName] = value;
            }
        }
        // Procesar filtros que no están en formato filter[field]
        else if (key !== "filter") {
            const value = query[key];
            if (Array.isArray(value)) {
                filter[key] = { $in: value };
            } else if (typeof value === "string") {
                filter[key] = new RegExp(value, "i");
            } else {
                filter[key] = value;
            }
        }
    });
    return { filter, sort, pagination };
}
