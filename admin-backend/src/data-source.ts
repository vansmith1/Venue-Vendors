import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { User } from "./entity/user";
import { Venue } from "./entity/venue";

dotenv.config();
export const AppDataSource = new DataSource({
  	type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD, 
	database: process.env.DB_DATABASE,
    
	options: {
    	encrypt: false, 
    	trustServerCertificate: true,
	},
	synchronize: false, 
	logging: true, 
	entities: [User, Venue],
	migrations: [],
	subscribers: [],
});