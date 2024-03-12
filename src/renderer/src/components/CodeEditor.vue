<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python'
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { vscodeDark } from '@renderer/styles/themes/vsCodeTheme';
import { EditorView } from 'codemirror';
import { type EditorState } from '@codemirror/state';
import EditorToolbar from './EditorToolbar.vue';

const disable = ref(false);
const code = ref(`console.log('Hello, world!')`);
const extensions = [
    //---- languages
    // python(),
    javascript(),
    //---- themes
    vscodeDark,
    //---- others
    EditorView.lineWrapping,
    indentationMarkers(),
];

// Codemirror EditorView instance ref
const view = shallowRef<EditorView>();

function handleReady(payload: {
    view: EditorView;
    state: EditorState;
    container: HTMLDivElement;
}): void {
    view.value = payload.view;
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
    <div class="d-block pa-4 w-100">   
        <EditorToolbar
            @action="console.log('action', $event)"
            @change-language="console.log('changeLanguage', $event)"
            @change-theme="console.log('changeTheme', $event)"
            color="primary" 
            client-name="Alice" />   
        <Codemirror 
            v-model="code" 
            placeholder="Code goes here..." 
            :autofocus="true" 
            :indent-with-tab="true" 
            :tab-size="2" 
            :disabled="disable"
            :extensions="extensions" 
            @ready="handleReady"
            @change="console.log('change', $event)" 
            @focus="console.log('focus', $event)"
            @blur="console.log('blur', $event)" 
        /> 
    </div>
</template>
