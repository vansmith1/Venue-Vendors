// Booking entity
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Booking")
export class Booking {
	@PrimaryGeneratedColumn()
	Id!: number;

	@Column()
	hirerId!: number;

	@Column()
	venueId!: number;

	@Column()
	occasion!: string;

	@Column({ type: "date" })
	bookingDate!: string;

	@Column()
	guests!: number;

	@Column({ type: "time" })
	startingTime!: string;

	@Column()
	duration!: number;

	@Column()
	status!: string;
}