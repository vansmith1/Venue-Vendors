// Compliance document entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity("ComplianceDocument")
export class ComplianceDocument {
	@PrimaryGeneratedColumn()
	Id!: number;

	@Column()
	hirerId!: number;

	@Column()
	documentType!: string;

	@Column()
	status!: string;

	@Column({ nullable: true })
	fileUrl!: string;

	@CreateDateColumn()
	uploadingDate!: Date;
}