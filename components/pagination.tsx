"use client";

import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
};

export function Pagination({ page, totalPages, total }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const style =
    "relative mr-1 inline-flex items-center rounded-md bg-gray-50 px-3 py-1 text-sm font-medium";
  const oddStyles = {
    listItem: "text-gray-500 hover:bg-gray-50",
    listItemActive: "cursor-default bg-black text-white",
    listDisable: "cursor-default font-bold bg-transparent text-gray-500",
  };

  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="isolate flex rounded-md">
        {totalPages > 1 ? (
          <button
            disabled={page < 2}
            type="button"
            className={cn(style)}
            onClick={() => setPage(page - 1)}
          >
            <RiArrowLeftSLine className="inline text-gray-500" size="1rem" />
          </button>
        ) : null}
        {totalPages > 1 ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(
              style,
              page === 1 ? oddStyles.listItemActive : oddStyles.listItem
            )}
            onClick={() => setPage(1)}
          >
            1
          </button>
        ) : null}
        {page > 3 ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(style, oddStyles.listDisable)}
          >
            ...
          </button>
        ) : null}
        {page > 2 ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(style, oddStyles.listItem)}
            onClick={() => setPage(page - 1)}
          >
            {page - 1}
          </button>
        ) : null}
        {page > 1 ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(style, oddStyles.listItemActive)}
            onClick={() => setPage(page)}
          >
            {page}
          </button>
        ) : null}
        {page < totalPages - 1 ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(style, oddStyles.listItem)}
            onClick={() => setPage(page + 1)}
          >
            {page + 1}
          </button>
        ) : null}
        {page < totalPages - 2 ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(style, oddStyles.listItem)}
          >
            {page + 2}
          </button>
        ) : null}
        {page < totalPages - 3 ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(style, oddStyles.listDisable)}
          >
            ...
          </button>
        ) : null}
        {page < totalPages ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(
              style,
              page === totalPages
                ? oddStyles.listItemActive
                : oddStyles.listItem
            )}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </button>
        ) : null}
        {page < totalPages ? (
          <button
            // disabled={mutating}
            type="button"
            className={cn(style, oddStyles.listItem)}
            onClick={() => setPage(page + 1)}
          >
            <RiArrowRightSLine className="inline text-gray-500" size="1rem" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
