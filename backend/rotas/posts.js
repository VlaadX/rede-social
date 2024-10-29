import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getAllLikedPosts, getFollowingPosts, getUsersPosts, searchPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts)
router.post("/create",protectRoute, createPost)
router.delete("/delete/:id",protectRoute, deletePost)
router.post("/like/:id",protectRoute, likeUnlikePost)
router.post("/comment/:id",protectRoute, commentOnPost)
router.get("/likes/:id",protectRoute, getAllLikedPosts)
router.get("/following",protectRoute, getFollowingPosts)
router.get("/user/:username",protectRoute, getUsersPosts)
router.get("/search",protectRoute, searchPosts)


export default router;