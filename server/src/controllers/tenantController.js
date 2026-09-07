export const tenantTest = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Tenant middleware working successfully",

            tenant: {
                organizationId: req.organizationId,
                organizationName: req.organization.name,
                organizationSlug: req.organization.slug,
            },

            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
        });

    } catch (error) {
        console.error(
            "Tenant Test Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Tenant test failed",
        });
    }
};