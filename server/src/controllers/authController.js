import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import generateToken from "../utils/generateToken.js";


// ======================================================
// REGISTER USER
// ======================================================

export const register = async (req, res, next) => {
    try {

        const {
            name,
            email,
            password,
            organizationName,
        } = req.body;


        // ==================================================
        // 1. Validate required fields
        // ==================================================

        if (
            !name ||
            !email ||
            !password ||
            !organizationName
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email, password and organization name are required",
            });
        }


        // ==================================================
        // 2. Validate password length
        // ==================================================

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters long",
            });
        }


        // ==================================================
        // 3. Normalize email
        // ==================================================

        const normalizedEmail =
            email.toLowerCase().trim();


        // ==================================================
        // 4. Check existing user
        // ==================================================

        const existingUser =
            await User.findOne({
                email: normalizedEmail,
            });


        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists",
            });
        }


        // ==================================================
        // 5. Create organization slug
        // ==================================================

        const slug =
            organizationName
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");


        // ==================================================
        // 6. Validate generated slug
        // ==================================================

        if (!slug) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid organization name",
            });
        }


        // ==================================================
        // 7. Check existing organization
        // ==================================================

        const existingOrganization =
            await Organization.findOne({
                slug,
            });


        if (existingOrganization) {
            return res.status(409).json({
                success: false,
                message:
                    "Organization with this name already exists",
            });
        }


        // ==================================================
        // 8. Hash password
        // ==================================================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ==================================================
        // 9. Create organization
        // ==================================================

        const organization =
            await Organization.create({
                name: organizationName.trim(),
                slug,
                // owner will be assigned after user creation
            });


        // ==================================================
        // 10. Create user
        // ==================================================

        const user =
            await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,

                // First registered user becomes owner
                role: "owner",

                // Connect user to organization
                organizationId:
                    organization._id,
            });


        // ==================================================
        // 11. Update organization owner
        // ==================================================

        organization.owner = user._id;

        await organization.save();


        // ==================================================
        // 12. Generate JWT
        // ==================================================

        const token =
            generateToken(user._id);


        // ==================================================
        // 13. Send response
        // ==================================================

        return res.status(201).json({
            success: true,

            message:
                "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationId:
                    user.organizationId,
            },

            organization: {
                id: organization._id,
                name: organization.name,
                slug: organization.slug,
            },
        });

    } catch (error) {

        console.error(
            "Registration Error:",
            error.message
        );

        next(error);
    }
};



// ======================================================
// LOGIN USER
// ======================================================

export const login = async (req, res, next) => {
    try {

        const {
            email,
            password,
        } = req.body;


        // ==================================================
        // 1. Validate fields
        // ==================================================

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }


        // ==================================================
        // 2. Normalize email
        // ==================================================

        const normalizedEmail =
            email.toLowerCase().trim();


        // ==================================================
        // 3. Find user
        // ==================================================

        const user =
            await User.findOne({
                email: normalizedEmail,
            });


        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }


        // ==================================================
        // 4. Compare password
        // ==================================================

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }


        // ==================================================
        // 5. Check organization
        // ==================================================

        if (!user.organizationId) {
            return res.status(403).json({
                success: false,
                message:
                    "User is not associated with an organization",
            });
        }


        // ==================================================
        // 6. Find organization
        // ==================================================

        const organization =
            await Organization.findById(
                user.organizationId
            ).select("name slug");


        if (!organization) {
            return res.status(404).json({
                success: false,
                message:
                    "Organization not found",
            });
        }


        // ==================================================
        // 7. Generate JWT
        // ==================================================

        const token =
            generateToken(user._id);


        // ==================================================
        // 8. Send response
        // ==================================================

        return res.status(200).json({
            success: true,

            message:
                "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationId:
                    user.organizationId,
            },

            organization: {
                id: organization._id,
                name: organization.name,
                slug: organization.slug,
            },
        });

    } catch (error) {

        console.error(
            "Login Error:",
            error.message
        );

        next(error);
    }
};



// ======================================================
// GET CURRENT LOGGED-IN USER
// ======================================================

export const getMe = async (req, res, next) => {
    try {

        // ==================================================
        // req.user comes from authMiddleware
        // ==================================================

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message:
                    "User not authenticated",
            });
        }


        // ==================================================
        // Get organization
        // ==================================================

        const organization =
            await Organization.findById(
                req.user.organizationId
            ).select("name slug");


        // ==================================================
        // Organization not found
        // ==================================================

        if (!organization) {
            return res.status(404).json({
                success: false,
                message:
                    "Organization not found",
            });
        }


        // ==================================================
        // Send response
        // ==================================================

        return res.status(200).json({
            success: true,

            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                organizationId:
                    req.user.organizationId,
            },

            organization: {
                id: organization._id,
                name: organization.name,
                slug: organization.slug,
            },
        });

    } catch (error) {

        console.error(
            "Get Me Error:",
            error.message
        );

        next(error);
    }
};