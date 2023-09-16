import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), (ctx) => {
  return ctx.reply(ctx.t("welcome! We'll roll dice 3 times. At the end whoever earns more points wins.\n\n Please use \"/dice\" command to roll a dice."));
});

export { composer as welcomeFeature };
