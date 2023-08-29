
<script lang="ts" setup>
import {ref} from 'vue';

const clients = ref(0);
</script>

<template>
  <!-- <p> -------------- host page -------------- </p> -->


  <v-container>
    <v-row
      class="mb-6"
      no-gutters
    >
      <v-col
        v-for="n in clients"
        :key="n"
      >
        <v-sheet class="pa-2 ma-2">
          .v-col-auto {{ n }}
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>

  <div>
    <v-btn @click="clients++"> + client </v-btn>
    <v-btn @click="clients--"> - client </v-btn>
  </div>
</template>

<style>
</style>

