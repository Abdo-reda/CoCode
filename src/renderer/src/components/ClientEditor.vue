<script lang="ts" setup>
// import { ref, onMounted } from 'vue';

// const props = defineProps({
//   title: {
//     type: String,
//     default: '',
//   },
//   content: {
//     type: String,
//     default: "console.log('hello client :)')",
//   },
//   readonly: {
//     type: Boolean,
//     default: false,
//   },
// });


//appearently I don't need this?
defineEmits<{
  'update:content': [content: string]
}>();
  
// const orgEditorRef = ref<InstanceType<typeof CodeEditor> | null>(null);
 

// onMounted(() => {
//   const orgEditor = orgEditorRef.value;
//   const headerElement = orgEditor!.$el.querySelector('.header');
//   const paragraph = document.createElement('code');
//   paragraph.textContent = '---- ' + props.title + ' ----';
//   headerElement.appendChild(paragraph);
// });

//TODO: use code mirror instead.
//https://www.npmjs.com/package/vue-codemirror 
</script>

<template>
  <div class="editor-container w-100">
    <!-- <CodeEditor
      ref="orgEditorRef"
      :model-value="content"
      class="editor w-100 text-center"
      :line-nums="true"
      theme="stackoverflow-dark"
      font-size="14px"
      :read-only="false"
      :languages="[['javascript', 'JS'], ['cpp', 'C++'], ['python', 'Python'], ['php', 'PHP']]"
      @input="$emit('update:content', ($event.target as HTMLInputElement).value)"
    /> -->
  </div>
</template>
  
<style>
.editor-container {
  max-height: inherit;
}

.editor {
  max-height: inherit;
  max-width: inherit;
  overflow-y: auto;
  /* there must be a better approach */
}

.code-editor .header {
  position: sticky;
  top: 0px;
  background-color: #202020;
}

.editor::-webkit-scrollbar {
  width: 0.2em;
}


/* .editor::-webkit-scrollbar-track  box-shadow: inset 0 0 6px rgb(0, 0, 0, 0); */


.editor::-webkit-scrollbar-thumb {
  background-color: #353535;
  /* outline: 1px solid rgb(0, 0, 0, 0); c28515, f5a81b*/
}


.editor::-webkit-scrollbar-thumb:hover {
  background: #c28515;
}

</style>
  