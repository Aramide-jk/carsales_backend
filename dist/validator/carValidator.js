"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.carValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for creating/updating a car
const carValidationRules = () => [
    (0, express_validator_1.body)("brand").notEmpty().withMessage("Brand is required"),
    (0, express_validator_1.body)("make").notEmpty().withMessage("Make is required"),
    (0, express_validator_1.body)("model").notEmpty().withMessage("Model is required"),
    (0, express_validator_1.body)("year")
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage("Year must be a valid number"),
    (0, express_validator_1.body)("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    (0, express_validator_1.body)("fuelType").notEmpty().withMessage("Fuel type is required"),
    (0, express_validator_1.body)("mileage").isInt({ min: 0 }).withMessage("Mileage must be a valid number"),
    (0, express_validator_1.body)("transmission").notEmpty().withMessage("Transmission is required"),
    (0, express_validator_1.body)("condition").notEmpty().withMessage("Condition is required"),
    (0, express_validator_1.body)("engine").notEmpty().withMessage("Engine is required"),
    (0, express_validator_1.body)("features")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Features must be an array with max 20 items"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["available", "sold", "pending"])
        .withMessage('Status must be one of "available", "sold", or "pending"'),
    (0, express_validator_1.body)("location").optional().isString().withMessage("Location must be a string"),
    (0, express_validator_1.body)("images")
        .optional()
        .isArray({ max: 10 })
        .withMessage("Images must be an array with max 10 URLs"),
];
exports.carValidationRules = carValidationRules;
// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // TypeScript-safe access to 'param'
        const formattedErrors = errors.array().map((err) => ({
            field: err.param,
            message: err.msg,
        }));
        return res.status(400).json({
            success: false,
            errors: formattedErrors,
        });
    }
    next();
};
exports.validate = validate;
