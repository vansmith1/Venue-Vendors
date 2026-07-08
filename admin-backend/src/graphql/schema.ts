import gql from "graphql-tag";

export const typeDefs = gql`
	type User {
		id: ID!
		name: String
		email: String!
		role: String!
	}

	type Venue {
		Id: ID!
		name: String!
		location: String!
		capacity: Int!
		suitability: String!
		vendorId: Int!
		price: Float!
		description: String!
		imageUrl: String!
		isActive: Boolean
		isFeatured: Boolean!
	}

	type Query {
		venues: [Venue!]!
		venue(id: ID!): Venue

		users: [User!]!
		user(id: ID!): User
	}

	type Mutation {
		createVenue(
			name: String!
			location: String!
			capacity: Int!
			suitability: String!
			vendorId: Int!
			price: Float!
			description: String!
			imageUrl: String!
		): Venue!

		updateVenue(
			id: ID!
			name: String
			location: String
			capacity: Int
			suitability: String
			vendorId: Int
			price: Float
			description: String
			imageUrl: String
			isActive: Boolean
			isFeatured: Boolean
		): Venue!

    	deleteVenue(id: ID!): Boolean!

		assignVendor(
			venueId: ID!
			vendorId: ID!
		): Venue!

    	toggleFeature(
      		venueId: ID!
      		isFeatured: Boolean!
    	): Venue!
  	}
`;
