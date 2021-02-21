import { GameOfDice } from './game-of-dice';
import { PromptService } from './services/promt.service';
import { LoggerService } from './services/logger.service';

const promtService = new PromptService();
const loggerService = new LoggerService();
const game = new GameOfDice();

initialize(start);

async function initialize(callback) {
  try {
    let userData: any = await promtService.getUserData();
    game.initializePlayers(userData.N);
    game.setWiiningTarget(userData.M);
    callback();
  } catch (err) {
    this.loggerService.error(err);
  }
}

function start() {
  game.play();
}
