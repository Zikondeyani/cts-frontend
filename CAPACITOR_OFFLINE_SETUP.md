Capacitor + Offline Setup (Optional)

This project remains a normal Vue web app.
Capacitor is added as an optional APK build path.

What was added:
- capacitor.config.json
- npm scripts: cap:copy, cap:sync, cap:add:android, cap:open:android, apk:prepare
- offline queue and cache service in src/services/offline/offline-sync.service.js
- startup hook in src/main.js

Offline behavior now:
- GET requests to VUE_APP_ROOT_API are cached after a successful online call.
- If offline/network fails, cached GET data is returned (if available).
- POST/PATCH/PUT/DELETE requests are queued while offline.
- Queued requests are auto-replayed when connection returns.

How to run as web (unchanged):
1. npm run serve

How to build APK with Capacitor:
1. npm install
2. npm run build
3. npm run cap:add:android   (first time only)
4. npm run cap:sync
5. npm run cap:open:android
6. In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)

Quick path after first setup:
1. npm run apk:prepare
2. npm run cap:open:android

Terminal-only emulator workflow (no physical phone):
1. npm run android:emulator:setup   (first time only)
2. npm run android:emulator:deploy

Optional separate commands:
- npm run android:emulator:start
- npm run apk:debug
- npm run android:emulator:install

Phone push notifications (app closed support):
- This app now registers native push tokens on mobile app startup and re-syncs token after login.
- Android requires Firebase config file at android/app/google-services.json.
- Add environment variables if backend endpoints differ:
	- VUE_APP_PUSH_TOKEN_REGISTER_ENDPOINT
	- VUE_APP_PUSH_TOKEN_UNREGISTER_ENDPOINT

Backend contract needed for real phone push:
- POST register endpoint payload:
	- token
	- platform
	- appId
	- appVersion
	- userId
- POST unregister endpoint payload:
	- token
	- userId

How phone pushes should be triggered:
- When backend records activity events (for example planner submits loading plan), backend should:
	1. resolve target users
	2. load their active device tokens
	3. send FCM notification+data payload

Recommended push payload fields:
- title
- body
- data.route (deep-link route inside app)
- data.type (event category)

Important notes:
- Keep VUE_APP_ROOT_API reachable from mobile device/emulator.
- If you use localhost for backend, map it correctly for emulator/device.
- Authentication endpoints are not queued offline by default.
- Queue data persists in localStorage until replay succeeds.

APK login/network checklist:
- APK builds use .env.production by default (via npm run build).
- Do not point VUE_APP_ROOT_API in .env.production to 127.0.0.1 or localhost for phone installs.
- Prefer an HTTPS URL reachable from the device (for example the same endpoint used by web in .env.development).
- After changing env values, rebuild and reinstall APK.

Offline auth behavior:
- First login still requires internet.
- Once signed in, normal data reads/writes can use cache/queue behavior when offline.

Offline-first synchronization behavior:
- App now runs a sync cycle automatically and silently on startup when initial sync is still required, after login, and when network connectivity changes from offline to online.
- Sync cycle order is: upload pending offline changes first, then download full dataset collections for offline use.
- Pending offline mutations are queued with statuses (pending, failed, conflict) and retried automatically.
- GET requests that fail online now fall back to Localbase collections by API resource path.
- Sync UI controls are hidden from end users; synchronization runs in the background.

Practical notes:
- Offline sign-in works for users that have signed in online on this device before (credentials are cached locally as hashes).
- Some advanced server-side filtered reports may still differ offline unless those specific filtered datasets are precomputed locally.
