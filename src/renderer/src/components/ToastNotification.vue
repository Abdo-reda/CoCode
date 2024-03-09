<script lang="ts" setup>
import { ref, watch } from 'vue';

const isShowing = ref(false);

const props = defineProps({
    color: {
        type: String,
        default: 'info',
    },
    text: {
        type: String,
        default: 'hi !',
    },
    show: {
        type: Boolean,
        default: false,
    },
});


//use v-model instead? I mean, I don't need two way binding, but it's more clean
watch(() => props.show, (newValue, _) => {
    isShowing.value = newValue;
});


</script>

<template>
  <v-snackbar
    v-model="isShowing"
    timeout="1500"
    :color="color"
    variant="tonal"
    position="relative"
    class="toast"
  >
    {{ text }}
    <template #actions>
      <v-btn
        color="color"
        variant="text"
        icon="mdi-close"
        @click="isShowing = false;"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>


<style>

.toast {
    bottom: 2rem !important;
}

</style>