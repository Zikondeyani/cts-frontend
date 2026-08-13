import axios from "axios";
import {
  getDataOffline,
  getDataOfflineById,
  replaceCollectionOffline,
} from "../localbase";

const OFFLINE_QUEUE_KEY = "cts.offline.queue.v1";
const OFFLINE_CACHE_KEY = "cts.offline.cache.v1";
const OFFLINE_SYNC_META_KEY = "cts.offline.meta.v1";
const OFFLINE_SYNC_STATE_EVENT = "cts.offline.sync.state";
const OFFLINE_QUEUE_MAX = 1000;
const OFFLINE_CACHE_MAX = 300;
const BOOTSTRAP_FETCH_LIMIT = 50000;
const MIN_SYNC_INTERVAL_MS = 45000;

let isInitialized = false;
let isSyncRunning = false;
let lastConnectivityStatus = null;
let lastSyncRunAt = 0;

const OFFLINE_RESOURCES = [
  "/roles",
  "/users",
  "/units",
  "/districts",
  "/organisations",
  "/projects",
  "/warehouses",
  "/fdps",
  "/truck-drivers",
  "/transporters",
  "/commodity-types",
  "/commodities",
  "/disasters",
  "/files",
  "/activities",
  "/feedbacks",
  "/faq",
  "/mailinggroups",
  "/mailinglists",
  "/logs",
  "/dispatches",
  "/receipts",
  "/requisitions",
  "/loading-plans",
  "/actionrequestors",
  "/commodity-inventories",
  "/instructed-commodities",
  "/instructed-dispatches",
  "/instructed-receipts",
  "/instructions",
  "/requested-commodities",
  "/dispatched-commodities",
  "/received-commodities",
  "/donations",
  "/donated-commodities",
  "/commoditytransfers",
  "/commoditytransferreceipts",
  "/warehousedispatches",
  "/warehousereceipts",
  "/warehouserequisitions",
];

const RESOURCE_COLLECTION_ALIASES = {
  "commodity-types": "commoditytypes",
  "commodity-inventories": "commodityinventories",
  "loading-plans": "loading-plans",
  "truck-drivers": "drivers",
  "dispatched-commodities": "dispatched-commodities",
  "requested-commodities": "requested-commodities",
  "received-commodities": "received-commodities",
};

const syncState = {
  isSyncing: false,
  phase: "idle",
  reason: "",
  completed: 0,
  total: OFFLINE_RESOURCES.length,
  pendingChanges: 0,
  lastSyncAt: null,
  lastError: null,
  failedCollections: [],
};

const AUTH_PATHS = [
  "/users/sign-in",
  "/users/sign-up",
  "/users/forgot-password",
  "/users/reset-password",
];

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
}

function readJson(key, fallback) {
  if (!isBrowser()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  return safeParse(raw, fallback);
}

function writeJson(key, value) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function getSyncMeta() {
  return readJson(OFFLINE_SYNC_META_KEY, {
    initialSyncComplete: false,
    syncedAt: null,
    collections: {},
  });
}

function setSyncMeta(meta) {
  writeJson(OFFLINE_SYNC_META_KEY, meta);
}

function mergeOfflineCollectionById(collection, existingRows, nextRows) {
  const map = new Map();

  for (const row of existingRows || []) {
    if (row && row.id != null) {
      map.set(String(row.id), row);
    }
  }

  for (const row of nextRows || []) {
    if (row && row.id != null) {
      map.set(String(row.id), row);
    }
  }

  return Array.from(map.values());
}

function emitSyncState() {
  syncState.pendingChanges = getPendingQueueCount();

  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(OFFLINE_SYNC_STATE_EVENT, {
      detail: { ...syncState },
    })
  );
}

function setSyncState(patch) {
  Object.assign(syncState, patch || {});
  emitSyncState();
}

function getRootApi() {
  return process.env.VUE_APP_ROOT_API || "";
}

function isApiUrl(url) {
  const rootApi = getRootApi();
  if (!url || !rootApi) {
    return false;
  }

  return url.startsWith(rootApi);
}

