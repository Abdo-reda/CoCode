export class GeneralUtility {

    //TODO: there must be a better approach?
  static isMobile(): boolean {
    const mobilePlatforms = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return mobilePlatforms.some(platform => {
      return navigator.userAgent.match(platform);
    });
  }
}
