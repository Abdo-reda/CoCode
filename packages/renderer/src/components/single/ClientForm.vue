<script lang="ts" setup>
import { ref, watch, inject  } from 'vue';
import { connectClient, isConnected, connectError, clientRef } from '/@/services/webSocketService';
import { useRouter } from 'vue-router';
import {ToastEvent} from '/@/events/keys';


// hint="localhost is b#aaab"

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const toastEvent: any = inject(ToastEvent); //I will make it typesafe later .. https://logaretm.com/blog/type-safe-provide-inject/
const router = useRouter();
const hostRoom = ref('');
const isLoading = ref(false);
const isValidated = ref(false);


const roomCodeRules = [
  (value: string) => {
    if (value.length !== 6) {
      return 'Room code must be 6 characters long';
    }
    return true;
  },
]; 

const clinetNameRules = [
  (value: string) => {
    if (value.length > 16) {
      return 'Client name must be less than 16 characters long';
    }
    if (value.length <= 0) {
      return 'Client name is required!';
    }
    return true;
  },
];


watch(isConnected, (newValue, _) => {
  if (newValue) {
    clientJoined();
  }
});


watch(connectError, (newValue, _) => {
  if (newValue.error) {
    isLoading.value = false;
    toastEvent.showToast(`ERROR: ${newValue.message}.Client could not connect to Host. `, 'error');
    connectError.error = false;
    connectError.message = '';
  }
});


function clientJoined() {
  isLoading.value = false;
  router.push({path: 'client'}); //should I use ref instead? global state management? 
  isConnected.value = false;
}


function join() {
  console.log('attempting to join ...');
  isLoading.value = true;
  connectClient(clientRef.name, hostRoom.value);
}

/*
  TODO:
    - validate input
    -  emit an event when the client connects successfully and after it reroute to the client page.
*/

</script>


<template>
  <v-card>
    <div class="text-center ma-2">
      <div class="font-italic text-secondary">Client Setup</div>
    </div>

    <div class="d-flex align-center justify-center ma-4">
      <v-form
        v-model="isValidated"
        class="w-100 d-flex flex-column align-center"
        @submit.prevent
      >
        <v-text-field
          v-model="clientRef.name"
          class="w-100"
          variant="filled"
          base-color="secondary-darken-1"
          density="compact"
          color="secondary-darken-1"
          label="Client Name"
          :rules="clinetNameRules"
        ></v-text-field>

        <v-text-field
          v-model="hostRoom"
          class="w-100"
          variant="filled"
          base-color="primary-darken-1"
          density="compact"
          color="primary-darken-1"
          label="Host Room"
          required
          
          :rules="roomCodeRules"
        ></v-text-field>

        <v-btn
          :disabled="!isValidated"
          :loading="isLoading"
          variant="outlined"
          size="small"
          color="secondary"
          type="submit"
          @click="join()"
        >
          Join
        </v-btn>
      </v-form>
    </div>
  </v-card>
</template>

