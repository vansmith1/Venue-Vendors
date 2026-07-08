import { Router } from "express";
import { ComplianceControllers } from "../controllers/complianceControllers";

const router = Router();
const complianceController = new ComplianceControllers();

router.post("/compliance/:hirerId", async (req, res) => {
    await complianceController.uploadDocument(req, res);
});

router.get("/compliance/:hirerId", async (req, res) => {
    await complianceController.getDocuments(req, res);
});

export default router;