function isAuthRequest(url) {
  if (!url) {
    return false;
  }

  return AUTH_PATHS.some((path) => url.includes(path));
}

function shouldHandleGet(config) {
  const method = (config?.method || "get").toLowerCase();
  return method === "get" && isApiUrl(config?.url);
}

function shouldQueueMutation(config) {
  const method = (config?.method || "get").toLowerCase();
  if (!["post", "put", "patch", "delete"].includes(method)) {
    return false;
  }

  return isApiUrl(config?.url) && !isAuthRequest(config?.url);
}

function buildCacheKey(config) {
  const url = config?.url || "";
  const params = config?.params || {};

  return JSON.stringify({
    method: "get",
    url,
    params,
  });
}

function getHeaderValue(headers, key) {
  if (!headers) {
    return undefined;
  }

  const entries = Object.entries(headers);
  const found = entries.find(([name]) => name.toLowerCase() === key.toLowerCase());
  return found ? found[1] : undefined;
}

function getMinimalHeaders(config) {
  const headers = config?.headers || {};
  const authorization = getHeaderValue(headers, "Authorization");
  const contentType = getHeaderValue(headers, "Content-Type") || getHeaderValue(headers, "Content-type");

  const minimalHeaders = {};
  if (authorization) {
    minimalHeaders.Authorization = authorization;
  }
  if (contentType) {
    minimalHeaders["Content-Type"] = contentType;
  }

  return minimalHeaders;
}

function getQueue() {
  return readJson(OFFLINE_QUEUE_KEY, []);
}

function setQueue(queue) {
  writeJson(OFFLINE_QUEUE_KEY, queue);
}

function enqueueMutation(config) {
  const queue = getQueue();

  const item = {
    id: "q-" + Date.now() + "-" + Math.random().toString(16).slice(2),
    createdAt: new Date().toISOString(),
    status: "pending",
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
    request: {
      method: (config.method || "post").toLowerCase(),
      url: config.url,
      data: config.data,
      params: config.params || {},
      headers: getMinimalHeaders(config),
    },
  };

  queue.push(item);

  if (queue.length > OFFLINE_QUEUE_MAX) {
    queue.splice(0, queue.length - OFFLINE_QUEUE_MAX);
  }

  setQueue(queue);
  emitSyncState();
  return item;
}

function getPendingQueueCount() {
  return getQueue().filter((item) =>
    ["pending", "failed", "conflict", "syncing"].includes(item.status)
  ).length;
}

function getCacheMap() {
  return readJson(OFFLINE_CACHE_KEY, {});
}

function setCacheMap(cacheMap) {
  writeJson(OFFLINE_CACHE_KEY, cacheMap);
}

function setCachedResponse(config, response) {
  const key = buildCacheKey(config);
  const cacheMap = getCacheMap();

  cacheMap[key] = {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers || {},
    updatedAt: new Date().toISOString(),
    url: config.url,
  };

  const entries = Object.entries(cacheMap);
  if (entries.length > OFFLINE_CACHE_MAX) {
    entries.sort((a, b) => {
      const aTime = new Date(a[1].updatedAt).getTime();
      const bTime = new Date(b[1].updatedAt).getTime();
      return aTime - bTime;
    });

    const removeCount = entries.length - OFFLINE_CACHE_MAX;
    for (let index = 0; index < removeCount; index += 1) {
      delete cacheMap[entries[index][0]];
    }
  }

  setCacheMap(cacheMap);
}

function getCachedResponse(config) {
  const key = buildCacheKey(config);
  const cacheMap = getCacheMap();
  return cacheMap[key];
}

function isNetworkError(error) {
  return !!error && !error.response;
}

function isOfflineQueuedError(error) {
  return !!error && error.isOfflineQueued === true;
}

function createQueuedResponse(config, queuedItem) {
  return {
    data: {
      queuedOffline: true,
      queueId: queuedItem.id,
      queuedAt: queuedItem.createdAt,
    },
    status: 202,
    statusText: "Queued Offline",
    headers: {},
    config,
    request: null,
  };
}

function isCurrentlyOffline() {
  if (!isBrowser()) {
    return false;
  }

  return navigator.onLine === false;
}

