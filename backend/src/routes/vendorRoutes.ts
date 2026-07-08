import { Router } from "express";
import { VendorController } from "../controllers/vendorControllers";

const router = Router();
const vendorController = new VendorController();

router.get("/hirers", async (req, res) => {
  await vendorController.getVenues(req, res);
});

router.put("/venue/:id/block", async (req, res) => {
    await vendorController.blockVenue(req, res);
});

router.put("/venue/:id/unblock", async (req, res) => {
    await vendorController.unblockVenue(req, res);
});

router.get("/apply", async (req, res) => {
  await vendorController.getBooking(req, res);
}); 

router.put("/apply/:id/status", async (req, res) => {
    await vendorController.updateBookingStatus(req, res);
});

router.post("/reviews", async (req, res) => {
    await vendorController.createReview(req, res);
});

router.get("/reviews", async (req, res) => {
    await vendorController.getReviews(req, res);
});

router.post("/create", async (req, res) => {
    await vendorController.createVenue(req, res);
});

router.get("/vendor/:vendorId/analytics/hirer-tallies", async (req, res) => {
    await vendorController.getHirerTallies(req, res);
});

router.get("/vendor/:vendorId/analytics/combined-hirer-tallies", async (req, res) => {
    await vendorController.getCombinedHirerTallies(req, res);
});

router.get("/vendor/:vendorId/analytics/hirer-activity", async (req, res) => {
    await vendorController.getHirerActivity(req, res);
});

router.get("/vendor/:vendorId/analytics/venue-utilization", async (req, res) => {
    await vendorController.getVenueUtilization(req, res);
});

router.put("/venue/:id", async (req, res) => {
    await vendorController.updateVenue(req, res);
});

router.delete("/venue/:id", async (req, res) => {
    await vendorController.deleteVenue(req, res);
});

export default router;