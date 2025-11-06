import k from "../kaplayCtx";
import game from "../scenes/game";

const makeGameManager = () => {
  const gameManager = k.add([
    k.state("menu", [
      "menu",
      "cutscene",
      "round-start",
      "round-end",
      "hunt-start",
      "hunt-end",
      "duck-hunted",
      "duck-escaped",
    ]),
    {
      isGamePaused: false,
      currentScore: 0,
      currentRoundNum: 0,
      currentHuntNum: 0,
      numBullets: 3,
      numDucksShot: 0,
      preySpeed: 100,
      resetGameState() {
        this.currentScore = 0;
        this.currentRoundNum = 0;
        this.currentHuntNum = 0;
        this.numBullets = 3;
        this.numDucksShot = 0;
        this.preySpeed = 100;
      },
    },
  ]);
  return gameManager;
};

const gameManager = makeGameManager();
export default gameManager;
