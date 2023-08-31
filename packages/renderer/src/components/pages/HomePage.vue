
<script lang="ts" setup>
import ClientForm from '/@/components/single/ClientForm.vue';
import { ref } from 'vue';
import electronService from '../../services/electronService';

const hostPopup = ref(false);
const clientPopup = ref(false);
// const hostRoom = ref('');

/*
  TODO:
    - validate input
    - turn room into a valid ipaddress and port
*/

//later - maybe store the rooms somewhere where the client can fetch and join them (so joining a random room I guess..)

// function toUpper() {
//   hostRoom.value = hostRoom.value.toUpperCase();
// }

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
      <div class="button-form d-flex flex-column align-center">
        <v-btn
          v-if="electronService.isDesktop"
          color="primary my-4"
          class="text-background"
          to="/host"
          prepend-icon="mdi-server-plus"
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
            <client-form> </client-form>
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

