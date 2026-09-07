import Organization from "../models/Organization.js";

const tenantMiddleware = async (req, res, next) => {
    try {
        // Check authenticated user
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not authenticated.",
            });
        }

        // Get organization ID from logged-in user
        const organizationId = req.user.organizationId;

        if (!organizationId) {
            return res.status(403).json({
                success: false,
                message: "User is not associated with any organization.",
            });
        }

        // Find organization
        const organization = await Organization.findById(
            organizationId
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found.",
            });
        }

        // Attach organization to request
        req.organization = organization;

        // Attach organization ID
        req.organizationId = organization._id;

        next();

    } catch (error) {
        console.error(
            "Tenant Middleware Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to identify organization.",
        });
    }
};

export default tenantMiddleware;