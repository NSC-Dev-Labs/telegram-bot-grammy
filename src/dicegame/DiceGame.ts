import { randomUUID } from "crypto";

interface RoundStats {
  round: number
  playerScore: number | null,
  cpuScore: number | null,
  playerDice: string | null,
  cpuDice: string | null,
}

export default class DiceGame {
  game_id: string;
  player_id: number;
  player_name: string;
  player_score: Array<number>;
  cpu_score: Array<number>;
  is_running: boolean;
  step: number;
  round: number;

  static DICE_ATTEMPTS: number = 3;
  
  constructor(player_id: number, name: string) {
    this.game_id = randomUUID();
    this.player_id = player_id;
    this.player_name = name;
    this.player_score = [];
    this.cpu_score = [];
    this.is_running = true;
    this.step = 0;
    this.round = 0;
  }

  play_a_round(): RoundStats | null {
    if(this.round >= DiceGame.DICE_ATTEMPTS) {
      return null;
    } 

    const cpu = this.play_cpu();
    const player = this.play_player();
    this.round += 1;

    return {
      round: this.round,
      playerScore: player,
      cpuScore: cpu,
      playerDice: DiceGame.get_dice_from_number(player),
      cpuDice: DiceGame.get_dice_from_number(cpu),
    }
  }

  who_is_winning() {
    const cpu = this.get_cpu_total_score();
    const player = this.get_player_total_score();

    if(player > cpu) {
      return `You won against CPU, with ${player - cpu} pts. Congratulations!!`
    } else if(player === cpu) {
      return `Game was a draw, You both made ${cpu} points!`
    } else {
      return `CPU won with ${cpu - player} pts. Try again!!`
    }
  }

  play_cpu() {
    if(!this.is_running || this.cpu_score.length >= DiceGame.DICE_ATTEMPTS) {
      return null;
    }

    const rand_num = Math.ceil(Math.random() * 6);
    this.cpu_score.push(rand_num);

    this.update_game_status();

    return rand_num;
  }

  play_player() {
    if(!this.is_running || this.player_score.length >= DiceGame.DICE_ATTEMPTS) {
      return null;
    }

    const rand_num = Math.ceil(Math.random() * 6);
    this.player_score.push(rand_num);

    this.update_game_status();

    return rand_num;
  }

  update_game_status() {
    this.step += 1;

    if(this.player_score.length === DiceGame.DICE_ATTEMPTS &&
      this.cpu_score.length === DiceGame.DICE_ATTEMPTS) {
        this.is_running = false;
    }
  }

  get_player_total_score() {
    const total_score = this.player_score.reduce((acc, item) => acc + item, 0);
    return total_score;
  }

  get_cpu_total_score() {
    const total_score = this.cpu_score.reduce((acc, item) => acc + item, 0);
    return total_score;
  }

  static get_dice_from_number(num: number | null) {
    switch (num) {
      case 1:
        return "&#9856;";
      case 2:
        return "&#9857;";
      case 3:
        return "&#9858;";
      case 4:
        return "&#9859;";
      case 5:
        return "&#9860;";
      case 6:
        return "&#9861;";
      default:
        return null;
    }
  }
}
