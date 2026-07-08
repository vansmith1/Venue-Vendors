import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/venue";
import { Booking } from "../entities/booking";
import { VenueBlockedSlot } from "../entities/venueBlockedSlot";
import { Review } from "../entities/review";
import { User } from "../entities/user";

export class VendorController {
    private venueRepository = AppDataSource.getRepository(Venue);
    private bookingRepository = AppDataSource.getRepository(Booking);
    private blockedRepository = AppDataSource.getRepository(VenueBlockedSlot);
    private reviewRepository = AppDataSource.getRepository(Review);

    // Get venues from database
    async getVenues(request: Request, response: Response) {
        const venues = await this.venueRepository.find();

        return response.status(200).json(venues);
    }

    // Block a venue
    async blockVenue(request: Request, response: Response) {
        try {
            // Grab parameter id
            const id = Number(request.params.id);

            // Find venue based off id
            const venue = await this.venueRepository.findOne({
                where: { Id: id }
            });

            // If venue does not exist...
            if (!venue) {
                return response.status(404).json({
                    message: "Venue not found"
                });
            }

            // Pull parameters
            const { blockedStartDate, blockedStartTime, blockedEndDate, blockedEndTime, reason } = request.body;

            // If inputs are not filled
            if (!blockedStartDate || !blockedStartTime || !blockedEndDate || !blockedEndTime || !reason) {
                return response.status(400).json({
                    message: "All fields must be provided"
                });
            }

            venue.isActive = false;

            // Create blocked slot
            const blockedSlot = this.blockedRepository.create({
                venueId: id,
                blockedStartDate,
                blockedEndDate,
                startingTime: blockedStartTime,
                endingTime: blockedEndTime,
                reason
            });

            await this.blockedRepository.save(blockedSlot);
            await this.venueRepository.save(venue);

            return response.status(200).json(venue);
        }

        catch {
            return response.status(500).json({
                message: "Database error"
            });
        }
    }

    // Unblock a venue
    async unblockVenue(request: Request, response: Response) {
        try {
            // Grab parameter id
            const id = Number(request.params.id);

            // Find venue based off id
            const venue = await this.venueRepository.findOne({
                where: { Id: id }
            });

            // Delete venue
            await this.blockedRepository.delete({venueId: id});
    
            if (!venue) {
                return response.status(404).json({
                    message: "Venue not found"
                });
            }

            venue.isActive = true;

            await this.venueRepository.save(venue);
            return response.status(200).json(venue);
        }

        catch {
            return response.status(500).json({
                message: "Database error"
            });
        }
    }

    // Get booking from database
    async getBooking(request: Request, response: Response) {
        const bookings = await this.bookingRepository.find();

        return response.status(200).json(bookings);
    }

    // Update the status of the booking
    async updateBookingStatus(request: Request, response: Response) {
        const { status } = request.body;
        const id = Number(request.params.id);

        // Find the booking
        const booking = await this.bookingRepository.findOne({
            where: { Id: id }
        });

        // If no booking
        if (!booking) {
            return response.status(404).json({
                message: "Booking not found"
            });
        }

        booking.status = status;

        await this.bookingRepository.save(booking);
        return response.status(200).json(booking);
    }

