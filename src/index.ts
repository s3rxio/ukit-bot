import {config} from "dotenv";
config({
	path:
		process.env.NODE_ENV === "production"
			? ".env.production"
			: ".env.development"
});

import { Telegraf } from "telegraf";
import { CommandHandler } from "./handlers/CommandHandler";
import { dataSource } from "./db/dataSource";

console.clear();

const client = new Telegraf(process.env.BOT_TOKEN);
const commandHandler = new CommandHandler(client);

(async () => {
	await client.launch();

	console.log(`Bot ${client.botInfo?.username} has been started`);
	console.log("BotInfo:", client.botInfo);

	await dataSource.initialize();
	console.log("Database has been initialized");
	await commandHandler.init();
})();

process.once("SIGINT", () => client.stop("SIGINT"));
process.once("SIGTERM", () => client.stop("SIGTERM"));
