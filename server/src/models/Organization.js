import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
    {
        // Organization name
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // Unique organization slug
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Organization owner
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Organization = mongoose.model(
    "Organization",
    organizationSchema
);

export default Organization;