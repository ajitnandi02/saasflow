import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import createNotification from "../utils/notificationUtils.js";
import createActivity from "../utils/activityUtils.js";

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
        let assignedUser = null;

        if (assignedTo) {
            assignedUser = await User.findOne({
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

        // ==========================================
        // ACTIVITY: TASK CREATED
        // ==========================================

        await createActivity({
            organizationId: req.organizationId,
            user: req.user._id,
            action: "created",
            entityType: "task",
            entityId: task._id,
            description: `Created task "${task.title}"`,
        });

        // ==========================================
        // NOTIFICATION: TASK ASSIGNED
        // ==========================================

        if (
            assignedUser &&
            assignedUser._id.toString() !== req.user._id.toString()
        ) {
            await createNotification({
                organizationId: req.organizationId,
                recipient: assignedUser._id,
                type: "task_assigned",
                title: "New Task Assigned",
                message: `You have been assigned a new task: "${task.title}"`,
                relatedTask: task._id,
                relatedProject: project._id,
            });
        }

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

        // ==========================================
        // STORE PREVIOUS VALUES
        // ==========================================

        const previousAssignedTo = task.assignedTo
            ? task.assignedTo.toString()
            : null;

        const previousStatus = task.status;

        // ==========================================
        // VALIDATE PROJECT
        // ==========================================

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

        // ==========================================
        // VALIDATE ASSIGNED USER
        // ==========================================

        let newAssignedUser = null;

        if (assignedTo !== undefined) {
            if (assignedTo === null || assignedTo === "") {
                task.assignedTo = null;
            } else {
                newAssignedUser = await User.findOne({
                    _id: assignedTo,
                    organizationId: req.organizationId,
                });

                if (!newAssignedUser) {
                    return res.status(404).json({
                        success: false,
                        message: "Assigned user not found in your organization",
                    });
                }

                task.assignedTo = assignedTo;
            }
        }

        // ==========================================
        // UPDATE TITLE
        // ==========================================

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Task title cannot be empty",
                });
            }

            task.title = title.trim();
        }

        // ==========================================
        // UPDATE DESCRIPTION
        // ==========================================

        if (description !== undefined) {
            task.description = description.trim();
        }

        // ==========================================
        // UPDATE STATUS
        // ==========================================

        if (status !== undefined) {
            task.status = status;
        }

        // ==========================================
        // UPDATE PRIORITY
        // ==========================================

        if (priority !== undefined) {
            task.priority = priority;
        }

        // ==========================================
        // UPDATE DUE DATE
        // ==========================================

        if (dueDate !== undefined) {
            task.dueDate = dueDate || null;
        }

        // ==========================================
        // SAVE TASK
        // ==========================================

        await task.save();

        // ==========================================
        // CHECK ASSIGNMENT CHANGE
        // ==========================================

        const currentAssignedTo = task.assignedTo
            ? task.assignedTo.toString()
            : null;

        const assignmentChanged =
            currentAssignedTo !== previousAssignedTo;

        // ==========================================
        // ACTIVITY: TASK UPDATED
        // ==========================================

        await createActivity({
            organizationId: req.organizationId,
            user: req.user._id,
            action: "updated",
            entityType: "task",
            entityId: task._id,
            description: `Updated task "${task.title}"`,
        });

        // ==========================================
        // ACTIVITY: TASK ASSIGNED
        // ==========================================

        if (
            assignmentChanged &&
            currentAssignedTo &&
            newAssignedUser
        ) {
            await createActivity({
                organizationId: req.organizationId,
                user: req.user._id,
                action: "assigned",
                entityType: "task",
                entityId: task._id,
                description: `Assigned task "${task.title}" to ${newAssignedUser.name}`,
            });
        }

        // ==========================================
        // ACTIVITY: TASK UNASSIGNED
        // ==========================================

        if (
            assignmentChanged &&
            !currentAssignedTo &&
            previousAssignedTo
        ) {
            await createActivity({
                organizationId: req.organizationId,
                user: req.user._id,
                action: "removed",
                entityType: "task",
                entityId: task._id,
                description: `Removed assignment from task "${task.title}"`,
            });
        }

        // ==========================================
        // ACTIVITY: TASK STATUS CHANGED
        // ==========================================

        if (
            status !== undefined &&
            status !== previousStatus
        ) {
            await createActivity({
                organizationId: req.organizationId,
                user: req.user._id,
                action: "status_changed",
                entityType: "task",
                entityId: task._id,
                description: `Changed task "${task.title}" status from "${previousStatus}" to "${task.status}"`,
            });
        }

        // ==========================================
        // NOTIFICATION: NEW TASK ASSIGNMENT
        // ==========================================

        if (
            assignmentChanged &&
            newAssignedUser &&
            newAssignedUser._id.toString() !== req.user._id.toString()
        ) {
            await createNotification({
                organizationId: req.organizationId,
                recipient: newAssignedUser._id,
                type: "task_assigned",
                title: "New Task Assigned",
                message: `You have been assigned a new task: "${task.title}"`,
                relatedTask: task._id,
                relatedProject: task.projectId,
            });
        }

        // ==========================================
        // NOTIFICATION: TASK STATUS CHANGED
        // ==========================================

        if (
            status !== undefined &&
            status !== previousStatus &&
            task.assignedTo &&
            task.assignedTo.toString() !== req.user._id.toString()
        ) {
            await createNotification({
                organizationId: req.organizationId,
                recipient: task.assignedTo,
                type: "task_updated",
                title: "Task Status Updated",
                message: `The status of "${task.title}" changed to "${task.status}".`,
                relatedTask: task._id,
                relatedProject: task.projectId,
            });
        }

        // ==========================================
        // POPULATE UPDATED TASK
        // ==========================================

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

        // Store values before deleting
        const taskId = task._id;
        const taskTitle = task.title;

        await task.deleteOne();

        // ==========================================
        // ACTIVITY: TASK DELETED
        // ==========================================

        await createActivity({
            organizationId: req.organizationId,
            user: req.user._id,
            action: "deleted",
            entityType: "task",
            entityId: taskId,
            description: `Deleted task "${taskTitle}"`,
        });

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};