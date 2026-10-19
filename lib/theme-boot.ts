// Shared storage keys, and the pre-paint theme script. Kept out of the client
// module so the server layout can inline the script.
export const DRAFT_KEY = "mt_draft";
export const PREVIEW_KEY = "mt_preview";
export const THEME_KEY = "theme";

/**
 * Runs before first paint (inlined in <head>) so the page never flashes the
 * wrong theme: a saved choice wins, then the draft's default while previewing,
 * then the published default.
 */
export function themeBootScript(defaultTheme: "dark" | "light") {
  return `(function(){var t="${defaultTheme}";try{var s=localStorage.getItem("${THEME_KEY}");if(s==="light"||s==="dark"){t=s;}else if(localStorage.getItem("${PREVIEW_KEY}")==="1"){var d=JSON.parse(localStorage.getItem("${DRAFT_KEY}")||"{}");if(d&&d.settings&&d.settings.defaultTheme)t=d.settings.defaultTheme;}}catch(e){}document.documentElement.dataset.theme=t;})();`;
}
