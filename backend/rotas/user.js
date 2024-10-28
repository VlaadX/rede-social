import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUser, getSuggestedUsers,updateUser, getAllFollowers, getAllFollowing } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile) 
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/follow/:id",protectRoute,followUnfollowUser) 
router.post("/update",protectRoute,updateUser)
router.get("/followers/:username",protectRoute,getAllFollowers)
router.get("/following/:username",protectRoute,getAllFollowing)


export default router;