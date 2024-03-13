import { type Extension } from '@codemirror/state';
import { EditorThemes } from '@renderer/core/enums/editorThemesEnum';
import { aura, dracula, githubDark, githubLight, materialDark, materialLight, oneDark, solarizedDark, solarizedLight, tokyoNight, tokyoNightDay, tokyoNightStorm, vscodeDark } from '@renderer/styles/themes';

export const themesMap = new Map<EditorThemes, Extension>([
    [EditorThemes.VS_CODE, vscodeDark],
    [EditorThemes.AURA, aura],
    [EditorThemes.DRACULA, dracula],
    [EditorThemes.GITHUB_LIGHT, githubLight],
    [EditorThemes.GITHUB_DARK, githubDark],
    [EditorThemes.MATERIAL_LIGHT, materialLight],
    [EditorThemes.MATERIAL_DARK, materialDark],
    [EditorThemes.ONE_DARK, oneDark],
    [EditorThemes.SOLARIZED_LIGHT, solarizedLight],
    [EditorThemes.SOLARIZED_DARK, solarizedDark],
    [EditorThemes.TOKYO_NIGHT, tokyoNight],
    [EditorThemes.TOKYO_NIGHT_DAY, tokyoNightDay],
    [EditorThemes.TOKYO_NIGHT_STORM, tokyoNightStorm],
]);
