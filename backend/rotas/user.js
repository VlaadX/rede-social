import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUser, getSuggestedUsers,updateUser, getAllFollowers, getAllFollowing, searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile) 
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/follow/:id",protectRoute,followUnfollowUser) 
router.post("/update",protectRoute,updateUser)
router.get("/followers/:username",protectRoute,getAllFollowers)
router.get("/following/:username",protectRoute,getAllFollowing)
router.get("/search",protectRoute,searchUsers)


export default router;