/**
 * Standard Pagination & Search Helper for API routes
 * Ensures full backward compatibility:
 * - If `page` parameter is supplied, returns `{ data: T[], pagination: { total, page, limit, totalPages, hasNextPage, hasPrevPage } }`
 * - If `page` parameter is NOT supplied, returns `data: T[]` directly so existing public pages and legacy callers don't break.
 */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ParsedPaginationQuery {
  isPaginated: boolean;
  page: number;
  limit: number;
  skip: number;
  q: string;
  status: string;
  category: string;
  searchParams: URLSearchParams;
}

/**
 * Parses URL search parameters for pagination and search
 */
export function parsePaginationParams(urlOrReq: string | URL | Request): ParsedPaginationQuery {
  let url: URL;
  if (typeof urlOrReq === "string") {
    url = new URL(urlOrReq, "http://localhost");
  } else if (urlOrReq instanceof Request) {
    url = new URL(urlOrReq.url);
  } else {
    url = urlOrReq;
  }

  const { searchParams } = url;
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const q = (searchParams.get("q") || "").trim();
  const status = (searchParams.get("status") || "").trim();
  const category = (searchParams.get("category") || "").trim();

  // If `page` is provided, caller expects paginated envelope
  const isPaginated = pageParam !== null;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(limitParam || "10", 10) || 10));
  const skip = (page - 1) * limit;

  return {
    isPaginated,
    page,
    limit,
    skip,
    q,
    status,
    category,
    searchParams,
  };
}

/**
 * Builds the appropriate response format based on whether pagination was requested
 */
export function formatDataResponse<T>(
  data: T[],
  total: number,
  params: { isPaginated: boolean; page: number; limit: number }
): T[] | PaginatedResponse<T> {
  if (!params.isPaginated) {
    return data;
  }

  const totalPages = Math.ceil(total / params.limit) || 1;
  return {
    data,
    pagination: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
      hasNextPage: params.page * params.limit < total,
      hasPrevPage: params.page > 1,
    },
  };
}