    // Create a review
    async createReview(request: Request, response: Response) {
        const {bookingId, vendorId, hirerId, rating, comment} = request.body;
                
        // If input fields are empty
        if (!bookingId || !vendorId || !hirerId || !rating) {
            return response.status(400).json({
                message: "All required fields must be provided"
            });
        }

        // If rating is more than five or less than one
        if (rating < 1 || rating > 5) {
            return response.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Find an existing review
        const existingReview = await this.reviewRepository.findOne({where: {bookingId}});

        // If we find an existing review
        if (existingReview) {
            return response.status(400).json({
                message: "Review already exists"
            });
        }

        // Create review
        const review = this.reviewRepository.create({ bookingId, vendorId, hirerId, rating, comment});

        await this.reviewRepository.save(review);
        return response.status(201).json(review);
    }

    // Pull reviews from database
    async getReviews(request: Request, response: Response) {
        const reviews = await this.reviewRepository.find();

        return response.status(200).json(reviews);
    }

    // Create a venue
    async createVenue(request: Request, response: Response) {
        const {name, location, capacity, suitability, vendorId, price, description, imageUrl, isActive, isFeatured} = request.body;
                
        // Ensure user fills all fields
        if (!name || !location || !capacity || !suitability || !vendorId || !price || !description || !imageUrl || !isActive) {
            return response.status(400).json({
                message: "All required fields must be provided"
            });
        }
        // If name only has numbers
        else if (!isNaN(Number(name))) {
            return response.status(400).json({
                message: "Name can't just contain numbers"
            });
        }
        // If location has only numbers
        else if (!isNaN(Number(location))) {
            return response.status(400).json({
                message: "Location can't just contain numbers"
            });
        }
        // If description has only numbers
        else if (!isNaN(Number(description))) {
            return response.status(400).json({
                message: "Description can't just contain numbers"
            });
        }
        // If suitability has only numbers
        else if (!isNaN(Number(suitability))) {
            return response.status(400).json({
                message: "Suitability can't just contain numbers"
            });
        }
        // If capacity is less than zero
        else if (capacity <= 0) {
            return response.status(400).json({
                message: "Capacity can't be less than zero"
            });
        }
        // If price is less than zero
        else if (price <= 0) {
            return response.status(400).json({
                message: "Price can't be less than zero"
            });
        }

        // Find existing venue
        const existingVenue = await this.venueRepository.findOne({where: {name}});

        // If venue exists
        if (existingVenue) {
            return response.status(400).json({
                message: "Venue already exists"
            });
        }

        // Create a new venue
        const venue = this.venueRepository.create({name, location, capacity, suitability, vendorId, price, description, imageUrl, isActive, isFeatured});

        await this.venueRepository.save(venue);
        return response.status(201).json(venue);
    }
    
    // Get hirer tallies
    async getHirerTallies(request: Request, response: Response){
        try{
            // Vendor Id and Venues
            const vendorId = Number(request.params.vendorId);
            const venues = await this.venueRepository.find({
                where: { vendorId }
            });
            
            // Find Bookings
            const bookings = await this.bookingRepository.find();  
            // Get Users repository
            const users = await AppDataSource.getRepository(User).find();
            // Only approved bookings
            const validStatuses = ["Approved", "Confirmed"];

            const hirers = users.filter((user) => user.role === "Hirer");

            // Map Bookings Matching venueId's
            const result = venues.map((venue) => {
                const venueBookings = bookings.filter(
                    (booking) => booking.venueId === venue.Id && 
                        validStatuses.includes(booking.status)
                    );
                
                // Booking count x hirerId's
                const hirerTallies = hirers.map((hirer) => {
                    const count = venueBookings.filter((booking) => booking.hirerId === hirer.id).length;
                    return {
                        hirerName: hirer.name || hirer.email,
                        bookings: count,
                    };
                }).filter((item) => item.bookings > 0);

                return {
                    venueId: venue.Id,
                    venueName: venue.name,
                    hirerTallies,
                };
            });

            return response.status(200).json(result);   
        } 
        
        catch (error) {
            return response.status(500).json({
                message: "Failed to Load Tallies",
            });
        }
    }

    // Get combined hirer tallies
    async getCombinedHirerTallies(request: Request, response: Response){
        // Find vendor ID and venues
        try {
            const vendorId = Number(request.params.vendorId);

            const venues = await this.venueRepository.find({
                where: { vendorId }
            });
            // Find bookings
            const bookings = await this.bookingRepository.find();  
            // Find users
            const users = await AppDataSource.getRepository(User).find();
            // Create valid statuses
            const validStatuses = ["Approved", "Confirmed"];
            // Venue IDs
            const venueIds = venues.map((venue) => venue.Id);
            // Find hirers
            const hirers = users.filter((user) => user.role === "Hirer");

            // Filter through bookings
            const vendorBookings = bookings.filter(
                (booking) => 
                    venueIds.includes(booking.venueId) &&
                    validStatuses.includes(booking.status)
            );

            const data = hirers.map((hirer) => {
                const row: any = {
                    hirerName: hirer.name || hirer.email,
                };

                let total = 0;

                venues.forEach((venue) => {
                    const count = vendorBookings.filter((booking) => 
                            booking.hirerId === hirer.id &&
                            booking.venueId === venue.Id
                    ).length;

                    row[venue.name] = count;
                    total += count;
                });
                row.total = total;
                return row;
            }).filter((row) => row.total > 0);

            return response.status(200).json({
                venues: venues.map((venue) => venue.name),data
            });
        } 
        
        catch (error) {
            return response.status(500).json({
                message: "Failed to load combined hirer tallies"
            });
        }
    }

    // Get the activity of the hirers
    async getHirerActivity(request:Request, response: Response) {
        try {
            const vendorId = Number(request.params.vendorId);
            const venues = await this.venueRepository.find({
                where: { vendorId }
            });

            const bookings = await this.bookingRepository.find();  
            const users = await AppDataSource.getRepository(User).find();
            const validStatuses = ["Approved", "Confirmed"];
            const venueIds = venues.map((venue) => venue.Id);
            const hirers = users.filter((user) => user.role === "Hirer");
        
            const vendorBookings = bookings.filter((booking) => 
                venueIds.includes(booking.venueId) &&
                validStatuses.includes(booking.status)
            );
        
            const hirerActivity = hirers.map((hirer) =>{
                const bookingCount = vendorBookings.filter(
                    (booking) => booking.hirerId === hirer.id
                ).length;
            
                return {hirerId: hirer.id, 
                   hirerName: hirer.name || hirer.email,
                   bookings: bookingCount,
                }; 
            })
            .filter((hirer) => hirer.bookings > 0)
            .sort((a, b) => b.bookings - a.bookings);

            const mostActive = hirerActivity[0] || null;
            const leastActive = hirerActivity[hirerActivity.length - 1] || null;

            return response.status(200).json({mostActive, leastActive, allHirers: hirerActivity,});
        }
        
        catch (error) {
            return response.status(500).json({
                message: "Failed to load hirer activity",
            });
        }
    }

    // Get how much a venue has been used
    async getVenueUtilization(request: Request, response: Response) {
        try {
            const users = await AppDataSource.getRepository(User).find();
            const bookings = await this.bookingRepository.find(); 
            const validStatuses = ["Approved", "Confirmed"];
            const vendorId = Number(request.params.vendorId);
            const range = String(request.query.range || "allTime");

            const venues = await this.venueRepository.find({
                where: { vendorId }
            });

            const venueIds = venues.map((venue) => venue.Id);
            const hirers = users.filter((user) => user.role === "Hirer");

            const vendorBookings = bookings.filter(
                (booking) => 
                    venueIds.includes(booking.venueId) &&
                    validStatuses.includes(booking.status)
            );

            let filteredBookings = vendorBookings;
            const today = new Date();

            // This Week
            if (range === "thisWeek") {
                const weekAgo = new Date();
                weekAgo.setDate(today.getDate() - 7);

                filteredBookings = vendorBookings.filter(
                    booking => new Date(booking.bookingDate) >= weekAgo
                );
            }
            
            // This Month
            if (range === "thisMonth") {
                filteredBookings = vendorBookings.filter(booking => {
                    const date = new Date(booking.bookingDate);
            
                    return(
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()
                    );
                });
            }

            // Last Month
            if (range === "lastMonth") {
                const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
                const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

                filteredBookings = vendorBookings.filter(booking => {
                    const date = new Date(booking.bookingDate);
            
                    return (
                        date.getMonth() === lastMonth &&
                        date.getFullYear() === year
                    );
                });
            }

            const dates = [
                ...new Set(
                    filteredBookings.map(
                        booking => booking.bookingDate
                    )
                )
            ].sort();

            const data = dates.map((date) => {
                const row: any = {
                    date
                };

                venues.forEach((venue) => {
                    const count = filteredBookings.filter(
                        booking => 
                            booking.bookingDate === date &&
                            booking.venueId === venue.Id
                    ).length;

                row[venue.name] = count;
            });

            return row;
        });

            return response.status(200).json({
                venues: venues.map(v => v.name),
                data
            });
        } 
        
        catch(error) {
            return response.status(500).json({
                message: "Failed to load venue utilization",
            });
        }
    }

    // Update the venue
    async updateVenue(request: Request, response: Response) {
        // Fetch venue ID
        const venueId = Number(request.params.id);
    
        // Fetch user inputs
        const {name, location, capacity, suitability, price, description, imageUrl} = request.body;

        // If venue ID is not a number
        if (isNaN(venueId)) {
            return response.status(400).json({
                message: "Invalid venue ID"
            });
        }

        // Find venue to change
        const venueChange = await this.venueRepository.findOne({
            where: { Id: venueId }
        });

        // If venue does not exist
        if (!venueChange) {
            return response.status(404).json({
                message: "Venue not found"
            });
        }

        // If user inputs aren't filled
        if (!name || !location || !capacity || !suitability || !price || !description || !imageUrl) {
            return response.status(400).json({
                message: "All required fields must be provided"
            });
        }
        // If name if just numbers
        else if (!isNaN(Number(name))) {
            return response.status(400).json({
                message: "Name can't just contain numbers"
            });
        }
        // If location is just numbers
        else if (!isNaN(Number(location))) {
            return response.status(400).json({
                message: "Location can't just contain numbers"
            });
        }
        // If description is just numbers
        else if (!isNaN(Number(description))) {
            return response.status(400).json({
                message: "Description can't just contain numbers"
            });
        }
        // If suitability is just numbers
        else if (!isNaN(Number(suitability))) {
            return response.status(400).json({
                message: "Suitability can't just contain numbers"
            });
        }
        // If capacity is less than zero
        else if (capacity <= 0) {
            return response.status(400).json({
                message: "Capacity can't be less than zero"
            });
        }
        // If price is less than zero
        else if (price <= 0) {
            return response.status(400).json({
                message: "Price can't be less than zero"
            });
        }

        // Update the venues details
        venueChange.name = name;
        venueChange.location = location;
        venueChange.capacity = capacity;
        venueChange.suitability = suitability;
        venueChange.price = price;
        venueChange.description = description;
        venueChange.imageUrl = imageUrl;

        await this.venueRepository.save(venueChange);
        return response.status(200).json(venueChange);
    }

    // Delete a venue
    async deleteVenue(request: Request, response: Response) {
        const venueId = Number(request.params.id);

        // If venue ID isn't a number
        if (isNaN(venueId)) {
            return response.status(400).json({
                message: "Invalid venue ID"
            });
        }

        // Find the venue
        const venue = await this.venueRepository.findOne({
            where: { Id: venueId }
        });
        
        // If the venue does not exist
        if (!venue) {
            return response.status(404).json({
                message: "Venue not found"
            });
        }

        // Delete the venue
        await this.venueRepository.remove(venue);

        return response.status(200).json({
            message: "Venue deleted successfully"
        });
    }
};