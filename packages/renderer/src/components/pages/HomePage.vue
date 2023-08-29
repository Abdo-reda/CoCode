
<script lang="ts" setup>
import { ref } from 'vue';
import electronService from '../../services/electronService';
// import {IO} from '#preload'; //THIS METHOD WON"T BE POSSIBLE ON THE WEB ... how the fuck do I import the io
import IO from 'socket.io-client';

const downloadPopup = ref(false);


function connectClient() {
  console.log('client is trying to connect ...');
  const socket = IO('http://localhost:8899'); //this address will depend on the server
  console.log('client connected?', socket.id);
}

</script>

<template>
  <div>
    <v-card class="my-4">
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
        > Welcome To Co_Code, The Collaborative Coding Experience! </code>
      </v-card-text>
    </v-card>


    <!-- Options -->
    <div class="d-flex align-center justify-space-between ">
      <div v-if="electronService.isDesktop">
        <v-btn
          color="primary"
          class="text-background"
          to="/host"
          prepend-icon="mdi-server-plus"
        >
          Host
        </v-btn>
      </div>
      <div v-else>
        <v-btn
          variant="tonal"
          class="text-primary-darken-1"
          prepend-icon="mdi-server-plus"
          @click="downloadPopup = true;"
        >
          Host
        </v-btn>
      </div>
      <v-btn
        color="secondary"
        prepend-icon="mdi-lan-connect"
        @click="connectClient()"
      >
        Client
      </v-btn>
    </div>
    <div class="ma-8">
      <v-fade-transition hide-on-leave>
        <v-card
          v-if="downloadPopup"
          class="mx-fit"
          elevation="16"
        >
          <div class="ma-4">
            <div class="text-center">
              <div class="font-italic text-primary">Hosting can only be done on the Desktop App!</div>
            </div>
            
            <div class="d-flex align-center justify-center">
              <v-btn
                variant="outlined"
                color="primary-darken-1"
                class="ma-2"
                icon="mdi-microsoft-windows"
                size="large"
              ></v-btn>
              <v-btn
                variant="outlined"
                color="primary-darken-1"
                class="ma-2"
                icon="mdi-linux"
                size="large"
              ></v-btn>
              <v-btn
                variant="outlined"
                color="primary-darken-1"
                class="ma-2"
                icon="mdi-apple"
                size="large"
              ></v-btn>
            </div>
          </div>
        </v-card>
      </v-fade-transition>
    </div>
  </div>
</template>

<style></style>

