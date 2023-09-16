import fastify from "fastify";
import { BotError, webhookCallback } from "grammy";
import type { Bot } from "#root/bot/index.js";
import { errorHandler } from "#root/bot/handlers/index.js";
import { logger } from "#root/logger.js";
import get_redis_client from "#root/redis/client.js";

export const createServer = async (bot: Bot) => {

  // Setup redis client
  const redis_client = get_redis_client()
  await redis_client.connect();

  
  const server = fastify({
    logger,
  });

  server.setErrorHandler(async (error, request, response) => {
    if (error instanceof BotError) {
      errorHandler(error);

      await response.code(200).send({});
    } else {
      logger.error(error);

      await response.status(500).send({ error: "Oops! Something went wrong." });
    }
  });

  server.get("/", () => ({ status: true }));

  server.post(`/${bot.token}`, webhookCallback(bot, "fastify"));

  return server;
};
