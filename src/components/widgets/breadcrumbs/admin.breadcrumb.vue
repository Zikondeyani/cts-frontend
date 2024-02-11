<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div>
    <nav class="sm:hidden" aria-label="Back">
      <router-link :to="breadcrumbs.slice(-2)[0].href">
        <a
          class="
            flex
            items-center
            text-sm
            font-medium
            text-white
            hover:text-blue-700
          "
        >
          <ChevronLeftIcon
            class="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
          Back
        </a>
      </router-link>
    </nav>
    <nav class="hidden sm:flex" aria-label="Breadcrumb">
      <ol role="list" class="flex items-center space-x-1">
        <!-- <li>
          <div class="flex">
          
              <router-link :to="{ name: 'admin-dashboard' }">
                <a class="text-sm font-medium text-blue-500 hover:text-blue-700"
                  >Home</a
                >
              </router-link>
          </div>
        </li> -->
        <li v-for="(breadcrumb, breadcrumbIndx) in breadcrumbs" :key="breadcrumb.name">
          <div class="flex items-center">
        
            <svg
            v-show="breadcrumbIndx > 0"
              class="flex-shrink-0 h-5 w-5 text-blue-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
            <router-link :to="breadcrumb.href">
              <a
                class="
                  ml-1
                  text-sm
                  font-medium
                  text-white
                  hover:text-blue-300
                "
                >{{ breadcrumb.name }}</a
              >
            </router-link>
          </div>
        </li>
      </ol>
    </nav>
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
