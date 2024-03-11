<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
// import { python } from '@codemirror/lang-python'
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
// import { oneDark } from '@codemirror/theme-one-dark'
// import { materialLight } from '@ddietr/codemirror-themes/material-light'
// import { materialDark } from '@ddietr/codemirror-themes/material-dark'
// import { solarizedLight } from '@ddietr/codemirror-themes/solarized-light'
// import { solarizedDark } from '@ddietr/codemirror-themes/solarized-dark'
// import { dracula } from '@ddietr/codemirror-themes/dracula'
// import { githubLight } from '@ddietr/codemirror-themes/github-light'
// import { githubDark } from '@ddietr/codemirror-themes/github-dark'
// import { aura } from '@ddietr/codemirror-themes/aura'
// import { tokyoNight } from '@ddietr/codemirror-themes/tokyo-night'
// import { tokyoNightStorm } from '@ddietr/codemirror-themes/tokyo-night-storm'
// import { tokyoNightDay } from '@ddietr/codemirror-themes/tokyo-night-day'
import { vscodeDark } from '@renderer/style/themes/vsCodeTheme';

const disable = ref(false);
const code = ref(`console.log('Hello, world!')`)
const extensions = [
    //---- languages
    // python(),
    javascript(),
    //---- themes
    vscodeDark,
    //---- others
    indentationMarkers(),
]

// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload) => {
    view.value = payload.view
}

// Status is available at all times via Codemirror EditorView
// const getCodemirrorStates = () => {
//     const state = view.value.state
//     const ranges = state.selection.ranges
//     const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
//     const cursor = ranges[0].anchor
//     const length = state.doc.length
//     const lines = state.doc.lines

//     console.log('---- state')
//     console.log('state', state, 'ranges', ranges, 'selected', selected, 'cursor', cursor, 'length', length, 'lines', lines);
//     // more state info ...
//     // return ...
// }

</script>

<template>
    <Codemirror v-model="code" placeholder="Code goes here..." :disabled="disable" :style="{ height: '400px' }"
        :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady"
        @change="console.log('change', $event)" @focus="console.log('focus', $event)"
        @blur="console.log('blur', $event)" />
</template>@renderer/style/themes/vsCodeTheme