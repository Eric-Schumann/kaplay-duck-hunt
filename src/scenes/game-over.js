import k from "../kaplayCtx";
import { FONT_CONFIG } from "../utils/constants";

export default () => {
  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
  k.add([
    k.text("GAME OVER!", FONT_CONFIG),
    k.anchor("center"),
    k.pos(k.center()),
  ]);

  k.wait(2, () => {
    k.go("main-menu");
  });
};
