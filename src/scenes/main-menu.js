import k from "../kaplayCtx";
import { COLORS, FONT_CONFIG } from "../utils/constants";
import formatScore from "../utils/formatScore";

export default () => {
  // add menu sprite
  k.add([k.sprite("menu"), k.pos(0, 0)]);

  const clickToStart = k.add([
    k.text("CLICK TO START", FONT_CONFIG),
    k.z(2),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 40),
  ]);

  k.loop(0.5, () => {
    clickToStart.hidden = !clickToStart.hidden;
  });

  k.add([
    k.text("MADE BY MORTAVIRO", FONT_CONFIG),
    k.z(2),
    k.anchor("center"),
    k.color(COLORS.BLUE),
    k.opacity(0.5),
    k.pos(k.center().x, k.center().y + 55),
  ]);

  let bestScore = k.getData("best-score") || 0;

  k.add([
    k.text(`BEST SCORE: ${formatScore(bestScore, 6)}`, FONT_CONFIG),
    k.z(2),
    k.anchor("center"),
    k.color(COLORS.RED),
    k.pos(k.center().x, k.center().y + 25),
  ]);

  k.onClick(() => {
    k.go("game");
  });
};
