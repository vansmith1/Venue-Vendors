import { AppDataSource } from "../data-source";
import { User } from "../entity/user";
import { Venue } from "../entity/venue";

const userRepository = AppDataSource.getRepository(User);
const venueRepository = AppDataSource.getRepository(Venue);

export const resolvers = {
  	Query: {
		// Query database for venues
		venues: async () => {
			return await venueRepository.find();
    	},

		// Query database for specific venue with matching ID
		venue: async (_: any, { id }: { id: string }) => {
			return await venueRepository.findOne({
				where: { Id: parseInt(id) },
			});
		},

		// Query database for users
		users: async () => {
			return await userRepository.find();
		},

		// Query database for specific user with matching ID
		user: async (_: any, { id }: { id: string }) => {
			return await userRepository.findOne({ where: { id: parseInt(id) } });
		},
  	},

  	Mutation: {
		// Assign vendor to venue
    	assignVendor: async (_: any, { venueId, vendorId }: { venueId: string, vendorId: string }) => {
      		// Find the venue we are changing the ownership of
			const venue = await venueRepository.findOne({
        		where: { Id: parseInt(venueId) },
      		});

			// If the venue does not exist...
      		if (!venue) {
       			throw new Error("Venue not found");
      		}

			// Change the venue's vendor ID
      		venue.vendorId = parseInt(vendorId);
      		return await venueRepository.save(venue);
    	},

		// Create new venue
    	createVenue: (_: any, { name, location, capacity, suitability, vendorId, price, description, imageUrl, }: any) => {
			// If any of the application fields are empty, alert the user to fill in all fields. 
			if (!name || !location || !capacity || !suitability || !price || !description || !imageUrl) {
				throw new Error("Please fill in all fields");
			} 
			// If venue name contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(name))) {
				throw new Error("Venue name cannot contain only numbers");
			}  
			// If venue location contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(location))) {
				throw new Error("Venue location cannot contain only numbers");
			}  
			// If venue description contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(description))) {
				throw new Error("Venue description cannot contain only numbers");
			} 
			// If venue suitability contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(suitability))) {
				throw new Error("Venue suitability cannot contain only numbers");
			} 
			// If capacity is not a valid number or less than 0, alert the user to enter a valid number.
			if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
				throw new Error("Please enter a valid capacity");
			}  
			// If venue price is not a valid number, alert the user to enter a valid event duration.
			if (isNaN(Number(price)) || Number(price) <= 0) {
				throw new Error("Please enter a valid price");
			}

			// If pass all input tests, create venue with inputs
			const venue = venueRepository.create({
				name,
				location,
				capacity,
				suitability,
				vendorId,
				price,
				description,
				imageUrl,
				isFeatured: false,
				isActive: true,
			});

      		return venueRepository.save(venue);
    	},

		// Update existing venue
    	updateVenue: async (_: any, { id, name, location, capacity, suitability, vendorId, price, description, imageUrl, }: any) => {
			// Find the venue that matches the venue ID we have
			const venueMatch = await venueRepository.findOne({
				where: { Id: Number(id) },
			});

			// If venue we are updating does not exist...
			if (!venueMatch) {
				throw new Error("Venue not found");
			}
			// If any of the application fields are empty, alert the user to fill in all fields. 
			if (!name || !location || !capacity || !suitability || !price || !description || !imageUrl) {
				throw new Error("Please fill in all fields");
			} 
			// If venue name contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(name))) {
				throw new Error("Venue name cannot contain only numbers");
			}  
			// If venue location contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(location))) {
				throw new Error("Venue location cannot contain only numbers");
			}  
			// If venue description contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(description))) {
				throw new Error("Venue description cannot contain only numbers");
			} 
			// If venue suitability contains only numbers, alert the user to enter a valid venue name.
			if (!isNaN(Number(suitability))) {
				throw new Error("Venue suitability cannot contain only numbers");
			} 
			// If capacity is not a valid number or less than 0, alert the user to enter a valid number.
			if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
				throw new Error("Please enter a valid capacity");
			}  
			// If venue price is not a valid number, alert the user to enter a valid event duration.
			if (isNaN(Number(price)) || Number(price) <= 0) {
				throw new Error("Please enter a valid price");
			}
        
			// Update existing venue's values
			venueMatch.name = name;
			venueMatch.location = location;
			venueMatch.capacity = capacity;
			venueMatch.suitability = suitability;
			venueMatch.vendorId = vendorId;
			venueMatch.price = price;
			venueMatch.description = description;
			venueMatch.imageUrl = imageUrl;

			return venueRepository.save(venueMatch);
		},

		// Delete a venue
    	deleteVenue: async (_: any, { id }: { id: string }) => {
			// Find the venue with matching ID
      		const venue = await venueRepository.findOne({
        		where: { Id: Number(id) },
      		});

			// If venue to be deleted does not exist...
			if (!venue) {
				throw new Error("Venue not found");
			}

			// Delete venue from repository
			await venueRepository.remove(venue);
			return true;
		},

		// Toggle a venue's feature value; affects if it shows on hirer's page
    	toggleFeature: async(_: any, { venueId, isFeatured }: any) => {
			// Find the venue in database with matching ID.
      		const venue = await venueRepository.findOne({
        		where: { Id: Number(venueId) },
      		});

			// If venue does not exist...
      		if (!venue) {
        		throw new Error("Venue not found");
      		}

			// Update venue's value
			venue.isFeatured = isFeatured;
			return venueRepository.save(venue);
		}
  	},
};