import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import get_redis_client from "#root/redis/client.js";
import DiceGameFactory from "#root/dicegame/DiceGameFactory.js";
import DiceGame from "#root/dicegame/DiceGame.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("dice", logHandle("command-dice"), async (ctx) => {
  const username = ctx.from.username || ctx.from.first_name || "Player";
  const game = DiceGameFactory.create_dice_game(ctx.from.id, username);
  const round = game.play_a_round();

  await ctx.reply(
    ctx.t(`Round: ${round.round}\n@${username}: ${round.playerDice}`),
    { parse_mode: "HTML" }
  );
  await ctx.reply(
    ctx.t(`Round: ${round.round}\nCPU: ${round.cpuDice}`),
    { parse_mode: "HTML" }
  );

  if (round.round >= DiceGame.DICE_ATTEMPTS) {
    return ctx.reply(ctx.t(game.who_is_winning()));
  }

  return ctx.reply(
    ctx.t(`Current Score \n\n CPU: ${game.get_cpu_total_score()},\n${username}: ${game.get_player_total_score()}`),
    { parse_mode: "HTML" }
  );
});

export { composer as diceGameFeature };
