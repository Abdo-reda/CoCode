<script lang="ts" setup>
import { provide, ref, watch, onBeforeUnmount } from 'vue';
import electronService from '/@/services/electronService';
import ToastNotification from '/@/components/shared/ToastNotification.vue';
import { ToastEvent } from '/@/events/keys';
import { ThemeInstance, useTheme } from 'vuetify';
import { DestroyHost } from '/@/services/hostService';
import Chat from '/@/components/single/Chat.vue';

const theme: ThemeInstance = useTheme();
const APP_VERSION = import.meta.env.VITE_APP_VERSION;
const toastShow = ref(false);
const toastText = ref('');
const toastColor = ref('info');
const drawer = ref(false);

function showToast(text: string, color: string) {
  toastShow.value = true;
  toastText.value = text;
  toastColor.value = color;
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

//shouldn't be a plugin and a global object?
provide(ToastEvent, {
  showToast,
});

onBeforeUnmount(() => {
  DestroyHost();
});

</script>

<template>
  <v-app>
    <v-app-bar class="toolbar" color="transparent">
      <div class="ma-4 toolbar-contents">
        <v-row> 
          <nav class="mx-4 d-flex align-center">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link> |
            <router-link to="/host">Host</router-link> |
            <router-link to="/client">Client</router-link> |
    
            <div>
              <v-btn variant="text" size="small" @click="electronService.openNewWindow()">
                New Window
              </v-btn>
            </div>
          </nav>
        </v-row>
        <v-row justify="end">
            <v-btn @click.stop="drawer = !drawer" variant="text" size="x-small" icon="mdi-message-text"> </v-btn>
        </v-row>
      </div>
    </v-app-bar>





    <v-navigation-drawer v-model="drawer" location="right">
      <chat> </chat>
    </v-navigation-drawer>



    <v-main class="d-flex flex-column align-center justify-center">
      <router-view> </router-view>
    </v-main>

    <toast-notification :show="toastShow" :color="toastColor" :text="toastText">
    </toast-notification>

    <v-footer class="pa-0 d-flex justify-space-between" app>
      <div class="mx-2">
        <p class="text-overline font-italic text-disabled">
          V-{{ APP_VERSION }}
        </p>
      </div>

    </v-footer>
  </v-app>
</template>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px; 
} 
*/

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

.toolbar-contents {
  -webkit-app-region: no-drag;
}

.toolbar {
  -webkit-app-region: drag;
}
</style>
