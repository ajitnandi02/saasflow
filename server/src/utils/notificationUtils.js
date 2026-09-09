import Notification from "../models/Notification.js";

const createNotification = async ({
    organizationId,
    recipient,
    type,
    title,
    message,
    relatedTask = null,
    relatedProject = null,
}) => {
    try {
        const notification = await Notification.create({
            organizationId,
            recipient,
            type,
            title,
            message,
            relatedTask,
            relatedProject,
        });

        return notification;
    } catch (error) {
        console.error("Notification creation error:", error.message);
        return null;
    }
};

export default createNotification;