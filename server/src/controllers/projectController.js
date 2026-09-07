import Project from "../models/Project.js";


// ==========================================
// CREATE PROJECT
// ==========================================

export const createProject = async (req, res, next) => {
    try {
        const {
            name,
            description,
        } = req.body;

        // Validate project name
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required",
            });
        }

        // Create project for current tenant
        const project = await Project.create({
            name: name.trim(),
            description: description?.trim() || "",
            organizationId: req.organizationId,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET ALL PROJECTS
// ==========================================

export const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({
            organizationId: req.organizationId,
        })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// GET SINGLE PROJECT
// ==========================================

export const getProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        }).populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            project,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// UPDATE PROJECT
// ==========================================

export const updateProject = async (req, res, next) => {
    try {
        const {
            name,
            description,
            status,
        } = req.body;

        const project = await Project.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Validate project name during update
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Project name cannot be empty",
                });
            }

            project.name = name.trim();
        }

        // Update description
        if (description !== undefined) {
            project.description = description.trim();
        }

        // Update status
        if (status !== undefined) {
            project.status = status;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// DELETE PROJECT
// ==========================================

export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        await project.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};