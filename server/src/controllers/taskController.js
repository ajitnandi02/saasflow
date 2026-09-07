import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";


// ==========================================
// CREATE TASK
// ==========================================

export const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            projectId,
            assignedTo,
            status,
            priority,
            dueDate,
        } = req.body;

        // Validate task title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        // Validate project ID
        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        // Make sure project belongs to current organization
        const project = await Project.findOne({
            _id: projectId,
            organizationId: req.organizationId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in your organization",
            });
        }

        // Validate assigned user
        if (assignedTo) {
            const assignedUser = await User.findOne({
                _id: assignedTo,
                organizationId: req.organizationId,
            });

            if (!assignedUser) {
                return res.status(404).json({
                    success: false,
                    message: "Assigned user not found in your organization",
                });
            }
        }

        // Create task
        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || "",
            projectId,
            organizationId: req.organizationId,
            assignedTo: assignedTo || null,
            status: status || "todo",
            priority: priority || "medium",
            dueDate: dueDate || null,
            createdBy: req.user._id,
        });

        // Populate response
        const populatedTask = await Task.findById(task._id)
            .populate("projectId", "name description")
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email");

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: populatedTask,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET ALL TASKS
// ==========================================

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({
            organizationId: req.organizationId,
        })
            .populate("projectId", "name")
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET SINGLE TASK
// ==========================================

export const getTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        })
            .populate("projectId", "name")
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// UPDATE TASK
// ==========================================

export const updateTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            projectId,
            assignedTo,
            status,
            priority,
            dueDate,
        } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        // Validate project when updating
        if (projectId !== undefined) {
            const project = await Project.findOne({
                _id: projectId,
                organizationId: req.organizationId,
            });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found in your organization",
                });
            }

            task.projectId = projectId;
        }

        // Validate assigned user when updating
        if (assignedTo !== undefined) {
            if (assignedTo === null || assignedTo === "") {
                task.assignedTo = null;
            } else {
                const assignedUser = await User.findOne({
                    _id: assignedTo,
                    organizationId: req.organizationId,
                });

                if (!assignedUser) {
                    return res.status(404).json({
                        success: false,
                        message: "Assigned user not found in your organization",
                    });
                }

                task.assignedTo = assignedTo;
            }
        }

        // Validate title when updating
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Task title cannot be empty",
                });
            }

            task.title = title.trim();
        }

        // Update description
        if (description !== undefined) {
            task.description = description.trim();
        }

        // Update status
        if (status !== undefined) {
            task.status = status;
        }

        // Update priority
        if (priority !== undefined) {
            task.priority = priority;
        }

        // Update due date
        if (dueDate !== undefined) {
            task.dueDate = dueDate || null;
        }

        await task.save();

        // Populate updated task
        const updatedTask = await Task.findById(task._id)
            .populate("projectId", "name")
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email");

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// DELETE TASK
// ==========================================

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        await task.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};