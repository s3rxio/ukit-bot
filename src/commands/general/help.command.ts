import { Command } from "../../models/Command";
import { CommandLoader } from "../../loaders/CommandLoader";
import { ICommandOptions } from "../../interfaces";
import { IHelpArgs } from "../../interfaces/commands";

export default class HelpCommand extends Command {
	private _commandLoader = new CommandLoader();
	private _commands: ICommandOptions[] = [];

	constructor() {
		super({
			name: "help",
			description: "Выводит список команд или информацию о конкретной команде",
			category: "general",

			usage: "/help command?",

			args: [
				{
					name: "commandName",
					description: "Название команды",

					required: false
				}
			]
		});
	}

	public async execute(ctx, args: IHelpArgs) {
		const { commandName } = args;
		this._commands = (await this._commandLoader.loadCommands()).map(
			command => command.options
		);

		if (commandName) {
			const command = this._commands.find(cmd => cmd.name === commandName);
			if (!command) return ctx.reply("Такой команды не существует!");

			return ctx.replyWithMarkdownV2(this.getCommandHelp(command));
		}

		this._commands.sort((a, b) => a.category.localeCompare(b.category));
		return ctx.replyWithMarkdownV2(
			this._commands.map(command => this.getCommandHelp(command)).join("\n")
		);
	}

	private getCommandHelp(command: ICommandOptions) {
		return (
			`*/${command.name}* — ${command.description}\n` +
			`*Категория*: ${command.category}\n` +
			`*Использование*: ${command.usage}\n`
		);
	}
}
