import { Command } from "../models/Command";
import { CommandLoader } from "../loaders/CommandLoader";
import { ExceptionMessage } from "../enums";
import { Cooldown } from "../tools/Cooldown";
import ms from "ms";
import { Context, Telegraf } from "telegraf";
import { MatchedContext } from "../types";

export class CommandHandler {
	private _commandLoader: CommandLoader = new CommandLoader();
	private _cooldown = new Cooldown();

	constructor(private _client: Telegraf) {}

	private _commands: Command[] = [];

	public get commands() {
		return this._commands;
	}

	public async init() {
		const loadedCommands = await this._commandLoader.loadCommands();
		await this.registerCommands(loadedCommands);

		if (this.commands.length === 0)
			return console.warn("No commands registered");

		this.commands.forEach(command => {
			this._client.command(command.options.name, async ctx =>
				this.handleCommand(ctx, command)
			);
		});
	}

	private async handleCommand(
		ctx: MatchedContext<Context, "text">,
		command: Command
	) {
		if (ctx.from.is_bot) return;
		if (ctx.chat.type !== "private") return;

		const { args: commandArgs, cooldown, adminOnly, devOnly } = command.options;

		const userId = ctx.from.id;

		const adminIds = process.env.ADMIN_IDS?.split(",");
		if (
			(adminOnly && !adminIds?.includes(userId.toString())) ||
			(devOnly && userId !== Number(process.env.DEV_ID))
		)
			return ctx.reply(ExceptionMessage.NO_PERMISSION);

		if (process.env.NODE_ENV === "production") {
			const timeLeft = this._cooldown.getTimeLeft(userId);
			if (timeLeft > 0)
				return ctx.reply(
					`You are on cooldown for ${ms(timeLeft * 1000, { long: true })}`
				);

			this._cooldown.setCooldown(userId, cooldown);
		}

		const commandCatchHandle = (err: Error) => {
			console.error(err);
			return ctx.reply(
				`${ExceptionMessage.UNKNOWN_ERROR} ${err.message && ": " + err.message}`
			);
		};

		const messageArgs = ctx.message.text.split(" ").slice(1);

		let args = {};
		if (commandArgs?.length > 0) {
			for (let i = 0; i < commandArgs.length; i++) {
				const arg = commandArgs[i];
				const messageArg = messageArgs[i];

				if (arg.required && !messageArg)
					return ctx.replyWithMarkdownV2(
						ExceptionMessage.REQUIRED_ARG.replace("{name}", arg.name)
					);

				args[arg.name] = messageArg;
			}
		}

		return command.execute(ctx, args, this._client).catch(commandCatchHandle);
	}

	private async registerCommands(commands: Command[]) {
		if (commands.length === 0) return console.warn("No commands found");

		this._commands = commands;

		const localCommands: {command: string, description: string}[] = this.commands.map(command => ({
			command: command.options.name,
			description: command.options.description
		}));

		const myCommands = await this._client.telegram.getMyCommands();
		if (myCommands.toString() === localCommands.toString())
			return console.log("Commands are up to date");

		await this._client.telegram.setMyCommands(localCommands);

		console.log("Pushed commands to bot");

		return commands;
	}
}
