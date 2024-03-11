<script lang="ts" setup>
import ClientEditor from '@renderer/components/ClientEditor.vue';

defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
});


</script>

<template>
  <div class="client-card mx-1">
    <client-editor
      :readonly="true"
      :content="content"
      :title="title"
    >
    </client-editor>
  </div>
</template>

<style>

.client-card {
  max-height: inherit;
}

.client-card .code-editor {
  border: 1px solid #373737;
}

.client-card .header {
  border-radius: unset !important;
}

</style>

