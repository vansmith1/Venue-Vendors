// Review entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("Review")
export class Review {
	@PrimaryGeneratedColumn()
	Id!: number;

	@Column()
	bookingId!: number;

	@Column()
	vendorId!: number;

	@Column()
	hirerId!: number;

	@Column()
	rating!: number;

	@Column({ nullable: true })
	comment!: string;

	@CreateDateColumn()
	publishedDate!: Date;
}