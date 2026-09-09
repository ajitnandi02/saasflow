import Activity from "../models/Activity.js";

const createActivity = async ({
    organizationId,
    user,
    action,
    entityType,
    entityId = null,
    description,
}) => {
    try {
        const activity = await Activity.create({
            organizationId,
            user,
            action,
            entityType,
            entityId,
            description,
        });

        return activity;
    } catch (error) {
        console.error(
            "Activity creation error:",
            error.message
        );

        return null;
    }
};

export default createActivity;