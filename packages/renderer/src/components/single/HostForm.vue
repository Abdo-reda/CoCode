<script lang="ts" setup>
import electronService from '/@/services/electronService';
import { ToastEvent } from '/@/events/keys';
import { useRouter } from 'vue-router';
import { ref, inject } from 'vue';
// import { hostServer } from '/@/services/webSocketService';

const router = useRouter();
const hostPopup = ref(false);

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const toastEvent: any = inject(ToastEvent);
//I will make it typesafe later .. https://logaretm.com/blog/type-safe-provide-inject/
//https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject

function host() {
  // hostServer();
  toastEvent.showToast('Hosting Server...', 'info');
  router.push({ path: 'host' });
}

</script>


<template>
  <v-btn
    v-if="electronService.isDesktop"
    color="primary my-4"
    class="text-background"
    prepend-icon="mdi-server-plus"
    @click="host()"
  >
    Host
  </v-btn>

  <v-btn
    v-else
    variant="tonal"
    class="text-primary-darken-1 my-4"
    prepend-icon="mdi-server-plus"
    @click="hostPopup = !hostPopup;"
  >
    Host
  </v-btn>
  <v-fade-transition :hide-on-leave="true">
    <v-card
      v-if="hostPopup"
      class="button-popup"
      elevation="16"
    >
      <div class="ma-4">
        <div class="text-center">
          <div class="font-italic text-primary">Hosting can only be done on the Desktop App!</div>
        </div>

        <div class="d-flex align-center justify-center ma-1">
          <v-btn
            variant="outlined"
            color="primary-darken-1"
            class="ma-1"
            icon="mdi-microsoft-windows"
            size="large"
          ></v-btn>
          <v-btn
            variant="outlined"
            color="primary-darken-1"
            class="ma-1"
            icon="mdi-linux"
            size="large"
          ></v-btn>
          <v-btn
            variant="outlined"
            color="primary-darken-1"
            class="ma-1"
            icon="mdi-apple"
            size="large"
          ></v-btn>
        </div>
      </div>
    </v-card>
  </v-fade-transition>
</template>

