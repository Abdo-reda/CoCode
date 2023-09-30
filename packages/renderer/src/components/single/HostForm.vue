<script lang="ts" setup>
import electronService from '/@/services/electronService';
import { ToastEvent } from '/@/events/keys';
import { useRouter } from 'vue-router';
import { ref, inject } from 'vue';
// import { hostServer } from '/@/services/webSocketService';
import { GetHostWebSockets, GetHostWebRTC } from '/@/services/hostService';

/* TODO:
  - Does the host have a freaking name? should there be a form for that.... 
  - Later, there could be a settings page for the host, what are the allowed languages, what are the allowed views and so on, to manage the room settinsg basically.
  - Implement local hosting ... use microsockets :) <3
*/

const router = useRouter();
const isLocalHosting = ref(false);
const isOnlineHosting = ref(false);

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const toastEvent: any = inject(ToastEvent);
//I will make it typesafe later .. https://logaretm.com/blog/type-safe-provide-inject/
//https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject


/**
 * Host the server for local connections, uses websockets.
 */
function hostLocal() {
  isLocalHosting.value = true;
  toastEvent.showToast('Hosting Local Server...', 'info');
  // const hostPeer = GetHostWebSockets();
  // hostPeer.hostRoom().then((_) => hostSuccessHandler()).catch( (err) => hostErrorHandler(err));
}


/**
 * Host the server for online connections, uses webRTC.
 */
function hostOnline() {
  isOnlineHosting.value = true;
  toastEvent.showToast('Hosting Online Server...', 'info');
  const hostPeer = GetHostWebRTC();
  hostPeer.hostRoom().then((_) => hostSuccessHandler()).catch( (err) => hostErrorHandler(err));
}


function hostSuccessHandler() {
  isLocalHosting.value = isOnlineHosting.value = false;
  toastEvent.showToast('Hosted Online Server Successfully!', 'success');
  router.push({ path: 'host' });
}


function hostErrorHandler(err: Error) {
  isLocalHosting.value = isOnlineHosting.value = false;
  toastEvent.showToast('Failed to Host Online Server!', 'error');
  console.log(err);
}

</script>


<template>
  <!-- @click="host()" -->
  <v-btn v-if="electronService.isDesktop" id="host-menu-activator" color="primary" class="text-background my-4"
    prepend-icon="mdi-server-plus">
    Host
  </v-btn>

  <v-menu activator="#host-menu-activator" :close-on-content-click="false" location="bottom center" offset="10">
    <v-card class="button-popup" elevation="16" :loading="isLocalHosting || isOnlineHosting">
      <div class="ma-2">
        <div class="text-center ma-4">
          <p class="font-italic text-primary">Choose your hosting method!</p>
        </div>
        
        <div class="d-flex align-center justify-center">
          <v-btn @click="hostOnline()" :loading="isOnlineHosting" color="primary" :disabled="isLocalHosting" class="text-background ma-2" variant="outlined" prepend-icon="mdi-wan">
            Online
          </v-btn>
          <v-btn @click="hostLocal()" :loading="isLocalHosting" color="primary" :disabled="isOnlineHosting" class="text-background ma-2" variant="outlined" prepend-icon="mdi-lan">
            Local
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-menu>

  <!-- <v-menu activator="#host-menu-activator" :close-on-content-click="false" location="bottom center" offset="10">
    <v-card class="button-popup" elevation="16" :loading="true">
      <v-card-item>
          <p class="font-italic text-primary">Choose your hosting method!</p>
      </v-card-item>
      <v-card-actions>
        <div class="d-flex align-center justify-space-between">
          <v-btn color="primary" class="text-background ma-2" variant="outlined" prepend-icon="mdi-wan">
            Online
          </v-btn>
          <v-btn color="primary" class="text-background ma-2" variant="outlined" prepend-icon="mdi-lan">
            Local
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-menu> -->

  <v-btn v-if="!electronService.isDesktop" id="desktop-menu-activator" variant="tonal" class="text-primary-darken-1 my-4"
    prepend-icon="mdi-server-plus">
    Host
  </v-btn>

  <v-menu activator="#desktop-menu-activator" :close-on-content-click="false" location="bottom center" offset="10">
    <v-card class="button-popup" elevation="16">
      <div class="ma-4">
        <div class="text-center">
          <p class="font-italic text-primary">Hosting can only be done on the Desktop App!</p>
        </div>

        <div class="d-flex align-center justify-center ma-1">
          <v-btn variant="outlined" color="primary-darken-1" class="ma-1" icon="mdi-microsoft-windows"
            size="large"></v-btn>
          <v-btn variant="outlined" color="primary-darken-1" class="ma-1" icon="mdi-linux" size="large"></v-btn>
          <v-btn variant="outlined" color="primary-darken-1" class="ma-1" icon="mdi-apple" size="large"></v-btn>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

