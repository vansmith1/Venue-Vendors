import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm"
dotenv.config();
import { User } from "./entities/user";
import { Venue } from "./entities/venue";
import { Booking } from "./entities/booking";
import { Review } from "./entities/review";
import { VenueBlockedSlot } from "./entities/venueBlockedSlot";
import { ComplianceDocument } from "./entities/complianceDocument";

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, 
        trustServerCertificate: false,
    },
    synchronize: false,
    logging: true, 
    entities: [
        User,
        Venue,
        Booking,
        Review,
        VenueBlockedSlot,
        ComplianceDocument,
], 
migrations: [],
subscribers: [],
});