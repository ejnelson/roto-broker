import Typography from "typography";
import moragaTheme from "typography-theme-moraga";

moragaTheme.baseFontSize = "16px";
moragaTheme.baseLineHeight = 1.6;
const typography = new Typography(moragaTheme);

export default typography;
export const { rhythm } = typography;
export const { scale } = typography;
