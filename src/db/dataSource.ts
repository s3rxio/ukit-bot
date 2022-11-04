import ms from "ms";
import { UserEntity } from "./enities/user.entity";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: process.env.DB_LOGGING === "true",
	entities: [UserEntity],
	cache: {
		duration: ms("5h")
	}
});
