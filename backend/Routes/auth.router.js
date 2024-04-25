import express from "express"
import { getMe, loginController, logoutController, signupController } from "../Controllers/auth.controller.js"
import { protect } from "../MiddleWare/Protect.js"

const router = express.Router()

router.get("/getme",protect ,getMe)
router.post('/signup', signupController)
router.post('/login', loginController)
router.post('/logout', logoutController)



export default router