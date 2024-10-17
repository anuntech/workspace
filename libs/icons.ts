export const initialWorkspaceIcons = ["🖱", "📦", "📘", "📃"];

export function isValidEmoji(emoji: string) {
  const emojiRegex =
    /[\u203C-\u3299]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF]|\uD83E[\uDE70-\uDEFF]|\u0023\u20E3|\u002A\u20E3|\u0030-\u0039\u20E3/;
  return emojiRegex.test(emoji);
}
