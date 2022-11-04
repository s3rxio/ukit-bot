import { Context, Telegraf } from "telegraf";
import { ICommandOptions } from "./ICommandOptions";
import { MatchedContext } from "../types";

export interface ICommand {
	options: ICommandOptions;

	execute(
		ctx: MatchedContext<Context, "text">,
		args?: {},
		client?: Telegraf
	): Promise<any>;
}
