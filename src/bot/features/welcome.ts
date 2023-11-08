import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { Menu } from "@grammyjs/menu";
import DiceGameFactory from "#root/dicegame/DiceGameFactory.js";
import DiceGame from "#root/dicegame/DiceGame.js";


const composer = new Composer<Context>();

const dice_roll_handler = async (ctx :any) => {
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
    await ctx.reply(ctx.t(game.who_is_winning()));
    return ctx.reply(
      ctx.t("Roll the dice"), 
      {reply_markup: menu}
    )
  }

  await ctx.reply(
    ctx.t(`Current Score \n\n CPU: ${game.get_cpu_total_score()},\n${username}: ${game.get_player_total_score()}`),
    { parse_mode: "HTML" }
  );

  return ctx.reply(
    ctx.t("Roll the dice"), 
    {reply_markup: menu}
  )
}

const feature = composer.chatType("private");
const menu: any = new Menu("my-menu-identifier")
  .text("Games", dice_roll_handler).row()
  .text("Profile", )

feature.use(menu);

feature.command("start", logHandle("command-start"), async (ctx) => {
  await  ctx.reply(ctx.t("welcome! Let's play the dice game. At the end whoever earns more points wins."));

  return ctx.reply(
    ctx.t("Let's roll the dice"), 
    {reply_markup: menu}
  )
});

export { composer as welcomeFeature };
