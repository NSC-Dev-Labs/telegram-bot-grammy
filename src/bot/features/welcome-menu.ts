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

const menu: Menu = new Menu("my-menu-identifier")
  .submenu("Games", "games-menu")
  .submenu("Profile", "profile-menu")

const games_menu = new Menu("games-menu")
  .text("Dice", (ctx) => ctx.reply("Let's play a dice game!")).row()
  .text("Roulette", (ctx) => ctx.reply("Win upto 100$")).row()
  .back("Go Back");

const profile_menu = new Menu("profile-menu")
  .submenu("Name", "name-menu")
  .submenu("Email", "email-menu")
  .back("Go Back");

const name_menu = new Menu("name-menu")
  .text("Update Name", async (ctx) => {
    return ctx.reply("Enter your name in the following format: \n \"name: adam\"\n");
  }).row()
  .back("Go Back");

const email_menu = new Menu("email-menu")
  .text("Update Email", async (ctx) => {
    return ctx.reply("Enter your email in the following format: \n \"email: adam@gmail.com\"\n");
  }).row()
  .back("Go Back");

profile_menu.register(name_menu);
profile_menu.register(email_menu);

menu.register(games_menu);
menu.register(profile_menu);

feature.use(menu);

feature.command("start", logHandle("command-start"), async (ctx) => {

  return ctx.reply(
    ctx.t("welcome! Play games and win cash prizes!"), 
    {reply_markup: menu}
  )
});

feature.hears(/^name:.+/, async (ctx) => {
  const name = ctx.message.text?.split(":")[1].trim();
  if(!name){
    return await ctx.reply("Invalid format, write like \"name:john\"");
  }


  return ctx.reply(
    ctx.t(`Hi ${name}, Your name is updated`),
    {reply_markup: profile_menu}
  )
});

feature.hears(/^email:.+/, async (ctx) => {
  const email = ctx.message.text?.split(":")[1].trim();
  if(!email){
    return await ctx.reply("Invalid format, write like \"email:john@abc.com\"");
  }

  return ctx.reply(
    ctx.t(`Your email:  ${email}, is updated`),
    {reply_markup: profile_menu}
  )
});

export { composer as welcomeFeature };
