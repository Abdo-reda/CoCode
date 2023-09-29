
<script lang="ts" setup>
import ClientEditor from '/@/components/shared/ClientEditor.vue';
import { ref, watch } from 'vue';
// import {getClientSocket, clientRef} from '/@/services/webSocketService';
import { diff_match_patch } from 'diff-match-patch';
import { GetClientPeer } from '/@/services/webRTCService';

defineProps({
    title: {
        type: String,
        default: '',
    },
});

const content = ref("console.log('hello client :)')");
const dmp = new diff_match_patch();
// const socket = getClientSocket();
const ClientPeer = GetClientPeer();





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



// //-------------------- Approach #1 - diff-match-patch
// watch(content, async (newContent, oldContent) => {
//   oldContent = oldContent ?? '';
//   const patches = dmp.patch_make(oldContent, newContent);
//   // let patch = dmp.patch_toText(patches); //TODO: maybe send patch_toText directly, we will see, I might not use this approach at all
//   socket?.emit('client-diff', clientRef.uuid, patches);
// }, { immediate: true });

//-------------------- Approach #2 - diff-match-patch with webRTC
watch(content, async (newContent, oldContent) => {
  oldContent = oldContent ?? '';
  const patches = dmp.patch_make(oldContent, newContent);
  // let patch = dmp.patch_toText(patches); //TODO: maybe send patch_toText directly, we will see, I might not use this approach at all
  ClientPeer.sendCode(patches);
  //TODO: this is gonna be problamatic when there are multiple peers, my god such a headache.
    //Probably multiple channels for each peer ... is that good?

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

