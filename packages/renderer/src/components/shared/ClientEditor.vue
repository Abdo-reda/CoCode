<script lang="ts" setup>
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
import {supportedLanguagesMap, supportedLanguages} from '/@/utils/enums/supportedLanguagesEnum';
import { ref, onMounted } from 'vue';


const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: "console.log('hello client :)')",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});


//TODO: appearently I don't need this? make this better //of course I need this, what the fuck am I on about?
const emits = defineEmits<{
  'update:content': [content: string]
  'execute': [lang: supportedLanguages]
}>();

const orgEditorRef = ref<InstanceType<typeof CodeEditor> | null>(null);
const curLanguage = ref<supportedLanguages>(supportedLanguages.JAVASCRIPT);

//TODO: this is really awful, why would I do this, I could have easily forked the package and changed it to include name. I still want to include an execute button.
onMounted(() => {
  const orgEditor = orgEditorRef.value;
  const headerElement = orgEditor!.$el.querySelector('.header');
  const paragraph = document.createElement('code');
  paragraph.textContent = '---- ' + props.title + ' ----';
  headerElement.appendChild(paragraph);
});

function onLanguageChange(selectedLanguage: supportedLanguages): void {
  console.log('---- language', selectedLanguage);
  curLanguage.value = selectedLanguage;
}

function executeCode(): void {
  emits('execute', curLanguage.value);
}

</script>

<template>
  <div class="editor-container w-100">
    <v-btn @click="executeCode()"> Execute Me please </v-btn>
    <CodeEditor
      ref="orgEditorRef"
      :model-value="content"
      class="editor w-100 text-center"
      :line-nums="true"
      theme="stackoverflow-dark"
      font-size="14px"
      :read-only="false"
      :languages="Array.from(supportedLanguagesMap.entries())"
      @input="$emit('update:content', ($event.target as HTMLInputElement).value)"
      @lang="onLanguageChange"
    >
    </CodeEditor>
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

.editor::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgb(0, 0, 0, 0); */
}

.editor::-webkit-scrollbar-thumb {
  background-color: #353535;
  /* outline: 1px solid rgb(0, 0, 0, 0); c28515, f5a81b*/
}


.editor::-webkit-scrollbar-thumb:hover {
  background: #c28515;
}

</style>
