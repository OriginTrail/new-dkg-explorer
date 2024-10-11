export const isMobile = () => {
  return document.body.clientWidth <= 480;
};
export const isTablet = () => {
  return document.body.clientWidth <= 1280 && document.body.clientWidth > 480;
};

export const isNotDesktop = () => {
  return isTablet() || isMobile();
};

export const isBrave = async () => {
  return (navigator.brave && (await navigator.brave.isBrave())) || false;
};

export const goBackInHistory = () => {
  if (history.length <= 1 || document.referrer === "") {
    window.open("/", "_self");
  } else {
    history.back();
  }
};

export const isSmallDevice = () => {
  return document.body.clientWidth <= 767;
};

export const isTouchCapableDevice = () => {
  return "ontouchstart" in window;
};

export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const setUrlArgument = (key, value) => {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState(null, "", url.toString());
};

export const removeUrlArgument = (key) => {
  const url = new URL(window.location);
  url.searchParams.delete(key);
  window.history.pushState(null, "", url.toString());
};

export const getURLParams = (singleParamName = null, { url } = {}) => {
  const parsedUrl = new URL(url ?? window.location);
  if (singleParamName) {
    return parsedUrl.searchParams.get(singleParamName);
  }
  return Object.fromEntries(parsedUrl.searchParams.entries());
};
