/**
 * Sri Lankan Localized Date helpers.
 */
export function formatLocalDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-LK", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Returns beginning/end range of current month in UTC.
 */
export function getCurrentMonthRange() {
  const date = new Date();
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}
