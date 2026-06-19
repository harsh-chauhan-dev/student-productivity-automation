


import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    refreshAccessToken
} from "../controllers/auth.controller.js";

import {auth} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", auth, logoutUser);

router.get("/profile",auth, getProfile);

router.post('/refresh-token', refreshAccessToken);
export default router;
