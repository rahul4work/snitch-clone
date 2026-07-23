import multer, { memoryStorage } from "multer";

const upload = multer({
  storage: memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024, //5MB
  },
});

export const uploadProductImages = async (req, res, next) => {
  upload.array("images", 7)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_UNEXPECTED_FILE":
          return res.status(400).json({
            succes: false,
            message: "You can upload a maximum of 7 images",
          });

        case "LIMIT_FILE_SIZE":
          return res.status(400).json({
            succes: false,
            message: "Each images must be less than 5 MB.",
          });

        default:
          return res.status(400).json({
            succes: false,
            message: err.message,
          });
      }
    }

    if (err) {
      return next(err);
    }
    next();
  });
};
