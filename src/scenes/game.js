import k from "../kaplayCtx";
import formatScore from "../utils/formatScore";
import gm from "../utils/gameManager";
import { COLORS, FONT_CONFIG } from "../utils/constants";
import Dog from "../entities/dog";
import Duck from "../entities/duck";

//LEFT OFF: 54:34

export default () => {
  k.setCursor("none");
  k.setLayers(
    ["sky", "dog_jump", "duck", "background", "mask", "dog_normal", "ui"],
    "dog_normal"
  );

  //create sky
  k.add([
    k.rect(k.width(), k.height()),
    k.color(COLORS.BLUE),
    k.layer("sky"),
    "sky",
  ]);

  //background
  k.add([k.sprite("background", k.pos(0, -10), k.layer("background"))]);

  const score = k.add([
    k.text(formatScore(0, 6), FONT_CONFIG),
    k.pos(192, 206),
    k.z(2),
  ]);

  const roundCount = k.add([
    k.text("1", FONT_CONFIG),
    k.pos(42, 191),
    k.layer("ui"),
    k.color(COLORS.RED),
  ]);

  const bulletUIMask = k.add([
    k.rect(0, 8),
    k.pos(25, 208),
    k.layer("ui"),
    k.color(0, 0, 0),
  ]);

  const dog = Dog(k.vec2(0, k.center().y + 7));
  dog.searchForDucks();

  let duckIcons = null;

  const roundStartController = gm.onStateEnter(
    "round-start",
    async (isFirstRound) => {
      duckIcons = k.add([k.pos(95, 208), k.layer("mask")]);

      let duckIconPosX = 1;
      for (let i = 0; i < 10; i++) {
        duckIcons.add([k.rect(7, 9), k.pos(duckIconPosX, 0), `duckIcon-${i}`]);
        duckIconPosX += 8;
      }

      if (!isFirstRound) gm.preySpeed += 50;
      k.play("ui-appear");
      gm.currentRoundNum += 1;
      roundCount.text = String(gm.currentRoundNum);
      const textBox = k.add([
        k.sprite("text-box"),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 50),
        k.layer("ui"),
      ]);

      textBox.add([
        k.text("ROUND", FONT_CONFIG),
        k.anchor("center"),
        k.pos(0, -10),
      ]);

      textBox.add([
        k.text(String(gm.currentRoundNum), FONT_CONFIG),
        k.anchor("center"),
        k.pos(0, 4),
      ]);

      await k.wait(1);
      textBox.destroy();
      gm.enterState("hunt-start");
    }
  );

  const roundEndController = gm.onStateEnter("round-end", () => {
    if (gm.numDucksShot < 6) {
      k.go("game-over");
      return;
    }
    if (gm.numDucksShot == 10) {
      gm.currentScore += 500;
    }
    gm.numDucksShot = 0;
    duckIcons.destroy();
    gm.enterState("round-start");
  });

  const huntStartController = gm.onStateEnter("hunt-start", () => {
    gm.currentHuntNum += 1;
    const duck = Duck(String(gm.currentHuntNum - 1), gm.preySpeed);
    duck.setBehavior();
  });

  const huntEndController = gm.onStateEnter("hunt-end", () => {
    const bestScore = Number(k.getData("best-score"));
    if (bestScore < gm.currentScore) {
      k.setData("best-score", gm.currentScore);
    }
    if (gm.currentHuntNum <= 9) {
      gm.enterState("hunt-start");
      return;
    }

    gm.currentHuntNum = 0;
    gm.enterState("round-end");
  });

  const duckHuntedController = gm.onStateEnter("duck-hunted", () => {
    gm.numBullets = 3;
    dog.catchFallenDuck();
  });

  const duckEscapedController = gm.onStateEnter("duck-escaped", () => {
    dog.mockPlayer();
  });

  const cursor = k.add([
    k.sprite("cursor"),
    k.anchor("center"),
    k.z(3),
    k.pos(),
  ]);

  k.onUpdate(() => {
    score.text = formatScore(gm.currentScore, 6);
    switch (gm.numBullets) {
      case 3:
        bulletUIMask.width = 0;
        break;
      case 2:
        bulletUIMask.width = 8;
        break;
      case 1:
        bulletUIMask.width = 15;
        break;
      default:
        bulletUIMask.width = 22;
    }
    cursor.moveTo(k.mousePos());
  });

  k.onClick(() => {
    if (gm.state === "hunt-start" && !gm.isGamePaused) {
      if (gm.numBullets > 0) {
        k.play("gun-shot", { volume: 0.5 });
        gm.numBullets -= 1;
      }
    }
  });

  const forestAmbiance = k.play("forest-ambiance", {
    volume: 0.05,
    loop: true,
  });

  k.onSceneLeave(() => {
    forestAmbiance.stop();
    roundEndController.cancel();
    roundEndController.cancel();
    huntStartController.cancel();
    huntEndController.cancel();
    duckHuntedController.cancel();
    duckEscapedController.cancel();
    gm.resetGameState();
  });

  k.onKeyPress((key) => {
    const audioCtx = new AudioContext();
    if (key === "p") {
      k.getTreeRoot().paused = !k.getTreeRoot().paused;
      if (k.getTreeRoot().paused) {
        gm.isGamePaused = true;
        audioCtx.suspend();
        k.add([
          k.text("PAUSED", FONT_CONFIG),
          k.pos(5, 5),
          k.layer("ui"),
          "paused-text",
        ]);
      } else {
        gm.isGamePaused = false;
        audioCtx.resume();
        const pausedText = k.get("paused-text")[0];
        if (pausedText) pausedText.destroy();
      }
    }
  });
};
