import express from "express"
import upload from "../middleware/multer.js"
import { getUserInfo, login, logout, register } from "../controller/auth.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

router.route("/register").post(upload.single("profilePic"), register)
router.route("/login").post(login);
router.route("/getuserinfo").get(protect, getUserInfo);
router.route("/logout").get( logout);
export default router