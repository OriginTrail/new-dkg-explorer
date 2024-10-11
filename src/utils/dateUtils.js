/**
 * Transforms a date string into a formatted date string.
 * @param {string} inputDate - The input date string (e.g., "2023-10-13 00:00:00").
 * @returns {string} - The formatted date string (e.g., "Oct 13").
 */
export const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const options = { month: "short", day: "numeric" };

  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};

export const formatDateLocal = (inputDate) => {
  const date = new Date(inputDate);

  return date.toLocaleString();
};

/**
 * Get client side timezone.
 *
 * @returns {(+|-)HH:mm} - Where `HH` is 2 digits hours and `mm` 2 digits minutes.
 * @example
 * // From Indian/Reunion with UTC+4
 * // '+04:00'
 * getTimeZone()
 */
export const getTimeZone = () => {
  const timezoneOffset = new Date().getTimezoneOffset();
  const offset = Math.abs(timezoneOffset);
  const offsetOperator = timezoneOffset < 0 ? "+" : "-";
  const offsetHours = Math.floor(offset / 60)
    .toString()
    .padStart(2, "0");
  const offsetMinutes = Math.floor(offset % 60)
    .toString()
    .padStart(2, "0");

  return `${offsetOperator}${offsetHours}:${offsetMinutes}`;
};
