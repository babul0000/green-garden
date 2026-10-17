"use client";

import React, { useState, useEffect, useMemo } from "react";

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: keyof T | string;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  mobileLabel?: string;
}

export interface TableFilter {
  id: string;
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;

  // Pagination (Server-side or Client-side)
  totalCount?: number;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  serverSide?: boolean;

  // Search
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  // Filters
  filters?: TableFilter[];

  // Header Actions (e.g. "+ Add New" button)
  actions?: React.ReactNode;

  // State flags
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;

  // Mobile custom card renderer
  renderMobileCard?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  totalCount,
  page = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  serverSide = false,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  searchPlaceholder = "সার্চ করুন...",
  filters = [],
  actions,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = "কোনো তথ্য পাওয়া যায়নি",
  emptyDescription = "বর্তমান ফিল্টার বা সার্চ অনুযায়ী কোনো রেকর্ড পাওয়া যায়নি।",
  emptyIcon,
  renderMobileCard,
  onRowClick,
}: DataTableProps<T>) {
  // Client-side state fallback when serverSide is false
  const [internalSearch, setInternalSearch] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);

  const activeSearch = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
  const activePage = serverSide ? page : internalPage;
  const activePageSize = serverSide ? pageSize : internalPageSize;

  const handleSearchChange = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalSearch(val);
      setInternalPage(1);
    }
  };

  const handlePageChange = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
    } else {
      setInternalPage(p);
    }
  };

  const handlePageSizeChange = (s: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(s);
    } else {
      setInternalPageSize(s);
      setInternalPage(1);
    }
  };

  // Client-side filtering and slicing
  const processedData = useMemo(() => {
    if (serverSide) return data;

    let res = [...data];

    // Client-side text search
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase();
      res = res.filter((item: any) => {
        return Object.values(item).some((v) => {
          if (v === null || v === undefined) return false;
          if (typeof v === "string" || typeof v === "number") {
            return String(v).toLowerCase().includes(q);
          }
          return false;
        });
      });
    }

    return res;
  }, [data, serverSide, activeSearch]);

  const activeTotal = serverSide ? (totalCount ?? data.length) : processedData.length;
  const totalPages = Math.max(1, Math.ceil(activeTotal / activePageSize));

  const pagedData = useMemo(() => {
    if (serverSide) return data;
    const start = (activePage - 1) * activePageSize;
    return processedData.slice(start, start + activePageSize);
  }, [processedData, serverSide, data, activePage, activePageSize]);

  const startEntry = activeTotal === 0 ? 0 : (activePage - 1) * activePageSize + 1;
  const endEntry = Math.min(activePage * activePageSize, activeTotal);

  return (
    <div className="flex flex-col gap-4 font-sans text-[#121813]">
      
      {/* ================= 1. TOOLBAR: SEARCH, FILTERS & ACTIONS ================= */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        
        {/* Left: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75787B] text-xs pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={activeSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs font-mono placeholder:text-[#75787B] text-[#121813] focus:outline-none focus:border-[#2B4D33] shadow-2xs transition-colors"
            />
            {activeSearch && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold p-1 cursor-pointer"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {filters.map((f) => (
            <div key={f.id} className="relative shrink-0">
              <select
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-[#D6D2C4] rounded-xl text-xs font-mono text-[#121813] focus:outline-none focus:border-[#2B4D33] shadow-2xs appearance-none pr-7 cursor-pointer transition-colors"
              >
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-[#75787B]">
                ▼
              </span>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* ================= 2. ERROR STATE ================= */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-mono font-semibold rounded-xl transition-colors cursor-pointer text-xs"
            >
              পুনরায় চেষ্টা করুন
            </button>
          )}
        </div>
      )}

      {/* ================= 3. DESKTOP VIEW: CLEAN ARCHITECTURAL TABLE ================= */}
      <div className="hidden sm:block bg-white rounded-2xl border border-[#D6D2C4] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#D6D2C4] bg-[#F7F6F2] text-[#75787B] text-[10px] font-mono uppercase tracking-wider">
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3.5 px-4 font-semibold ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#E4E2D7]">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: Math.min(activePageSize, 6) }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="py-4 px-4">
                        <div className="h-4 bg-stone-100 rounded-md w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : pagedData.length === 0 ? (
                // Empty Table Row
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center p-4 max-w-sm mx-auto">
                      <span className="text-3xl mb-2 opacity-50">
                        {emptyIcon || "📂"}
                      </span>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#121813]">
                        {emptyMessage}
                      </p>
                      <p className="text-[11px] font-light text-[#75787B] mt-1">
                        {emptyDescription}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Actual Data Rows
                pagedData.map((row, rIdx) => {
                  const key = keyExtractor(row, rIdx);
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`hover:bg-[#F7F6F2] transition-colors ${
                        onRowClick ? "cursor-pointer" : ""
                      }`}
                    >
                      {columns.map((col, cIdx) => {
                        let content: React.ReactNode;
                        if (col.cell) {
                          content = col.cell(row, rIdx);
                        } else if (col.accessorKey) {
                          content = (row as any)[col.accessorKey];
                        } else {
                          content = null;
                        }

                        return (
                          <td key={cIdx} className={`py-3.5 px-4 align-middle ${col.className || ""}`}>
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 4. MOBILE VIEW: ADAPTIVE CARD TRANSFORMATION ================= */}
      <div className="block sm:hidden flex flex-col gap-3">
        {loading ? (
          // Mobile Card Skeletons
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-[#D6D2C4] shadow-2xs space-y-3 animate-pulse">
              <div className="h-4 bg-stone-100 rounded w-1/2"></div>
              <div className="h-3 bg-stone-100 rounded w-3/4"></div>
              <div className="h-8 bg-stone-100 rounded"></div>
            </div>
          ))
        ) : pagedData.length === 0 ? (
          // Mobile Empty State
          <div className="bg-white rounded-2xl p-8 border border-dashed border-[#D6D2C4] text-center">
            <span className="text-3xl mb-2 opacity-50 block">
              {emptyIcon || "📂"}
            </span>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#121813]">
              {emptyMessage}
            </p>
            <p className="text-[11px] font-light text-[#75787B] mt-1">
              {emptyDescription}
            </p>
          </div>
        ) : (
          // Mobile Card Items
          pagedData.map((row, rIdx) => {
            const key = keyExtractor(row, rIdx);

            if (renderMobileCard) {
              return (
                <div key={key} onClick={() => onRowClick && onRowClick(row)}>
                  {renderMobileCard(row, rIdx)}
                </div>
              );
            }

            // Default card layout rendering column key-value pairs
            return (
              <div
                key={key}
                onClick={() => onRowClick && onRowClick(row)}
                className={`bg-white rounded-2xl p-4 border border-[#D6D2C4] shadow-2xs space-y-2.5 transition-all ${
                  onRowClick ? "cursor-pointer active:scale-[0.99]" : ""
                }`}
              >
                {columns.map((col, cIdx) => {
                  if (col.hideOnMobile) return null;

                  let content: React.ReactNode;
                  if (col.cell) {
                    content = col.cell(row, rIdx);
                  } else if (col.accessorKey) {
                    content = (row as any)[col.accessorKey];
                  } else {
                    content = null;
                  }

                  const headerText = col.mobileLabel || (typeof col.header === "string" ? col.header : "");

                  return (
                    <div key={cIdx} className="flex justify-between items-center text-xs gap-3">
                      {headerText && (
                        <span className="font-mono text-[10px] text-[#75787B] uppercase tracking-wider shrink-0">
                          {headerText}:
                        </span>
                      )}
                      <div className="text-right truncate flex-1 flex justify-end">
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* ================= 5. PAGINATION FOOTER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs font-mono text-[#75787B]">
        
        {/* Entry Range and Page Size Selector */}
        <div className="flex items-center gap-3">
          <span>
            দেখাচ্ছে <strong className="text-[#121813] font-bold">{startEntry}</strong> - <strong className="text-[#121813] font-bold">{endEntry}</strong> (সর্বমোট <strong className="text-[#121813] font-bold">{activeTotal}</strong>)
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#75787B]">প্রতি পেজে:</span>
            <select
              value={activePageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-[#D6D2C4] rounded-lg text-xs font-mono text-[#121813] focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page Nav Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              type="button"
              disabled={activePage <= 1 || loading}
              onClick={() => handlePageChange(activePage - 1)}
              className="px-3 py-1.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] text-xs font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ◀ পূর্ববর্তী
            </button>

            {/* Page indicator pill */}
            <span className="px-3 py-1.5 rounded-xl bg-[#2B4D33] text-white text-xs font-mono font-bold">
              {activePage} / {totalPages}
            </span>

            {/* Next Button */}
            <button
              type="button"
              disabled={activePage >= totalPages || loading}
              onClick={() => handlePageChange(activePage + 1)}
              className="px-3 py-1.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] text-xs font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              পরবর্তী ▶
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
