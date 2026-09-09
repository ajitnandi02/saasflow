import Activity from "../models/Activity.js";


// ==========================================
// GET ALL ACTIVITIES
// ==========================================

export const getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({
            organizationId: req.organizationId,
        })
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: activities.length,
            activities,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET RECENT ACTIVITIES
// ==========================================

export const getRecentActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({
            organizationId: req.organizationId,
        })
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            count: activities.length,
            activities,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET ACTIVITY COUNT
// ==========================================

export const getActivityCount = async (req, res, next) => {
    try {
        const count = await Activity.countDocuments({
            organizationId: req.organizationId,
        });

        return res.status(200).json({
            success: true,
            count,
        });

    } catch (error) {
        next(error);
    }
};