// Venue blocked slot entity
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("VenueBlockedSlot")

export class VenueBlockedSlot {
	@PrimaryGeneratedColumn()
	Id!: number;

	@Column()
	venueId!: number;

	@Column({ type: "date" })
	blockedStartDate!: string;

	@Column({ type: "date" })
	blockedEndDate!: string;

	@Column({ type: "time" })
	startingTime!: string;

	@Column({ type: "time" })
	endingTime!: string;

	@Column({ nullable: true })
	reason!: string;
}