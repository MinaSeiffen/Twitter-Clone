import express from "express"
import { protect } from "../MiddleWare/Protect.js"
import { deleteNotifications, getNotifications , deleteNotification } from "../Controllers/notification.controller.js"

const router = express.Router()


router.get("/", protect, getNotifications)
router.delete("/", protect, deleteNotifications)
router.delete("/:id", protect, deleteNotification)



export default router