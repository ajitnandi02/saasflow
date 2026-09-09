import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "task_assigned",
                "task_updated",
                "project_created",
                "project_updated",
                "user_added",
                "system",
            ],
            default: "system",
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        relatedTask: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },

        relatedProject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;