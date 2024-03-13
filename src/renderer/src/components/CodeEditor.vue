<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { EditorView } from 'codemirror';
import { type EditorState } from '@codemirror/state';
import EditorToolbar from './EditorToolbar.vue';
import { redo, undo } from '@codemirror/commands';
import { EditorActions } from '@renderer/core/enums/editorActionsEnum';
import { EditorThemes } from '@renderer/core/enums/editorThemesEnum';
import { EditorLanguages } from '@renderer/core/enums/editorLanguagesEnum';
import { languagesMap } from '@renderer/core/utils/editor/languageMap';
import { themesMap } from '@renderer/core/utils/editor/themeMap';

const disable = ref(false);
const code = ref(`console.log('Hello, world!')`);
const editorLanguage = ref(EditorLanguages.JAVASCRIPT);
const editorTheme = ref(EditorThemes.VS_CODE);

const extensions = computed( () => {
    return [
        languagesMap.get(editorLanguage.value)!,
        themesMap.get(editorTheme.value)!,
        EditorView.lineWrapping,
        indentationMarkers(),
    ];
});

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



function handleChangeTheme(theme: EditorThemes): void {
    editorTheme.value = theme;
}

function handleChangeLanguage(lang: EditorLanguages): void {
    editorLanguage.value = lang;
}

function handleAction(action: EditorActions): void {
    switch (action) {
        case EditorActions.COPY:
            navigator.clipboard.writeText(code.value);
            break;
        case EditorActions.UNDO:
            undo({
                dispatch: view.value!.dispatch,
                state: view.value!.state,
            });
            break;
        case EditorActions.REDO:
            redo({
                dispatch: view.value!.dispatch,
                state: view.value!.state,
            });
            break;
        default:
            break;
    }
}


</script>

<template>
    <div class="d-block pa-4 w-100">   
        <EditorToolbar
            @action="handleAction"
            @change-language="handleChangeLanguage"
            @change-theme="handleChangeTheme"
            color="primary" 
            client-name="Alice" />   
        <Codemirror 
            v-model="code" 
            placeholder="Code goes here..." 
            :style="{ height: 'calc(100vh - 180px)' }"
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
