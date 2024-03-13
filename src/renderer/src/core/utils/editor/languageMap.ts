import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { type LanguageSupport } from '@codemirror/language';
import { EditorLanguages } from '@renderer/core/enums/editorLanguagesEnum';

export const languagesMap = new Map<EditorLanguages, LanguageSupport>([
    [EditorLanguages.JAVASCRIPT, javascript()],
    [EditorLanguages.PYTHON, python()],
]);