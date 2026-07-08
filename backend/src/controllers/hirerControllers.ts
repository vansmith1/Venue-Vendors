import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/venue";
import { Booking } from "../entities/booking";
import { VenueBlockedSlot } from "../entities/venueBlockedSlot";

export class HirerController {
    // Venue repository
    private venueRepository = AppDataSource.getRepository(Venue);
    // Booking repository
    private bookingRepository = AppDataSource.getRepository(Booking);
    // Blocked venue repository
    private blockedRepository = AppDataSource.getRepository(VenueBlockedSlot);

    // Get the venues
    async getVenues(request: Request, response: Response) {
        const venues = await this.venueRepository.find();

        return response.status(200).json(venues);
    }

    // Create booking
    async createBooking(request: Request, response: Response) {
        try {
            // Pull application parameters from request body
            const { hirerId, venueId, occasion, bookingDate, guests, startingTime, duration, status } = request.body;

            // Find venue with venue id
            const venue = await this.venueRepository.findOne({
                where: { Id: venueId }
            });

            // Checks if the vendor has blocked the venue off
            const blockedSlot = await this.blockedRepository.findOne({
                where: {
                    venueId
                }
            });

            // Checks if there are bookings under venue
            const existingBookings = await this.bookingRepository.find({
                where: {
                    venueId
                }
            });

            // Missing fields
            if (!hirerId || !venue || !occasion || !bookingDate || !guests || !startingTime || !duration) {
                return response.status(400).json({
                    message: "All fields are required"
                });
            // If the inputted number of guests is higher than venue capacity.
            }
            const today = new Date();
            today.setHours(0,0,0,0);
            const selectedDate = new Date(bookingDate);
            selectedDate.setHours(0,0,0,0);
            // If the date is before today
            if (selectedDate < today) {
                return response.status(400).json({
                    message: "Booking date cannot be in the past"
                });
            }
            // If the number of guests is more than the capacity
            if (Number(guests) > venue.capacity) {
                    return response.status(400).json({
                        message: "Too many guests"
                    });
            // If event name contains only numbers
            } else if (!isNaN(Number(occasion))) {
                    return response.status(400).json({
                        message: "Event name cannot contain only numbers"
                    });
            // If number of guests is not a valid number or less than 0
            } else if (isNaN(Number(guests)) || Number(guests) <= 0) {
                    return response.status(400).json({
                        message: "Invalid number of guests"
                    });
             // If event duration is not a valid number
            } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
                    return response.status(400).json({
                        message: "Invalid event duration"
                    }); 
            }
            // if venue is already booked at selected start date/time
            const bookingStart = new Date(`${bookingDate}T${startingTime}`);
            const bookingEnd = new Date(bookingStart);
            bookingEnd.setHours(bookingEnd.getHours() + Number(duration)); 

            for (let i = 0; i < existingBookings.length; i++) {
                const booking = existingBookings[i];

                const existingStart = new Date(
                    `${booking.bookingDate}T${booking.startingTime}`
                );

                const existingEnd = new Date(existingStart);

                existingEnd.setHours(
                    existingEnd.getHours() + Number(booking.duration)
                );

                // If time booking attempt is in another booking
                if (bookingStart < existingEnd && bookingEnd > existingStart) {
                    return response.status(400).json({
                        message: "Venue is already booked during this time"
                    });
                }
            }
            // if venue has been blocked by vendor at start date/time
            if (blockedSlot) {
                const blockedStart = new Date(
                    `${blockedSlot.blockedStartDate}T${blockedSlot.startingTime}`
                );
                const blockedEnd = new Date(
                    `${blockedSlot.blockedEndDate}T${blockedSlot.endingTime}`
                );
                if (
                    bookingStart < blockedEnd &&
                    bookingEnd > blockedStart
                ) {
                    return response.status(400).json({
                        message: "Venue is blocked during this time"
                    });
                }
            }
            // Create application
            const booking = this.bookingRepository.create({
                hirerId, venueId, occasion, bookingDate, guests, startingTime, duration, status 
            });

            // Save application
            await this.bookingRepository.save(booking);
            return response.status(201).json(booking);
        }
        
        catch (error) {
            return response.status(500).json({
                message: "Database error"
            });
        }
    }

    // Get booking
    async getBooking(request: Request, response: Response) {
        const bookings = await this.bookingRepository.find();

        return response.status(200).json(bookings);
    }
    
}