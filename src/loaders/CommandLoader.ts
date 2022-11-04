import { Command } from "../models/Command";
import { glob } from "glob";
import { resolve } from "path";

export class CommandLoader {
	constructor() {}

	public async loadCommands() {
		const commands: Command[] = [];
		const files = glob.sync(
			`./${
				process.env.NODE_ENV === "production" ? "dist" : "src"
			}/commands/**/*.command.?(js||ts)`
		);

		for (const file of files) {
			const { default: commandDefault } = await import(resolve(file));

			if (!commandDefault)
				throw new Error(`Import by default failed for "${file}"`);

			if (!(commandDefault.prototype instanceof Command))
				throw new Error(`"${file}" is not a command`);

			commands.push(new commandDefault());

			console.log(`Loaded command ${commandDefault.name}`);
		}
		return commands;
	}
}
