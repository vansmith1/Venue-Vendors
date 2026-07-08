"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
const userController = new userControllers_1.UserController();
router.post("/signup", async (req, res) => {
    await userController.signup(req, res);
});
router.post("/login", async (req, res) => {
    await userController.login(req, res);
});
router.get("/profile/:id", async (req, res) => {
    await userController.profile(req, res);
});
exports.default = router;
