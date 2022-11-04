import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { IPostArgs } from "../../interfaces/commands";
import { Command } from "../../models/Command";
import ms from "ms";
import { Telegraf } from "telegraf";
import axios from "axios";
import { UserEntity } from "../../db/enities/user.entity";

export default class PostCommand extends Command {
	private _states = new Map<string, boolean>();

	constructor() {
		super({
			name: "post",
			description: "Рассылает всем сообщение",
			category: "admin",

			adminOnly: true,

			usage: "/post text?",
			cooldown: "30s",

			args: [
				{
					name: "message",
					description: "Сообщение для рассылки",

					required: false
				}
			]
		});
	}

	public async execute(ctx, args: IPostArgs, client: Telegraf) {
		await ctx.reply("Send document");

		this._states.set("isFinished", false);
		setTimeout(() => {
			if (this._states.get("isFinished") === true) return;
			this._states.set("isFinished", true);

			return ctx.reply("Время ожидания истекло");
		}, ms("1.5m"));

		client.on("document", async ctx => {
			if (this._states.get("isFinished") === true) return;

			if (
				!["application/pdf", "application/xlsx"].includes(
					ctx.message.document.mime_type
				)
			)
				return ctx.reply("Неверный формат файла");

			const documentUrl = (
				await ctx.telegram.getFileLink(ctx.message.document.file_id)
			).href;

			const { data } = await axios.get(documentUrl, {
				responseEncoding: "binary",
				headers: {
					"Content-Type": "application/pdf"
				}
			});

			if (!existsSync("./src/uploads")) await mkdir("./src/uploads");

			await writeFile("./src/uploads/schedule.pdf", data, "binary");
			this._states.set("isFinished", true);

			await ctx.reply("Секунду...");

			const { message } = args;
			const users = await UserEntity.findBy({ isSubscribed: true });
			for (const user of users) {
				if (user.id === ctx.from.id) return ctx.reply("Done");
				if (message !== undefined)
					await ctx.telegram.sendMessage(user.id, message);
				await ctx.telegram.sendDocument(user.id, {
					source: "./src/uploads/schedule.pdf",
					filename: "schedule.pdf"
				});
			}

			console.log("check6");

			return ctx.reply("Done");
		});
	}
}
