
<script lang="ts" setup>
import { ref } from 'vue';
import electronService from '../../services/electronService';
import IO from 'socket.io-client';

const downloadPopup = ref(true);
const clientPopup = ref(true);
const clientName = ref('');
const hostRoom = ref('');

/*
  TODO:
    - validate input
    - turn room into a valid ipaddress and port
*/

//later - maybe store the rooms somewhere where the client can fetch and join them (so joining a random room I guess..)

function connectClient() {

  console.log('client is trying to connect ...');
  const socket = IO('http://localhost:8899'); //this address will depend on the server
  console.log('client connected?', socket.id);
  return socket;
  //TODO: emit an event when the client connects successfully and after it reroute to the client page.
}

function toUpper() {
  hostRoom.value = hostRoom.value.toUpperCase();
}

</script>

<template>
  <div>
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
    <div class="d-flex justify-space-between ">
      <v-btn
        v-if="electronService.isDesktop"
        color="primary"
        class="text-background"
        to="/host"
        prepend-icon="mdi-server-plus"
      >
        Host
      </v-btn>
      <div
        v-else
        class="button-form d-flex flex-column align-center"
      >
        <v-btn
          variant="tonal"
          class="text-primary-darken-1 my-4"
          prepend-icon="mdi-server-plus"
          @click="downloadPopup = !downloadPopup;"
        >
          Host
        </v-btn>
        <v-fade-transition :hide-on-leave="true">
          <v-card
            v-if="downloadPopup"
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

      <div class="button-form d-flex flex-column align-center">
        <v-btn
          color="secondary"
          prepend-icon="mdi-lan-connect"
          class="my-4"
          @click="clientPopup = !clientPopup;"
        >
          Client
        </v-btn>
        <v-fade-transition :hide-on-leave="true">
          <v-card
            v-if="clientPopup"
            class="button-form"
            elevation="16"
          >
            <div class="ma-4">
              <div class="text-center ma-2">
                <div class="font-italic text-secondary">Client Setup</div>
              </div>

              <div class="d-flex align-center justify-center">
                <v-form
                  class="w-100 d-flex flex-column align-center"
                  @submit.prevent
                >
                  <!-- <v-text-field :rules="rules" label="First name"></v-text-field> -->
                  <v-text-field
                    v-model="clientName"
                    class="w-100 ma-2"
                    variant="filled"
                    base-color="secondary-darken-1"
                    density="compact"
                    color="secondary-darken-1"
                    label="Client Name"
                    required
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    class="w-100 ma-2"
                    variant="filled"
                    base-color="primary-darken-1"
                    v-model="hostRoom"
                    density="compact"
                    color="primary-darken-1"
                    label="Host Room"
                    required
                    @input="toUpper()"
                    hide-details
                  ></v-text-field>
                  <v-btn
                    variant="outlined"
                    size="small"
                    color="secondary"
                    type="submit"
                    class="ma-2"
                    @click="connectClient()"
                  >
                    Join
                  </v-btn>
                </v-form>

                <!-- v-model="firstname"
              :rules="nameRules" -->
              </div>
            </div>
          </v-card>
        </v-fade-transition>
      </div>
    </div>
  </div>
</template>

<style>
.button-form {
  width: 12em;
}
</style>

