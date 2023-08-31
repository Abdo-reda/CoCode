
<script lang="ts" setup>
// import hljs from 'highlight.js';
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
import { ref } from 'vue';
// import {diff_match_patch} from 'diff-match-patch';




/*
TODO:
  - add option to change things like font-size, theme, ..
  - SCROLL WHEEEL SUPPORT!!!!
  - ok, so I can capture the content, but how will I update the host? send the difference between the two contents, if the contents get added only then this is simple, but the contents can be delete too ...
*/

let content = ref("console.log('hello client :)')");
// const dmp = new diff_match_patch();

// watch(content, async (newContent, oldContent) => {
//   oldContent = oldContent ?? '';
//   const patches = dmp.patch_make(oldContent, newContent); //diff_cleanupEfficiency(diffs)
//   let patch = dmp.patch_toText(patches);
//   socket.emit('client-diff', patches);
// }, { immediate: true });

// function calcDiff(newContent: string, oldContent: string) {
//   let oldContentLen = oldContent.length;
//   if (newContent.length >= oldContentLen) {
//     const diff = newContent.slice(oldContentLen);
//     console.log('add', diff);
//     socket.emit('client-add', diff); //HE CAN ADD TEXT ANYWHERE HE WANTS!!!!!! not only at the end ...
//   } else {
//     const diff = oldContent!.slice(newContent.length);
//     console.log('del', diff);
//     socket.emit('client-del', diff);
//   }
// }



</script>


<template>
  <div class="w-100 text-center ma-4">
    <code> CLIENT_NAME</code>
    <CodeEditor
      v-model="content"
      class="w-100 my-4"
      :line-nums="true"
      theme="stackoverflow-dark"
      font-size="14px"
      :languages="[['javascript', 'JS'], ['cpp', 'C++'],['python', 'Python'],['php', 'PHP']]"
    >
    <!-- wrap don't work with line numbers -->
    <!--      @content="getContent" ??? -->
    </CodeEditor>
  </div>
</template>

<style>
.code-editor {
  overflow-y: auto;
  max-height: calc(100vh - 10em); 
  /* there must be a better approach */
}

.code-editor .header {
  position: sticky;
  top: 0px;
  background-color: #202020;
}
</style>

