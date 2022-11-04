import { ICommand, ICommandOptions } from "../interfaces";
import { MatchedContext } from "../types";
import { Context, Telegraf } from "telegraf";

export class Command implements ICommand {
	public options: ICommandOptions;

	constructor(options: ICommandOptions) {
		this.options = options;
		this.options.cooldown = this.options.cooldown || "3s";
	}

	async execute(
		ctx: MatchedContext<Context, "text">,
		args?: {},
		client?: Telegraf
	): Promise<any> {}
}
