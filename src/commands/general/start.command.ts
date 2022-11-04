import {Command} from "../../models/Command";

export default class StartCommand extends Command {
    constructor() {
        super({
            name: "start",
            description: "Starts the bot",
            category: "general",

            usage: "/start",
        });
    }

    public async execute(ctx, args) {
        return ctx.replyWithMarkdownV2(
            `Привет, *${ctx.from.first_name}*\\!\n` +
            `Я *${ctx.botInfo.first_name}*, который помогает *тебе* найти расписание занятий, звонков и обедов\\.\n` +
            "Чтобы узнать, что я умею, введи /help\n\n" +

            "Ссылка на Github репозиторий: https://github\\.com/s3rxio/ukit\\-bot\n" +
            "Ссылка на Github Автора: https://github\\.com/s3rxio"
        );
    }
}