const ORDER_RETURN_RESOLUTION_OPTIONS = [
  {
    value: "refund",
    label: "Refund",
    description: "Request a refund after the returned items are processed.",
  },
  {
    value: "replacement",
    label: "Replacement",
    description: "Request replacement items after the return is processed.",
  },
];

const ORDER_RETURN_REASON_OPTIONS = [
  {
    value: "damaged",
    label: "Damaged",
  },
  {
    value: "defective",
    label: "Defective",
  },
  {
    value: "wrong-item",
    label: "Wrong item",
  },
  {
    value: "size-issue",
    label: "Size issue",
  },
  {
    value: "color-issue",
    label: "Color issue",
  },
  {
    value: "quality-issue",
    label: "Quality issue",
  },
  {
    value: "not-as-described",
    label: "Not as described",
  },
  {
    value: "changed-mind",
    label: "Changed my mind",
  },
  {
    value: "other",
    label: "Other",
  },
];

const ORDER_RETURN_RESOLUTION_VALUES = ORDER_RETURN_RESOLUTION_OPTIONS.map(
  (option) => option.value,
);

const ORDER_RETURN_REASON_VALUES = ORDER_RETURN_REASON_OPTIONS.map((option) => option.value);

export {
  ORDER_RETURN_REASON_OPTIONS,
  ORDER_RETURN_REASON_VALUES,
  ORDER_RETURN_RESOLUTION_OPTIONS,
  ORDER_RETURN_RESOLUTION_VALUES,
};
