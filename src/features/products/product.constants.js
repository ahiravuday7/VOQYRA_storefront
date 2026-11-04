export const PRODUCT_LIST_DEFAULTS = {
  page: 1,
  limit: 20,
  sort: "newest",
};

export const PRODUCT_LIST_MAX_LIMIT = 50;

export const PRODUCT_SORT_VALUES = [
  "newest",
  "oldest",
  "price-low-to-high",
  "price-high-to-low",
  "name-asc",
  "name-desc",
];

export const PRODUCT_SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "oldest",
    label: "Oldest",
  },
  {
    value: "price-low-to-high",
    label: "Price: Low to High",
  },
  {
    value: "price-high-to-low",
    label: "Price: High to Low",
  },
  {
    value: "name-asc",
    label: "Name: A–Z",
  },
  {
    value: "name-desc",
    label: "Name: Z–A",
  },
];
