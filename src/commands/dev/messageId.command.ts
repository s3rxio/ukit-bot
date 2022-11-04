import { Command } from "../../models/Command";

export default class MessageIdCommand extends Command {
	constructor() {
		super({
			name: "messageid",
			description: "Получить ID сообщения",
			category: "dev",

			devOnly: true,

			usage: "/messageId",
			cooldown: "15s"
		});
	}

	public async execute(ctx) {
		const { message_id } = ctx.message?.reply_to_message || ctx.message;
		return ctx.reply(
			message_id ? String(message_id) : "Не удалось получить ID сообщения"
		);
	}
}
