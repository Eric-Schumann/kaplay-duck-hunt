import k from "../kaplayCtx";
import gm from "../utils/gameManager";

export default (position) => {
  const sniffing = k.play("sniffing", { volume: 2 });
  sniffing.stop();

  const barking = k.play("barking");
  barking.stop();

  const laughing = k.play("laughing");
  laughing.stop();

  const dog = k.add([
    k.sprite("dog"),
    k.pos(position),
    k.layer("dog_normal"),
    k.state("search", ["search", "sniff", "detect", "jump", "drop"]),
    {
      speed: 15,
      searchForDucks() {
        let numSniffs = 0;
        this.onStateEnter("search", () => {
          this.play("search");
          k.wait(2, () => {
            this.enterState("sniff");
          });
        });

        this.onStateUpdate("search", () => {
          this.move(this.speed, 0);
        });

        this.onStateEnter("sniff", () => {
          numSniffs += 1;
          this.play("sniff");
          sniffing.play();
          k.wait(2, () => {
            sniffing.stop();
            if (numSniffs === 2) {
              this.enterState("detect");
              return;
            }
            this.enterState("search");
          });
        });

        this.onStateEnter("detect", () => {
          barking.play();
          this.play("detect");
          k.wait(1, () => {
            barking.stop();
            this.enterState("jump");
          });
        });

        this.onStateEnter("jump", () => {
          barking.play();
          this.play("jump");
          k.wait(0.5, () => {
            barking.stop();
            this.layer = "dog_jump";
            this.enterState("drop");
          });
        });

        this.onStateUpdate("jump", () => {
          this.move(100, -50);
        });

        this.onStateEnter("drop", async () => {
          await k.tween(
            this.pos.y,
            135,
            0.5,
            (newY) => {
              this.pos.y = newY;
            },
            k.easings.linear
          );

          gm.enterState("round-start", true);
        });
      },
      async slideUpAndDown() {
        await k.tween(
          this.pos.y,
          90,
          0.4,
          (newY) => {
            this.pos.y = newY;
          },
          k.easings.linear
        );
        await k.wait(1);
        await k.tween(
          this.pos.y,
          130,
          0.4,
          (newY) => (this.pos.y = newY),
          k.easings.linear
        );
      },
      async catchFallenDuck() {
        this.play("catch");
        k.play("successful-hunt");
        await this.slideUpAndDown();
        gm.enterState("hunt-end");
      },
      async mockPlayer() {
        laughing.play();
        this.play("mock");
        await this.slideUpAndDown();
        gm.enterState("hunt-end");
      },
    },
  ]);

  return dog;
};
