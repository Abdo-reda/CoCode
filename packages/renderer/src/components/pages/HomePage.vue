
<script lang="ts" setup>

</script>

<template>
  <div class="text-center">
    <v-card class="my-4">
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
        > Welcome To Co_Code, The Collaborative Coding Experience! </code>
      </v-card-text>
    </v-card>


    <!-- Options -->
    <div class="d-flex align-center justify-space-between ">
      <router-link to="/host">
        <v-btn prepend-icon="mdi-server-plus">
          Host
        </v-btn>
      </router-link>

      <v-btn prepend-icon="mdi-lan-connect">
        Client
      </v-btn>
    </div>
  </div>
</template>

<style></style>

