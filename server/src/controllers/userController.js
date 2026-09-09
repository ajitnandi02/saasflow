import bcrypt from "bcryptjs";
import User from "../models/User.js";
import createActivity from "../utils/activityUtils.js";

// ======================================================
// GET ALL ORGANIZATION USERS
// ======================================================

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({
            organizationId: req.organizationId,
        })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET SINGLE ORGANIZATION USER
// ======================================================

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// CREATE TEAM MEMBER
// ======================================================

export const createUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role,
        } = req.body;

        // ==============================================
        // 1. Validate required fields
        // ==============================================

        if (
            !name ||
            !name.trim() ||
            !email ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        // ==============================================
        // 2. Validate password
        // ==============================================

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // ==============================================
        // 3. Normalize email
        // ==============================================

        const normalizedEmail = email.toLowerCase().trim();

        // ==============================================
        // 4. Validate email format
        // ==============================================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        // ==============================================
        // 5. Check existing email
        // ==============================================

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // ==============================================
        // 6. Validate role
        // ==============================================

        const allowedRoles = [
            "admin",
            "member",
        ];

        const userRole = role || "member";

        if (!allowedRoles.includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Use admin or member",
            });
        }

        // ==============================================
        // 7. Hash password
        // ==============================================

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // ==============================================
        // 8. Create user
        // ==============================================

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
            organizationId: req.organizationId,
        });

        // ==============================================
        // 9. ACTIVITY: USER ADDED
        // ==============================================

        await createActivity({
            organizationId: req.organizationId,
            user: req.user._id,
            action: "added",
            entityType: "user",
            entityId: user._id,
            description: `Added user "${user.name}"`,
        });

        // ==============================================
        // 10. Response
        // ==============================================

        return res.status(201).json({
            success: true,
            message: "Team member created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// UPDATE USER
// ======================================================

export const updateUser = async (req, res, next) => {
    try {
        const {
            name,
            role,
        } = req.body;

        // ==============================================
        // 1. Find user inside current organization
        // ==============================================

        const user = await User.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ==============================================
        // Store previous values
        // ==============================================

        const previousName = user.name;
        const previousRole = user.role;

        // ==============================================
        // 2. OWNER PROTECTION
        // ==============================================

        if (user.role === "owner") {
            // Owner role cannot be changed
            if (
                role !== undefined &&
                role !== "owner"
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Owner role cannot be changed",
                });
            }
        }

        // ==============================================
        // 3. SELF ROLE CHANGE PROTECTION
        // ==============================================

        if (
            req.user._id.toString() ===
                user._id.toString() &&
            role !== undefined &&
            role !== user.role
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot change your own role",
            });
        }

        // ==============================================
        // 4. ADMIN PROTECTION
        // ==============================================

        if (
            req.user.role === "admin" &&
            user.role === "admin" &&
            role !== undefined &&
            role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Admin cannot change another admin's role",
            });
        }

        // ==============================================
        // 5. UPDATE NAME
        // ==============================================

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
            }

            user.name = name.trim();
        }

        // ==============================================
        // 6. UPDATE ROLE
        // ==============================================

        if (role !== undefined) {
            if (
                !["admin", "member"].includes(role)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid role. Use admin or member",
                });
            }

            user.role = role;
        }

        // ==============================================
        // 7. Save updated user
        // ==============================================

        await user.save();

        // ==============================================
        // 8. ACTIVITY: USER UPDATED
        // ==============================================

        const changes = [];

        if (previousName !== user.name) {
            changes.push(
                `name from "${previousName}" to "${user.name}"`
            );
        }

        if (previousRole !== user.role) {
            changes.push(
                `role from "${previousRole}" to "${user.role}"`
            );
        }

        const updateDescription =
            changes.length > 0
                ? `Updated user "${user.name}" (${changes.join(", ")})`
                : `Updated user "${user.name}"`;

        await createActivity({
            organizationId: req.organizationId,
            user: req.user._id,
            action: "updated",
            entityType: "user",
            entityId: user._id,
            description: updateDescription,
        });

        // ==============================================
        // 9. Response
        // ==============================================

        return res.status(200).json({
            success: true,
            message: "User updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// DELETE / REMOVE USER
// ======================================================

export const deleteUser = async (req, res, next) => {
    try {
        // ==============================================
        // 1. Find user inside current organization
        // ==============================================

        const user = await User.findOne({
            _id: req.params.id,
            organizationId: req.organizationId,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ==============================================
        // 2. OWNER PROTECTION
        // ==============================================

        if (user.role === "owner") {
            return res.status(403).json({
                success: false,
                message:
                    "Organization owner cannot be deleted",
            });
        }

        // ==============================================
        // Store values before deletion
        // ==============================================

        const userId = user._id;
        const userName = user.name;

        // ==============================================
        // 3. Delete user
        // ==============================================

        await user.deleteOne();

        // ==============================================
        // 4. ACTIVITY: USER REMOVED
        // ==============================================

        await createActivity({
            organizationId: req.organizationId,
            user: req.user._id,
            action: "removed",
            entityType: "user",
            entityId: userId,
            description: `Removed user "${userName}"`,
        });

        // ==============================================
        // 5. Response
        // ==============================================

        return res.status(200).json({
            success: true,
            message: "User removed successfully",
        });
    } catch (error) {
        next(error);
    }
};