import { Command } from "../../models/Command";
import fs from "fs";

export default class ScheduleCommand extends Command {
	constructor() {
		super({
			name: "schedule",
			description: "Скидывает расписание",
			category: "general",

			usage: "/schedule",
			cooldown: "5s"
		});
	}

	public async execute(ctx) {
		await ctx.reply("Секунду...");

		if (!fs.existsSync("./src/uploads/schedule.pdf")) return ctx.reply("Расписание не найдено :(");

		const scheduleFile = fs.readFileSync("./src/uploads/schedule.pdf");

		await ctx.replyWithDocument({
			source: scheduleFile,
			filename: "schedule.pdf"
		});
	}
}
