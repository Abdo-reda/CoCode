
//TODO: what languages does fucking hljs support?    languageClass: "hljs language-" + this.languages[0][0],
export enum SupportedLanguages {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  PHP = 'php',
  CPP = 'cpp',
}

export const SupportedLanguagesMap = new Map<SupportedLanguages, string>([
  [SupportedLanguages.JAVASCRIPT, "JS"],
  [SupportedLanguages.PYTHON, "Python"],
  [SupportedLanguages.PHP, "PHP"],
  [SupportedLanguages.CPP, "C++"],
]);
