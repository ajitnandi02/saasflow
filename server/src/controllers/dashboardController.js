import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

// ==========================================
// GET DASHBOARD STATISTICS
// ==========================================

export const getDashboardStats = async (req, res, next) => {
    try {
        const organizationId = req.organizationId;

        // Count Projects
        const totalProjects = await Project.countDocuments({
            organizationId,
        });

        // Count Users
        const totalUsers = await User.countDocuments({
            organizationId,
        });

        // Count Tasks
        const totalTasks = await Task.countDocuments({
            organizationId,
        });

        // Task status counts
        const todoTasks = await Task.countDocuments({
            organizationId,
            status: "todo",
        });

        const inProgressTasks = await Task.countDocuments({
            organizationId,
            status: "in-progress",
        });

        const completedTasks = await Task.countDocuments({
            organizationId,
            status: "completed",
        });

        // Task priority counts
        const lowPriorityTasks = await Task.countDocuments({
            organizationId,
            priority: "low",
        });

        const mediumPriorityTasks = await Task.countDocuments({
            organizationId,
            priority: "medium",
        });

        const highPriorityTasks = await Task.countDocuments({
            organizationId,
            priority: "high",
        });

        return res.status(200).json({
            success: true,

            organization: {
                id: req.organization._id,
                name: req.organization.name,
                slug: req.organization.slug,
            },

            statistics: {
                totalProjects,
                totalUsers,
                totalTasks,
            },

            tasksByStatus: {
                todo: todoTasks,
                inProgress: inProgressTasks,
                completed: completedTasks,
            },

            tasksByPriority: {
                low: lowPriorityTasks,
                medium: mediumPriorityTasks,
                high: highPriorityTasks,
            },
        });

    } catch (error) {
        next(error);
    }
};