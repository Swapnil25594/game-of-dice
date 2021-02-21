import * as prompts from 'prompts';

export class PromptService {
  async getUserData() {
    return new Promise(async (resolve, reject) => {
      try {
        const userData = {
          M: 0,
          N: 0
        };
        const response = await prompts({
          type: 'number',
          name: 'value',
          message: 'How many players ?',
          validate: (value) => (value < 2 ? `Game of Dice is multiplayer Game :) ` : true)
        });
        userData.N = response.value;

        const response2 = await prompts({
          type: 'number',
          name: 'value',
          message: 'What is the Winning Target ?',
          validate: (value) => (value < 1 ? `Oops. Winning target should be  > 1 ` : true)
        });
        userData.M = response2.value;
        resolve(userData);
      } catch (err) {
        reject(err);
      }
    });
  }

  async askToRollDice(playerName) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await prompts({
          type: 'text',
          name: 'value',
          message: `Hey ${playerName}, Its your turn. Press \'r\' to roll the dice`,
          validate: (value) => (value !== 'r' ? `Press \'r\' to roll the dice` : true)
        });
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}
