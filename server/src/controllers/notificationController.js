import Notification from "../models/Notification.js";


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({
            organizationId: req.organizationId,
            recipient: req.user._id,
        })
            .populate("relatedTask", "title")
            .populate("relatedProject", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            notifications,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET UNREAD NOTIFICATION COUNT
// ==========================================

export const getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({
            organizationId: req.organizationId,
            recipient: req.user._id,
            isRead: false,
        });

        return res.status(200).json({
            success: true,
            count,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

export const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            {
                organizationId: req.organizationId,
                recipient: req.user._id,
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// DELETE ONE NOTIFICATION
// ==========================================

export const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        await notification.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};