import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class CustomEntity extends BaseEntity {
	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
