import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ComplianceDocument } from "../entities/complianceDocument";

export class ComplianceControllers{
    // Repository for compliance documents
    private complianceRepository = AppDataSource.getRepository(ComplianceDocument);

    // Document upload function
    async uploadDocument(request: Request, response: Response) {
        try {
            const hirerId = Number(request.params.hirerId);
            const {documentType, fileUrl } = request.body;

            if (!hirerId || !documentType || !fileUrl) {
                return response.status(400).json({
                    message: "Missing required document details",
                });
            }

            // Try to find an existing document
            const existingDocuments = await this.complianceRepository.findOne({
                where: {
                    hirerId, 
                    documentType,
                },
            });

            // If it exists, replace it
            if (existingDocuments) {
                existingDocuments.fileUrl = fileUrl;
                existingDocuments.status = "submitted";
            
                const updateDocument = await this.complianceRepository.save(existingDocuments);
                
                return response.status(200).json(updateDocument);
            }

            // Else, make a new document
            const newDocument = this.complianceRepository.create({
                hirerId,
                documentType, 
                fileUrl,
                status: "submitted",
                uploadingDate: new Date()
            });

            // Save the document
            const savedDocument = await this.complianceRepository.save(newDocument);
        
            return response.status(201).json(savedDocument);
        } 
        
        catch (error) {
            return response.status(500).json({
                message: "Failed to upload the compliance document",
            });
        }
    }

    // Get the documents
    async getDocuments(request: Request, response: Response) {
        try {
            const hirerId = Number(request.params.hirerId);

            // Find the documents with the matching ID
            const documents = await this.complianceRepository.find({
                where: { hirerId },
            });

            return response.status(200).json(documents);
        } 
        catch (error) {
            return response.status(500).json({
                message: "Failed to fetch compliance documents",
            });
        }
    }
}