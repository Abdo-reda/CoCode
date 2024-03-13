<script setup lang=ts>
import { EditorActions } from '@renderer/core/enums/editorActionsEnum';
import { EditorLanguages } from '@renderer/core/enums/editorLanguagesEnum';
import { EditorThemes } from '@renderer/core/enums/editorThemesEnum';

const editorLanguages = Object.values(EditorLanguages);
const editorThemes = Object.values(EditorThemes);

type EditorToolbarProps = {
    clientName: string;
    color: 'primary' | 'secondary';
}

const emit = defineEmits<{
    action: [action: EditorActions],
    changeLanguage: [language: EditorLanguages],
    changeTheme: [theme: EditorThemes]
}>();

defineProps<EditorToolbarProps>();

</script>

<template>
    <v-toolbar :color="color" :border="true" :height="30">
        <v-toolbar-title class="text-h3 font-weight-black"> {{ clientName }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-select 
            :value="editorLanguages[0]"
            @update:model-value="emit('changeLanguage', $event!)"
            class="w-0 mx-2"
            density="compact"
            :hide-details="true"
            :items="editorLanguages"
            variant="solo">
        </v-select>
        <v-select 
            :value="editorThemes[0]"
            @update:model-value="emit('changeTheme', $event!)"
            class="w-0"
            density="compact"
            :hide-details="true"
            :items="editorThemes"
            variant="solo">
        </v-select>
        <v-btn @click="emit('action', EditorActions.COPY)" size="x-small" icon="mdi-content-copy"></v-btn>
        <v-btn @click="emit('action', EditorActions.UNDO)" size="x-small" icon="mdi-undo-variant"></v-btn>
        <v-btn @click="emit('action', EditorActions.REDO)" size="x-small" icon="mdi-redo-variant"></v-btn>
        <v-btn size="x-small" icon="mdi-dots-vertical"></v-btn>
    </v-toolbar>
</template>