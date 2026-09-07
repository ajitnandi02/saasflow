import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. No token provided.",
            });
        }

        // Get token
        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user using userId from JWT
        const user = await User.findById(decoded.userId)
            .select("-password")
            .populate("organizationId", "name slug");

        // User doesn't exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        // Attach user to request
        req.user = user;

        // Continue
        next();

    } catch (error) {
        console.error("JWT ERROR:", error.name, error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

export default authMiddleware;