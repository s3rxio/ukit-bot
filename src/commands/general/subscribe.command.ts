import { Command } from "../../models/Command";
import { UserEntity } from "../../db/enities/user.entity";

export default class SubscribeCommand extends Command {
	constructor() {
		super({
			name: "subscribe",
			description: "Подписаться на рассылку",
			category: "general",

			usage: "/subscribe"
		});
	}

	public async execute(ctx) {
		const { id, username } = ctx.from;

		let user = await UserEntity.findOneBy({ id });
		if (!user) user = UserEntity.create({ id });

		user.isSubscribed = !user.isSubscribed;
		await user.save();

		return ctx.reply(
			`Вы успешно ${
				user.isSubscribed ? "подписались на" : "отписались от"
			} рассылки!`
		);
	}
}
