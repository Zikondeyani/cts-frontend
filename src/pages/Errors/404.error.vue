<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div
    class="min-h-full pt-16 pb-12 flex flex-col bg-white"
    style="height: 100vh"
  >
    <main
      class="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8"
    >
     
      <div class="py-16">
        <div class="text-center">
          <p
            class="text-sm font-semibold text-gray-600 uppercase tracking-wide"
          >
            404 error
          </p>
          <h1
            class="mt-2 text-4xl font-extrabold text-blue-500 tracking-tight sm:text-5xl"
          >
            Page not found.
          </h1>
          <p class="mt-2 text-base text-gray-500">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div class="mt-6 space-x-5">
            <button
              @click="onClear"
              class="button text-base font-medium text-gray-600 hover:text-gray-500"
              >Clear data and go back <span aria-hidden="true">
                &rarr;</span
              ></button
            >
            <router-link to="/">
              <a
                class="text-base font-medium text-gray-600 hover:text-gray-500"
                >Go back home<span aria-hidden="true"> &rarr;</span></a
              >
            </router-link>
          </div>
        </div>
      </div>
    </main>
    <footer class="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-center space-x-4">
        <router-link to="/support">
          <a href="https://apalis.io" class="text-sm font-medium text-gray-500 hover:text-gray-600"
            >Contact Support</a
          >
        </router-link>
      </nav>
    </footer>
  </div>
</template>
<script setup>
import { inject, reactive, ref } from "vue";
import { useSessionStore } from "../../stores/session.store";
import { useRouter } from "vue-router";
//DECLARATIONS
const system = reactive({
  name: process.env.VUE_APP_NAME,
  short: process.env.VUE_APP_SHORT_NAME,
  version: process.env.VUE_APP_VERSION,
});
const $router = useRouter();
//INJENCTIONS
const moment = inject("moment");
const Swal = inject("Swal");
//VARIABLES
const sessionStore = useSessionStore();
const user = ref(sessionStore.getUser);
const role = ref(sessionStore.getRole);
//FUNCTIONS
function onClear() {
  sessionStore.signOut().then((result) => {
    // redirect
    $router.push({ path: "/portal/signin" });
  });
}
</script>
