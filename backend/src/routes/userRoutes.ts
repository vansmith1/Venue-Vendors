import { Router } from "express";
import { UserController } from "../controllers/userControllers";
const router = Router();
const userController = new UserController();

router.post("/signup", async (req, res) => {
  await userController.signup(req, res);
});

router.post("/login", async (req, res) => {
  await userController.login(req, res);
});

router.get("/profile/:email", async (req, res) => {
  await userController.profile(req, res);
});

router.put("/profile/:id", async (req, res) => {
  await userController.updateProfile(req, res);
});

router.put("/profile/:id/avatar", async (req, res) => {
  await userController.updateProfileImage(req, res);
});

router.get("/user/:id", async (req, res) => {
  await userController.getUserById(req, res);
});

router.get("/users", async (req, res) => {
    await userController.getUsers(req, res);
});
export default router;
