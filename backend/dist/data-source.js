"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_1 = require("./entities/user");
const venue_1 = require("./entities/venue");
const booking_1 = require("./entities/booking");
const review_1 = require("./entities/review");
const venueBlockedSlot_1 = require("./entities/venueBlockedSlot");
const complianceDocument_1 = require("./entities/complianceDocument");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
    username: "s4180466",
    password: "Nikolakao27!",
    database: "s4180466",
    options: {
        encrypt: false,
        trustServerCertificate: false,
    },
    synchronize: false,
    logging: true,
    entities: [
        user_1.User,
        venue_1.Venue,
        booking_1.Booking,
        review_1.Review,
        venueBlockedSlot_1.VenueBlockedSlot,
        complianceDocument_1.ComplianceDocument,
    ],
    migrations: [],
    subscribers: [],
});
