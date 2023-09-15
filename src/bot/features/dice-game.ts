import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("dice", logHandle("command-dice"), (ctx) => {
  return ctx.reply(ctx.t(`Rolled the virtual dice: Got ${Math.ceil(Math.random() * 6)}`));
});

export { composer as diceGameFeature };
