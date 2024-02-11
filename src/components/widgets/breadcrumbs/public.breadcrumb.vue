<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div>
    <div>
      <nav class="sm:hidden" aria-label="Back">
        <router-link :to="breadcrumbs.slice(-2)[0].href">
          <a
            class="
              flex
              items-center
              text-sm
              font-medium
              text-gray-500
              hover:text-gray-700
            "
          >
            <ChevronLeftIcon
              class="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Back
          </a>
        </router-link>
      </nav>
      <nav class="hidden sm:flex ml-1" aria-label="Breadcrumb">
        <ol role="list" class="flex items-center space-x-4">
          <li
            v-for="(breadcrumb, breadcrumbIndx) in breadcrumbs"
            :key="breadcrumb.name"
          >
            <div class="flex items-center">
              <svg
                v-show="breadcrumbIndx > 0"
                class="flex-shrink-0 h-5 w-5 text-gray-300 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <router-link :to="breadcrumb.href">
                <a
                  class="text-sm font-medium text-gray-500 hover:text-gray-700"
                  :aria-current="breadcrumb.current ? 'page' : undefined"
                  >{{ breadcrumb.name }}</a
                >
              </router-link>
            </div>
          </li>
        </ol>
      </nav>
    </div>
    <div class="mt-2 md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2
          class="
            text-2xl
            font-bold
            leading-7
            text-gray-900
            sm:text-3xl sm:truncate
          "
        >
          {{ breadcrumbs.slice(-1)[0].name }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, toRefs } from "vue";
import {
  ChevronRightIcon,
  HomeIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/solid";
//DECLARATIONS
const props = defineProps({
  breadcrumbs: {
    type: Array,
  },
});
//VARIABLES
const { breadcrumbs } = toRefs(props);
</script>
