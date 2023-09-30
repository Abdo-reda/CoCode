<script lang="ts" setup>
import ClientForm from '/@/components/single/ClientForm.vue';
import HostForm from '/@/components/single/HostForm.vue';
import { ref } from 'vue';

//TODO: add two methods, lan connection that uses webosckets and other connection that uses webRTC
  //TODO: also add different view for host and client depending on which connection mode is made
//Also, fix the organization and transitions ... why is there a host-form and client-form and can we fix this


const clientPopup = ref(false);

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
        <host-form> </host-form>
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
  max-width: 24rem;
}
</style>

