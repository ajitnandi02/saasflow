const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Access denied. You do not have permission to perform this action.",
                });
            }

            next();

        } catch (error) {
            console.error(
                "Role Middleware Error:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message: "Role authorization failed",
            });
        }
    };
};

export default roleMiddleware;