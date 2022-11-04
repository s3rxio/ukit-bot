import { Command } from "../../models/Command";

export default class LunchshCommand extends Command {
	constructor() {
		super({
			name: "lunchsh",
			description: "Скидывает расписание обедов",
			category: "general",

			usage: "/lunchsh"
		});
	}

	public async execute(ctx) {
		return ctx.replyWithMarkdownV2(
			"*Расписание обедов*:\n" +
				"*1,2 этажи старого здания*:\n" +
				"11:50 \\- 12:10\n\n" +
				"*3,4 этажи старого здания*: \n" +
				"12:30 \\- 12:50\n\n" +
				"*Новое здание*: \n" +
				"13:20 \\- 13:40"
		);
	}
}
