import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            enum: [
                "created",
                "updated",
                "deleted",
                "assigned",
                "status_changed",
                "added",
                "removed",
            ],
            required: true,
        },

        entityType: {
            type: String,
            enum: [
                "task",
                "project",
                "user",
                "organization",
            ],
            required: true,
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model(
    "Activity",
    activitySchema
);

export default Activity;