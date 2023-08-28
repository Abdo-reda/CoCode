<script lang="ts" setup>
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

</script>

<template>
  <v-app class="rounded rounded-b-xl">
    <v-app-bar class="toolbar">
      <!-- Temp Nav for testing  -->
      <!-- <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/contact">Contact</router-link>
      </nav> -->
    </v-app-bar>

    <!-- <v-navigation-drawer>
       <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list> 
    </v-navigation-drawer> -->

    <v-main class="d-flex align-center justify-center">
      <router-view> </router-view>
    </v-main>

    <v-footer class="flex-0-0 rounded rounded-b-xl">
      <code class="text-overline font-weight-thin font-italic text-disabled">
        version: {{ APP_VERSION }}
      </code>
    </v-footer>
  </v-app>
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

nav {
  -webkit-app-region: no-drag;
}

.toolbar {
  -webkit-app-region: drag;
}
</style>
