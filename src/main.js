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

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret);
/***/
const app = createApp(App);

import Vue from 'vue';
import mitt from 'mitt';
const emitter = mitt()

app.component('font-awesome-icon', FontAwesomeIcon);
//plugin//providers
app.provide('emitter', emitter);
app.provide("Swal", Swal);



moment.locale('en-nz'); // 'en'
app.provide("moment", moment);


app.use(VuePdf);
app.use(createPinia());
app.use(VueGoodTablePlugin);
/***/
app.use(router);
app.mount('#app');
/***/