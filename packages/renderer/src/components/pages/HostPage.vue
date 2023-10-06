
<script lang="ts" setup>
import electronService from '/@/services/electronService';
import ClientCard from '/@/components/shared/ClientCard.vue';
import { GetHost } from '/@/services/hostService';

const hostPeer = GetHost(); //in theory, this can't be null
const roomId = hostPeer?.roomId ?? 'no room id';

//I will have a map, key is client uuid, and value is client object containing client name & content. That's all what I need.
  //This map, will be in the Ihost, he will keep track of the clients connected non? when a client is disconnected, he removes it from the object, yest.

//----------- Refactor this logic and see where it should be ... complexity demon enters the chat :) 
// electronService.onClientJoined((_, client) => {
//   console.log('on client joined from host', client.name);
//   clients.push(client);
// });

// electronService.onClientType((_, clientId, clientText) => {
//   console.log('recieved client text ...', clientId, clientText);
//   clients.forEach(client => {
//     if (client.uuid === clientId) {
//       client.content = clientText;
//     }
//   });
// });

let counter = 0;

function tempAddClient() {
  hostPeer?.clientList.value.set(`client_temp_${counter}`, {
    name: `client_temp_${counter++}`,
    uuid: '', 
  });
}

function tempRemoveClient() {
  hostPeer?.clientList.value.delete(`client_temp_${--counter}`);
}

//TODO: add toast notification that its copied.
function copyToClipboard() {
  electronService.copyToClipboard(roomId);
}

</script>

<template>
  <!-- <p> -------------- host page -------------- </p> -->
  <div class="w-100 ma-4">
    <v-row
      no-gutters
      class="clients-container"
    >
      <v-scale-transition :group="true">
        <v-col
          v-for="[clientUUID, client] in hostPeer!.clientList.value" :key="clientUUID"
          class="client-card-container my-1"
        >
          <client-card
            :content="hostPeer?.clientsCode.value.get(clientUUID)"
            :title="client.name"
          >
          </client-card>
        </v-col>
      </v-scale-transition>
    </v-row>

    <div class="d-flex align-center justify-space-around">
      <v-btn @click="tempAddClient"> + client </v-btn>
      <v-btn @click="tempRemoveClient"> - client </v-btn>
    </div>

    <div class="text-center ma-4">
      <v-btn
        variant="text"
        class="host-room font-weight-black text-disabled text-primary"
        @click="copyToClipboard"
      >
        Host Room: {{ roomId }}
      </v-btn>
    </div>
  </div>
</template>

<style>

.clients-container {
  max-height: calc(100vh - 8em);
  overflow-y: auto;
}

.client-card-container {
  /* max-height: calc(100vh - 10em); */
  max-height: 40vh;
  min-width: 25%;
}

.host-room {
  text-transform: unset !important;
}
</style>

