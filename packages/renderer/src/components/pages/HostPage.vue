
<script lang="ts" setup>
import { reactive } from 'vue';
import electronService from '/@/services/electronService';
import ClientCard from '/@/components/shared/ClientCard.vue';
import type { IClient } from '/@/services/clientService';
import { GetHostPeer } from '/@/services/webRTCService';


const hostPeer = GetHostPeer();
const roomId = await hostPeer.hostRoom();
//TODO: implement loading for creating host,
//TODO: also on unload should deal with it, the connection should remain, could try and use dependency injection.
const clients = reactive<IClient[]>([]);

electronService.onClientJoined((_, client) => {
  console.log('on client joined from host', client.name);
  clients.push(client);
});


electronService.onClientType((_, clientId, clientText) => {
  console.log('recieved client text ...', clientId, clientText);
  clients.forEach(client => {
    if (client.uuid === clientId) {
      client.content = clientText;
    }
  });
});


function tempAddClient() {
  clients.push({
    name: 'client_temp',
    uuid: '',
    content: 'testing temp client stuff',
  });
}

function tempRemoveClient() {
  clients.pop();
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
          v-for="client in clients"
          :key="client.uuid"
          class="client-card-container my-1"
        >
          <client-card
            :content="client.content"
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