function getAuthHeaders() {
  const token = sessionStorage.getItem("JWT");
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-type": "Application/json",
  };
}

function normalizeResourceKey(resourcePath) {
  const raw = (resourcePath || "").replace(/^\//, "").trim();
  if (!raw) {
    return "";
  }

  return RESOURCE_COLLECTION_ALIASES[raw] || raw;
}

function resolveApiRequestInfo(url) {
  const rootApi = getRootApi();
  if (!rootApi || !url) {
    return null;
  }

  try {
    const fullUrl = new URL(url, rootApi);
    const rootUrl = new URL(rootApi);

    let pathname = fullUrl.pathname;
    const rootPath = rootUrl.pathname.replace(/\/+$/, "");

    if (rootPath && pathname.startsWith(rootPath)) {
      pathname = pathname.slice(rootPath.length);
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return null;
    }

    const resource = segments[0];
    const second = segments[1] || null;
    const isCount = second === "count";

    return {
      resource,
      id: !isCount && second ? second : null,
      isCount,
      collection: normalizeResourceKey(resource),
    };
  } catch (_error) {
    return null;
  }
}

async function buildLocalDbFallbackResponse(config) {
  const info = resolveApiRequestInfo(config?.url);
  if (!info || !info.collection) {
    return null;
  }

  if (info.isCount) {
    const rows = await getDataOffline(info.collection);
    return {
      data: { count: rows.length },
      status: 200,
      statusText: "OK (offline count)",
      headers: {},
      config,
      request: null,
      fromOfflineDb: true,
    };
  }

  if (info.id) {
    const row = await getDataOfflineById(info.collection, info.id);
    if (row) {
      return {
        data: row,
        status: 200,
        statusText: "OK (offline item)",
        headers: {},
        config,
        request: null,
        fromOfflineDb: true,
      };
    }

    return null;
  }

  const rows = await getDataOffline(info.collection);
  return {
    data: rows,
    status: 200,
    statusText: "OK (offline list)",
    headers: {},
    config,
    request: null,
    fromOfflineDb: true,
  };
}

async function bootstrapOfflineDataset(reason = "startup") {
  if (isCurrentlyOffline()) {
    return;
  }

  const headers = getAuthHeaders();
  if (!headers.Authorization) {
    return;
  }

  setSyncState({
    isSyncing: true,
    phase: "downloading",
    reason,
    completed: 0,
    total: OFFLINE_RESOURCES.length,
    lastError: null,
    failedCollections: [],
  });

  const meta = getSyncMeta();
  const failedCollections = [];
  const canUseIncremental =
    meta.initialSyncComplete &&
    !!meta.syncedAt &&
    (reason === "network-restored" || reason === "startup");

  for (let index = 0; index < OFFLINE_RESOURCES.length; index += 1) {
    const path = OFFLINE_RESOURCES[index];
    const collection = normalizeResourceKey(path);

    try {
      const defaultFilter = { limit: BOOTSTRAP_FETCH_LIMIT };
      const incrementalFilter = {
        where: {
          or: [
            { updatedAt: { gt: meta.syncedAt } },
            { createdAt: { gt: meta.syncedAt } },
          ],
        },
        limit: BOOTSTRAP_FETCH_LIMIT,
      };

      const filterObject = canUseIncremental ? incrementalFilter : defaultFilter;
      const filter = encodeURIComponent(JSON.stringify(filterObject));

      let response;
      try {
        response = await axios.get(`${getRootApi()}${path}?filter=${filter}`, {
          headers,
          __skipOfflineInterceptors: true,
        });
      } catch (incrementalError) {
        if (!canUseIncremental) {
          throw incrementalError;
        }

        // Some resources may not support updatedAt/createdAt filters; fall back to full download.
        const fallbackFilter = encodeURIComponent(JSON.stringify(defaultFilter));
        response = await axios.get(
          `${getRootApi()}${path}?filter=${fallbackFilter}`,
          {
            headers,
            __skipOfflineInterceptors: true,
          }
        );
      }

      const incomingData = Array.isArray(response.data)
        ? response.data
        : response.data
        ? [response.data]
        : [];

      if (canUseIncremental) {
        const existingRows = await getDataOffline(collection);
        const merged = mergeOfflineCollectionById(
          collection,
          existingRows,
          incomingData
        );
        await replaceCollectionOffline(collection, merged);
      } else {
        await replaceCollectionOffline(collection, incomingData);
      }

      meta.collections[collection] = {
        count: canUseIncremental
          ? (await getDataOffline(collection)).length
          : incomingData.length,
        syncedAt: new Date().toISOString(),
      };
    } catch (error) {
      failedCollections.push({
        collection,
        message: error?.message || "Failed to sync collection",
      });
    }

    setSyncState({
      completed: index + 1,
      failedCollections,
    });
  }

  const syncedAt = new Date().toISOString();
  meta.initialSyncComplete = failedCollections.length === 0;
  meta.syncedAt = syncedAt;
  setSyncMeta(meta);

  setSyncState({
    isSyncing: false,
    phase: "idle",
    completed: OFFLINE_RESOURCES.length,
    total: OFFLINE_RESOURCES.length,
    lastSyncAt: syncedAt,
    lastError:
      failedCollections.length > 0
        ? `${failedCollections.length} collection(s) failed to sync`
        : null,
    failedCollections,
  });
}

async function replayQueue() {
  if (isSyncRunning) {
    return;
  }

  if (isCurrentlyOffline()) {
    return;
  }

  isSyncRunning = true;

  try {
    const queue = getQueue();
    if (queue.length === 0) {
      return;
    }

    const updatedQueue = [...queue];

    for (let index = 0; index < updatedQueue.length; index += 1) {
      const item = updatedQueue[index];

      if (!["pending", "failed", "conflict", "syncing"].includes(item.status)) {
        continue;
      }

      item.status = "syncing";
      item.attempts = (item.attempts || 0) + 1;
      item.lastAttemptAt = new Date().toISOString();
      item.lastError = null;
      setQueue(updatedQueue);
      emitSyncState();

      try {
        await axios({
          method: item.request.method,
          url: item.request.url,
          data: item.request.data,
          params: item.request.params,
          headers: item.request.headers,
          __skipOfflineInterceptors: true,
        });

        item.status = "synced";
      } catch (error) {
        if (isNetworkError(error)) {
          item.status = "pending";
          item.lastError = "Network unavailable while syncing queued change";
          setQueue(updatedQueue);
          emitSyncState();
          break;
        }

        if (error?.response?.status === 409) {
          item.status = "conflict";
          item.lastError = "Conflict detected with server version";
        } else {
          item.status = "failed";
          item.lastError = error?.message || "Server rejected queued change";
        }
      }

      setQueue(updatedQueue);
      emitSyncState();
    }

    const remaining = updatedQueue.filter((item) =>
      ["pending", "failed", "conflict", "syncing"].includes(item.status)
    );
    setQueue(remaining);
    emitSyncState();
  } finally {
    isSyncRunning = false;
  }
}

function installAxiosOfflineInterceptors() {
  axios.interceptors.request.use((config) => {
    if (config.__skipOfflineInterceptors) {
      return config;
    }

    if (shouldQueueMutation(config) && isCurrentlyOffline()) {
      const queuedItem = enqueueMutation(config);
      const error = new Error("Request queued while offline");
      error.isOfflineQueued = true;
      error.config = config;
      error.queuedItem = queuedItem;
      return Promise.reject(error);
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      if (shouldHandleGet(response.config)) {
        setCachedResponse(response.config, response);
      }

      return response;
    },
    (error) => {
      if (isOfflineQueuedError(error)) {
        return Promise.resolve(createQueuedResponse(error.config, error.queuedItem));
      }

      const config = error?.config;
      if (!config || config.__skipOfflineInterceptors) {
        return Promise.reject(error);
      }

      if (shouldQueueMutation(config) && isNetworkError(error)) {
        const queuedItem = enqueueMutation(config);
        return Promise.resolve(createQueuedResponse(config, queuedItem));
      }

      if (shouldHandleGet(config) && isNetworkError(error)) {
        return buildLocalDbFallbackResponse(config).then((localResponse) => {
          if (localResponse) {
            return localResponse;
          }

        const cached = getCachedResponse(config);
        if (cached) {
            return {
            data: cached.data,
            status: cached.status || 200,
            statusText: cached.statusText || "OK (cached)",
            headers: cached.headers || {},
            config,
            request: null,
            fromOfflineCache: true,
            };
          }

          return Promise.reject(error);
        });
      }

      return Promise.reject(error);
    }
  );
}

function installOnlineListeners() {
  if (!isBrowser()) {
    return;
  }

  const handleConnectivity = (connected, reason) => {
    if (lastConnectivityStatus === connected) {
      return;
    }

    lastConnectivityStatus = connected;

    if (connected) {
      runOfflineSyncCycle(reason);
    } else {
      setSyncState({
        phase: "offline",
        reason,
        isSyncing: false,
        lastError: null,
      });
    }
  };

  window.addEventListener("online", () => {
    handleConnectivity(true, "network-restored");
  });

  window.addEventListener("offline", () => {
    handleConnectivity(false, "network-lost");
  });

  // Optional: use Capacitor network events when running inside app shell.
  import("@capacitor/network")
    .then(({ Network }) => {
      Network.addListener("networkStatusChange", (status) => {
        handleConnectivity(!!status.connected, "network-restored");
      });
    })
    .catch(() => {
      // Ignore when Capacitor plugin is not installed yet (web-only mode).
    });
}

async function runOfflineSyncCycle(reason = "manual") {
  if (syncState.isSyncing || isSyncRunning) {
    return;
  }

  const now = Date.now();
  const meta = getSyncMeta();
  const pendingChanges = getPendingQueueCount();

  if (reason === "startup" && meta.initialSyncComplete && pendingChanges === 0) {
    return;
  }

  if (
    reason === "network-restored" &&
    now - lastSyncRunAt < MIN_SYNC_INTERVAL_MS
  ) {
    return;
  }

  if (isCurrentlyOffline()) {
    setSyncState({
      phase: "offline",
      reason,
      lastError: "Device is offline",
    });
    return;
  }

  lastSyncRunAt = now;

  setSyncState({
    isSyncing: true,
    phase: "uploading",
    reason,
    lastError: null,
  });

  try {
    await replayQueue();
    await bootstrapOfflineDataset(reason);
  } catch (error) {
    setSyncState({
      isSyncing: false,
      phase: "idle",
      lastError: error?.message || "Offline sync cycle failed",
    });
  }
}

export function initializeOfflineSync() {
  if (isInitialized) {
    return;
  }

  installAxiosOfflineInterceptors();
  installOnlineListeners();
  lastConnectivityStatus = !isCurrentlyOffline();
  const meta = getSyncMeta();
  setSyncState({
    lastSyncAt: meta.syncedAt || null,
    pendingChanges: getPendingQueueCount(),
    total: OFFLINE_RESOURCES.length,
  });

  if (!isCurrentlyOffline() && sessionStorage.getItem("JWT")) {
    runOfflineSyncCycle("startup");
  } else {
    emitSyncState();
  }

  isInitialized = true;
}

export function getOfflineQueueCount() {
  return getQueue().length;
}

export function syncOfflineQueueNow() {
  return runOfflineSyncCycle("manual");
}

export function runFullOfflineSync(reason = "manual") {
  return runOfflineSyncCycle(reason);
}

export function getOfflineSyncState() {
  return { ...syncState, pendingChanges: getPendingQueueCount() };
}

export function subscribeOfflineSyncState(callback) {
  if (!isBrowser() || typeof callback !== "function") {
    return () => {};
  }

  const handler = (event) => {
    callback(event.detail || getOfflineSyncState());
  };

  window.addEventListener(OFFLINE_SYNC_STATE_EVENT, handler);
  callback(getOfflineSyncState());

  return () => {
    window.removeEventListener(OFFLINE_SYNC_STATE_EVENT, handler);
  };
}

export function isInitialOfflineSyncComplete() {
  return !!getSyncMeta().initialSyncComplete;
}
