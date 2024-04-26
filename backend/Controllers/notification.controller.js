import notificationModel from "../Models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await notificationModel.find({to : userId}).populate({
            path: "from",
            select: "userName profileImg",
        })

        await notificationModel.updateMany({to: userId} , {read: true})

        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await notificationModel.deleteMany({to: userId})
        res.status(200).json({message: "All Notifications deleted successfully"})
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const {id} = req.params
        const userId = req.user._id

        const notification = await notificationModel.findById(id)

        if (!notification) {
            return res.status(404).json({error: "Notification not found"})
        }

        if (notification.to.toString() !== userId) {
            return res.status(403).json({error: "You can not delete this notification"})
        }

        await notificationModel.findByIdAndDelete(id)

        res.status(200).json({message: "Notification deleted successfully"})
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}