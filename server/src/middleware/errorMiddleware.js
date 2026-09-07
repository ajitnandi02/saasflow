const errorMiddleware = (err, req, res, next) => {
    console.error("ERROR:", err);

    // ------------------------------------------
    // Mongoose Invalid ObjectId
    // ------------------------------------------
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }

    // ------------------------------------------
    // Mongoose Validation Error
    // ------------------------------------------
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(
            (error) => error.message
        );

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    // ------------------------------------------
    // MongoDB Duplicate Key Error
    // ------------------------------------------
    if (err.code === 11000) {
        const duplicateFields = Object.keys(
            err.keyValue || {}
        );

        return res.status(409).json({
            success: false,
            message: `Duplicate value for: ${duplicateFields.join(", ")}`,
        });
    }

    // ------------------------------------------
    // Default Server Error
    // ------------------------------------------
    return res.status(err.statusCode || 500).json({
        success: false,
        message:
            err.message || "Internal Server Error",
    });
};

export default errorMiddleware;