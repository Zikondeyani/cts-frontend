import axios from "axios";
import { Capacitor } from "@capacitor/core";

const PUSH_TOKEN_KEY = "cts.push.token.v1";
const PUSH_ENDPOINT_WARNING_KEY = "cts.push.endpoint.warned.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function isNativeMobile() {
  return Capacitor.isNativePlatform();
}

function isPushEnabled() {
  return String(process.env.VUE_APP_ENABLE_PUSH_NOTIFICATIONS || "false").toLowerCase() === "true";
}

function getRootApi() {
  return process.env.VUE_APP_ROOT_API || "";
}

function getRegisterEndpoint() {
  return (
    process.env.VUE_APP_PUSH_TOKEN_REGISTER_ENDPOINT ||
    `${getRootApi()}/users/device-token`
  );
}

function getUnregisterEndpoint() {
  return (
    process.env.VUE_APP_PUSH_TOKEN_UNREGISTER_ENDPOINT ||
    `${getRootApi()}/users/device-token/unregister`
  );
}

function getTokenPayload(token) {
  return {
    token,
    platform: Capacitor.getPlatform(),
    appId: process.env.VUE_APP_SERIAL || "cts-mobile",
    appVersion: process.env.VUE_APP_VERSION || "0.0.0",
    userId: JSON.parse(sessionStorage.getItem("USR") || "null")?.id || null,
  };
}

function getAuthHeaders() {
  const jwt = sessionStorage.getItem("JWT");
  if (!jwt) {
    return null;
  }

  return {
    Authorization: `Bearer ${jwt}`,
    "Content-type": "Application/json",
  };
}

function rememberToken(token) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(PUSH_TOKEN_KEY, token);
}

function getRememberedToken() {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(PUSH_TOKEN_KEY);
}

function clearRememberedToken() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(PUSH_TOKEN_KEY);
}

function warnMissingEndpointOnce(error) {
  if (!isBrowser()) {
    return;
  }

  const alreadyWarned = localStorage.getItem(PUSH_ENDPOINT_WARNING_KEY) === "1";
  if (alreadyWarned) {
    return;
  }

  if (error?.response?.status === 404 || error?.response?.status === 405) {
    // Warn once to avoid flooding logs before backend endpoint exists.
    console.warn(
      "Push token endpoint is not available yet. Add backend endpoint for device token registration."
    );
    localStorage.setItem(PUSH_ENDPOINT_WARNING_KEY, "1");
  }
}

async function registerTokenWithBackend(token) {
  const headers = getAuthHeaders();
  if (!headers) {
    return false;
  }

  const endpoint = getRegisterEndpoint();
  if (!endpoint) {
    return false;
  }

  try {
    await axios.post(endpoint, getTokenPayload(token), { headers });
    return true;
  } catch (error) {
    warnMissingEndpointOnce(error);
    console.warn("Failed to register push token", error?.message || error);
    return false;
  }
}

export async function unregisterPushTokenFromBackend() {
  const headers = getAuthHeaders();
  const token = getRememberedToken();

  if (!headers || !token) {
    return;
  }

  const endpoint = getUnregisterEndpoint();
  if (!endpoint) {
    return;
  }

  try {
    await axios.post(
      endpoint,
      {
        token,
        userId: JSON.parse(sessionStorage.getItem("USR") || "null")?.id || null,
      },
      { headers }
    );
  } catch (error) {
    warnMissingEndpointOnce(error);
    console.warn("Failed to unregister push token", error?.message || error);
  }
}

export async function syncRememberedPushToken() {
  const token = getRememberedToken();
  if (!token) {
    return false;
  }

  return registerTokenWithBackend(token);
}

export async function initializePushNotifications(router) {
  if (!isNativeMobile()) {
    return;
  }

  if (!isPushEnabled()) {
    console.info(
      "Push notifications are disabled. Set VUE_APP_ENABLE_PUSH_NOTIFICATIONS=true after Firebase is configured."
    );
    return;
  }

  const { PushNotifications } = await import("@capacitor/push-notifications");

  await PushNotifications.removeAllListeners();

  PushNotifications.addListener("registration", async (token) => {
    const value = token?.value;
    if (!value) {
      return;
    }

    rememberToken(value);
    await registerTokenWithBackend(value);
  });

  PushNotifications.addListener("registrationError", (error) => {
    console.error("Push registration error", error);
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    if (!isBrowser()) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("cts:push:received", {
        detail: notification,
      })
    );
  });

  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    const routePath = action?.notification?.data?.route;
    if (routePath && router) {
      router.push(routePath).catch(() => {});
    }
  });

  try {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== "granted") {
      console.warn("Push permission was not granted.");
      return;
    }

    await PushNotifications.register();
  } catch (error) {
    console.warn(
      "Push registration skipped because Firebase is not configured in this build.",
      error?.message || error
    );
  }
}

export function clearStoredPushToken() {
  clearRememberedToken();
}
