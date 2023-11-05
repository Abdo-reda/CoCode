<script lang="ts" setup>
import { provide, ref, onBeforeUnmount, inject } from 'vue';
import ToastNotification from '/@/components/shared/ToastNotification.vue';
import { ElectronServiceKey, ToastEventKey } from '/@/utils/symbols/keys';
import type { ThemeInstance} from 'vuetify';
import { useTheme } from 'vuetify';
import { DestroyHost } from '/@/services/hostService';

const electronService = inject(ElectronServiceKey)!;
const theme: ThemeInstance = useTheme();
const APP_VERSION = import.meta.env.VITE_APP_VERSION;
const toastShow = ref(false);
const toastText = ref('');
const toastColor = ref('info');

//TODO: Make this a plugin ... non?
function showToast(text: string, color: string): void {
  toastShow.value = true;
  toastText.value = text;
  toastColor.value = color;
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

//shouldn't be a plugin and a global object?
provide(ToastEventKey, {
  showToast,
});

onBeforeUnmount(() => {
  DestroyHost();
});

</script>

<template>
  <v-app>
    <v-app-bar density="compact" height="2em" class="toolbar">
      <!-- Temp Nav for testing  -->
      <nav class="mx-4">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/host">Host</router-link> |
        <router-link to="/client">Client</router-link> |
        <v-btn variant="text" size="small" @click="electronService.openNewWindow()">
          New Window
        </v-btn>
      </nav>
      <div>

        <!-- <v-switch v-model="darkTheme">
          <template v-slot:label>
            Turn on the progress:
            <v-progress-circular :indeterminate="darkTheme" size="24" class="ms-2"></v-progress-circular>
          </template>
        </v-switch> -->
      </div>

    </v-app-bar>


    <!-- <v-navigation-drawer>
       <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-main class="d-flex flex-column align-center justify-center">
      <div class="main-container">
        <!-- <v-switch @change="toggleTheme()" true-icon="mdi-white-balance-sunny" density="compact"
          false-icon="mdi-moon-waning-crescent" >

        </v-switch> -->

        <router-view> </router-view>
      </div>
    </v-main>

    <toast-notification :show="toastShow" :color="toastColor" :text="toastText">
    </toast-notification>

    <v-footer class="app-footer flex-0-0 pa-0" :app="true">
      <p class="text-overline font-italic text-disabled pa-1">
        V-{{ APP_VERSION }}
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
