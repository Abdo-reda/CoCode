<script lang="ts" setup>
import { ref, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ToastEventKey } from '/@/utils/symbols/keys';
import { GetClient, GetClientWebRTC, GetClientWebSockets } from '/@/services/clientService';
import type { IClient } from '/@/utils/interfaces/clientInterface';


// hint="localhost is b#aaab"

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const toastEvent = inject(ToastEventKey); //I will make it typesafe later .. https://logaretm.com/blog/type-safe-provide-inject/
const router = useRouter();
const isLoading = ref(false);
const isValidated = ref(false);
const isConnected = ref(false);

let ClientPeer: IClient | null = GetClient();
const clientName = ref(ClientPeer?.name ?? ''); //Does the name need to be reactive, I don't think so.
const hostRoom = ref(ClientPeer?.roomId ?? '');


const roomCodeRules = [
  (value: string) => {
    if (!value) {
      return 'Room code cannot be empty!';
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


// watch(ClientPeer.connectionState, (newValue, _) => {
//   toastEvent.showToast(`Client: ${newValue}`);
//   if (newValue === 'connected') {
//     isConnected.value = true;
//     clientJoined();
//   }
// });


// watch(connectError, (newValue, _) => {
//   if (newValue.error) {
//     isLoading.value = false;
//     toastEvent.showToast(`ERROR: ${newValue.message}.Client could not connect to Host. `, 'error');
//     connectError.error = false;
//     connectError.message = '';
//   }
// });


function clientJoined(): void {
  isLoading.value = false;
  router.push({ path: 'client' });
}


function join(): void {
  console.log('attempting to join ...');
  isLoading.value = true;
  if (ClientPeer && (ClientPeer.roomId === hostRoom.value)) {
    ClientPeer.setInfo(clientName.value);
    clientJoined();
    // if (ClientPeer?.isConnected.value) clientJoined(); Does this condition matter?
  }

  setupClient();
}

function setupClient(): void {

  if (hostRoom.value.length === 6) {
    ClientPeer = GetClientWebSockets();
  } else {
    ClientPeer = GetClientWebRTC();
  }

  ClientPeer!.setInfo(clientName.value);
  ClientPeer!.joinRoom(hostRoom.value);

  watch(ClientPeer!.isConnected, (newValue, _) => {
    if (newValue) clientJoined();
  });
}

</script>


<template>
  <v-card>
    <div class="text-center ma-2">
      <div class="font-italic text-secondary">Client Setup</div>
    </div>

    <div class="d-flex align-center justify-center ma-4">
      <v-form v-model="isValidated" class="w-100 d-flex flex-column align-center" @submit.prevent>
        <v-text-field v-model="clientName" class="w-100" variant="filled" base-color="secondary-darken-1"
          density="compact" color="secondary-darken-1" label="Client Name" :rules="clinetNameRules"></v-text-field>

        <v-text-field v-model="hostRoom" class="w-100" variant="filled" base-color="primary-darken-1" density="compact"
          color="primary-darken-1" label="Host Room" required :rules="roomCodeRules"></v-text-field>

        <v-btn :disabled="!isValidated" :loading="isLoading" variant="outlined" size="small" color="secondary"
          type="submit" @click="join()">
          Join
        </v-btn>
      </v-form>
    </div>
  </v-card>
</template>

../../utils/symbols/keys
