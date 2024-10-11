import DOMPurify from "isomorphic-dompurify";
export const clearHtmlText = (input) => {
  return DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
};

export function camelToTitleCase(str) {
  const result = str
    .replace(/([a-z])([A-Z0-9])|([A-Z0-9])([a-z])/g, "$1$3$2$4")
    .replace(/^./, (s) => s.toUpperCase());

  return result;
}

export function removeQuotes(str) {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  } else {
    return str;
  }
}

export function sluggify(input) {
  if (!input) return;
  return input.replace(/\s+/g, "_").replace(/[^\w_]/g, "");
}

export function isValidJson(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}
