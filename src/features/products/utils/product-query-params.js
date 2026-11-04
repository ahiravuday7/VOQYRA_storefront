import {
  PRODUCT_LIST_DEFAULTS,
  PRODUCT_LIST_MAX_LIMIT,
  PRODUCT_SORT_VALUES,
} from "@/features/products/product.constants";

function parsePositiveInteger(value, fallback, maximum) {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  if (maximum && parsedValue > maximum) {
    return maximum;
  }

  return parsedValue;
}

function parseOptionalNumber(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return undefined;
  }

  return parsedValue;
}

function parseOptionalBoolean(value) {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return undefined;
}

function parseSort(value) {
  if (PRODUCT_SORT_VALUES.includes(value)) {
    return value;
  }

  return PRODUCT_LIST_DEFAULTS.sort;
}

function cleanOptionalString(value) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}

function removeUndefinedValues(params) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
}

export function normalizeProductListParams(params = {}) {
  const minPrice = parseOptionalNumber(params.minPrice);
  const maxPrice = parseOptionalNumber(params.maxPrice);

  return removeUndefinedValues({
    page: parsePositiveInteger(params.page, PRODUCT_LIST_DEFAULTS.page, 100000),

    limit: parsePositiveInteger(params.limit, PRODUCT_LIST_DEFAULTS.limit, PRODUCT_LIST_MAX_LIMIT),

    search: cleanOptionalString(params.search),

    category: cleanOptionalString(params.category),

    brand: cleanOptionalString(params.brand),

    collection: cleanOptionalString(params.collection),

    isFeatured: parseOptionalBoolean(params.isFeatured),

    isNewArrival: parseOptionalBoolean(params.isNewArrival),

    isBestSeller: parseOptionalBoolean(params.isBestSeller),

    inStock: parseOptionalBoolean(params.inStock),

    minPrice,
    maxPrice,

    sort: parseSort(params.sort),
  });
}

export function parseProductListSearchParams(searchParams) {
  return normalizeProductListParams({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    search: searchParams.get("search") ?? searchParams.get("q"),
    category: searchParams.get("category"),
    brand: searchParams.get("brand"),
    collection: searchParams.get("collection"),
    isFeatured: searchParams.get("isFeatured"),
    isNewArrival: searchParams.get("isNewArrival"),
    isBestSeller: searchParams.get("isBestSeller"),
    inStock: searchParams.get("inStock"),
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    sort: searchParams.get("sort"),
  });
}
