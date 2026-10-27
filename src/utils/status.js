const successStatuses = new Set(["active", "paid", "delivered", "completed", "approved"]);

const warningStatuses = new Set(["pending", "processing", "requested", "in_transit"]);

const dangerStatuses = new Set(["failed", "cancelled", "canceled", "rejected", "inactive"]);

function getStatusTone(status = "") {
  const normalizedStatus = String(status).trim().toLowerCase();

  if (successStatuses.has(normalizedStatus)) {
    return "success";
  }

  if (warningStatuses.has(normalizedStatus)) {
    return "warning";
  }

  if (dangerStatuses.has(normalizedStatus)) {
    return "danger";
  }

  return "neutral";
}

function formatStatus(status = "") {
  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export { formatStatus, getStatusTone };
