import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user";
import argon2 from "argon2";

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    // User sign up function
    async signup(request: Request, response: Response) {
        try {
            const { email, password1, password2, role } = request.body;

            // Valid email domains
            const validDomains = [
                "@gmail.com",
                "@email.com",
                "@outlook.com",
                "@hotmail.com",
                "@yahoo.com",
                "@live.com",
                "@icloud.com",
                "@student.rmit.edu.au",
                "@rmit.edu.au"
            ];

            // Find user using email saved in localStorage
            const existingUser = await this.userRepository.findOne({
                where: { email }
            });

            // If existing user....
            if (existingUser) {
                return response.status(400).json({
                    message: "Email already exists"
                });
            }
            // If user hasn't filled out all the fields
            if(!email || !password1 || !password2){
                return response.status(400).json({
                    message: "Please fill in all fields"
                });
            }
            // If passwords don't match
            if (password1 !== password2) {
                return response.status(400).json({
                    message: "Passwords do not match"
                });
            // If password is less than 6 characters, alert user
            } if (password1.length < 6) {
                return response.status(400).json({
                    message: "Password must be at least 6 characters"
                });
            // If user enters email dress with invalid domain
            }  if (!validDomains.some(domain => email.endsWith(domain))) {
                return response.status(400).json({
                    message: "Please enter a valid email address"
                });
            // If password doesn't contain an uppercase letter
            }  if (!/[A-Z]/.test(password1)) {
                return response.status(400).json({
                    message: "Password must contain an uppercase letter"
                });
            // If password doesn't contain a lowercase letter
            }  if (!/[a-z]/.test(password1)) {
                return response.status(400).json({
                    message: "Password must contain a lowercase letter"
                });
            // If password doesn't contain a special character
            }  if (!/[^A-Za-z0-9]/.test(password1)) {
                return response.status(400).json({
                    message: "Password must contain a special character"
                });
            } 
            // Hash password
            const passwordHash = await argon2.hash(password1);

            // Create user using inputs
            const user = this.userRepository.create({
                email,
                passwordHash,
                role,
                dateJoined: new Date()
            });

            await this.userRepository.save(user);
            return response.status(201).json(user);
        } 
        catch (error) {
            return response.status(500).json({
                message: "Database error"
            });
        }
    }

    // User login function
    async login(request: Request, response: Response) {
        // Check email and password input from user
        const { email, password } = request.body;

        let user: User | null;

        try {
            // Try and find email in db, put into user
            user = await this.userRepository.findOne({
                where: { email }
            });
        } 
        catch (error) {
            return response.status(500).json({
                message: "Database error"
            });
        }
        // If user has not filled out all fields
        if (!email || !password) {
            return response.status(400).json({
                message: "Email and password are required"
            });
        }
        // If user does not exist
        if (!user) {
            return response.status(404).json({
                message: "User not found"
            });
        }

        const passwordMatch = await argon2.verify(user.passwordHash, password);
        if (passwordMatch) {
            return response.status(200).json(user);
        }
        else {
            return response.status(401).json({
                message: "Incorrect Password"
            });
        }
    }

    // Get profile details from email
    async profile(request: Request, response: Response) {
        const email = request.params.email as string;

        // Get profile 
        const user = await this.userRepository.findOne({
            where: { email }
        });

        if (!user) {
            return response.status(404).json({
                message: "User not found"
            });
        }

        return response.status(200).json(user);
    }

    // Profile update feature
    async updateProfile(request: Request, response: Response) {
        try {
            const id = Number(request.params.id);
            const { name, phoneNumber, abn } = request.body;

            const user = await this.userRepository.findOne({
            where: { id }
            });

            if (!user) {
                return response.status(404).json({
                    message: "User not found"
                });
            }

            user.name = name;
            user.phoneNumber = phoneNumber;
            user.abn = abn;

            // Update name
            if (name !== undefined) {
                user.name = name;
            }
            // Update phone number
            if (phoneNumber !== undefined) {
                user.phoneNumber = phoneNumber;
            }
            // Update abn
            if (abn !== undefined) {
                user.abn = abn;
            }

            const updatedUser = await this.userRepository.save(user);

            return response.status(200).json(updatedUser);
            } 
            
            catch (error) {
                return response.status(500).json({
                    message: "Failed to update profile"
                });
            }
    }
    
    // Profile image update
    async updateProfileImage(request: Request, response: Response){
        try {
            const id = Number(request.params.id);
            const { profileImageURL } = request.body;

            // Find user in database
            const user = await this.userRepository.findOne({
                where: { id }
            });

            if (!user) {
                return response.status(404).json({
                    message: "User not found"
                });
            }
            
            user.profileImageURL = profileImageURL;

            const updatedUser = await this.userRepository.save(user);

            return response.status(200).json(updatedUser);
            } 
            
        catch (error) {
            return response.status(500).json({
                message: "Failed to update profile image"
            });
        }
    }

    // Fetch user from database with ID
    async getUserById(request: Request, response: Response) {
        const id = Number(request.params.id);

        const user = await this.userRepository.findOne({
            where: { id: id }
        });

        if (!user) {
            return response.status(404).json({
                message: "User not found"
            });
        }

        return response.status(200).json(user);
    }

    // Get all users
    async getUsers(request: Request, response: Response) {
        const users = await this.userRepository.find();
        return response.status(200).json(users);
    }
}