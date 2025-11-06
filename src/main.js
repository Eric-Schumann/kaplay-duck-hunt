import k from './kaplayCtx';
import loadAssets from './utils/loadAssets';
import mainMenu from './scenes/main-menu';
import game from './scenes/game';
import gameOver from './scenes/game-over';

loadAssets();

k.scene('main-menu', mainMenu);
k.scene('game', game);
k.scene('game-over', gameOver);

k.go('main-menu');