<script lang="ts" setup>
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

</script>

<template>
  <v-app class="rounded rounded-lg">
    <v-app-bar class="toolbar"></v-app-bar>

    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px;"
    >
      Main Content
    </v-main>

    <v-footer class="flex-0-0 rounded rounded-lg">
      <code class="text-overline font-weight-thin font-italic text-disabled">
        version: {{ APP_VERSION }}
      </code>
    </v-footer>
  </v-app>

  <!-- toolbar -->
  <!-- <main-header> </main-header> -->

  <!-- Logo -->
  <!-- <div>
    <code>CO_CODE</code>
    <img alt="Vue logo" src="../assets/logo.svg" width="150" />
  </div> -->

  <!-- Options -->
  <!-- <div>
    <v-btn prepend-icon="$vuetify">
      Host
    </v-btn>
    <v-btn prepend-icon="$vuetify">
      Client
    </v-btn>
  </div> -->

  <!-- Footer -->
  <!-- <main-footer> </main-footer> -->
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px; */
}

.toolbar {
  -webkit-app-region: drag;
}
</style>
