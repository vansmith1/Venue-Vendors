// Venue entity
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Venue")
export class Venue{
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    name!: string;

    @Column()
    location!: string;

    @Column()
    capacity!: number;

    @Column()
    suitability!: string;

    @Column()
    vendorId!: number;

    @Column()
    price!: number;

    @Column()
    description!: string;

    @Column()
    imageUrl!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ default: false })
    isFeatured!: boolean;
}