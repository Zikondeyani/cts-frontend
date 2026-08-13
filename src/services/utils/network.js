// utils/network.js
export const checkOnlineStatus = async (
  url = `${process.env.VUE_APP_ROOT_API || ""}/users`,
  timeout = 5000
) => {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return false;
  }

  if (!url || typeof fetch === "undefined") {
    return true;
  }

  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    await fetch(url, {
      method: "GET",
      cache: "no-cache",
      signal,
    });

    clearTimeout(timeoutId);
    return true;
  } catch (_error) {
    // If navigator reports online, avoid false negatives from CORS/WebView probe failures.
    return typeof navigator !== "undefined" ? navigator.onLine !== false : false;
  }
};
  