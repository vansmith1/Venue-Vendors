import { Router } from "express";
import { HirerController } from "../controllers/hirerControllers";

const router = Router();
const hirerController = new HirerController();

router.get("/hirers", async (req, res) => {
  await hirerController.getVenues(req, res);
});

// application was posted to /apply -> send to controller
router.post("/apply", async (req, res) => {
  await hirerController.createBooking(req, res);
});

router.get("/apply", async (req, res) => {
  await hirerController.getBooking(req, res);
});

export default router;