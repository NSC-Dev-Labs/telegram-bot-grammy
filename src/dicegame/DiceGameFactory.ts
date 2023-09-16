import DiceGame from "./DiceGame.js";

interface Games {
  [name: string]: DiceGame
}
interface DiceGameFactoryType {
  games: Games,
  create_dice_game: Function,
  get_dice_game: Function
}

const  DiceGameFactory: DiceGameFactoryType  = {
  games: {},

  create_dice_game(player_id: number, name: string) {
    const last_game = this.games[player_id.toString()];

    if(last_game && last_game.is_running) {
      return last_game;
    }
    
    const new_game = new DiceGame(player_id, name);

    this.games[player_id.toString()] = new_game;
    return new_game;
  },

  get_dice_game(player_id: number) {
    return this.games[player_id.toString()];
  }

}

export default DiceGameFactory;