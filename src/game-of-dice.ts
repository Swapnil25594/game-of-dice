import { IPlayer } from './models/player.model';
import { PromptService } from './services/promt.service';
import { LoggerService } from './services/logger.service';

export class GameOfDice {
  private players: Array<IPlayer> = [];
  private target: number = 0;
  private _rankIndex = 0;
  private _round = 0;
  private promtService = new PromptService();
  private loggerService = new LoggerService();

  constructor() {}

  async play() {
    try {
      this.allocateRandomTurnOrder();

      while (this.isAnybodyLeftForTarget()) {
        this.loggerService.info(`\n\n\t\tRound ${++this._round}`);
        this.loggerService.info('\tCurrent Score for palyers : ');
        this.printScore();
        for (let index = 0; index < this.players.length; index++) {
          if (this.canPlayerRollADice(this.players[index])) {
            await this.askPlayerToRollADice(this.players[index]);
          }
        }
      }
      this.loggerService.info('\n\n\n\tFinal score card');
      this.printScore();
    } catch (err) {
      this.loggerService.error(err);
    }
  }

  initializePlayers(N) {
    let players: Array<IPlayer> = [];
    for (let index = 0; index < N; index++) {
      players.push({
        playerName: `Player ${index + 1}`,
        score: 0,
        rollsHistory: [],
        rank: 0
      });
    }
    this.players = players;
  }

  setWiiningTarget(target: number) {
    this.target = target;
  }

  async askPlayerToRollADice(p: IPlayer) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.promtService.askToRollDice(p.playerName);
        const roll = this.getRandomRoll();
        this.loggerService.info(`\t${p.playerName}, you rolled ${roll}`);
        p.score += roll;
        p.rollsHistory.push(roll);
        if (this.isTargetAchieved(p)) {
          return resolve(true);
        }
        if (roll === 6) {
          this.loggerService.info(`\t${p.playerName} got another chance becase you rolled 6.`);
          return resolve(this.askPlayerToRollADice(p));
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  private getRandomRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  private printScore() {
    const scoreCard = this.players.map(({ playerName, score, rank }) => ({
      playerName,
      score,
      rank
    }));
    this.loggerService.table(scoreCard);
  }

  private allocateRandomTurnOrder() {
    const players = this.players;
    var currentIndex = players.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = players[currentIndex];
      players[currentIndex] = players[randomIndex];
      players[randomIndex] = temporaryValue;
    }

    this.loggerService.info('\n\n\tPlayers wil play in the order below -');
    this.loggerService.table(this.players.map((p) => p.playerName));
    this.players = players;
  }

  private canPlayerRollADice(player: IPlayer) {
    if (player.score >= this.target) {
      return false;
    }

    if (player.rollsHistory.slice(player.rollsHistory.length - 2).join('') === '11') {
      this.loggerService.info(
        `\tHey, ${player.playerName},  you have rolled \'1\' twice consecutively, See you in next turn :)`
      );
      player.rollsHistory.push('-');
      return false;
    }
    return true;
  }

  private isAnybodyLeftForTarget() {
    if (this.players.find((p) => p.score < this.target)) {
      return true;
    }
    return false;
  }

  private isTargetAchieved(p: IPlayer) {
    if (p.score >= this.target) {
      p.rank = ++this._rankIndex;
      this.loggerService.info(
        `\tCongrats ${p.playerName}, you completed the game. You Rank is ${p.rank}`
      );
      return true;
    }
    return false;
  }
}
