import { ICommandArg } from "./ICommandArg";

export interface ICommandOptions {
	name: string;
	description?: string;

	args?: ICommandArg[];

	usage?: string;
	cooldown?: string | number;
	category?: string;

	adminOnly?: boolean;
	devOnly?: boolean;
}
