import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PRODUCT_LIST_DEFAULTS } from "@/features/products/product.constants";
import { parseProductListSearchParams } from "@/features/products/utils/product-query-params";

function setOrDelete(searchParams, key, value) {
  if (value === undefined || value === null || value === "" || value === false) {
    searchParams.delete(key);
    return;
  }

  searchParams.set(key, String(value));
}

function useProductListUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => parseProductListSearchParams(searchParams), [searchParams]);

  const updateParams = useCallback(
    (updates, options = {}) => {
      setSearchParams(
        (currentSearchParams) => {
          const nextSearchParams = new URLSearchParams(currentSearchParams);

          Object.entries(updates).forEach(([key, value]) => {
            setOrDelete(nextSearchParams, key, value);
          });

          /*
           * Whenever a filter/sort/search changes, return to page 1.
           * Explicit page updates are excluded.
           */
          if (!Object.prototype.hasOwnProperty.call(updates, "page")) {
            nextSearchParams.delete("page");
          }

          /*
           * Keep the URL clean by omitting defaults.
           */
          if (Number(nextSearchParams.get("page")) === PRODUCT_LIST_DEFAULTS.page) {
            nextSearchParams.delete("page");
          }

          if (Number(nextSearchParams.get("limit")) === PRODUCT_LIST_DEFAULTS.limit) {
            nextSearchParams.delete("limit");
          }

          if (nextSearchParams.get("sort") === PRODUCT_LIST_DEFAULTS.sort) {
            nextSearchParams.delete("sort");
          }

          return nextSearchParams;
        },
        {
          replace: options.replace ?? false,
        },
      );
    },
    [setSearchParams],
  );

  const clearParams = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    params,
    updateParams,
    clearParams,
  };
}

export { useProductListUrlState };
