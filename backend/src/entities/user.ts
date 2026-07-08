// User entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity("User")
export class User{
    @PrimaryGeneratedColumn({ name: "Id" })
    id!: number;

    @Column({ nullable: true })
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @CreateDateColumn()
    dateJoined!: Date;

    @Column({ nullable: true })
    profileImageURL!: string;

    @Column()
    role!: string;
    
    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    abn?: string;
}