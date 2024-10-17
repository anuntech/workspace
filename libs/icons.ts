export const initialWorkspaceIcons = ["🖱", "📦", "📘", "📃"];

export function isValidEmoji(emoji: string) {
  const emojiRegex =
    /(\uD83C[\uDDE6-\uDDFF])|(\uD83D[\uDC00-\uDE4F])|(\uD83E[\uDD00-\uDDFF])|(\u0023\u20E3)|(\u002A\u20E3)|(\u0030-\u0039\u20E3)|(\uD83D[\uDE00-\uDE4F])/;
  return emojiRegex.test(emoji);
}
