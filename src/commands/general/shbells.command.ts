import { Command } from "../../models/Command";

export default class ScheduleCommand extends Command {
	private _shBells = [
		"8:30 \\- 10:00",
		"10:10 \\- 11:40",
		"11:50 \\- 13:40",
		"13:50 \\- 15:20",
		"15:30 \\- 17:00",
		"17:10 \\- 18:40",
		"18:50 \\- 20:20"
	];

	constructor() {
		super({
			name: "shbells",
			description: "Скидывает расписание звонков",
			category: "general",

			usage: "/schedule",
			cooldown: "5s"
		});
	}

	public async execute(ctx) {
		return ctx.replyWithMarkdownV2(
			`*Расписание звонков:*\n` +
				this._shBells
					.map((bell, index) => {
						const currentLessonStroke = `*${index + 1} пара*: ${bell}`;
						return index === 3
							? `*Обед посменно*\n${currentLessonStroke}`
							: currentLessonStroke;
					})
					.join("\n")
		);
	}
}
