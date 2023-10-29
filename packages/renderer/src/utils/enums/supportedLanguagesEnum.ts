
//TODO: what languages does fucking hljs support?    languageClass: "hljs language-" + this.languages[0][0],
export enum supportedLanguages {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  PHP = 'php',
  CPP = 'cpp',
}

export const supportedLanguagesMap = new Map<supportedLanguages, string>([
  [supportedLanguages.JAVASCRIPT, "JS"],
  [supportedLanguages.PYTHON, "Python"],
  [supportedLanguages.PHP, "PHP"],
  [supportedLanguages.CPP, "C++"],
]);
