import { defineStore } from "pinia";
import UserService from "../services/api/user.service";
import {
  syncRememberedPushToken,
  unregisterPushTokenFromBackend,
} from "../services/mobile/push-notification.service";

const userService = new UserService();
const OFFLINE_AUTH_KEY = "cts.offline.auth.v1";
const OFFLINE_AUTH_USERS_KEY = "cts.offline.auth.users.v1";

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

const getOfflineAuthSnapshot = () => {
  try {
    const raw = localStorage.getItem(OFFLINE_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
};

const getOfflineAuthUsers = () => {
  try {
    const raw = localStorage.getItem(OFFLINE_AUTH_USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const setOfflineAuthUsers = (users) => {
  try {
    localStorage.setItem(OFFLINE_AUTH_USERS_KEY, JSON.stringify(users));
  } catch (_error) {
    // Ignore write failures.
  }
};

const upsertOfflineAuthUser = (snapshot) => {
  const users = getOfflineAuthUsers();
  const email = normalizeEmail(snapshot?.email);
  const nextUsers = users.filter((user) => normalizeEmail(user?.email) !== email);
  nextUsers.push(snapshot);
  setOfflineAuthUsers(nextUsers);
};

const findOfflineAuthUser = (email) => {
  const users = getOfflineAuthUsers();
  const normalized = normalizeEmail(email);
  return users.find((user) => normalizeEmail(user?.email) === normalized) || null;
};

const isLikelyNetworkError = (error) => {
  if (!error) {
    return true;
  }

  if (error.statusCode === 0 || error.code === "ERR_NETWORK") {
    return true;
  }

  const message = String(error.message || error).toLowerCase();
  return (
    message.includes("network") ||
    message.includes("offline") ||
    message.includes("failed to fetch") ||
    message.includes("load failed") ||
    message.includes("timeout")
  );
};

const hashCredential = async (email, password) => {
  const payload = `${normalizeEmail(email)}::${password || ""}`;

  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.subtle &&
    typeof TextEncoder !== "undefined"
  ) {
    const data = new TextEncoder().encode(payload);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  // Fallback hash for older runtimes that do not expose Web Crypto.
  let hash = 0;
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash << 5) - hash + payload.charCodeAt(i);
    hash |= 0;
  }
  return `fallback-${Math.abs(hash)}`;
};

export const useSessionStore = defineStore({
  id: "session",
  state: () => ({
    token: null,
    user: null,
    role: null,
  }),
  getters: {
    getToken: (state) => {
      if (state.token != null) {
        return state.token;
      } else {
        return sessionStorage.getItem("JWT");
      }
    },
    getUser: (state) => {
      if (state.user != null) {
        return state.user;
      } else {
        return JSON.parse(sessionStorage.getItem("USR"));
      }
    },
    getRole: (state) => {
      if (state.role != null) {
        return state.role;
      } else {
        return JSON.parse(sessionStorage.getItem("RLE"));
      }
    },
  },
  actions: {
    async signIn(credentials) {
      try {
        const result = await userService.signin(credentials);

        if (!result) {
          throw new Error("Sign in failed");
        }

        this.token = result.token.id;
        this.role = result.user.role;
        delete result.user.role;
        this.user = result.user;

        sessionStorage.setItem("JWT", this.token);
        sessionStorage.setItem("RLE", JSON.stringify(this.role));
        sessionStorage.setItem("USR", JSON.stringify(this.user));
        sessionStorage.setItem("FILE", JSON.stringify(this.file));

        const passwordHash = await hashCredential(
          credentials.email,
          credentials.password
        );
        const snapshot = {
          email: normalizeEmail(credentials.email),
          passwordHash,
          token: this.token,
          role: this.role,
          user: this.user,
          cachedAt: new Date().toISOString(),
        };

        localStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(snapshot));
        upsertOfflineAuthUser(snapshot);

        syncRememberedPushToken().catch(() => {});

        return { session: sessionStorage, role: this.role.name };
      } catch (error) {
        if (error?.statusCode === 401) {
          throw new Error("you entered an invalid password or email");
        }

        if (isLikelyNetworkError(error)) {
          const offlineAuth =
            findOfflineAuthUser(credentials.email) || getOfflineAuthSnapshot();
          if (!offlineAuth) {
            throw new Error(
              "No cached offline credentials. Sign in once while online first."
            );
          }

          if (offlineAuth.email !== normalizeEmail(credentials.email)) {
            throw new Error(
              "Offline sign in failed for this email. Use the last online account."
            );
          }

          const inputHash = await hashCredential(
            credentials.email,
            credentials.password
          );

          if (inputHash !== offlineAuth.passwordHash) {
            throw new Error("you entered an invalid password or email");
          }

          this.token = offlineAuth.token || `offline-${Date.now()}`;
          this.role = offlineAuth.role || null;
          this.user = offlineAuth.user || null;

          sessionStorage.setItem("JWT", this.token);
          sessionStorage.setItem("RLE", JSON.stringify(this.role));
          sessionStorage.setItem("USR", JSON.stringify(this.user));
          sessionStorage.setItem("FILE", JSON.stringify(this.file));

          return {
            session: sessionStorage,
            role: this.role?.name,
            offline: true,
          };
        }

        throw error?.message || "Sign in failed";
      }
    },
    async signUp(data) {
      return await userService
        .signup(data)
        .then((result) => {
          if (result) {
            //store
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 401:
              throw new Error("you entered an invalid password or email");
              break;
            case 409:
              throw new Error(
                "this email is already in use , please enter another one "
              );
              break;
            default:
              throw error.message;
          }
        });
    },

    async signOut() {
      try {
        await unregisterPushTokenFromBackend();
        await userService.signOut(); // hit backend signout endpoint
      } catch (error) {
        if (error === 401) {
          console.warn("Session already expired.");
        } else {
          console.error("Error during sign out:", error);
        }
      } finally {
        // Always clear local session
        sessionStorage.removeItem("JWT");
        sessionStorage.removeItem("RLE");
        sessionStorage.removeItem("USR");
        sessionStorage.clear();
      }
    },

    async activeusers() {
      return await userService
        .activeusers()
        .then((result) => {
          
          return result;

        })
        .catch((error) => {
          switch (error) {
            case 401:
              throw new Error(
                "invalid session token please sign in to refresh your session"
              );
              break;
            default:
              throw error.message;
          }
        });
    },

    async check() {
      return await userService
        .ping()
        .then((result) => {
          if (result) {
            this.role = result.role;
            delete result.role;
            this.user = result;
            //session
            sessionStorage.setItem("RLE", JSON.stringify(this.role));
            sessionStorage.setItem("USR", JSON.stringify(this.user));
            //store
            return this.role.name;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 401:
              throw new Error(
                "invalid session token please sign in to refresh your session"
              );
              break;
            default:
              throw error.message;
          }
        });
    },
  },
});
