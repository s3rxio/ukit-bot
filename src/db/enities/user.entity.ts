import { Column, Entity, PrimaryColumn } from "typeorm";
import { CustomEntity } from "../../models/CustomEntity";

@Entity("users")
export class UserEntity extends CustomEntity {
	@PrimaryColumn()
	id: number;

	@Column({
		default: false
	})
	isSubscribed: boolean;
}
