
<script lang="ts" setup>
import ClientEditor from '/@/components/shared/ClientEditor.vue';
import { ref, watch } from 'vue';
import {getClientSocket, clientRef} from '/@/services/webSocketService';
import { diff_match_patch } from 'diff-match-patch';


defineProps({
    title: {
        type: String,
        default: '',
    },
});

const content = ref("console.log('hello client :)')");
const dmp = new diff_match_patch();
const socket = getClientSocket();





/*
TODO:
  - add option to change things like font-size, theme, ..
*/

//---------------------- Approach #2 - manual diff
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



//-------------------- Approach #1 - diff-match-patch 
watch(content, async (newContent, oldContent) => {
  oldContent = oldContent ?? '';
  const patches = dmp.patch_make(oldContent, newContent); 
  // let patch = dmp.patch_toText(patches); //TODO: maybe send patch_toText directly, we will see, I might not use this approach at all
  socket?.emit('client-diff', clientRef.uuid, patches);
}, { immediate: true });

</script>


<template>
  <div class="client-page w-100 pa-2">
    <client-editor
      v-model:content="content"
      :title="clientRef.name"
    >
    </client-editor>
  </div>
</template>

<style>

.client-page {
  max-height:  calc(100vh - 6em);
}

</style>

