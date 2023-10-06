<script setup lang="ts"> 
import { onMounted, ref } from 'vue';
import { GetHost } from '/@/services/hostService';
import { GetClient } from '/@/services/clientService';

//I could have a connected state generally which is updated whenever a client or host are created ... 
const Peer = GetHost() ?? GetClient();
const chatText = ref('');

function sendChat() {
    console.log(chatText.value);
}

onMounted(() => {
    console.log('------ beginning');
});

// Either this is from the host, or from the client, need to consider both.

</script>

<template>
    <div v-if="Peer" class="h-100">
        <div class="h-100 d-flex flex-column justify-end">
           <!-- <v-row justify="end">
             <v-btn variant="text" @click.stop="drawer = !drawer" icon="mdi-close-box"> </v-btn>
           </v-row> -->
           <div class="ma-2">
               <!-- CLIENT LIST NEEDS TO BE GOT FROM CLIENT AS WELL? -->
               <!-- <div   v-for="[clientUUID, client] in hostPeer?.clientList.value" :key="clientUUID">
                   <p class="text-red"> {{ client.name }}: </p>
                   <p> {{ hostPeer?.clientsChat.value.get(clientUUID) }} </p>
               </div> -->
               <!--  -->
           </div>
           <div class="ma-2">
             <v-text-field v-model="chatText" hide-details density="compact" variant="solo" append-icon="mdi-send-variant" @click:append="sendChat()"> </v-text-field>
           </div>
    
         </div>
    </div>
    <div v-else class="h-100">
        <div class="h-100 d-flex flex-column align-center justify-center">
            <v-icon class="ma-2" color="grey" icon="mdi-network-strength-off-outline"> </v-icon>
            <p class="text-h6 text-disabled"> You are offline :) </p>
        </div>
    </div>
</template>