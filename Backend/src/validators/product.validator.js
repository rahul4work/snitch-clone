import { body, validationResult } from "express-validator";

// custom validation middleware
const validateRequest = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: errors.array(),
    });
  }

  next();
};

// create product validation
export const createProductValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("priceAmount")
    .notEmpty()
    .withMessage("Price amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Price amount must be greater than 0"),

  body("priceCurrency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "JYP", "INR"])
    .withMessage("Invalid currency"),

  validateRequest,
];

// add product variant validation
export const addProductVariantValidator = [
  body("attributes")
    .notEmpty()
    .withMessage("Variant attributes are required")
    .custom((attributes) => {
      if (
        typeof attributes !== "object" ||
        Array.isArray(attributes) ||
        Object.keys(attributes).length === 0
      ) {
        throw new Error("Variant attributes must be a non-empty object");
      }

      return true;
    }),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("price")
    .optional({ values: "falsy" })
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  validateRequest,
];
