
<script lang="ts" setup>
// import hljs from 'highlight.js';
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
import { ref, watch } from 'vue';
import IO from 'socket.io-client'; //TODO: this should be done in the home page, also, the host or room name would be required ...

function connectClient() {
  console.log('client is trying to connect ...');
  const socket = IO('http://localhost:8899'); //this address will depend on the server
  console.log('client connected?', socket.id);
  return socket;
  //TODO: emit an event when the client connects successfully and after it reroute to the client page.
}

const socket = connectClient();


/*
TODO:
  - add option to change things like font-size, theme, ..
  - SCROLL WHEEEL SUPPORT!!!!
  - ok, so I can capture the content, but how will I update the host? send the difference between the two contents, if the contents get added only then this is simple, but the contents can be delete too ... 
*/

let content = ref("console.log('hello client :)')");

watch(content, async (newContent, oldContent) => {
  let oldContentLen = oldContent?.length ?? 0;
  if (newContent.length >= oldContentLen) {
    const diff = newContent.slice(oldContentLen);
    console.log('add', diff);
    socket.emit('client-add', diff); //HE CAN ADD TEXT ANYWHERE HE WANTS!!!!!! not only at the end ...
  } else {
    const diff = oldContent!.slice(newContent.length);
    console.log('del', diff);
    socket.emit('client-del', diff);    
  }
}, { immediate: true });


</script>


<template>
  <div class="w-100 text-center ma-4">
    <p> ------- client ------- </p>
    <CodeEditor 
      v-model="content"
      class="w-100" 
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
</style>

