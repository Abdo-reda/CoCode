<template>
  <div class="ma-4">
    <div class="text-center ma-2">
      <div class="font-italic text-secondary">Client Setup</div>
    </div>

    <div class="d-flex align-center justify-center">
      <v-form
        class="w-100 d-flex flex-column align-center"
        @submit.prevent
      >
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
          v-model="hostRoom"
          class="w-100 ma-2"
          variant="filled"
          base-color="primary-darken-1"
          density="compact"
          color="primary-darken-1"
          label="Host Room"
          required
          hide-details
        ></v-text-field>

        <v-btn
          :loading="loading"
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

      <!-- MAKE THEM REQUIRED AND MAKE SURE ROOM NUMBER IS EACTLY 4 -->
    </div>
  </div>
</template>

<script>
import { connectSocket } from '/@/services/webSocketService';


export default {
    data() {
        return {
            clientName: '',
            hostRoom: '',
            loading: false,
        };
    },
    methods: {
        connectClient() {
            this.loading = true;
            const socket = connectSocket();
            socket.on('connect', () => {
                console.log('client connected', socket.id);
                socket.emit('client-join', {
                    clientName: this.clientName,
                });
                this.loading = false;
                this.$router.push({ path: 'client' });
            });
             //TODO: emit an event when the client connects successfully and after it reroute to the client page.
        },
    },
};
</script>