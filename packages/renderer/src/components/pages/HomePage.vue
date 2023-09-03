<script lang="ts" setup>
import ClientForm from '/@/components/single/ClientForm.vue';
import { ref, inject } from 'vue';
import electronService from '/@/services/electronService';
import { hostServer } from '/@/services/webSocketService';
import { useRouter } from 'vue-router';
import { ToastEvent } from '/@/events/keys';

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const toastEvent: any = inject(ToastEvent); //I will make it typesafe later .. https://logaretm.com/blog/type-safe-provide-inject/
const router = useRouter();
const hostPopup = ref(false);
const clientPopup = ref(false);

function host() {
  hostServer();
  toastEvent.showToast('Hosting Server...', 'info');
  router.push({ path: 'host' });
}


function isMobile(): boolean {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}


</script>

<template>
  <div class="home-page">
    <v-card class="my-2">
      <!-- Logo -->
      <!-- <div>
                <code>CO_CODE</code>
                <img alt="Vue logo" src="../assets/logo.svg" width="150" />
            </div> -->

      <v-card-item>
        <v-card-title> <code> Co_Code </code> </v-card-title>
      </v-card-item>

      <v-card-text>
        <code
          class="text-medium-emphasis font-weight-thin font-italic"
        > Welcome To Co_Code, The Collaborative Learning Coding Experience! </code>
      </v-card-text>
    </v-card>


    <!-- Options -->
    <div class="d-flex justify-center ">
      <!-- Host Option -->
      <div
        v-if="!isMobile()"
        class="button-popup host-option d-flex flex-column align-center mx-8"
      >
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
      </div>
      <!-- Client Option -->
      <div class="button-popup d-flex flex-column align-center mx-8">
        <v-btn
          color="secondary"
          prepend-icon="mdi-lan-connect"
          class="my-4"
          @click="clientPopup = !clientPopup;"
        >
          Client
        </v-btn>
        <v-fade-transition :hide-on-leave="true">
          <div
            v-if="clientPopup"
            class="button-popup"
          >
            <client-form> </client-form>
          </div>
        </v-fade-transition>
      </div>
    </div>
  </div>
</template>

<style>
.home-page {
  max-width: 90%;
}

.button-popup {
  width: 100%;
  max-width: 16rem;
}
</style>

