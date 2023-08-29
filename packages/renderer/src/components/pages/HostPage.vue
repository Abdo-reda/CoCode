
<script lang="ts" setup>
import { ref } from 'vue';

const clients = ref(0);
</script>

<template>
  <!-- <p> -------------- host page -------------- </p> -->
  <div class="w-100 ma-4">
    <v-row
      class="mb-6"
      no-gutters
    >
      <v-scale-transition :group="true">
        <v-col
          v-for="n in clients"
          :key="n"
          style="min-width: 25%;"
        >
          <v-sheet class="pa-2 ma-2">
            Client {{ n }}
          </v-sheet>
        </v-col>
      </v-scale-transition>
    </v-row>

    <div class="d-flex align-center justify-center">
      <v-btn @click="clients++"> + client </v-btn>
      <v-btn @click="clients--"> - client </v-btn>
    </div>
  </div>
</template>

<style></style>

