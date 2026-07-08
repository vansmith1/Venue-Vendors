import { gql } from "@apollo/client";

export const GET_VENUES = gql`
	query {
		venues {
			Id
			name
			location
			capacity
			suitability
			description
			price
			imageUrl
			isFeatured
			vendorId
		}
	}
`;

export const GET_USERS = gql`
	query {
		users {
			id
			name
			role
		}
	}
`;

export const ASSIGN_VENDOR = gql`
	mutation AssignVendor($venueId: ID!, $vendorId: ID!) {
		assignVendor( venueId: $venueId vendorId: $vendorId ) {
			Id
			name
			vendorId
		}
	}
`;
 
export const CREATE_VENUE = gql`
	mutation CreateVenue( $name: String! $location: String! $capacity: Int! $suitability: String! $vendorId: Int! $price: Float! $description: String! $imageUrl: String! ) {
		createVenue( name: $name location: $location capacity: $capacity suitability: $suitability vendorId: $vendorId price: $price description: $description imageUrl: $imageUrl ) {
			Id
			name
			vendorId
			isFeatured
			isActive
		}
	}
`;

export const UPDATE_VENUE = gql`
	mutation updateVenue( $id: ID! $name: String! $location: String! $capacity: Int! $suitability: String! $vendorId: Int! $price: Float! $description: String! $imageUrl: String! ) {
		updateVenue( id: $id name: $name location: $location capacity: $capacity suitability: $suitability vendorId: $vendorId price: $price description: $description imageUrl: $imageUrl ) {
			Id
			name
			vendorId
			price
			imageUrl
			isFeatured
			isActive
		}
	}
`;

export const DELETE_VENUE = gql`
	mutation DeleteVenue($id: ID!) {
		deleteVenue(id: $id)
	}
`;

export const TOGGLE_FEATURE = gql`
	mutation toggleFeature($venueId: ID!, $isFeatured: Boolean!) {
		toggleFeature( venueId: $venueId, isFeatured: $isFeatured) {
			Id
			isFeatured
		}
	}
`;