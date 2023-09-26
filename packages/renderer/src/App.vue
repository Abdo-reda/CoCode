<script lang="ts" setup>
import { provide, ref } from 'vue';
import electronService from '/@/services/electronService';
import ToastNotification from '/@/components/shared/ToastNotification.vue';
import {ToastEvent} from '/@/events/keys';
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

const toastShow = ref(false);
const toastText = ref('');
const toastColor = ref('info');

function showToast(text:string, color: string) {
  toastShow.value = true;
  toastText.value = text;
  toastColor.value = color;
}

provide(ToastEvent, {
  showToast,
});

</script>

<template>
  <v-app>
    <v-app-bar
      density="compact"
      height="2em"
      class="toolbar"
    >
      <!-- Temp Nav for testing  -->
      <nav class="mx-4">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/host">Host</router-link> |
        <router-link to="/client">Client</router-link> |
        <v-btn
          variant="text"
          size="small"
          @click="electronService.openNewWindow()"
        >
          New Window
        </v-btn>
      </nav>
    </v-app-bar>

    <!-- <v-navigation-drawer>
       <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-main class="d-flex flex-column align-center justify-center">
      <div class="main-container">
        <router-view> </router-view>
      </div>
    </v-main>

    <toast-notification
      :show="toastShow"
      :color="toastColor"
      :text="toastText"
    >
    </toast-notification>

    <v-footer
      class="app-footer flex-0-0 pa-0"
      :app="true"
    >
      <p class="text-overline font-weight-thin font-italic text-disabled pa-1">
        version-{{ APP_VERSION }}
      </p>
    </v-footer>
  </v-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px; */
}

.main-container {
  height: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* .main-container {
  height: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
} */

nav {
  -webkit-app-region: no-drag;
}

.app-footer {
  border: 1px solid #373737 !important;
  height: 1.5em;
}

.toolbar {
  -webkit-app-region: drag;
  border: 1px solid #373737 !important;
  height: 2em;
}
</style>
