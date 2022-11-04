import ms from "ms";

export class Cooldown {
	private _cooldowns: Map<number, number> = new Map();

	public setCooldown(userId: number, cooldown: number | string) {
		const convertedCooldown =
			typeof cooldown === "string" ? ms(cooldown) : cooldown;
		this._cooldowns.set(userId, Date.now() + convertedCooldown);

		setTimeout(() => this._cooldowns.delete(userId), convertedCooldown);
	}

	public getTimeLeft(userId: number) {
		if (!this._cooldowns.has(userId)) return 0;

		const cooldown = this._cooldowns.get(userId);
		if (cooldown < Date.now()) return 0;

		return Math.floor((cooldown - Date.now()) / 1000);
	}
}
