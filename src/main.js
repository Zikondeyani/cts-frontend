import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import moment from 'moment'
import './registerServiceWorker'
import './assets/css/index.tailwind.css'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { db } from './services/db.service';
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import "leaflet/dist/leaflet.css";
import 'tw-elements';
import VuePdf from 'vue3-pdfjs'

const app = createApp(App);

import Vue from 'vue';
import mitt from 'mitt';
const emitter = mitt()

// providers
app.provide('emitter', emitter);
app.provide("Swal", Swal);
moment.locale('en-nz');
app.provide("moment", moment);

app.use(VuePdf);
app.use(createPinia());
app.use(VueGoodTablePlugin);

app.use(router);
app.mount('#app');



/* let currentVersion = null;


async function checkVersion() {
  try {
    const res = await fetch('/version.json?t=' + Date.now());
    console.log('Version fetch response:', res);

    if (!res.ok) {
      console.warn('Could not fetch version.json');
      return;
    }

    const data = await res.json();
    console.log('Version data:', data);

    if (!currentVersion) {
      currentVersion = data.version;
      console.log('Current version set to', currentVersion);
      return;
    }

    if (currentVersion !== data.version) {
      console.log(`Version changed: ${currentVersion} → ${data.version}`);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'New update available',
        text: 'Click to refresh and load the latest version',
        showConfirmButton: true,
        confirmButtonText: 'Refresh',
        timer: 15000,
        timerProgressBar: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload(true);
        }
      });
    }

  } catch (err) {
    console.warn('Version check failed', err);
  }
}
setInterval(checkVersion, 5000);

checkVersion(); */